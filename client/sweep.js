const fs = require('fs');
const path = require('path');

const directoryPath = path.join(__dirname, 'src');

const replacements = [
  // Gradients
  { regex: /linear-gradient\(135deg,\s*#7c3aed,\s*#4f46e5\)/gi, replacement: 'var(--primary-blue)' },
  { regex: /linear-gradient\(135deg,\s*#D35400,\s*#E67E22\)/gi, replacement: 'var(--primary-blue)' },
  { regex: /linear-gradient\(135deg,\s*#F97316,\s*#FB923C\)/gi, replacement: 'var(--primary-blue)' },
  
  // Oranges
  { regex: /#D35400/gi, replacement: 'var(--primary-blue)' },
  { regex: /#E67E22/gi, replacement: 'var(--secondary-blue)' },
  { regex: /#F97316/gi, replacement: 'var(--primary-blue)' },
  { regex: /#FB923C/gi, replacement: 'var(--secondary-blue)' },
  
  // Purples
  { regex: /#7C3AED/gi, replacement: 'var(--primary-blue)' },
  { regex: /#4F46E5/gi, replacement: 'var(--secondary-blue)' },
  
  // RGBA Purples (Admin backgrounds)
  { regex: /rgba\(\s*124\s*,\s*58\s*,\s*237\s*,/g, replacement: 'rgba(11, 59, 145,' },
];

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    const dirPath = path.join(dir, f);
    const isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

let modifiedFiles = 0;

walkDir(directoryPath, function(filePath) {
  if (filePath.endsWith('.jsx') || filePath.endsWith('.js') || filePath.endsWith('.css')) {
    let content = fs.readFileSync(filePath, 'utf8');
    let originalContent = content;

    replacements.forEach(rule => {
      content = content.replace(rule.regex, rule.replacement);
    });

    if (content !== originalContent) {
      fs.writeFileSync(filePath, content, 'utf8');
      modifiedFiles++;
      console.log('Modified:', filePath);
    }
  }
});

console.log(`Total files modified: ${modifiedFiles}`);
