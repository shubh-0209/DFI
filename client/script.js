const fs = require('fs');
const path = require('path');

const dir = 'c:/Users/Dhruv/Documents/DFI/client/src';

const mapSize = (val) => {
  if (val.includes('var(')) return val;
  if (val.includes('rem')) {
    const num = parseFloat(val);
    if (num <= 0.75) return 'var(--text-xs)';
    if (num <= 0.85) return 'var(--text-sm)';
    if (num <= 1.0) return 'var(--text-base)';
    if (num <= 1.1) return 'var(--text-lg)';
    if (num <= 1.25) return 'var(--text-xl)';
    if (num <= 1.5) return 'var(--text-2xl)';
    return 'var(--text-3xl)';
  } else if (val.includes('px')) {
    const num = parseFloat(val);
    if (num <= 12) return 'var(--text-xs)';
    if (num <= 14) return 'var(--text-sm)';
    if (num <= 16) return 'var(--text-base)';
    if (num <= 18) return 'var(--text-lg)';
    if (num <= 20) return 'var(--text-xl)';
    if (num <= 24) return 'var(--text-2xl)';
    return 'var(--text-3xl)';
  }
  return val; 
};

let count = 0;

const walk = (dir) => {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filepath = path.join(dir, file);
    if (fs.statSync(filepath).isDirectory()) {
      walk(filepath);
    } else if (filepath.endsWith('.jsx') || filepath.endsWith('.js')) {
      let content = fs.readFileSync(filepath, 'utf8');
      let original = content;
      
      // Regex to match fontSize: '1.5rem' or fontSize: "16px"
      content = content.replace(/fontSize:\s*(['"])([^'"]+)\1/g, (match, quote, val) => {
        const mapped = mapSize(val);
        if (mapped !== val) {
          count++;
          return ontSize: ;
        }
        return match;
      });
      
      if (content !== original) {
        fs.writeFileSync(filepath, content, 'utf8');
        console.log(Updated );
      }
    }
  }
};

walk(dir);
console.log(Replaced  inline font sizes.);
