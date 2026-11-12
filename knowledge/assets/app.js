/* Study Library 前端逻辑 - hash 路由 SPA，静态托管，自建中文搜索 */
(function () {
  'use strict';

  var CAT_META = {
    'politics':      { name: '政治', en: 'Politics', color: '#a32d2d', icon: '政', desc: '马克思主义原理 · 毛中特 · 近现代史 · 思修 · 形势与政策' },
    'english':       { name: '英语', en: 'English', color: '#185fa5', icon: '英', desc: '词汇 · 语法 · 长难句 · 阅读 · 写作 · 真题解析' },
    'mathematics':   { name: '数学', en: 'Mathematics', color: '#0f6e56', icon: '数', desc: '高等数学 · 线性代数 · 概率论与数理统计' },
    'computer-408':  { name: '计算机408', en: 'Computer 408', color: '#534ab7', icon: '计', desc: '数据结构 · 组成原理 · 操作系统 · 计算机网络' }
  };

  var app = document.getElementById('app');
  var indexData = null;      // 首页 slim 数据
  var catCache = {};         // 各科完整数据缓存
  var flatCache = {};        // 各科扁平化文件列表缓存

  function h(html) { return html; }
  function esc(s) {
    return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }
  function humanSize(n) {
    if (n == null) return '';
    var u = ['B', 'KB', 'MB', 'GB', 'TB'];
    var i = 0;
    while (n >= 1024 && i < u.length - 1) { n /= 1024; i++; }
    return n.toFixed(n >= 100 ? 0 : 1) + ' ' + u[i];
  }

  function fetchJSON(url) {
    return fetch(url).then(function (r) { if (!r.ok) throw new Error('load fail'); return r.json(); });
  }

  function loadIndex() {
    if (indexData) return Promise.resolve(indexData);
    return fetchJSON('data/index.json').then(function (d) { indexData = d; return d; });
  }
  function loadCategory(cid) {
    if (catCache[cid]) return Promise.resolve(catCache[cid]);
    return fetchJSON('data/cat-' + cid + '.json').then(function (d) { catCache[cid] = d; return d; });
  }
  // 扁平化文件列表（用于搜索与渲染）
  function flatten(tree, base) {
    var out = [];
    (tree.__files__ || []).forEach(function (f) { out.push({ file: f, dir: base }); });
    var ch = tree.__children__ || {};
    Object.keys(ch).forEach(function (k) {
      out = out.concat(flatten(ch[k], base.concat([k])));
    });
    return out;
  }
  function getFlat(cid) {
    return loadCategory(cid).then(function (d) {
      if (!flatCache[cid]) flatCache[cid] = flatten(d.tree, []);
      return flatCache[cid];
    });
  }

  // ---------- 路由 ----------
  function route() {
    var hash = location.hash.replace(/^#\/?/, '') || '/';
    var parts = hash.split('/').filter(Boolean);
    setActiveNav();
    if (parts.length === 0) return renderHome();
    if (parts[0] === 'category' && parts[1]) return renderCategory(parts[1]);
    if (parts[0] === 'search') return renderSearch(decodeURIComponent(parts[1] || ''));
    if (parts[0] === 'note') return renderNote(decodeURIComponent(parts[1] || ''), decodeURIComponent(parts[2] || ''));
    return renderHome();
  }
  function setActiveNav() {
    var h = location.hash;
    document.querySelectorAll('[data-nav]').forEach(function (a) {
      var nav = a.getAttribute('data-nav');
      if (nav === 'home' && (h === '#/' || h === '')) a.classList.add('active');
      else if (nav !== 'home' && h.indexOf('/category/' + nav) === 0) a.classList.add('active');
      else a.classList.remove('active');
    });
  }

  // ---------- 首页 ----------
  function renderHome() {
    return loadIndex().then(function (d) {
      var cats = d.categories.map(function (c) {
        var m = CAT_META[c.id] || {};
        return '<a class="sl-cat-card" href="#/category/' + c.id + '">'
          + '<div class="icon" style="background:' + (m.color || '#666') + '">' + (m.icon || '') + '</div>'
          + '<h3>' + esc(c.name) + '</h3>'
          + '<div class="en">' + esc(m.en || '') + '</div>'
          + '<div class="meta">' + c.fileCount + ' 份资料 · ' + esc(c.sizeHuman) + '</div>'
          + '</a>';
      }).join('');
      app.innerHTML = h(
        '<div class="sl-hero">'
        + '<p class="zh">考研知识库</p>'
        + '<h1>Study Library</h1>'
        + '<p class="desc">Your Personal Learning &amp; Knowledge Center —— 政治 · 英语 · 数学 · 计算机408，结构化、可搜索、可持续更新的考研知识中心。</p>'
        + '</div>'
        + '<div class="sl-search"><span class="icon">&#128269;</span>'
        + '<input id="q" type="text" placeholder="搜索全站知识点、资料、章节…（支持中文/英文）" onkeydown="if(event.key===\'Enter\'){location.hash=\'#/search/\'+encodeURIComponent(this.value);}">'
        + '</div>'
        + '<div class="sl-metrics">'
        + '<div class="sl-metric"><div class="label">资料总数</div><div class="num">' + d.totalFiles + '</div></div>'
        + '<div class="sl-metric"><div class="label">总容量</div><div class="num">' + d.totalSizeHuman + '</div></div>'
        + '<div class="sl-metric"><div class="label">学科</div><div class="num">' + d.categories.length + '</div></div>'
        + '<div class="sl-metric"><div class="label">更新</div><div class="num">' + (d.generatedAt || '').slice(0, 10) + '</div></div>'
        + '</div>'
        + '<div class="sl-section"><h2>四大学科</h2><div class="sl-cat-grid">' + cats + '</div></div>'
        + '<div class="sl-footer">Study Library · 考研知识库 · 资料通过 COS 提供下载 · 原始文件与知识点一一对应</div>'
      );
      var q = document.getElementById('q');
      if (q) q.focus();
    });
  }

  // ---------- 学科页 ----------
  function renderCategory(cid) {
    var m = CAT_META[cid];
    if (!m) { app.innerHTML = '<div class="sl-empty">未知学科</div>'; return Promise.resolve(); }
    return loadCategory(cid).then(function (d) {
      var tree = d.tree;
      var files = flatten(tree, []);
      var withText = files.filter(function (x) { return x.file.summary && x.file.summary.length > 0; }).length;
      var scanned = files.filter(function (x) { return x.file.scanned; }).length;
      var dup = files.filter(function (x) { return x.file.duplicate; }).length;

      app.innerHTML = h(
        '<div class="sl-crumb"><a href="#/">首页</a><span>/</span>' + esc(m.name) + '</div>'
        + '<div class="sl-hero" style="padding-top:8px">'
        + '<h1>' + esc(m.name) + ' <span style="color:' + m.color + '">' + esc(m.en) + '</span></h1>'
        + '<p class="desc">' + esc(m.desc) + '</p>'
        + '</div>'
        + '<div class="sl-metrics">'
        + '<div class="sl-metric"><div class="label">资料数</div><div class="num">' + d.fileCount + '</div></div>'
        + '<div class="sl-metric"><div class="label">总容量</div><div class="num">' + d.sizeHuman + '</div></div>'
        + '<div class="sl-metric"><div class="label">可检索文字</div><div class="num">' + withText + '</div></div>'
        + '<div class="sl-metric"><div class="label">扫描版</div><div class="num">' + scanned + '</div></div>'
        + '</div>'
        + '<div class="sl-search"><span class="icon">&#128269;</span>'
        + '<input type="text" placeholder="在' + esc(m.name) + '中搜索…" onkeydown="if(event.key===\'Enter\'){location.hash=\'#/search/\'+encodeURIComponent(this.value)+\'?cat=' + cid + '\';}">'
        + '</div>'
        + '<div class="sl-section"><h2>目录结构</h2><div id="tree-root"></div></div>'
        + '<div class="sl-footer">共 ' + d.fileCount + ' 份资料' + (dup ? ' · ' + dup + ' 份重复已标注' : '') + ' · 原始文件可下载</div>'
      );
      renderTree(document.getElementById('tree-root'), tree, cid, []);
    });
  }

  // 递归渲染目录树
  function renderTree(container, node, cid, breadcrumb) {
    var ch = node.__children__ || {};
    var files = node.__files__ || [];
    var html = '<ul class="sl-tree">';
    var keys = Object.keys(ch).sort();
    keys.forEach(function (k, i) {
      var id = 'd-' + cid + '-' + i + '-' + Math.random().toString(36).slice(2, 8);
      var cnt = countFiles(ch[k]);
      html += '<li><div class="dir-row" data-target="' + id + '">'
        + '<span class="fold">&#9654;</span>'
        + '<span class="dname">' + esc(k) + '</span>'
        + '<span class="cnt">' + cnt + ' 项</span>'
        + '</div><ul class="sl-tree" id="' + id + '" style="display:none"></ul></li>';
    });
    files.forEach(function (x) {
      var f = x.file;
      var dupCls = f.duplicate ? ' dup' : '';
      html += '<li><div class="file-row' + dupCls + '">'
        + '<span class="fext">' + esc(f.ext) + '</span>'
        + '<a class="fname" href="' + esc(f.url) + '" target="_blank" rel="noopener">' + esc(f.name) + '</a>'
        + '<span class="fsize">' + esc(f.sizeHuman) + (f.pages ? ' · ' + f.pages + '页' : '') + '</span>'
        + '</div></li>';
    });
    html += '</ul>';
    container.innerHTML = html;

    // 目录展开/收起（懒加载子目录）
    container.querySelectorAll('.dir-row').forEach(function (row) {
      row.addEventListener('click', function () {
        var tid = row.getAttribute('data-target');
        var sub = document.getElementById(tid);
        if (sub.style.display === 'none') {
          if (!sub.dataset.loaded) {
            var k = row.querySelector('.dname').textContent;
            var childNode = node.__children__[k];
            renderTree(sub, childNode, cid, breadcrumb.concat([k]));
            sub.dataset.loaded = '1';
          }
          sub.style.display = '';
          row.classList.add('open');
        } else {
          sub.style.display = 'none';
          row.classList.remove('open');
        }
      });
    });
  }
  function countFiles(node) {
    var n = (node.__files__ || []).length;
    Object.keys(node.__children__ || {}).forEach(function (k) { n += countFiles(node.__children__[k]); });
    return n;
  }

  // ---------- 搜索 ----------
  function renderSearch(query, catFilter) {
    app.innerHTML = h(
      '<div class="sl-crumb"><a href="#/">首页</a><span>/</span>搜索</div>'
      + '<div class="sl-hero" style="padding-top:8px"><h1>搜索</h1><p class="desc">关键词：' + esc(query || '') + '</p></div>'
      + '<div class="sl-search"><span class="icon">&#128269;</span>'
      + '<input id="q2" type="text" value="' + esc(query) + '" placeholder="搜索知识点、资料、章节…" onkeydown="if(event.key===\'Enter\'){location.hash=\'#/search/\'+encodeURIComponent(this.value);}">'
      + '</div>'
      + '<div class="sl-results" id="results"><div class="sl-loading"><div class="spinner"></div>搜索中…</div></div>'
    );
    if (!query) { document.getElementById('results').innerHTML = '<div class="sl-empty">请输入搜索关键词</div>'; return Promise.resolve(); }

    var cids = catFilter ? [catFilter] : Object.keys(CAT_META);
    var q = query.toLowerCase();
    return Promise.all(cids.map(getFlat)).then(function (lists) {
      var all = [];
      lists.forEach(function (list, i) { all = all.concat(list.map(function (x) { x.cid = cids[i]; return x; })); });
      var results = all.filter(function (x) {
        var f = x.file;
        var hay = (f.name + ' ' + (f.summary || '') + ' ' + x.dir.join(' ')).toLowerCase();
        return hay.indexOf(q) >= 0;
      });
      renderResults(results, query);
    });
  }
  function renderResults(results, query) {
    var el = document.getElementById('results');
    if (!results.length) { el.innerHTML = '<div class="sl-empty">未找到与「' + esc(query) + '」相关的内容</div>'; return; }
    var re = new RegExp('(' + query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')', 'gi');
    var html = '<div style="font-size:13px;color:var(--text-2);margin-bottom:12px">共 ' + results.length + ' 条结果</div>';
    results.slice(0, 200).forEach(function (x) {
      var f = x.file;
      var m = CAT_META[x.cid] || {};
      var title = f.name.replace(re, '<mark>$1</mark>');
      var summary = (f.summary || '').slice(0, 200);
      if (summary) summary = esc(summary).replace(re, '<mark>$1</mark>');
      html += '<div class="sl-result">'
        + '<div class="title"><a href="' + esc(f.url) + '" target="_blank" rel="noopener">' + title + '</a></div>'
        + '<div class="path">' + esc(m.name) + ' / ' + esc(x.dir.join(' / ')) + ' · ' + esc(f.sizeHuman) + '</div>'
        + (summary ? '<div class="summary">' + summary + '…</div>' : '')
        + '</div>';
    });
    el.innerHTML = html;
  }

  // ---------- 知识点笔记 ----------
  function renderNote(cid, slug) {
    app.innerHTML = h('<div class="sl-crumb"><a href="#/">首页</a><span>/</span><a href="#/category/' + cid + '">' + (CAT_META[cid] ? CAT_META[cid].name : cid) + '</a><span>/</span>笔记</div><div class="sl-loading"><div class="spinner"></div>加载笔记…</div>');
    return fetch('notes/' + cid + '/' + slug + '.md').then(function (r) {
      if (!r.ok) throw new Error('note missing');
      return r.text();
    }).then(function (md) {
      var html = mdToHtml(md);
      app.innerHTML = html;
    }).catch(function () {
      app.innerHTML = '<div class="sl-empty">笔记不存在或无法加载</div>';
    });
  }

  // 简易 Markdown 渲染（标题/段落/代码块/引用/列表）
  function mdToHtml(md) {
    var lines = md.split('\n');
    var out = [];
    var inCode = false, codeBuf = [];
    var frontMatter = false, fmDone = false;
    lines.forEach(function (line) {
      if (!fmDone) {
        if (line.trim() === '---') { frontMatter = !frontMatter; if (!frontMatter) fmDone = true; return; }
        if (frontMatter) return;
      }
      if (line.trim().startsWith('```')) {
        if (inCode) { out.push('<pre><code>' + esc(codeBuf.join('\n')) + '</code></pre>'); codeBuf = []; inCode = false; }
        else inCode = true;
        return;
      }
      if (inCode) { codeBuf.push(line); return; }
      var m;
      if ((m = line.match(/^(#{1,4})\s+(.*)/))) {
        var lv = m[1].length;
        out.push('<h' + lv + '>' + esc(m[2]) + '</h' + lv + '>');
      } else if (line.trim().startsWith('> ')) {
        out.push('<blockquote>' + esc(line.trim().slice(2)) + '</blockquote>');
      } else if (line.trim().startsWith('- ')) {
        out.push('<p>' + esc(line.trim().slice(2)) + '</p>');
      } else if (line.trim()) {
        out.push('<p>' + esc(line.trim()) + '</p>');
      }
    });
    return '<div class="sl-note">' + out.join('\n') + '</div>';
  }

  window.addEventListener('hashchange', route);
  route();
})();
