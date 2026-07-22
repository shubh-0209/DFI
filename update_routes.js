const fs = require('fs');
const glob = require('glob');

const files = glob.sync('server/src/modules/**/*.routes.js');
let updatedCount = 0;

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  let changed = false;

  if (content.includes('authenticate') && !content.includes('authenticatedLimiter')) {
    // Add import right after authenticate import
    content = content.replace(/(const \{ authenticate \} = require\([^)]+\);)/, '$1\nconst { authenticatedLimiter } = require(\'../../config/rateLimiter.config\');');
    
    // Replace everywhere `authenticate` is used as a middleware
    const lines = content.split('\n');
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].includes('router.') && lines[i].includes('authenticate')) {
         lines[i] = lines[i].replace(/\bauthenticate\b/g, 'authenticate, authenticatedLimiter');
      }
    }
    content = lines.join('\n');
    changed = true;
  }

  if (changed) {
    fs.writeFileSync(file, content, 'utf8');
    updatedCount++;
    console.log('Updated: ' + file);
  }
}
console.log('Total files updated: ' + updatedCount);
