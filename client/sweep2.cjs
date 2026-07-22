const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    if (isDirectory) {
      walkDir(dirPath, callback);
    } else {
      if (dirPath.endsWith('.jsx') || dirPath.endsWith('.js') || dirPath.endsWith('.tsx') || dirPath.endsWith('.ts')) {
        callback(dirPath);
      }
    }
  });
}

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf-8');
  let originalContent = content;
  let needsImport = false;

  // Replace <p>Loading...<p> or <div>Loading...</div>
  const loadingTextRegex = /<([a-zA-Z]+)[^>]*>\s*Loading[^<]*\s*<\/\1>/g;
  
  if (content.match(loadingTextRegex)) {
    content = content.replace(loadingTextRegex, '<DashboardLoader />');
    needsImport = true;
  }
  
  // Clean up LoadingScreen imports and usage
  if (content.includes('LoadingScreen')) {
     content = content.replace(/import\s+LoadingScreen\s+from\s+['"][^'"]+['"];?/g, '');
     content = content.replace(/<LoadingScreen[^>]*\/>/g, '<DashboardLoader />');
     needsImport = true;
  }
  
  // Clean up SkeletonLoader if any left
  if (content.match(/<SkeletonLoader[^>]*\/>/g)) {
      content = content.replace(/<SkeletonLoader[^>]*\/>/g, '<DashboardLoader />');
      needsImport = true;
  }
  
  if (content.includes('import { Loader2 }')) {
      content = content.replace(/import { Loader2 } from 'lucide-react';?/g, '');
  }

  // Add DashboardLoader import if needed
  if (needsImport && !content.includes('DashboardLoader')) {
    // Calculate relative path to components/common/DashboardLoader
    const fileDir = path.dirname(filePath);
    const targetDir = path.join(srcDir, 'components', 'common');
    let relPath = path.relative(fileDir, targetDir).replace(/\\/g, '/');
    if (!relPath.startsWith('.')) relPath = './' + relPath;
    const importStatement = `import DashboardLoader from '${relPath}/DashboardLoader';\n`;
    
    // Find the last import
    const lastImportIndex = content.lastIndexOf('import ');
    if (lastImportIndex !== -1) {
      const endOfLastImport = content.indexOf('\n', lastImportIndex);
      content = content.slice(0, endOfLastImport + 1) + importStatement + content.slice(endOfLastImport + 1);
    } else {
      content = importStatement + content;
    }
  }

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf-8');
    console.log(`Updated ${filePath}`);
  }
}

walkDir(srcDir, processFile);
console.log('Sweep 2 complete.');
