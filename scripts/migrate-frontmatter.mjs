import fs from 'node:fs';
import path from 'node:path';
import { COLLECTIONS, dateFromText, frontMatter, parseFrontMatter, summaryFromBody, titleFromBody, toPosix, walkMarkdown } from './content-utils.mjs';

const legacyKeys = { '日期': 'date', '摘要': 'summary', '技术栈': 'stack', 'GitHub': 'github', '封面': 'cover', '书目': 'book' };
let changed = 0;

for (const [type, directory] of Object.entries(COLLECTIONS)) {
  for (const file of walkMarkdown(directory)) {
    const source = fs.readFileSync(file, 'utf8');
    const parsed = parseFrontMatter(source);
    if (parsed.hasFrontMatter) {
      if (!parsed.meta.title && type === 'diary') {
        const fallbackTitle = path.basename(file, '.md').replace(/^\d{4}-\d{2}-\d{2}[-_]?/, '').trim();
        fs.writeFileSync(file, frontMatter({ ...parsed.meta, title: fallbackTitle }, parsed.body), 'utf8');
        changed += 1;
      }
      continue;
    }
    const meta = {};
    const body = source.split('\n').filter(line => {
      const match = line.match(/^>\s*([^:：]+)[:：]\s*(.+)\s*$/);
      if (!match || !legacyKeys[match[1].trim()]) return true;
      meta[legacyKeys[match[1].trim()]] = match[2].trim();
      return false;
    }).join('\n');
    meta.title = titleFromBody(body);
    meta.date ||= dateFromText(path.basename(file)) || dateFromText(toPosix(file));
    if (type === 'reading') {
      meta.book ||= path.relative(directory, file).split(path.sep)[0];
      const chapter = meta.title.match(/第([一二三四五六七八九十百千0-9]+)章/);
      meta.section = chapter ? `第${chapter[1]}章` : '未分章';
    }
    if (type === 'project') { meta.summary ||= summaryFromBody(body); meta.stack ||= '待补充'; }
    fs.writeFileSync(file, frontMatter(meta, body), 'utf8');
    changed += 1;
  }
}
console.log(`已迁移 ${changed} 篇内容到 Front Matter。`);
