const DATA = window.__BLOG_DATA__ || { diary: [], reading: [], project: [] };

export const escapeHtml = (value = '') => String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#39;');
export const articleUrl = item => `./article.html?type=${encodeURIComponent(item.type)}&id=${encodeURIComponent(item.id)}`;
export const entries = type => DATA[type] || [];
export const getQuery = () => Object.fromEntries(new URLSearchParams(location.search));

export function assetUrl(rawPath, markdownPath) {
  try { return new URL(rawPath, new URL(markdownPath, location.href)).href; } catch { return ''; }
}

export function markdown(markdownSource, markdownPath, pageTitle = '') {
  const { body = markdownSource } = splitFrontMatter(markdownSource);
  let listOpen = false;
  let checkedDocumentTitle = false;
  const closeList = () => listOpen ? (listOpen = false, '</ul>') : '';
  return body.split('\n').map(raw => {
    const line = raw.trim();
    if (!line) return closeList();
    if (/^# /.test(line)) {
      const heading = line.slice(2).trim();
      if (!checkedDocumentTitle) { checkedDocumentTitle = true; if (heading === pageTitle) return closeList(); }
      return `${closeList()}<h1>${escapeHtml(heading)}</h1>`;
    }
    if (/^## /.test(line)) return `${closeList()}<h2>${escapeHtml(line.slice(3))}</h2>`;
    if (/^### /.test(line)) return `${closeList()}<h3>${escapeHtml(line.slice(4))}</h3>`;
    if (/^@@hero /.test(line)) return `${closeList()}<p class="md-hero">${escapeHtml(line.slice(7))}</p>`;
    const image = line.match(/^!\[([^\]]*)\]\(([^)]+)\)$/);
    if (image) return `${closeList()}<img src="${escapeHtml(assetUrl(image[2], markdownPath))}" alt="${escapeHtml(image[1])}" loading="lazy">`;
    if (/^- /.test(line)) { const item = `<li>${inline(line.slice(2), markdownPath)}</li>`; return listOpen ? item : (listOpen = true, `<ul>${item}`); }
    if (/^> /.test(line)) return `${closeList()}<blockquote>${inline(line.slice(2), markdownPath)}</blockquote>`;
    return `${closeList()}<p>${inline(line, markdownPath)}</p>`;
  }).join('') + closeList();
}

function inline(text, markdownPath) {
  return escapeHtml(text).replace(/`([^`]+)`/g, '<code>$1</code>').replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>').replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_, label, href) => {
    const url = /^(https?:|mailto:)/i.test(href) ? href : assetUrl(href, markdownPath);
    return `<a href="${escapeHtml(url)}" target="_blank" rel="noopener">${label}</a>`;
  });
}

function splitFrontMatter(source) {
  const match = source.match(/^---\n[\s\S]*?\n---\n?([\s\S]*)$/);
  return { body: match ? match[1] : source };
}

export function card(item, heading = 'h2') {
  const github = item.github && /^https:\/\//i.test(item.github) ? `<a class="read-more" href="${escapeHtml(item.github)}" target="_blank" rel="noopener">GitHub</a>` : '';
  const summary = item.summary && item.summary.trim() !== item.title.trim() ? `<p class="item-desc">${escapeHtml(item.summary)}</p>` : '';
  return `<li class="item card-row"><div class="item-meta">${escapeHtml(item.date)}${item.stack ? ` · ${escapeHtml(item.stack)}` : ''}</div><${heading} class="item-title"><a href="${articleUrl(item)}">${escapeHtml(item.title)}</a></${heading}>${summary}${github}</li>`;
}
