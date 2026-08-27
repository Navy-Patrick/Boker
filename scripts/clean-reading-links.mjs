import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const TARGET = path.join(ROOT, 'content', 'reading', 'daodejing');

function walkMd(dir) {
  if (!fs.existsSync(dir)) return [];
  const out = [];
  const items = fs.readdirSync(dir, { withFileTypes: true });
  for (const item of items) {
    const full = path.join(dir, item.name);
    if (item.isDirectory()) out.push(...walkMd(full));
    else if (item.isFile() && full.toLowerCase().endsWith('.md')) out.push(full);
  }
  return out;
}

function cleanMarkdownLinks(text) {
  // [塔](https://...) -> 塔
  return text
    .replace(/\[([^\]]+)\]\((https?:\/\/[^\)]+)\)/g, '$1')
    .replace(/\[([^\]]+)\]\((zhida:[^\)]+)\)/g, '$1');
}

function removeMetaNoiseLines(text) {
  return text
    .split(/\r?\n/)
    .filter(line => {
      const plain = line.replace(/\*\*/g, '').trim();
      if (/^>\s*Source\s*\/\s*来源\s*[:：]/i.test(plain)) return false;
      if (/^>\s*Author\s*\/\s*作者\s*[:：]/i.test(plain)) return false;
      return true;
    })
    .join('\n');
}

const files = walkMd(TARGET);
let changed = 0;

for (const file of files) {
  const oldText = fs.readFileSync(file, 'utf8');
  const cleaned = removeMetaNoiseLines(cleanMarkdownLinks(oldText));
  if (cleaned !== oldText) {
    fs.writeFileSync(file, cleaned, 'utf8');
    changed += 1;
  }
}

console.log(`清洗完成：${changed}/${files.length} 个文件发生变更`);
