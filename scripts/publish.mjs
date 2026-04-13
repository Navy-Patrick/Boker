import { execSync } from 'node:child_process';

const withPush = process.argv.includes('--push');
const dateTag = new Date().toISOString().slice(0, 10);

function run(cmd) {
  execSync(cmd, { stdio: 'inherit' });
}

function hasGitRepo() {
  try {
    execSync('git rev-parse --is-inside-work-tree', { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
}

// 1) 先清洗道德经中的链接与噪声元信息
run('node scripts/clean-reading-links.mjs');

// 2) 再生成索引（含自动摘要抽取）
run('node scripts/build-indexes.mjs');

if (!hasGitRepo()) {
  console.log('已完成清洗+索引更新。当前目录不是 git 仓库，跳过 add/commit/push。');
  console.log('如需启用一键发布，请先执行：git init 并绑定 GitHub 远程仓库。');
  process.exit(0);
}

run('git add .');

try {
  run(`git commit -m "update: daily notes ${dateTag}"`);
} catch {
  console.log('没有可提交的变更，跳过 commit。');
}

if (withPush) {
  run('git push');
}

console.log(withPush ? '发布完成（已推送）。' : '发布准备完成（未推送）。');
