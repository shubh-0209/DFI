const supabase = require('../../config/supabase');

class RewardCatalogRepository {
  async create(catalogData) {
    const { v4: uuidv4 } = require('uuid');
    const _id = uuidv4();
    const document = {
      _id,
      ...catalogData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    const { data, error } = await supabase
      .from('rewardcatalogs')
      .insert([{ _id, document }])
      .select();
      
    if (error) throw new Error(error.message);
    return data[0]?.document;
  }

  async findAll(filters = {}, options = {}) {
    const { page = 1, limit = 20, sort = '-createdAt' } = options;
    const skip = (page - 1) * limit;

    let query = supabase.from('rewardcatalogs').select('*', { count: 'exact' });

    if (filters.category && filters.category !== 'All') {
      query = query.eq('document->>category', filters.category);
    }
    if (filters.status) {
      query = query.eq('document->>status', filters.status);
    } else {
      query = query.neq('document->>status', 'inactive');
    }
    if (filters.isFeatured !== undefined) {
      // In JSONB, booleans are stringified in arrow operators (->>) depending on how you query, 
      // but let's query carefully.
      query = query.eq('document->>isFeatured', filters.isFeatured.toString());
    }
    if (filters.minCoins !== undefined) {
      query = query.gte('document->>coinCost', filters.minCoins.toString());
    }
    if (filters.maxCoins !== undefined) {
      query = query.lte('document->>coinCost', filters.maxCoins.toString());
    }
    if (filters.inStock !== undefined && filters.inStock) {
      query = query.gt('document->>stock', '0');
    }
    if (filters.search) {
      // Supabase REST doesn't natively do OR across multiple JSONB fields easily via rest,
      // but we can fetch and filter in memory if needed, or use a complex or filter.
      // E.g., or=(document->>name.ilike.%search%,document->>description.ilike.%search%)
      query = query.or(`document->>name.ilike.%${filters.search}%,document->>description.ilike.%${filters.search}%,document->>category.ilike.%${filters.search}%`);
    }

    // Sorting
    // Handle sorting by parsing the sort string
    const isDesc = sort.startsWith('-');
    const sortBy = isDesc ? sort.substring(1) : sort;
    
    // We can't sort by JSONB fields easily in PostgREST unless there's a generated column,
    // so we will fetch and sort in memory if needed, or try to sort by document->>field.
    // Actually, PostgREST doesn't support ordering by JSONB fields yet.
    // Let's just fetch everything matching the query and sort/paginate in memory.
    // (This is fine for small catalogs of ~100 items).
    const { data, count, error } = await query;
    
    if (error) throw new Error(error.message);

    let items = data.map(row => row.document);

    // Manual sort
    items.sort((a, b) => {
      let valA = a[sortBy];
      let valB = b[sortBy];
      if (valA < valB) return isDesc ? 1 : -1;
      if (valA > valB) return isDesc ? -1 : 1;
      return 0;
    });

    // Pagination
    const paginatedItems = items.slice(skip, skip + limit);

    return { items: paginatedItems, total: count || items.length, page, limit };
  }

  async findById(id) {
    const { data, error } = await supabase
      .from('rewardcatalogs')
      .select('*')
      .eq('_id', id)
      .single();
      
    if (error && error.code !== 'PGRST116') throw new Error(error.message);
    return data ? data.document : null;
  }

  async findFeatured(limit = 10) {
    const { data, error } = await supabase
      .from('rewardcatalogs')
      .select('*')
      .eq('document->>isFeatured', 'true')
      .eq('document->>status', 'active')
      .gt('document->>stock', '0');
      
    if (error) throw new Error(error.message);

    let items = data.map(row => row.document);
    
    // Sort by popularity -1, createdAt -1
    items.sort((a, b) => {
      const popA = a.popularity || 0;
      const popB = b.popularity || 0;
      if (popA !== popB) return popB - popA;
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

    return items.slice(0, limit);
  }

  async updateStock(id, quantity) {
    const reward = await this.findById(id);
    if (!reward) return null;
    
    reward.stock = Math.max(0, reward.stock - quantity);
    return this.findByIdAndUpdate(id, reward);
  }

  async findByIdAndUpdate(id, updateData) {
    const existing = await this.findById(id);
    if (!existing) return null;

    const updatedDoc = {
      ...existing,
      ...updateData,
      updatedAt: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('rewardcatalogs')
      .update({ document: updatedDoc, updated_at: new Date().toISOString() })
      .eq('_id', id)
      .select();

    if (error) throw new Error(error.message);
    return data[0]?.document;
  }

  async incrementPopularity(id) {
    const reward = await this.findById(id);
    if (!reward) return null;
    
    reward.popularity = (reward.popularity || 0) + 1;
    return this.findByIdAndUpdate(id, reward);
  }
}

module.exports = new RewardCatalogRepository();
