async function loadJson(path) {
  try {
    const res = await fetch(path);
    if (!res.ok) throw new Error(`无法读取数据：${path}`);
    return await res.json();
  } catch (err) {
    if (path.includes('diary') && Array.isArray(window.__DIARY_DATA__)) return window.__DIARY_DATA__;
    if (path.includes('reading') && Array.isArray(window.__READING_DATA__)) return window.__READING_DATA__;
    if (path.includes('projects') && Array.isArray(window.__PROJECTS_DATA__)) return window.__PROJECTS_DATA__;
    throw err;
  }
}

function escapeHtml(input = "") {
  return input
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function isMetaLine(rawLine) {
  const plain = rawLine
    .replace(/\*\*/g, "")
    .replace(/^>\s*/, "")
    .trim();

  if (!plain) return false;
  if (plain === "---" || plain === "--") return true;

  return /^(Author\s*\/\s*作者|Source\s*\/\s*来源|Date\s*\/\s*日期|作者|来源|日期|摘要|Summary|技术栈|Stack|GitHub|封面|Cover)\s*[:：]/i.test(plain);
}

function normalizeAssetPath(rawPath = "") {
  const p = rawPath.trim().replaceAll('\\', '/');
  if (!p) return p;

  if (/^https?:\/\//i.test(p)) {
    return encodeURI(p);
  }

  const normalized = (p.startsWith('./') || p.startsWith('../') || p.startsWith('/'))
    ? p
    : `./${p}`;

  return encodeURI(normalized);
}

function miniMarkdown(md) {
  const lines = md.replace(/\r\n/g, "\n").split("\n");
  let html = "";
  let inList = false;
  let inCode = false;
  let codeLang = "";

  const closeList = () => {
    if (inList) {
      html += "</ul>";
      inList = false;
    }
  };

  for (const rawLine of lines) {
    const line = rawLine;

    if (isMetaLine(line)) {
      continue;
    }

    if (line.startsWith("```")) {
      closeList();
      if (!inCode) {
        inCode = true;
        codeLang = line.slice(3).trim();
        html += `<pre><code class="lang-${escapeHtml(codeLang)}">`;
      } else {
        inCode = false;
        codeLang = "";
        html += "</code></pre>";
      }
      continue;
    }

    if (inCode) {
      html += `${escapeHtml(line)}\n`;
      continue;
    }

    if (!line.trim()) {
      closeList();
      html += "<br />";
      continue;
    }

    if (line.startsWith("@@hero ")) {
      closeList();
      html += `<p class="md-hero">${escapeHtml(line.slice(7).trim())}</p>`;
      continue;
    }

    if (line.startsWith("### ")) {
      closeList();
      html += `<h3>${escapeHtml(line.slice(4))}</h3>`;
      continue;
    }

    if (line.startsWith("## ")) {
      closeList();
      html += `<h2>${escapeHtml(line.slice(3))}</h2>`;
      continue;
    }

    if (line.startsWith("# ")) {
      closeList();
      html += `<h1>${escapeHtml(line.slice(2))}</h1>`;
      continue;
    }

    if (line.startsWith("> ")) {
      closeList();
      html += `<blockquote>${escapeHtml(line.slice(2))}</blockquote>`;
      continue;
    }

    if (line.startsWith("- ")) {
      if (!inList) {
        html += "<ul>";
        inList = true;
      }
      html += `<li>${escapeHtml(line.slice(2))}</li>`;
      continue;
    }

    closeList();
    let inline = escapeHtml(line)
      .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
      .replace(/`([^`]+)`/g, "<code>$1</code>");

    inline = inline
      .replace(/!\[([^\]]*)\]\(([^\)]+)\)/g, (_, alt, src) => `<img src="${normalizeAssetPath(src)}" alt="${alt}" loading="lazy" />`)
      .replace(/\[([^\]]+)\]\(([^\)]+)\)/g, (_, text, href) => `<a href="${normalizeAssetPath(href)}" target="_blank" rel="noopener">${text}</a>`);

    html += `<p>${inline}</p>`;
  }

  closeList();
  return html;
}

function normalizeArticleMarkdown(md) {
  const lines = md.replace(/\r\n/g, "\n").split("\n");
  const out = [];
  let skippedTitle = false;

  for (const raw of lines) {
    const line = raw.trim();

    if (!skippedTitle && line.startsWith("# ")) {
      skippedTitle = true;
      continue;
    }

    if (isMetaLine(raw)) {
      continue;
    }

    out.push(raw);
  }

  return out.join("\n").trim();
}

function formatDate(date) {
  return date || "";
}

function parseQuery() {
  const q = new URLSearchParams(location.search);
  return {
    type: q.get("type") || "diary",
    id: q.get("id") || ""
  };
}

window.BlogApp = {
  loadJson,
  miniMarkdown,
  normalizeArticleMarkdown,
  formatDate,
  parseQuery
};
