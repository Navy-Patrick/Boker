import fs from 'node:fs';
import path from 'node:path';
import { COLLECTIONS, dateFromText, parseFrontMatter, readingSummaryFromBody, slugFromFile, summaryFromBody, toPosix, walkMarkdown } from './content-utils.mjs';

const output = path.join(process.cwd(), 'assets', 'data', 'site-data.js');

function readEntry(type, file) {
  const source = fs.readFileSync(file, 'utf8').replace(/\r\n/g, '\n');
  const { meta, body } = parseFrontMatter(source);
  const relative = toPosix(path.relative(process.cwd(), file));
  const summary = meta.summary || (type === 'reading' ? readingSummaryFromBody(body) : summaryFromBody(body));
  const entry = { id: `${type}-${slugFromFile(file)}`, type, title: meta.title, date: meta.date || dateFromText(relative), summary, path: `./${relative}`, content: source };
  if (type === 'reading') Object.assign(entry, { book: meta.book, section: meta.section });
  if (type === 'project') Object.assign(entry, { stack: meta.stack, github: meta.github || '', cover: meta.cover || '' });
  return entry;
}

const collections = Object.fromEntries(Object.entries(COLLECTIONS).map(([type, directory]) => [type,
  walkMarkdown(directory).map(file => readEntry(type, file)).sort((left, right) => right.date.localeCompare(left.date))
]));

fs.mkdirSync(path.dirname(output), { recursive: true });
fs.writeFileSync(output, `window.__BLOG_DATA__ = ${JSON.stringify(collections, null, 2)};\n`, 'utf8');
console.log(`索引更新完成：随笔 ${collections.diary.length} 篇，读书 ${collections.reading.length} 篇，项目 ${collections.project.length} 个`);
