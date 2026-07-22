const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

// Files to NOT modify (keep DashboardLoader)
const keepFiles = [
  'DashboardLoader.jsx',
  'SimpleLoader.jsx',
  'GlobalLoaderFallback.jsx',
  'App.jsx',
  'DashboardErrorBoundary.jsx',
  'ProtectedRoute.jsx'
];

walkDir('./src', (filePath) => {
  if (!filePath.endsWith('.jsx')) return;
  const fileName = path.basename(filePath);
  
  if (keepFiles.includes(fileName)) return;

  const content = fs.readFileSync(filePath, 'utf8');
  if (content.includes('DashboardLoader')) {
    
    // Replace import (handling both ' and " quotes)
    let newContent = content.replace(/import\s+DashboardLoader\s+from\s+['"].*?DashboardLoader['"];/g, (match) => {
      return match.replace(/DashboardLoader/g, 'SimpleLoader');
    });
    
    // Replace usages
    newContent = newContent.replace(/<DashboardLoader/g, '<SimpleLoader');
    
    fs.writeFileSync(filePath, newContent);
    console.log('Migrated to SimpleLoader: ' + filePath);
  }
});
