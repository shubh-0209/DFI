const fs = require('fs');
const glob = require('glob');

const files = glob.sync('server/src/modules/**/*.routes.js');
let updatedCount = 0;

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  let changed = false;

  if (content.includes('authenticate') && !content.includes('authenticatedLimiter')) {
    // 1. Replace inline usages of `authenticate,` with `authenticate, authenticatedLimiter,`
    // Negative lookbehind to avoid matching `const { authenticate, ... }`
    content = content.replace(/(?<!\{\s*)authenticate,/g, 'authenticate, authenticatedLimiter,');
    
    // 2. Replace router.use(authenticate)
    content = content.replace(/router\.use\(authenticate\);?/g, 'router.use(authenticate);\nrouter.use(authenticatedLimiter);');
    
    // 3. Add the require statement for authenticatedLimiter
    // Find the line that requires auth.middleware.js and insert our require right after it
    content = content.replace(/(const .* = require\(['"]\.\.\/\.\.\/middlewares\/auth\.middleware['"]\);?)/, '$1\nconst { authenticatedLimiter } = require(\'../../config/rateLimiter.config\');');
    
    changed = true;
  }

  if (changed) {
    fs.writeFileSync(file, content, 'utf8');
    updatedCount++;
    console.log('Updated: ' + file);
  }
}
console.log('Total files updated: ' + updatedCount);
