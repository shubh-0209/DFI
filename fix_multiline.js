const fs = require('fs');
const glob = require('glob');

const files = glob.sync('server/src/modules/**/*.routes.js');
let updatedCount = 0;

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  
  // Replace `authenticate,` with `authenticate, authenticatedLimiter,`
  // Only if it's NOT followed by authenticatedLimiter
  let newContent = content.replace(/\bauthenticate,\s*(?!authenticatedLimiter)/g, (match) => {
    // Preserve the original whitespace
    return 'authenticate, authenticatedLimiter,' + match.substring(13);
  });
  
  // Fix the import line if it got accidentally modified
  // It could have been `const { authenticate, authorize }` -> `const { authenticate, authenticatedLimiter, authorize }`
  // Actually, authenticatedLimiter is ALREADY imported separately in these files (from rateLimiter.config.js)
  // So we just need to revert `const { authenticate, authenticatedLimiter,` back to `const { authenticate,`
  newContent = newContent.replace(/const\s*\{\s*authenticate,\s*authenticatedLimiter,/g, 'const { authenticate,');

  if (newContent !== content) {
    fs.writeFileSync(file, newContent, 'utf8');
    updatedCount++;
    console.log('Fixed multiline in: ' + file);
  }
}
console.log('Total multiline files updated: ' + updatedCount);
