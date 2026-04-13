import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const DIARY_DIR = path.join(ROOT, 'content', 'essays');
const READING_DIR = path.join(ROOT, 'content', 'reading');
const DATA_DIR = path.join(ROOT, 'data');

const DIARY_JSON = path.join(DATA_DIR, 'diary.json');
const READING_JSON = path.join(DATA_DIR, 'reading.json');
const DIARY_JS = path.join(DATA_DIR, 'diary.js');
const READING_JS = path.join(DATA_DIR, 'reading.js');

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

function toPosix(p) {
  return p.split(path.sep).join('/');
}

function readText(file) {
  return fs.readFileSync(file, 'utf8').replace(/\r\n/g, '\n');
}

function slugFromPath(file) {
  return toPosix(path.relative(ROOT, file))
    .replace(/\.md$/i, '')
    .replace(/[^\w\u4e00-\u9fa5/-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/[\/]/g, '-');
}

function parseDate(text) {
  const m = text.match(/(\d{4}-\d{2}-\d{2})/);
  return m ? m[1] : '';
}

function cleanTitle(raw) {
  return raw
    .replace(/\(article-[^)]+\)/gi, '')
    .replace(/^\[[^\]]+\]\s*/, '')
    .replace(/^\d{4}-\d{2}-\d{2}[-_\s]*/, '')
    .replace(/\.md$/i, '')
    .trim();
}

function inferSummary(md) {
  const lines = md.split('\n');

  // 1) 道德经优先：取“原文”代码块中的第一句
  let inOriginal = false;
  let inCode = false;
  for (const raw of lines) {
    const line = raw.trim();
    const plain = line.replace(/\*\*/g, '').replace(/^>\s*/, '').trim();

    if (!inOriginal && (plain === '原文：' || plain === '原文')) {
      inOriginal = true;
      continue;
    }

    if (inOriginal && line.startsWith('```')) {
      inCode = !inCode;
      continue;
    }

    if (inOriginal && inCode) {
      const sentence = plain
        .replace(/^[-•*]\s*/, '')
        .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1')
        .trim();
      if (sentence) {
        return sentence.length > 100 ? `${sentence.slice(0, 100)}…` : sentence;
      }
      continue;
    }

    if (inOriginal && !inCode && plain && plain !== '原文：') {
      // 原文块结束
      break;
    }
  }

  // 2) 通用兜底：第一段有效正文
  let inAnyCode = false;
  for (const raw of lines) {
    const line = raw.trim();

    if (line.startsWith('```')) {
      inAnyCode = !inAnyCode;
      continue;
    }

    if (inAnyCode) continue;

    const plain = line
      .replace(/\*\*/g, '')
      .replace(/^>\s*/, '')
      .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1')
      .trim();

    if (!plain) continue;
    if (plain === '---' || plain === '--') continue;
    if (plain.startsWith('#')) continue;
    if (plain === '原文：' || plain === '译文：' || plain === '个人体会：') continue;
    if (plain.startsWith('Author / 作者') || plain.startsWith('Source / 来源') || plain.startsWith('Date / 日期')) continue;
    if (plain.startsWith('作者') || plain.startsWith('来源') || plain.startsWith('日期')) continue;
    if (plain.startsWith('http://') || plain.startsWith('https://')) continue;

    return plain.length > 100 ? `${plain.slice(0, 100)}…` : plain;
  }

  return '（待补充摘要）';
}

function diaryFromFilename(file, md) {
  const base = path.basename(file, '.md');
  const date = parseDate(base);
  const title = cleanTitle(base.replace(/^\d{4}-\d{2}-\d{2}[-_]?/, '')) || base;
  return {
    id: `diary-${slugFromPath(file)}`,
    date: date || new Date().toISOString().slice(0, 10),
    title,
    summary: inferSummary(md),
    path: `./${toPosix(path.relative(ROOT, file))}`,
    content: md
  };
}

function readingFromFilename(file, md) {
  const rel = toPosix(path.relative(READING_DIR, file));
  const parts = rel.split('/');
  const bookSeg = (parts[0] || '未分类').toLowerCase();
  const book = bookSeg.includes('daodejing') ? '道德经' : parts[0] || '未分类';

  const folderName = path.basename(path.dirname(file));
  const base = path.basename(file, '.md');
  const sourceName = base.toLowerCase() === 'index' ? folderName : base;

  const date = parseDate(sourceName) || parseDate(rel);
  const title = cleanTitle(sourceName) || sourceName;

  const chapterMatch = title.match(/第([一二三四五六七八九十百千0-9]+)章/);
  const section = chapterMatch ? `第${chapterMatch[1]}章` : '未分章';

  return {
    id: `reading-${slugFromPath(file)}`,
    book,
    section,
    date: date || new Date().toISOString().slice(0, 10),
    title,
    summary: inferSummary(md),
    path: `./${toPosix(path.relative(ROOT, file))}`,
    content: md
  };
}

function makeDiaryIndex() {
  return walkMd(DIARY_DIR)
    .filter(file => {
      const name = path.basename(file).toLowerCase();
      return !name.includes('template') && !name.includes('copy');
    })
    .map(file => diaryFromFilename(file, readText(file)))
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

function makeReadingIndex() {
  return walkMd(READING_DIR)
    .map(file => readingFromFilename(file, readText(file)))
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

function writeJson(file, obj) {
  fs.writeFileSync(file, `${JSON.stringify(obj, null, 2)}\n`, 'utf8');
}

function writeJs(file, varName, obj) {
  fs.writeFileSync(file, `window.${varName} = ${JSON.stringify(obj, null, 2)};\n`, 'utf8');
}

const diary = makeDiaryIndex();
const reading = makeReadingIndex();

writeJson(DIARY_JSON, diary);
writeJson(READING_JSON, reading);
writeJs(DIARY_JS, '__DIARY_DATA__', diary);
writeJs(READING_JS, '__READING_DATA__', reading);

console.log(`索引更新完成：随笔 ${diary.length} 篇，读书 ${reading.length} 篇`);
