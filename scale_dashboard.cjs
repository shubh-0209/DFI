const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'client/src/components/dashboard');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.jsx'));

const replacements = [
  { from: /borderRadius: 16/g, to: 'borderRadius: 15.36' },
  { from: /borderRadius: 14/g, to: 'borderRadius: 13.44' },
  { from: /borderRadius: 12/g, to: 'borderRadius: 11.52' },
  { from: /borderRadius: 10/g, to: 'borderRadius: 9.6' },
  { from: /borderRadius: 8/g, to: 'borderRadius: 7.68' },
  { from: /borderRadius: 6/g, to: 'borderRadius: 5.76' },
  { from: /width: 30,\s*height: 30/g, to: 'width: 28.8, height: 28.8' }
];

for (const file of files) {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf-8');
  let originalContent = content;
  
  for (const { from, to } of replacements) {
    content = content.replace(from, to);
  }
  
  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf-8');
    console.log(`Updated ${file}`);
  }
}
console.log('Done.');
