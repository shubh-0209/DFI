const { createClient } = require('@supabase/supabase-js');
const { Pool } = require('pg');
const mingo = require('mingo');
require('mingo/init/system');

let dbType = 'supabase';
let pgPool = null;
let supabaseClient = null;

if (process.env.SUPABASE_URL && process.env.SUPABASE_KEY) {
  supabaseClient = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY, {
    auth: { persistSession: false }
  });
  console.log('[mongoose-compat] Auto-initialized Supabase HTTP Client.');
} else {
  console.warn('[mongoose-compat] Warning: SUPABASE_URL and SUPABASE_KEY must be set.');
}

const modelsRegistry = {};

const connect = async (uri, _options) => {
  const connectionString = process.env.DATABASE_URL || (uri && uri.startsWith('postgres') ? uri : null);
  
  if (connectionString) {
    pgPool = new Pool({
      connectionString,
      ssl: connectionString.includes('supabase') || connectionString.includes('localhost') ? { rejectUnauthorized: false } : false
    });
    dbType = 'pg';
    console.log('[mongoose-compat] Connected to PostgreSQL database.');
    
    for (const model of Object.values(modelsRegistry)) {
      await model.ensureTable();
    }
  } else if (process.env.SUPABASE_URL && process.env.SUPABASE_KEY) {
    supabaseClient = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY, {
      auth: { persistSession: false }
    });
    dbType = 'supabase';
    console.log('[mongoose-compat] Connected to Supabase via HTTP Client.');
  } else {
    console.warn('[mongoose-compat] Warning: No database connection config found.');
  }
  return { connection: { host: 'supabase' } };
};

