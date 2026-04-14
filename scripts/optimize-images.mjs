import path from 'node:path';
import fs from 'node:fs';
import sharp from 'sharp';

const root = process.cwd();
const jobs = [
  { src: 'assets/hero.png', out: 'assets/hero-1600.webp', width: 1600, quality: 72 },
  { src: 'content/projects/dual-platform-crawler/dashboard.png', out: 'content/projects/dual-platform-crawler/dashboard.webp', width: 1200, quality: 78 },
  { src: 'content/projects/dual-platform-crawler/eastmoney.png', out: 'content/projects/dual-platform-crawler/eastmoney.webp', width: 1200, quality: 78 },
  { src: 'content/projects/dual-platform-crawler/xueqiu.png', out: 'content/projects/dual-platform-crawler/xueqiu.webp', width: 1200, quality: 78 }
];

for (const job of jobs) {
  const src = path.join(root, job.src);
  const out = path.join(root, job.out);
  if (!fs.existsSync(src)) {
    console.log(`跳过（不存在）：${job.src}`);
    continue;
  }

  await sharp(src)
    .resize({ width: job.width, withoutEnlargement: true })
    .webp({ quality: job.quality, effort: 6 })
    .toFile(out);

  const kb = (fs.statSync(out).size / 1024).toFixed(1);
  console.log(`已生成：${job.out} (${kb} KB)`);
}

console.log('图片优化完成。');
