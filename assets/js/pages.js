import { articleUrl, assetUrl, card, entries, escapeHtml, getQuery, markdown } from './blog.js?v=3';

const byId = (type, id) => entries(type).find(item => item.id === id);
const setHtml = (id, html) => { document.getElementById(id).innerHTML = html; };

function renderHome() {
  const diary = entries('diary');
  const reading = entries('reading');
  document.getElementById('stat-diary').textContent = diary.length;
  document.getElementById('stat-reading').textContent = reading.length;
  setHtml('latest-list', diary.slice(0, 3).map(item => `${card(item, 'h3').replace('</li>', `<a class="read-more" href="${articleUrl(item)}">阅读全文</a></li>`)}`).join(''));
  const now = new Date(); const yearStart = new Date(now.getFullYear(), 0, 1); const nextYear = new Date(now.getFullYear() + 1, 0, 1); const percent = (((now - yearStart) / (nextYear - yearStart)) * 100).toFixed(1);
  document.getElementById('year-progress-text').textContent = `${percent}%`; document.getElementById('year-progress-fill').style.width = `${percent}%`;
  const pool = window.__POEMS__ || []; const poem = pool[Math.floor(Math.random() * pool.length)];
  if (poem) { document.getElementById('hero-poem-text').textContent = `“${poem.text}”`; document.getElementById('hero-poem-author').textContent = `—— ${poem.author}`; }
}

function renderList(type, elementId) { setHtml(elementId, entries(type).map(item => card(item, type === 'reading' ? 'h3' : 'h2')).join('') || '<li class="empty">暂无内容。</li>'); }

function renderReading() {
  const groups = entries('reading').reduce((result, item) => {
    const key = item.book || '未分类';
    (result[key] ||= []).push(item);
    return result;
  }, {});
  const books = Object.keys(groups);
  setHtml('book-tabs', books.length > 1 ? books.map((book, index) => `<li><a href="#book-${index}" class="book-tab">${escapeHtml(book)}<span>${groups[book].length}</span></a></li>`).join('') : '');
  setHtml('book-groups', Object.entries(groups).map(([book, items], index) => `<section class="book-group" id="book-${index}"><h2 class="group-title">《${escapeHtml(book)}》</h2><ul class="item-list">${items.map(item => card(item, 'h3')).join('')}</ul></section>`).join(''));
}

function renderArticle() {
  const { type = 'diary', id = '' } = getQuery(); const item = byId(type, id);
  if (!item) { document.getElementById('article-title').textContent = '未找到文章'; return; }
  document.title = `${item.title} | Patrick 的静心小站`; document.getElementById('article-title').textContent = item.title; document.getElementById('article-date').textContent = item.date;
  const body = document.getElementById('article-body');
  const legacyLayout = type === 'project' && getQuery().layout === 'legacy';
  if (type === 'project' && !legacyLayout) {
    const images = [...item.content.matchAll(/^!\[([^\]]*)\]\(([^)]+)\)\s*$/gm)].map(([, alt, source]) => ({ alt: alt || '项目截图', source: assetUrl(source, item.path) }));
    const textOnlyContent = item.content.replace(/^!\[[^\]]*\]\([^)]+\)\s*$/gm, '');
    const gallery = images.length ? `<section class="project-gallery-section" aria-label="项目展示"><div class="project-gallery-heading"><h2>项目展示</h2><a href="${articleUrl(item)}&layout=legacy">使用经典布局</a></div><div class="project-gallery">${images.map((image, index) => `<button class="project-gallery-card" type="button" data-gallery-index="${index}" data-gallery-src="${escapeHtml(image.source)}" data-gallery-alt="${escapeHtml(image.alt)}"><img src="${escapeHtml(image.source)}" alt="${escapeHtml(image.alt)}" loading="lazy"><span>${escapeHtml(image.alt)}</span></button>`).join('')}</div></section>` : '';
    body.innerHTML = `${markdown(textOnlyContent, item.path, item.title)}${gallery}`;
    bindGallery(body);
  } else {
    body.innerHTML = markdown(item.content, item.path, item.title);
    if (type === 'project') body.insertAdjacentHTML('afterbegin', `<p class="layout-switch"><a href="${articleUrl(item)}">使用自适应图册布局</a></p>`);
  }
  const position = entries(type).indexOf(item); const older = entries(type)[position + 1]; const newer = entries(type)[position - 1];
  if (type !== 'project') setHtml('article-nav', [newer, older].map((entry, index) => entry ? `<a class="nav-card" href="${articleUrl(entry)}"><span>${index ? '下一篇' : '上一篇'}</span><strong>${escapeHtml(entry.title)}</strong></a>` : '').join(''));
}

function bindGallery(container) {
  const cards = [...container.querySelectorAll('[data-gallery-index]')];
  if (!cards.length) return;
  const dialog = document.createElement('dialog');
  dialog.className = 'image-lightbox';
  dialog.innerHTML = '<button class="lightbox-close" type="button" aria-label="关闭图片">×</button><img alt=""><p></p>';
  document.body.append(dialog);
  const image = dialog.querySelector('img'); const caption = dialog.querySelector('p');
  cards.forEach(card => card.addEventListener('click', () => { image.src = card.dataset.gallerySrc; image.alt = card.dataset.galleryAlt; caption.textContent = card.dataset.galleryAlt; dialog.showModal(); }));
  dialog.querySelector('.lightbox-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });
}

const page = document.body.dataset.page;
if (page === 'home') renderHome();
if (page === 'diary') renderList('diary', 'diary-list');
if (page === 'project') renderList('project', 'project-list');
if (page === 'reading') renderReading();
if (page === 'article') renderArticle();