async function ensureTableExists(tableName) {
  if (dbType !== 'pg' || !pgPool) return;
  const client = await pgPool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS "${tableName}" (
        _id TEXT PRIMARY KEY,
        document JSONB NOT NULL,
        created_at TIMESTAMPTZ DEFAULT now(),
        updated_at TIMESTAMPTZ DEFAULT now()
      );
    `);
    await client.query(`
      CREATE INDEX IF NOT EXISTS "idx_${tableName}_doc_gin" ON "${tableName}" USING gin (document);
    `);
  } catch (err) {
    console.error(`[mongoose-compat] Error ensuring table "${tableName}":`, err.message);
  } finally {
    client.release();
  }
}

function generateObjectId() {
  const timestamp = Math.floor(Date.now() / 1000).toString(16).padStart(8, '0');
  const random = Array.from({ length: 16 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
  return timestamp + random;
}

function isValidObjectId(id) {
  if (typeof id !== 'string') return false;
  return /^[0-9a-fA-F]{24}$/.test(id);
}

function getCollectionName(modelName) {
  const lower = modelName.toLowerCase();
  if (lower.endsWith('y')) {
    return lower.slice(0, -1) + 'ies';
  }
  if (lower.endsWith('s')) {
    return lower;
  }
  return lower + 's';
}

function getDeepValue(obj, path) {
  const parts = path.split('.');
  let current = obj;
  for (const part of parts) {
    if (current === undefined || current === null) return undefined;
    current = current[part];
  }
  return current;
}

function setDeepValue(obj, path, value) {
  const parts = path.split('.');
  let current = obj;
  for (let i = 0; i < parts.length; i++) {
    const part = parts[i];
    
    if (i === parts.length - 1) {
      current[part] = value;
    } else {
      if (parts[i + 1] === '$') {
        const array = current[part];
        if (Array.isArray(array)) {
          let matchedIndex = 0;
          const queryVal = obj._lastQueryContext;
          if (queryVal) {
            let targetUserId = null;
            for (const [qk, qv] of Object.entries(queryVal)) {
              if (qk.includes('userId')) targetUserId = qv;
            }
            if (targetUserId) {
              const idx = array.findIndex(item => String(item.userId) === String(targetUserId));
              if (idx !== -1) matchedIndex = idx;
            }
          }
          parts[i + 1] = matchedIndex;
        }
      }
      if (!current[part]) {
        current[part] = typeof parts[i + 1] === 'number' ? [] : {};
      }
      current = current[part];
    }
  }
}
function unwrapObjectIdStrings(v) {
  if (v instanceof String) return v.toString();
  if (Array.isArray(v)) return v.map(unwrapObjectIdStrings);
  if (v && typeof v === 'object' && !(v instanceof Date) && !(v instanceof RegExp)) {
    const res = {};
    for (const [k, val] of Object.entries(v)) {
      res[k] = unwrapObjectIdStrings(val);
    }
    return res;
  }
  return v;
}

function applyMongoUpdate(doc, update) {
  if (!update) return doc;
  update = unwrapObjectIdStrings(update);
  
  if (update.$set) {
    for (const [key, val] of Object.entries(update.$set)) {
      setDeepValue(doc, key, val);
    }
  }
  
  if (update.$inc) {
    for (const [key, val] of Object.entries(update.$inc)) {
      const current = getDeepValue(doc, key) || 0;
      setDeepValue(doc, key, current + val);
    }
  }
  
  if (update.$push) {
    for (const [key, val] of Object.entries(update.$push)) {
      let arr = getDeepValue(doc, key);
      if (!Array.isArray(arr)) {
        arr = [];
        setDeepValue(doc, key, arr);
      }
      if (val && typeof val === 'object' && val.$each) {
        arr.push(...val.$each);
      } else {
        arr.push(val);
      }
    }
  }
  
  if (update.$pull) {
    for (const [key, val] of Object.entries(update.$pull)) {
      let arr = getDeepValue(doc, key);
      if (!Array.isArray(arr)) continue;
      
      let updatedArr = [...arr];
      if (val && typeof val === 'object') {
        const keys = Object.keys(val);
        updatedArr = updatedArr.filter(item => {
          if (!item || typeof item !== 'object') return true;
          return !keys.every(k => String(item[k]) === String(val[k]));
        });
      } else {
        updatedArr = updatedArr.filter(item => String(item) !== String(val));
      }
      setDeepValue(doc, key, updatedArr);
    }
  }
  
  if (update.$addToSet) {
    for (const [key, val] of Object.entries(update.$addToSet)) {
      let arr = getDeepValue(doc, key);
      if (!Array.isArray(arr)) {
        arr = [];
        setDeepValue(doc, key, arr);
      }
      
      const contains = (targetArr, item) => {
        if (item && typeof item === 'object') {
          return targetArr.some(existing => {
            if (!existing || typeof existing !== 'object') return false;
            return Object.keys(item).every(k => String(existing[k]) === String(item[k]));
          });
        }
        return targetArr.some(existing => String(existing) === String(item));
      };
      
      if (val && typeof val === 'object' && val.$each) {
        val.$each.forEach(item => {
          if (!contains(arr, item)) arr.push(item);
        });
      } else {
        if (!contains(arr, val)) arr.push(val);
      }
    }
  }
  
  const hasOperators = Object.keys(update).some(k => k.startsWith('$'));
  if (!hasOperators) {
    for (const [key, val] of Object.entries(update)) {
      setDeepValue(doc, key, val);
    }
  }
  
  return doc;
}

function translatePostgresError(pgError) {
  if (!pgError) return null;
  const msg = pgError.message || '';
  const details = pgError.details || '';
  
  if (pgError.code === '23505' || msg.includes('duplicate key') || details.includes('already exists')) {
    const error = new Error('Duplicate Key Error');
    error.code = 11000;
    error.keyValue = {};
    const match = details.match(/Key \((.*?)\)=\((.*?)\) already exists/);
    if (match) {
      error.keyValue[match[1]] = match[2];
    } else {
      error.keyValue = { unknown: '' };
    }
    return error;
  }
  return pgError;
}

function validateSchema(definition, doc) {
  const errors = {};
  for (const [key, rules] of Object.entries(definition)) {
    const val = doc[key];
    
    if (rules && rules.required) {
      let isMissing = val === undefined || val === null || val === '';
      if (Array.isArray(rules.required) && rules.required[0] === true) {
        if (isMissing) {
          errors[key] = { path: key, message: rules.required[1] || `${key} is required` };
        }
      } else if (rules.required === true) {
        if (isMissing) {
          errors[key] = { path: key, message: `${key} is required` };
        }
      }
    }
    
    if (rules && rules.enum && val !== undefined && val !== null) {
      const allowed = Array.isArray(rules.enum) ? rules.enum : [];
      if (!allowed.includes(val)) {
        errors[key] = { path: key, message: `${val} is not a valid enum value for path ${key}` };
      }
    }
  }
  
  if (Object.keys(errors).length > 0) {
    const err = new Error('Validation Failed');
    err.name = 'ValidationError';
    err.errors = errors;
    throw err;
  }
}

async function handlePopulates(documents, populates, modelRegistry) {
  if (!documents || documents.length === 0 || populates.length === 0) return;
  
  for (const pop of populates) {
    const { path, select } = pop;
    const model = modelRegistry[documents[0]._model.modelName];
    const pathSchema = model?.schema?.definition[path];
    let refModelName = null;
    if (pathSchema) {
      if (pathSchema.ref) {
        refModelName = pathSchema.ref;
      } else if (Array.isArray(pathSchema) && pathSchema[0]?.ref) {
        refModelName = pathSchema[0].ref;
      }
    }
    
    if (!refModelName) {
      refModelName = path.charAt(0).toUpperCase() + path.slice(1);
    }
    
    const targetModel = modelRegistry[refModelName];
    if (!targetModel) continue;
    
    const idsToFetch = new Set();
    for (const doc of documents) {
      const val = doc._doc[path];
      if (typeof val === 'string') {
        idsToFetch.add(val);
      } else if (Array.isArray(val)) {
        val.forEach(v => {
          if (typeof v === 'string') idsToFetch.add(v);
        });
      }
    }
    
    if (idsToFetch.size === 0) continue;
    
    const fetchedDocs = await targetModel.find({ _id: { $in: Array.from(idsToFetch) } });
    const docMap = {};
    for (const fdoc of fetchedDocs) {
      let docData = fdoc.toObject();
      if (select) {
        const selectFields = select.split(/\s+/).filter(Boolean);
        const projected = {};
        const isExclusion = selectFields.some(f => f.startsWith('-'));
        if (isExclusion) {
          const excludeKeys = selectFields.map(f => f.slice(1));
          projected._id = docData._id;
          for (const [k, v] of Object.entries(docData)) {
            if (!excludeKeys.includes(k)) {
              projected[k] = v;
            }
          }
        } else {
          projected._id = docData._id;
          for (const f of selectFields) {
            projected[f] = docData[f];
          }
        }
        docData = projected;
      }
      docMap[fdoc._id] = docData;
    }
    
    for (const doc of documents) {
      const val = doc._doc[path];
      if (typeof val === 'string') {
        doc._doc[path] = docMap[val] || null;
      } else if (Array.isArray(val)) {
        doc._doc[path] = val.map(v => docMap[v] || v);
      }
    }
  }
}

function compileQueryToSQL(query) {
  const whereClauses = [];
  const params = [];
  let paramIndex = 1;

  if (query && typeof query === 'object') {
    for (const [key, value] of Object.entries(query)) {
      if (key.startsWith('$')) continue;

      if (value !== null && typeof value === 'object') {
        const ops = Object.keys(value);

        // $in operator
        if (ops.length === 1 && ops[0] === '$in' && Array.isArray(value.$in)) {
          if (key === '_id') {
            const placeholders = value.$in.map(() => `$${paramIndex++}`).join(', ');
            whereClauses.push(`_id IN (${placeholders})`);
            params.push(...value.$in);
          } else {
            const placeholders = value.$in.map(() => `$${paramIndex++}`).join(', ');
            whereClauses.push(`document->>'${key}' IN (${placeholders})`);
            params.push(...value.$in.map(v => String(v)));
          }
          continue;
        }

        // $ne operator
        if (ops.length === 1 && ops[0] === '$ne') {
          if (key === '_id') {
            whereClauses.push(`_id != $${paramIndex++}`);
            params.push(String(value.$ne));
          } else {
            whereClauses.push(`document->>'${key}' != $${paramIndex++}`);
            params.push(String(value.$ne));
          }
          continue;
        }

        // $exists operator
        if (ops.length === 1 && ops[0] === '$exists') {
          if (value.$exists) {
            whereClauses.push(`document->>'${key}' IS NOT NULL`);
          } else {
            whereClauses.push(`document->>'${key}' IS NULL`);
          }
          continue;
        }

        // Skip other complex operators — mingo will handle them in-memory
        continue;
      }

      if (key === '_id') {
        whereClauses.push(`_id = $${paramIndex++}`);
        params.push(value);
      } else if (typeof value === 'boolean') {
        // CRITICAL FIX: boolean false must also match rows where the field
        // is absent/null (e.g. isDeleted: false should include rows where
        // isDeleted was never set). Using IS NOT TRUE / IS TRUE handles both.
        if (value === false) {
          whereClauses.push(`(document->>'${key}')::boolean IS NOT TRUE`);
        } else {
          whereClauses.push(`(document->>'${key}')::boolean IS TRUE`);
        }
      } else if (value === null) {
        whereClauses.push(`document->>'${key}' IS NULL`);
      } else {
        whereClauses.push(`document->>'${key}' = $${paramIndex++}`);
        params.push(String(value));
      }
    }
  }

  const whereSql = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';
  return { whereSql, params };
}

class Query {
  constructor(modelClass, operation, args) {
    this.modelClass = modelClass;
    this.operation = operation;
    this.args = args;
    this._sort = null;
    this._skip = null;
    this._limit = null;
    this._select = null;
    this._populates = [];
  }
  
  sort(val) {
    this._sort = val;
    return this;
  }
  skip(val) {
    this._skip = val;
    return this;
  }
  limit(val) {
    this._limit = val;
    return this;
  }
  select(val) {
    this._select = val;
    return this;
  }
  populate(path, select) {
    this._populates.push({ path, select });
    return this;
  }
  lean(val) {
    this._lean = val !== false;
    return this;
  }
  
  async exec() {
    if (['find', 'findOne', 'findById', 'countDocuments'].includes(this.operation)) {
      return executeQuery(this);
    }
    if (['updateOne', 'updateMany', 'findOneAndUpdate', 'findByIdAndUpdate'].includes(this.operation)) {
      return executeUpdate(this);
    }
    if (['deleteOne', 'deleteMany', 'findOneAndDelete', 'findByIdAndDelete'].includes(this.operation)) {
      return executeDelete(this);
    }
    if (this.operation === 'aggregate') {
      return executeAggregate(this);
    }
    throw new Error(`Unsupported query operation: ${this.operation}`);
  }
  
  then(onfulfilled, onrejected) {
    return this.exec().then(onfulfilled, onrejected);
  }
  catch(onrejected) {
    return this.exec().catch(onrejected);
  }
}

function sanitizeDocs(rows, table) {
  return (rows || []).map(row => {
    const doc = row.document;
    if (doc) {
      if (row._id) {
        doc._id = row._id;
      }
      if (!doc.createdAt && row.created_at) {
        doc.createdAt = row.created_at;
      }
      for (const key of Object.keys(doc)) {
        if (key.endsWith('At') || key.endsWith('Date') || key === 'createdAt' || key === 'updatedAt') {
          if (doc[key] && (typeof doc[key] === 'string' || typeof doc[key] === 'number')) {
            doc[key] = new Date(doc[key]);
          }
        }
      }
      if (table === 'attendances') {
        doc.attendanceDate = doc.attendanceDate || doc.createdAt || new Date();
      }
      if (table === 'certificates') {
        doc.issuedAt = doc.issuedAt || doc.createdAt || new Date();
      }
    }
    return doc;
  });
}

async function executeQuery(queryObj) {
  const model = queryObj.modelClass;
  const table = model.collectionName;
  let filter = queryObj.args[0] || {};
  if (typeof filter === 'string') {
    filter = { _id: filter };
  }
  
  await model.ensureTable();
  
  let docs = [];
  
  if (dbType === 'pg' && pgPool) {
    const { whereSql, params } = compileQueryToSQL(filter);
    const sql = `SELECT _id, document, created_at FROM "${table}" ${whereSql}`;
    const res = await pgPool.query(sql, params);
    docs = sanitizeDocs(res.rows, table);
  } else if (dbType === 'supabase' && supabaseClient) {
    let builder = supabaseClient.from(table).select('_id, document, created_at');
    for (const [key, val] of Object.entries(filter)) {
      if (key.startsWith('$')) continue;
      if (key === '_id') {
        if (typeof val === 'string') {
          builder = builder.eq('_id', val);
        } else if (val && typeof val === 'object' && val.$in) {
          builder = builder.in('_id', val.$in);
        }
      } else if (typeof val === 'boolean') {
        // boolean false: match rows where field is false OR missing
        // PostgREST doesn't support IS NOT TRUE directly, so fetch all
        // and rely on mingo for boolean false filtering
        if (val === true) {
          builder = builder.eq(`document->>${key}`, 'true');
        }
        // For false, don't add a filter — let mingo handle it in-memory
      } else if (val !== null && typeof val !== 'object') {
        builder = builder.eq(`document->>${key}`, String(val));
      }
    }
    const { data, error } = await builder;
    if (error) throw translatePostgresError(error);
    docs = sanitizeDocs(data, table);
  } else {
    throw new Error('Database not connected. Call mongoose.connect first.');
  }
  
  const mingoQuery = new mingo.Query(filter);

  // Normalise boolean fields before mingo filters — documents saved before
  // schema defaults were applied may have undefined where false is expected.
  // mingo treats { isDeleted: false } as "value must equal false", which
  // excludes undefined. We coerce missing booleans to false here.
  const booleanFields = Object.keys(filter).filter(k => filter[k] === false || filter[k] === true);
  const normalisedDocs = booleanFields.length > 0
    ? docs.map(d => {
        const copy = { ...d };
        for (const bf of booleanFields) {
          if (copy[bf] === undefined || copy[bf] === null) {
            copy[bf] = false;
          }
        }
        return copy;
      })
    : docs;

  let cursor = mingoQuery.find(normalisedDocs);
  
  if (queryObj._sort) {
    const sortObj = {};
    for (const [k, v] of Object.entries(queryObj._sort)) {
      sortObj[k] = v === -1 ? -1 : 1;
    }
    cursor = cursor.sort(sortObj);
  }
  
  let finalDocs = cursor.all();
  
  if (queryObj._skip !== null) {
    finalDocs = finalDocs.slice(queryObj._skip);
  }
  if (queryObj._limit !== null) {
    finalDocs = finalDocs.slice(0, queryObj._limit);
  }
  
  const documentInstances = finalDocs.map(d => new model(d));
  
  if (queryObj._populates.length > 0) {
    await handlePopulates(documentInstances, queryObj._populates, modelsRegistry);
  }
  
  const results = queryObj._lean ? documentInstances.map(inst => inst.toObject()) : documentInstances;
  
  if (queryObj.operation === 'findOne' || queryObj.operation === 'findById') {
    return results[0] || null;
  }
  if (queryObj.operation === 'countDocuments') {
    return finalDocs.length;
  }
  
  return results;
}

async function executeUpdate(queryObj) {
  const model = queryObj.modelClass;
  let filter = queryObj.args[0] || {};
  if (typeof filter === 'string') {
    filter = { _id: filter };
  }
  const updateData = queryObj.args[1] || {};
  const options = queryObj.args[2] || {};
  
  const findQuery = new Query(model, 'find', [filter]);
  const matchedDocs = await findQuery.exec();
  
  if (matchedDocs.length === 0) {
    if (options.upsert) {
      const newDocData = { ...filter };
      newDocData._id = filter._id || generateObjectId();
      newDocData._lastQueryContext = filter;
      applyMongoUpdate(newDocData, updateData);
      delete newDocData._lastQueryContext;
      
      const newInstance = new model(newDocData);
      await newInstance.save();
      return options.new ? newInstance : null;
    }
    return queryObj.operation.startsWith('update') ? { matchedCount: 0, modifiedCount: 0 } : null;
  }
  
  const docsToUpdate = options.multi || queryObj.operation === 'updateMany' ? matchedDocs : [matchedDocs[0]];
  const updatedInstances = [];
  
  for (const doc of docsToUpdate) {
    doc._doc._lastQueryContext = filter;
    applyMongoUpdate(doc._doc, updateData);
    delete doc._doc._lastQueryContext;
    await doc.save();
    updatedInstances.push(doc);
  }
  
  if (queryObj.operation === 'findOneAndUpdate' || queryObj.operation === 'findByIdAndUpdate') {
    return options.new ? updatedInstances[0] : (docsToUpdate[0] || null);
  }
  
  return { matchedCount: docsToUpdate.length, modifiedCount: docsToUpdate.length };
}

async function executeDelete(queryObj) {
  const model = queryObj.modelClass;
  const table = model.collectionName;
  let filter = queryObj.args[0] || {};
  if (typeof filter === 'string') {
    filter = { _id: filter };
  }
  
  const findQuery = new Query(model, 'find', [filter]);
  const matchedDocs = await findQuery.exec();
  
  if (matchedDocs.length === 0) {
    return queryObj.operation.startsWith('delete') ? { deletedCount: 0 } : null;
  }
  
  const docsToDelete = queryObj.operation === 'deleteMany' ? matchedDocs : [matchedDocs[0]];
  const ids = docsToDelete.map(d => d._id);
  
  if (dbType === 'pg' && pgPool) {
    const placeholders = ids.map((_, i) => `$${i + 1}`).join(', ');
    await pgPool.query(`DELETE FROM "${table}" WHERE _id IN (${placeholders})`, ids);
  } else if (dbType === 'supabase' && supabaseClient) {
    const { error } = await supabaseClient.from(table).delete().in('_id', ids);
    if (error) throw translatePostgresError(error);
  }
  
  if (queryObj.operation === 'findOneAndDelete' || queryObj.operation === 'findByIdAndDelete') {
    return docsToDelete[0];
  }
  
  return { deletedCount: docsToDelete.length };
}

async function executeAggregate(queryObj) {
  const model = queryObj.modelClass;
  const table = model.collectionName;
  const pipeline = queryObj.args[0] || [];
  
  await model.ensureTable();
  
  let initialMatch = {};
  if (pipeline.length > 0 && pipeline[0].$match) {
    initialMatch = pipeline[0].$match;
  }
  
  let docs = [];
  if (dbType === 'pg' && pgPool) {
    const { whereSql, params } = compileQueryToSQL(initialMatch);
    const sql = `SELECT _id, document, created_at FROM "${table}" ${whereSql}`;
    const res = await pgPool.query(sql, params);
    docs = sanitizeDocs(res.rows, table);
  } else if (dbType === 'supabase' && supabaseClient) {
    let builder = supabaseClient.from(table).select('_id, document, created_at');
    for (const [key, val] of Object.entries(initialMatch)) {
      if (key === '_id') {
        if (typeof val === 'string') {
          builder = builder.eq('_id', val);
        } else if (val && typeof val === 'object' && val.$in) {
          builder = builder.in('_id', val.$in);
        }
      } else if (!key.startsWith('$') && typeof val !== 'object') {
        builder = builder.eq(`document->>${key}`, String(val));
      }
    }
    const { data, error } = await builder;
    if (error) throw translatePostgresError(error);
    docs = sanitizeDocs(data, table);
  }
  
  // Pre-fetch collections for any $lookup pipeline stages
  const lookupCollections = [];
  for (const stage of pipeline) {
    if (stage.$lookup && typeof stage.$lookup.from === 'string') {
      lookupCollections.push(stage.$lookup.from);
    }
  }

  const lookupCache = {};
  for (const colName of lookupCollections) {
    let colDocs = [];
    try {
      if (dbType === 'pg' && pgPool) {
        const res = await pgPool.query(`SELECT _id, document, created_at FROM "${colName}"`);
        colDocs = sanitizeDocs(res.rows, colName);
      } else if (dbType === 'supabase' && supabaseClient) {
        const { data, error } = await supabaseClient.from(colName).select('_id, document, created_at');
        if (error) throw error;
        colDocs = sanitizeDocs(data, colName);
      }
    } catch (err) {
      console.error(`[mongoose-compat] Error resolving lookup collection "${colName}":`, err.message);
    }
    lookupCache[colName] = colDocs;
  }

  const mingoOptions = {
    collectionResolver: (name) => lookupCache[name] || []
  };

  const aggregator = new mingo.Aggregator(pipeline, mingoOptions);
  const result = aggregator.run(docs);
  return result;
}

class MongooseDocument {
  constructor(modelClass, data) {
    this._model = modelClass;
    this._doc = { ...data };
    if (!this._doc._id) {
      this._doc._id = generateObjectId();
    }
    
    const schemaPaths = modelClass.schema ? Object.keys(modelClass.schema.definition) : [];
    const allKeys = new Set([...Object.keys(this._doc), ...schemaPaths]);
    
    for (const key of allKeys) {
      if (key === '_model' || key === '_doc') continue;
      Object.defineProperty(this, key, {
        get: () => this._doc[key],
        set: (val) => {
          this._doc[key] = val;
        },
        enumerable: true,
        configurable: true
      });
    }
  }
  
  get id() {
    return this._doc._id;
  }
  
  get _id() {
    return this._doc._id;
  }
  
  set _id(val) {
    this._doc._id = val;
  }

  async save() {
    const table = this._model.collectionName;

    // Apply schema defaults for any fields that are missing from the document.
    // This ensures fields like isDeleted, isPinned, status etc. are always
    // present in the stored JSONB so filters work correctly.
    if (this._model.schema) {
      for (const [key, rules] of Object.entries(this._model.schema.definition)) {
        if (this._doc[key] === undefined && rules && rules.default !== undefined) {
          const def = rules.default;
          this._doc[key] = typeof def === 'function' ? def() : def;
        }
      }
      validateSchema(this._model.schema.definition, this._doc);
    }
    
    await this._model.ensureTable();
    
    if (dbType === 'pg' && pgPool) {
      const query = `
        INSERT INTO "${table}" (_id, document, updated_at)
        VALUES ($1, $2, now())
        ON CONFLICT (_id) DO UPDATE
        SET document = $2, updated_at = now()
        RETURNING document
      `;
      try {
        const res = await pgPool.query(query, [this._doc._id, JSON.stringify(this._doc)]);
        this._doc = res.rows[0].document;
      } catch (err) {
        throw translatePostgresError(err);
      }
    } else if (dbType === 'supabase' && supabaseClient) {
      const { data, error } = await supabaseClient
        .from(table)
        .upsert({ _id: this._doc._id, document: this._doc })
        .select();
      if (error) throw translatePostgresError(error);
      if (data && data[0]) {
        this._doc = data[0].document;
      }
    }
    
    return this;
  }

  toObject() {
    return JSON.parse(JSON.stringify(this._doc));
  }

  toJSON() {
    let ret = this.toObject();
    const toJSONOption = this._model.schema?.options?.toJSON;
    if (toJSONOption && typeof toJSONOption.transform === 'function') {
      ret = toJSONOption.transform(this, ret);
    }
    return ret;
  }
}

class Schema {
  constructor(definition, options) {
    this.definition = definition;
    this.options = options;
  }
  index() {}
  set() {}
  pre() {}
  post() {}
}
Schema.Types = {
  ObjectId: 'ObjectId',
  Mixed: 'Mixed',
};

class Session {
  constructor() {
    this.client = null;
  }
  async startTransaction() {
    if (dbType === 'pg' && pgPool) {
      this.client = await pgPool.connect();
      await this.client.query('BEGIN');
    }
  }
  async commitTransaction() {
    if (this.client) {
      await this.client.query('COMMIT');
    }
  }
  async abortTransaction() {
    if (this.client) {
      await this.client.query('ROLLBACK');
    }
  }
  endSession() {
    if (this.client) {
      this.client.release();
      this.client = null;
    }
  }
}

const _SchemaType = {
  ObjectId: 'ObjectId',
};

module.exports = {
  connect: connect,
  disconnect: async () => {
    if (pgPool) {
      await pgPool.end();
      pgPool = null;
    }
    dbType = null;
  },
  connection: {
    host: 'supabase'
  },
  Schema: Schema,
  Types: {
    ObjectId: Object.assign(
      function ObjectId(id) {
        const val = id || generateObjectId();
        if (new.target) {
          return new String(val);
        }
        return val;
      },
      {
        isValid: isValidObjectId
      }
    )
  },
  startSession: async () => {
    const sess = new Session();
    return sess;
  },
  model: (modelName, schema, collectionOverride) => {
    if (modelsRegistry[modelName]) return modelsRegistry[modelName];
    
    const collectionName = collectionOverride || getCollectionName(modelName);
    
    const ModelClass = class extends MongooseDocument {
      constructor(data = {}) {
        super(ModelClass, data);
      }
      
      static get modelName() { return modelName; }
      static get schema() { return schema; }
      static get collectionName() { return collectionName; }
      
      static async ensureTable() {
        await ensureTableExists(collectionName);
      }
      
      static find(query) {
        return new Query(ModelClass, 'find', [query]);
      }
      static findOne(query) {
        return new Query(ModelClass, 'findOne', [query]);
      }
      static findById(id) {
        return new Query(ModelClass, 'findById', [id]);
      }
      static create(doc) {
        if (Array.isArray(doc)) {
          return Promise.all(doc.map(d => new ModelClass(d).save()));
        }
        return new ModelClass(doc).save();
      }
      static insertMany(docs) {
        return Promise.all(docs.map(d => new ModelClass(d).save()));
      }
      static updateOne(query, update, options) {
        return new Query(ModelClass, 'updateOne', [query, update, options]);
      }
      static updateMany(query, update, options) {
        return new Query(ModelClass, 'updateMany', [query, update, options]);
      }
      static findOneAndUpdate(query, update, options) {
        return new Query(ModelClass, 'findOneAndUpdate', [query, update, options]);
      }
      static findByIdAndUpdate(id, update, options) {
        return new Query(ModelClass, 'findByIdAndUpdate', [id, update, options]);
      }
      static deleteOne(query) {
        return new Query(ModelClass, 'deleteOne', [query]);
      }
      static deleteMany(query) {
        return new Query(ModelClass, 'deleteMany', [query]);
      }
      static findOneAndDelete(query) {
        return new Query(ModelClass, 'findOneAndDelete', [query]);
      }
      static findByIdAndDelete(id) {
        return new Query(ModelClass, 'findByIdAndDelete', [id]);
      }
      static countDocuments(query) {
        return new Query(ModelClass, 'countDocuments', [query]);
      }
      static aggregate(pipeline) {
        return new Query(ModelClass, 'aggregate', [pipeline]);
      }
      static async bulkWrite(bulkOps, _options) {
        let modifiedCount = 0;
        let upsertedCount = 0;
        for (const op of bulkOps) {
          if (op.updateOne) {
            const { filter, update, upsert } = op.updateOne;
            const query = new Query(ModelClass, 'findOneAndUpdate', [filter, update, { upsert, new: true }]);
            const res = await query.exec();
            if (res) {
              modifiedCount++;
            }
          }
        }
        return { modifiedCount, upsertedCount };
      }
    };
    
    modelsRegistry[modelName] = ModelClass;
    return ModelClass;
  }
};
