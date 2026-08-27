import fs from 'node:fs';
import path from 'node:path';

export const ROOT = process.cwd();
export const CONTENT_DIR = path.join(ROOT, 'content');
export const COLLECTIONS = {
  diary: path.join(CONTENT_DIR, 'essays'),
  reading: path.join(CONTENT_DIR, 'reading'),
  project: path.join(CONTENT_DIR, 'projects')
};

export function walkMarkdown(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap(item => {
    const full = path.join(dir, item.name);
    return item.isDirectory() ? walkMarkdown(full) : item.isFile() && /\.md$/i.test(item.name) ? [full] : [];
  });
}

export function toPosix(value) { return value.split(path.sep).join('/'); }

export function parseFrontMatter(source) {
  const match = source.replace(/^\uFEFF/, '').match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!match) return { meta: {}, body: source, hasFrontMatter: false };
  const meta = {};
  for (const line of match[1].split('\n')) {
    const separator = line.indexOf(':');
    if (separator < 1) continue;
    const key = line.slice(0, separator).trim();
    let value = line.slice(separator + 1).trim();
    value = value.replace(/^['"]|['"]$/g, '');
    meta[key] = value;
  }
  return { meta, body: match[2], hasFrontMatter: true };
}

export function frontMatter(meta, body) {
  const header = Object.entries(meta).filter(([, value]) => value !== '').map(([key, value]) => `${key}: ${String(value).replace(/\n/g, ' ')}`);
  return `---\n${header.join('\n')}\n---\n\n${body.trim()}\n`;
}

export function titleFromBody(body) {
  return (body.match(/^#\s+(.+)$/m) || [null, ''])[1].trim();
}

export function dateFromText(value = '') { return (value.match(/\d{4}-\d{2}-\d{2}/) || [''])[0]; }

export function slugFromFile(file) {
  return toPosix(path.relative(ROOT, file)).replace(/\.md$/i, '').replace(/[^\w\u4e00-\u9fa5/-]+/g, '-').replace(/-+/g, '-').replaceAll('/', '-');
}

export function summaryFromBody(body) {
  let inCodeBlock = false;
  for (const raw of body.split('\n')) {
    const line = raw.trim();
    if (line.startsWith('```')) { inCodeBlock = !inCodeBlock; continue; }
    if (inCodeBlock || !line || /^#{1,6}\s/.test(line) || line === '---') continue;
    const text = line.replace(/^[-*]\s+|^>\s*/, '').replaceAll('**', '').trim();
    if (!text || text.startsWith('![') || text.startsWith('@@')) continue;
    if (/^(Date\s*\/\s*日期|日期)\s*[:：]/i.test(text)) continue;
    if (/^(原文|译文|个人体会)\s*[:：]?$/i.test(text)) continue;
    return text.length > 120 ? `${text.slice(0, 120)}…` : text;
  }
  return '（待补充摘要）';
}

export function readingSummaryFromBody(body) {
  let afterOriginal = false;
  let inCodeBlock = false;
  const lines = [];
  for (const raw of body.split('\n')) {
    const line = raw.trim();
    const plain = line.replaceAll('**', '').trim();
    if (!afterOriginal && /^(原文)\s*[:：]?$/.test(plain)) { afterOriginal = true; continue; }
    if (!afterOriginal) continue;
    if (line.startsWith('```')) {
      if (inCodeBlock) break;
      inCodeBlock = true;
      continue;
    }
    if (inCodeBlock && line) lines.push(line);
  }
  const summary = lines.join(' ').replace(/\s+/g, ' ').trim();
  return summary ? (summary.length > 120 ? `${summary.slice(0, 120)}…` : summary) : '（暂无原文摘要）';
}
