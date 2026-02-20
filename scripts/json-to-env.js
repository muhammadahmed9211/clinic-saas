const fs = require('fs');
const path = require('path');

const inputFile = process.argv[2];
const jsonStr = inputFile
  ? fs.readFileSync(path.resolve(inputFile), 'utf8')
  : fs.readFileSync(process.stdin.fd, 'utf8');
const data = JSON.parse(jsonStr);

function envEscape(v) {
  if (v === undefined || v === null) return '';
  const s = String(v);
  if (
    s.includes('"') ||
    s.includes('\n') ||
    s.includes('=') ||
    s.includes(' ') ||
    s.includes('#') ||
    s.length === 0
  ) {
    return '"' + s.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, '\\n') + '"';
  }
  return s;
}

const lines = Object.entries(data)
  .map(([k, v]) => (typeof k === 'string' ? k.trim() : k) + '=' + envEscape(v))
  .join('\n');

const outPath = path.join(__dirname, '..', '.env-aws-prod-n');
fs.writeFileSync(outPath, lines + '\n', 'utf8');
console.log('Written:', outPath);
