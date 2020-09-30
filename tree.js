const fs = require('fs');
const path = require('path');

const dir = path.resolve(process.argv[2]);
const depth = process.argv[3];

console.log(dir);

const indent = (str) => str.split('\n').map(s => '  ' + s).join('\n');

function readDir(parent, name, depth) {
  if (name === 'node_modules') return '';
  const me = path.join(parent, name);
  const stat = fs.statSync(me);
  if (stat.isFile()) {
    return indent(`<div role="treeitem">${name}</div>`)
  } else if (stat.isDirectory()) {
    children = fs.readdirSync(me);
    if (depth === 0 || children.length === 0) {
      return indent(`<div role="treeitem" aria-expanded="false">${name}</div>`)
    } else {
      return indent(`<div role="treeitem" aria-expanded="true">
  ${name}
  <div role="group">
${indent(children.map(name => readDir(me, name, depth--)).join('\n'))}
  </div>
</div>`)
    }
  }
  return '';
}

function tree(dir, depth) {
  const parent = path.dirname(dir);
  const name = path.basename(dir);
  return `<div role="tree">
${readDir(parent, name, depth)}
</div>`;
}

console.log(tree(dir, depth));
