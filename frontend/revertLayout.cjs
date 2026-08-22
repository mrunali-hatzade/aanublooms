const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else {
      if (file.endsWith('.jsx')) results.push(file);
    }
  });
  return results;
}

const files = walk('d:/PROJECTS/Ecommerce2/frontend/src');
let changed = 0;
files.forEach(f => {
  let c = fs.readFileSync(f, 'utf8');
  if (c.includes('w-full px-4 sm:px-6 lg:px-8')) {
    c = c.replace(/w-full px-4 sm:px-6 lg:px-8/g, 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8');
    fs.writeFileSync(f, c);
    console.log('Reverted in ' + f);
    changed++;
  }
});
console.log('Total files changed: ' + changed);
