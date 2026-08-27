const data = window.__BLOG_DATA__ || {};
const results = [];
const types = ['diary', 'reading', 'project'];
const required = { diary: ['title', 'date'], reading: ['title', 'date', 'book', 'section'], project: ['title', 'date', 'summary', 'stack'] };
const ids = new Set();

for (const type of types) {
  const items = data[type];
  if (!Array.isArray(items)) { results.push(`✗ ${type} 数据集不存在`); continue; }
  results.push(`✓ ${type}：${items.length} 篇`);
  for (const item of items) {
    for (const field of required[type]) if (!item[field]) results.push(`✗ ${item.id} 缺少 ${field}`);
    if (ids.has(item.id)) results.push(`✗ 重复 ID：${item.id}`); ids.add(item.id);
    for (const match of item.content.matchAll(/!\[[^\]]*\]\(([^)]+)\)/g)) {
      const url = new URL(match[1], new URL(item.path, location.href));
      if (url.origin === location.origin) {
        const response = await fetch(url); if (!response.ok) results.push(`✗ ${item.title} 资源不可用：${match[1]}`);
      }
    }
  }
}
const failed = results.filter(item => item.startsWith('✗'));
document.getElementById('check-summary').textContent = failed.length ? `发现 ${failed.length} 个问题` : '✓ 页面检查通过';
document.getElementById('check-results').innerHTML = results.map(item => `<li class="item ${item.startsWith('✗') ? 'check-fail' : 'check-pass'}">${item}</li>`).join('');
