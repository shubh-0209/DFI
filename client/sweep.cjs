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

  // Track if we need to add DashboardLoader import
  let needsImport = false;

  // 1. Remove Loader2 from lucide-react imports
  if (content.includes('Loader2')) {
    content = content.replace(/,\s*Loader2/, '');
    content = content.replace(/Loader2\s*,/, '');
    content = content.replace(/{\s*Loader2\s*}/, '{}');
    
    // Replace <Loader2 ... /> with <DashboardLoader />
    content = content.replace(/<Loader2[^>]*\/>/g, '<DashboardLoader />');
    needsImport = true;
  }

  // 2. Replace <div className="spinner"... />
  if (content.match(/<div[^>]*className=["'][^"']*spinner[^"']*["'][^>]*\/>/g) || content.match(/<span[^>]*className=["'][^"']*spinner[^"']*["'][^>]*\/>/g)) {
    content = content.replace(/<div[^>]*className=["'][^"']*spinner[^"']*["'][^>]*\/>/g, '<DashboardLoader />');
    content = content.replace(/<span[^>]*className=["'][^"']*spinner[^"']*["'][^>]*\/>/g, '<DashboardLoader />');
    needsImport = true;
  }
  
  if (content.match(/<div[^>]*className=["'][^"']*spinner[^"']*["'][^>]*>.*?<\/div>/g)) {
    content = content.replace(/<div[^>]*className=["'][^"']*spinner[^"']*["'][^>]*>.*?<\/div>/g, '<DashboardLoader />');
    needsImport = true;
  }

  // 3. Replace Skeletons
  if (content.includes('SkeletonLoader')) {
    content = content.replace(/import\s+SkeletonLoader\s+from\s+['"][^'"]+['"];?/g, '');
    content = content.replace(/<SkeletonLoader[^>]*\/>/g, '<DashboardLoader />');
    needsImport = true;
  }
  
  if (content.includes('DashboardSkeleton')) {
    content = content.replace(/import\s+DashboardSkeleton\s+from\s+['"][^'"]+['"];?/g, '');
    content = content.replace(/<DashboardSkeleton[^>]*\/>/g, '<DashboardLoader />');
    needsImport = true;
  }
  
  if (content.includes('ContributionSkeleton')) {
    content = content.replace(/import\s+ContributionSkeleton\s+from\s+['"][^'"]+['"];?/g, '');
    content = content.replace(/<ContributionSkeleton[^>]*\/>/g, '<DashboardLoader />');
    needsImport = true;
  }
  
  if (content.includes('SkeletonCard')) {
    content = content.replace(/<SkeletonCard[^>]*\/>/g, '<DashboardLoader />');
    // Note: SkeletonCard might be defined in the same file or imported. 
    needsImport = true;
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
console.log('Sweep complete.');
