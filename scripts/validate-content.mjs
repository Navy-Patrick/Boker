import fs from 'node:fs';
import path from 'node:path';
import { COLLECTIONS, dateFromText, parseFrontMatter, walkMarkdown } from './content-utils.mjs';

const errors = [];
const required = { diary: ['title', 'date'], reading: ['title', 'date', 'book', 'section'], project: ['title', 'date', 'summary', 'stack'] };
for (const [type, directory] of Object.entries(COLLECTIONS)) {
  for (const file of walkMarkdown(directory)) {
    const source = fs.readFileSync(file, 'utf8');
    const { meta, body, hasFrontMatter } = parseFrontMatter(source);
    const name = path.relative(process.cwd(), file);
    if (!hasFrontMatter) errors.push(`${name}: 缺少 Front Matter`);
    for (const key of required[type]) if (!meta[key]) errors.push(`${name}: 缺少 ${key}`);
    if (meta.date && !dateFromText(meta.date)) errors.push(`${name}: date 必须为 YYYY-MM-DD`);
    for (const match of body.matchAll(/!\[[^\]]*\]\(([^)]+)\)|\[[^\]]+\]\(([^)]+)\)/g)) {
      const target = (match[1] || match[2]).trim();
      if (/^(https?:|mailto:|#)/i.test(target)) continue;
      if (!fs.existsSync(path.resolve(path.dirname(file), target))) errors.push(`${name}: 找不到资源 ${target}`);
    }
  }
}
if (errors.length) { console.error(errors.map(error => `✗ ${error}`).join('\n')); process.exit(1); }
console.log('✓ 内容校验通过');
