/* JayDreamy Resources Center
   No framework, no CDN, no build step. Loads the sharded manifest on demand.
   All dynamic text is HTML-escaped; file names come from the real filesystem. */
(function () {
  'use strict';

  var root = document.getElementById('rs-root');
  if (!root) return;

  var pathname = window.location.pathname;
  if (/\.html?$/i.test(pathname)) pathname = pathname.replace(/[^/]*$/, '');
  if (pathname.slice(-1) !== '/') pathname += '/';
  var DATA = pathname + 'data/';

  var ICON = {
    search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"></circle><path d="M20 20l-3.6-3.6"></path></svg>',
    folder: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path></svg>',
    file: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M7 3h7l5 5v12a1 1 0 0 1 1-1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z"></path><path d="M14 3v5h5"></path></svg>',
    download: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v12"></path><path d="M7 11l5 5 5-5"></path><path d="M4 20h16"></path></svg>',
    eye: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3.6-6 10-6 10 6 10 6-3.6 6-10 6S2 12 2 12z"></path><circle cx="12" cy="12" r="2.8"></circle></svg>'
  };

  var S = {
    index: null,
    shards: {},
    pending: {},
    category: 'all',
    group: 'all',
    query: '',
    sort: 'name',
    order: 1,
    dir: '',
    limit: 60,
    lastFiltered: []
  };
  var debounce = null;

  // Only these browser-native formats can be shown inline. COS already serves
  // them with the correct Content-Type and without Content-Disposition, so no
  // server-side change is required. Anything else keeps the download button.
  var PREVIEW_EXT = {
    pdf: 'frame',
    png: 'image', jpg: 'image', jpeg: 'image', gif: 'image', webp: 'image', bmp: 'image', svg: 'image',
    mp4: 'video', webm: 'video', ogv: 'video', m4v: 'video',
    mp3: 'audio', m4a: 'audio', wav: 'audio', ogg: 'audio', aac: 'audio', flac: 'audio',
    txt: 'text', md: 'text', log: 'text', csv: 'text', json: 'text'
  };
  function previewKind(f) {
    var ext = String(f.extension || '').replace(/^\./, '').toLowerCase();
    var kind = PREVIEW_EXT[ext] || '';
    // Large plain-text resources (e.g. 13 MB dictionary .mdx files) would
    // freeze the tab if rendered inline, so only small text files qualify.
    if (kind === 'text' && f.size > 1024 * 1024) return '';
    return kind;
  }

  // Replacing #rs-content can shrink the document and make the browser clamp
  // scrollY. Restore the reader's position after each re-render instead of
  // forcing a jump back to the top of the resources block.
  function restoreScroll(y) {
    if (!y || !window.scrollTo) return;
    var doc = document.documentElement || document.body;
    var maxY = (doc && typeof doc.scrollHeight === 'number')
      ? Math.max(0, doc.scrollHeight - (window.innerHeight || 0)) : y;
    var target = Math.min(y, maxY);
    if (Math.abs((window.pageYOffset || window.scrollY || 0) - target) > 1) {
      window.scrollTo(0, target);
    }
  }

  function esc(value) {
    return String(value == null ? '' : value).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function pageSize() { return (S.index && S.index.pageSize) || 60; }
  function fmtSize(n) {
    if (typeof n !== 'number') return '-';
    if (n < 1024) return n + ' B';
    var units = ['KB', 'MB', 'GB', 'TB'], v = n / 1024, i = 0;
    while (v >= 1024 && i < units.length - 1) { v /= 1024; i++; }
    return (v >= 100 ? v.toFixed(0) : v >= 10 ? v.toFixed(1) : v.toFixed(2)) + ' ' + units[i];
  }
  function fmtDate(s) { return String(s || '').replace('T', ' ').slice(0, 16); }
  function byName(a, b) { return String(a).localeCompare(String(b), 'zh-Hans-CN', { numeric: true, sensitivity: 'base' }); }
  function badge(g) {
    return { document: 't-pdf', archive: 't-archive', image: 't-image', video: 't-video', audio: 't-audio' }[g] || '';
  }
  function catById(id) {
    for (var i = 0; i < S.index.categories.length; i++) {
      if (S.index.categories[i].id === id) return S.index.categories[i];
    }
    return null;
  }

  function buildShell() {
    root.innerHTML =
      '<div class="rs-intro"><span class="rs-intro-dot"></span>' +
        '<span>学习资料 · 文档 · 视频 · 图片</span><span>·</span>' +
        '<span>按原始目录层级整理，支持在线预览与下载</span></div>' +
      '<div class="rs-stats" id="rs-stats"></div>' +
      '<div class="rs-bundles" id="rs-bundles"></div>' +
      '<div class="rs-search">' + ICON.search +
        '<input class="rs-search-input" id="rs-q" type="search" autocomplete="off" ' +
          'placeholder="搜索文件名称、路径或关键词（中文 / English）" aria-label="搜索资源">' +
        '<button class="rs-search-clear" id="rs-clear" data-act="clear" aria-label="清除搜索">&times;</button>' +
      '</div>' +
      '<div class="rs-tabs" id="rs-tabs"></div>' +
      '<div class="rs-filters" id="rs-filters"></div>' +
      '<div class="rs-pending" id="rs-pending"></div>' +
      '<div class="rs-crumb" id="rs-crumb"></div>' +
      '<div class="rs-content" id="rs-content"></div>' +
      '<div class="rs-foot" id="rs-foot"></div>' +
      '<div class="rs-modal" id="rs-modal" hidden>' +
        '<div class="rs-modal-mask" data-act="close-preview"></div>' +
        '<div class="rs-modal-box" role="dialog" aria-modal="true" aria-label="文件在线预览">' +
          '<div class="rs-modal-head" id="rs-modal-head"></div>' +
          '<div class="rs-modal-body" id="rs-modal-body"></div>' +
        '</div>' +
      '</div>';
  }

  function loadShard(id) {
    if (S.shards[id]) return Promise.resolve(S.shards[id]);
    if (S.pending[id]) return S.pending[id];
    var cat = catById(id);
    if (!cat) return Promise.resolve([]);
    S.pending[id] = fetch(DATA + cat.shard, { cache: 'no-cache' })
      .then(function (r) {
        if (!r.ok) throw new Error('HTTP ' + r.status + ' (' + cat.shard + ')');
        return r.json();
      })
      .then(function (j) {
        S.shards[id] = j.files || [];
        delete S.pending[id];
        return S.shards[id];
      })
      .catch(function (e) { delete S.pending[id]; throw e; });
    return S.pending[id];
  }
  function needAll() { return S.category === 'all' || S.query.trim() !== ''; }
  function scopeFiles() {
    if (needAll()) {
      return Promise.all(S.index.categories.map(function (c) { return loadShard(c.id); }))
        .then(function (arrays) { return [].concat.apply([], arrays); });
    }
    return loadShard(S.category);
  }
  function basePrefix() {
    if (S.category === 'all') return '';
    var cat = catById(S.category);
    if (!cat) return '';
    for (var i = 0; i < (cat.topDirs || []).length; i++) {
      var t = cat.topDirs[i];
      if (!/\.(zip|7z|rar|tar|gz)$/i.test(t)) return t;
    }
    return '';
  }
  function vpath(f) {
    var b = basePrefix();
    if (b && f.path.indexOf(b + '/') === 0) return f.path.slice(b.length + 1);
    return f.path;
  }
  function vdir(f) {
    var p = vpath(f), i = p.lastIndexOf('/');
    return i < 0 ? '' : p.slice(0, i);
  }

  function renderStats() {
    var n = S.index.totalFiles.toLocaleString('zh-CN');
    document.getElementById('rs-stats').innerHTML =
      '<div class="rs-stat"><div class="rs-stat-num">' + n + '</div><div class="rs-stat-label">资源总数</div></div>' +
      '<div class="rs-stat"><div class="rs-stat-num">' + S.index.categoryCount + '</div><div class="rs-stat-label">分类数量</div></div>' +
      '<div class="rs-stat"><div class="rs-stat-num">' + esc(S.index.totalSizeHuman) + '</div><div class="rs-stat-label">总文件容量</div></div>';
  }
  function renderBundles() {
    var host = document.getElementById('rs-bundles');
    if (!host) return;
    var list = S.index.bundles || [];
    if (!list.length) { host.innerHTML = ''; return; }
    var html = '<div class="rs-bundle-head"><span class="rs-bundle-title">' + ICON.folder +
      '整包下载</span><span class="rs-bundle-note">' + esc(S.index.bundleNote || '') + '</span></div>' +
      '<div class="rs-bundle-grid">';
    list.forEach(function (b) {
      html += '<a class="rs-bundle-card" href="' + esc(b.url) + '" target="_blank" rel="noopener noreferrer">' +
        '<div class="rs-bundle-name"><span class="rs-bundle-badge">ZIP</span>' + esc(b.name) + '</div>' +
        '<div class="rs-bundle-file">' + esc(b.file) + '</div>' +
        '<div class="rs-bundle-bottom"><span class="rs-bundle-size">' + esc(b.sizeHuman) + '</span>' +
        '<span class="rs-bundle-dl">' + ICON.download + '下载整包</span></div></a>';
    });
    html += '</div>';
    host.innerHTML = html;
  }
  function renderPending() {
    var host = document.getElementById('rs-pending');
    if (!host) return;
    var list = S.index.pendingCategories || [];
    if (!list.length) { host.innerHTML = ''; return; }
    var names = list.map(function (c) {
      return esc(c.name) + '（' + c.count + ' 个文件 · ' + esc(c.sizeHuman) + '）';
    }).join('、');
    host.innerHTML = '<span class="rs-pending-dot"></span><div><strong>' +
      esc(S.index.pendingNote || '部分资料正在上传中') + '</strong>' +
      '<span>暂未开放逐文件下载：' + names + '。整包下载不受影响。</span></div>';
  }
  function renderTabs() {
    var html = '<button class="rs-tab' + (S.category === 'all' ? ' active' : '') + '" data-act="cat" data-id="all">全部资源' +
      '<span class="rs-tab-count">' + S.index.totalFiles + '</span></button>';
    S.index.categories.forEach(function (c) {
      html += '<button class="rs-tab' + (S.category === c.id ? ' active' : '') + '" data-act="cat" data-id="' + esc(c.id) + '">' +
        esc(c.name) + '<span class="rs-tab-count">' + c.count + '</span></button>';
    });
    document.getElementById('rs-tabs').innerHTML = html;
  }
  function renderFilters() {
    var html = '<button class="rs-chip' + (S.group === 'all' ? ' active' : '') + '" data-act="group" data-id="all">全部类型</button>';
    (S.index.typeGroups || []).forEach(function (g) {
      html += '<button class="rs-chip' + (S.group === g.id ? ' active' : '') + '" data-act="group" data-id="' + esc(g.id) + '">' +
        esc(g.label) + ' ' + g.count + '</button>';
    });
    html += '<div class="rs-sort"><select id="rs-sort" aria-label="排序方式">' +
      '<option value="name"' + (S.sort === 'name' ? ' selected' : '') + '>按名称</option>' +
      '<option value="size"' + (S.sort === 'size' ? ' selected' : '') + '>按大小</option>' +
      '<option value="modified"' + (S.sort === 'modified' ? ' selected' : '') + '>按更新时间</option>' +
      '</select><button class="rs-order" data-act="order" aria-label="切换升降序">' +
      (S.order === 1 ? '&#8593;' : '&#8595;') + '</button></div>';
    document.getElementById('rs-filters').innerHTML = html;
  }
  function renderCrumb() {
    if (S.query.trim()) {
      document.getElementById('rs-crumb').innerHTML =
        '<span class="rs-crumb-cur">搜索：' + esc(S.query.trim()) + '</span>' +
        '<button style="margin-left:auto" data-act="clear">清除搜索</button>';
      return;
    }
    var parts = S.dir ? S.dir.split('/') : [];
    var html = '<button data-act="crumb" data-dir="">全部资源</button>';
    var acc = '';
    parts.forEach(function (part, i) {
      acc = acc ? acc + '/' + part : part;
      html += '<span class="rs-sep">/</span>';
      html += (i === parts.length - 1)
        ? '<span class="rs-crumb-cur">' + esc(part) + '</span>'
        : '<button data-act="crumb" data-dir="' + esc(acc) + '">' + esc(part) + '</button>';
    });
    if (parts.length) html += '<button style="margin-left:auto" data-act="up">&#8592; 返回上级</button>';
    document.getElementById('rs-crumb').innerHTML = html;
  }
  function renderFoot() {
    document.getElementById('rs-foot').innerHTML =
      '清单更新于 ' + esc(String(S.index.generatedAt).replace('T', ' ')) +
      ' · 共 ' + S.index.shards.length + ' 个分类数据分片，按需加载。' +
      '<br>文件按原始目录结构组织，链接指向 <code>files.jaydreamy.com</code> 上的具体对象地址，不依赖云端目录列举权限。';
  }

  function rowHtml(f) {
    var kind = previewKind(f);
    var preview = kind
      ? '<button class="rs-btn rs-btn-preview" data-act="preview" data-url="' + esc(f.url) +
          '" data-name="' + esc(f.name) + '" data-kind="' + esc(kind) +
          '" data-size="' + (Number(f.size) || 0) +
          '" aria-label="在线预览 ' + esc(f.name) + '">' + ICON.eye + '预览</button>'
      : '';
    return '<div class="rs-row">' +
      '<div class="rs-cell-main"><span class="rs-file-ico">' + ICON.file + '</span>' +
        '<div style="min-width:0"><div class="rs-name">' + esc(f.name) +
        (f.bundle ? '<span class="rs-bundle-tag">合集</span>' : '') + '</div>' +
        '<div class="rs-path">' + esc(f.dir || f.category) + '</div></div></div>' +
      '<div class="rs-cell-type"><span class="rs-badge ' + badge(f.typeGroup) + '">' + esc(f.type) + '</span></div>' +
      '<div class="rs-cell-size">' + fmtSize(f.size) + '</div>' +
      '<div class="rs-cell-date">' + esc(fmtDate(f.modified)) + '</div>' +
      '<div class="rs-cell-action">' + preview + '<a class="rs-btn" href="' + esc(f.url) + '" ' +
        'target="_blank" rel="noopener noreferrer" aria-label="下载 ' + esc(f.name) + '">' + ICON.download + '下载</a></div>' +
    '</div>';
  }
  function emptyHtml() {
    return '<div class="rs-empty"><strong>没有找到匹配的资源</strong>' +
      '试试更换关键词，或清除分类 / 类型筛选条件。' +
      '<br><button data-act="reset">清除全部筛选</button></div>';
  }
  function paintContent(filtered, keepY) {
    var y = typeof keepY === 'number' ? keepY : (window.pageYOffset || window.scrollY || 0);
    S.lastFiltered = filtered;
    var content = document.getElementById('rs-content');
    var searching = S.query.trim() !== '';
    var inTree, direct, dirs;
    if (searching) {
      // Search is global: flatten matches across every directory instead of
      // hiding them behind folder cards.
      inTree = filtered;
      direct = filtered.slice();
      dirs = [];
    } else {
      inTree = filtered.filter(function (f) {
        var d = vdir(f);
        return S.dir === '' ? true : (d === S.dir || d.indexOf(S.dir + '/') === 0);
      });
      direct = inTree.filter(function (f) { return vdir(f) === S.dir; });
      var sub = {};
      inTree.forEach(function (f) {
        var d = vdir(f);
        if (d === S.dir) return;
        var rest = S.dir ? d.slice(S.dir.length + 1) : d;
        var name = rest.split('/')[0];
        if (!name) return;
        if (!sub[name]) sub[name] = { name: name, count: 0, size: 0 };
        sub[name].count++;
        sub[name].size += f.size;
      });
      dirs = Object.keys(sub).map(function (k) { return sub[k]; })
        .sort(function (a, b) { return byName(a.name, b.name); });
    }

    direct.sort(function (a, b) {
      var r;
      if (S.sort === 'size') r = a.size - b.size;
      else if (S.sort === 'modified') r = a.modified < b.modified ? -1 : (a.modified > b.modified ? 1 : 0);
      else r = byName(a.name, b.name);
      return r * S.order;
    });

    var html = '';
    if (dirs.length) {
      html += '<div class="rs-section-title">文件夹 <span>' + dirs.length + ' 个</span></div><div class="rs-dirs">';
      dirs.forEach(function (d) {
        var full = S.dir ? S.dir + '/' + d.name : d.name;
        html += '<button class="rs-dir" data-act="dir" data-dir="' + esc(full) +
          '" title="' + esc(d.name) + '">' +
          '<span class="rs-dir-ico">' + ICON.folder + '</span><span class="rs-dir-body">' +
          '<span class="rs-dir-name">' + esc(d.name) + '</span>' +
          '<span class="rs-dir-meta">' + d.count + ' 个文件 · ' + fmtSize(d.size) + '</span>' +
          '</span></button>';
      });
      html += '</div>';
    }
    html += '<div class="rs-section-title">' + (searching ? '搜索结果' : '文件') +
      ' <span>' + direct.length + ' 个</span></div>';
    if (!direct.length && !dirs.length) {
      html += emptyHtml();
    } else if (!direct.length) {
      html += '<div class="rs-empty"><strong>当前目录没有直接文件</strong>请进入上方文件夹查看内容。</div>';
    } else {
      html += '<div class="rs-list"><div class="rs-list-head">' +
        '<div class="rs-cell-main">文件名称</div><div class="rs-cell-type">类型</div>' +
        '<div class="rs-cell-size">大小</div><div class="rs-cell-date">更新时间</div>' +
        '<div class="rs-cell-action">操作</div></div>';
      direct.slice(0, S.limit).forEach(function (f) { html += rowHtml(f); });
      html += '</div>';
      if (direct.length > S.limit) {
        html += '<div class="rs-more-wrap"><button class="rs-more" data-act="more">加载更多（剩余 ' +
          (direct.length - S.limit) + ' 个）</button></div>';
      }
    }
    content.innerHTML = html;
    restoreScroll(y);
  }

  var HEAVY_LIMIT = 20 * 1024 * 1024;
  function openPreview(url, name, kind, size, force) {
    if (!url || !kind) return;
    var modal = document.getElementById('rs-modal');
    var head = document.getElementById('rs-modal-head');
    var body = document.getElementById('rs-modal-body');
    if (!modal || !head || !body) return;
    var bytes = Number(size) || 0;
    var heavy = kind === 'frame' && bytes > HEAVY_LIMIT && !force;
    var media;
    if (heavy) {
      // The built-in PDF viewer downloads the whole object before rendering.
      // Several scanned PDFs here approach 1 GB, so ask before loading them.
      media = '<div class="rs-preview-heavy">' +
        '<div class="rs-preview-heavy-title">大文件在线预览</div>' +
        '<div class="rs-preview-heavy-desc">该文件 ' + esc(fmtSize(bytes)) +
          '，浏览器 PDF 查看器需要先下载完整文件才能显示，可能较慢并产生较多流量。建议直接下载，或在新标签中打开。</div>' +
        '<div class="rs-preview-heavy-actions">' +
          '<button class="rs-more" data-act="force-preview" data-url="' + esc(url) +
            '" data-name="' + esc(name) + '" data-size="' + bytes + '">仍要在线预览</button>' +
          '<a class="rs-btn" href="' + esc(url) + '" target="_blank" rel="noopener noreferrer">新标签打开</a>' +
          '<a class="rs-btn rs-btn-preview" href="' + esc(url) + '" target="_blank" rel="noopener noreferrer" download>下载文件</a>' +
        '</div></div>';
    } else if (kind === 'image') {
      media = '<img class="rs-preview-img" src="' + esc(url) + '" alt="' + esc(name) + '">';
    } else if (kind === 'video') {
      media = '<video class="rs-preview-video" controls preload="metadata" src="' + esc(url) + '"></video>';
    } else if (kind === 'audio') {
      media = '<div class="rs-preview-audio"><div class="rs-preview-audio-name">' + esc(name) +
        '</div><audio controls preload="metadata" src="' + esc(url) + '"></audio></div>';
    } else {
      // #zoom=FitH is a hash-only hint for Chrome/Edge's built-in PDF viewer;
      // it is never sent to COS and degrades harmlessly in other browsers.
      media = '<div class="rs-preview-loading" id="rs-preview-loading">正在加载预览…</div>' +
        '<iframe class="rs-preview-frame" src="' + esc(url) + '#zoom=FitH" title="' + esc(name) + '"></iframe>';
    }
    head.innerHTML = '<span class="rs-modal-title" title="' + esc(name) + '">' + esc(name) + '</span>' +
      '<div class="rs-modal-actions">' +
        '<button class="rs-modal-btn" data-act="fullscreen" title="全屏预览">全屏</button>' +
        '<a class="rs-modal-open" href="' + esc(url) + '" target="_blank" rel="noopener noreferrer">新标签打开</a>' +
        '<a class="rs-modal-open" href="' + esc(url) + '" target="_blank" rel="noopener noreferrer" download>下载</a>' +
        '<button class="rs-modal-close" data-act="close-preview" aria-label="关闭预览">&times;</button>' +
      '</div>';
    body.innerHTML = media;
    var frame = body.querySelector ? body.querySelector('.rs-preview-frame') : null;
    if (frame && frame.addEventListener) {
      frame.addEventListener('load', function () {
        var l = document.getElementById('rs-preview-loading');
        if (l && l.parentNode && l.parentNode.removeChild) l.parentNode.removeChild(l);
      });
    }
    modal.hidden = false;
    if (document.body && document.body.classList) document.body.classList.add('rs-no-scroll');
  }
  function closePreview() {
    var modal = document.getElementById('rs-modal');
    var body = document.getElementById('rs-modal-body');
    if (body) body.innerHTML = ''; // unload media, stop audio/video playback
    if (modal) modal.hidden = true;
    if (document.body && document.body.classList) document.body.classList.remove('rs-no-scroll');
  }

  function render() {
    if (!S.index) return;
    var keepY = window.pageYOffset || window.scrollY || 0;
    renderStats();
    renderBundles();
    renderTabs();
    renderFilters();
    renderPending();
    renderCrumb();
    renderFoot();

    var needed = needAll() ? S.index.categories.map(function (c) { return c.id; }) : [S.category];
    if (needed.some(function (id) { return !S.shards[id]; })) {
      document.getElementById('rs-content').innerHTML = '<div class="rs-boot">正在加载资源数据…</div>';
    }
    scopeFiles().then(function (all) {
      var q = S.query.trim().toLowerCase();
      var filtered = all.filter(function (f) {
        if (S.group !== 'all' && f.typeGroup !== S.group) return false;
        if (!q) return true;
        return (f.name + ' ' + f.path).toLowerCase().indexOf(q) !== -1;
      });
      paintContent(filtered, keepY);
    }).catch(function (e) {
      document.getElementById('rs-content').innerHTML =
        '<div class="rs-error">资源清单加载失败：' + esc(e.message) +
        '<br>请确认 /resources/data/ 下的 JSON 已随站点发布。<br><br>' +
        '<button class="rs-more" data-act="retry">重新加载</button></div>';
      restoreScroll(keepY);
    });
  }

  root.addEventListener('click', function (e) {
    var t = e.target && e.target.closest ? e.target.closest('[data-act]') : null;
    if (!t || !root.contains(t)) return;
    var act = t.getAttribute('data-act');
    if (act === 'preview') {
      openPreview(t.getAttribute('data-url'), t.getAttribute('data-name'), t.getAttribute('data-kind'),
        Number(t.getAttribute('data-size')) || 0, false);
    } else if (act === 'force-preview') {
      openPreview(t.getAttribute('data-url'), t.getAttribute('data-name'), 'frame',
        Number(t.getAttribute('data-size')) || 0, true);
    } else if (act === 'fullscreen') {
      var mdl = document.getElementById('rs-modal');
      if (mdl && mdl.requestFullscreen) {
        try { mdl.requestFullscreen(); } catch (err) { /* unsupported or denied */ }
      }
    } else if (act === 'close-preview') {
      closePreview();
    } else if (act === 'cat') {
      S.category = t.getAttribute('data-id'); S.dir = ''; S.limit = pageSize(); render();
    } else if (act === 'group') {
      S.group = t.getAttribute('data-id'); S.dir = ''; S.limit = pageSize(); render();
    } else if (act === 'crumb') {
      S.dir = t.getAttribute('data-dir') || ''; S.limit = pageSize(); render();
    } else if (act === 'dir') {
      // Keep the reader where they are: opening a folder must not scroll up.
      S.dir = t.getAttribute('data-dir') || ''; S.limit = pageSize(); render();
    } else if (act === 'up') {
      var i = S.dir.lastIndexOf('/');
      S.dir = i < 0 ? '' : S.dir.slice(0, i); S.limit = pageSize(); render();
    } else if (act === 'order') {
      S.order *= -1; renderFilters(); render();
    } else if (act === 'more') {
      S.limit += pageSize(); paintContent(S.lastFiltered);
    } else if (act === 'clear') {
      S.query = ''; S.dir = ''; S.limit = pageSize();
      var input = document.getElementById('rs-q');
      if (input) input.value = '';
      document.getElementById('rs-clear').classList.remove('show');
      render();
    } else if (act === 'reset') {
      S.query = ''; S.category = 'all'; S.group = 'all'; S.sort = 'name'; S.order = 1;
      S.dir = ''; S.limit = pageSize();
      var q = document.getElementById('rs-q');
      if (q) q.value = '';
      document.getElementById('rs-clear').classList.remove('show');
      render();
    } else if (act === 'retry') {
      render();
    }
  });

  root.addEventListener('input', function (e) {
    if (!e.target || e.target.id !== 'rs-q') return;
    S.query = e.target.value;
    var clear = document.getElementById('rs-clear');
    if (clear) clear.classList.toggle('show', S.query.length > 0);
    clearTimeout(debounce);
    debounce = setTimeout(function () {
      S.dir = ''; S.limit = pageSize(); render();
    }, 180);
  });

  root.addEventListener('change', function (e) {
    if (e.target && e.target.id === 'rs-sort') {
      S.sort = e.target.value; S.limit = pageSize(); render();
    }
  });

  if (document.addEventListener) {
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' || e.keyCode === 27) closePreview();
    });
  }

  fetch(DATA + 'index.json', { cache: 'no-cache' })
    .then(function (r) {
      if (!r.ok) throw new Error('HTTP ' + r.status + ' (index.json)');
      return r.json();
    })
    .then(function (j) {
      S.index = j;
      S.limit = pageSize();
      buildShell();
      render();
    })
    .catch(function (e) {
      root.innerHTML = '<div class="rs-error">资源清单加载失败：' + esc(e.message) +
        '<br>请确认 /resources/data/index.json 已发布，或稍后刷新页面重试。</div>';
    });
})();
