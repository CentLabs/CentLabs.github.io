/* Study Library 2.0 - 阅读页引擎：增量渲染 TXT 语料为 HTML 阅读视图 */
(function () {
  'use strict';
  var META = window.READER_META;           // 构建期注入的元数据
  var CORPUS_FILE = META.file;            // corpus/xxx.txt（相对 knowledge 根）
  var $ = function (s) { return document.querySelector(s); };

  var lines = [], rendered = 0, BATCH = 400, state = null, targetLine = -1, done = false, bytesRead = 0;

  /* ---------- 路径修正：页面位于 read/{cid}/{pid}/index.html，需上跳三级 ---------- */
  function rel(p) { return p.replace(/^\.\//, ''); }
  function up(n) { var u = ''; for (var i = 0; i < n; i++) u += '../'; return u; }
  var ROOT = up(3);

  /* ---------- 初始化：流式读取 + 增量渲染（避免一次性 split 超大文件） ---------- */
  function init() {
    var m = location.hash.match(/[#&]L(\d+)/);
    if (m) targetLine = parseInt(m[1], 10);
    else if (window.StudyTools) {
      var prog = window.StudyTools.getProgress('corpus:' + META.categoryId + ':' + META.file);
      if (prog && prog.line > 0) targetLine = prog.line;
    }

    renderToc();
    bindAside();

    /* 标题由 META 重建（构建期注入，清空 body 后恢复） */
    var staticHead = '<h1>' + esc(META.displayTitle || META.name) + '</h1>' +
      '<p style="color:var(--text-3);font-size:13px">原始文件：' + esc(META.name) + ' · ' + esc(META.categoryName) +
      ' · ' + (META.chars / 10000).toFixed(1) + ' 万字符 · 含 ' + (META.sources ? META.sources.length : 0) + ' 份原始文件全文</p>';
    $('#kb-body').innerHTML = '<div class="kb-loading"><div class="kb-spinner"></div>正在加载全文（' +
      (META.chars / 10000).toFixed(1) + ' 万字符，大文件按需分块加载）…</div>';

    fetch(ROOT + rel(CORPUS_FILE)).then(function (r) {
      if (!r.ok) throw new Error('HTTP ' + r.status);
      if (r.body && r.body.getReader && typeof TextDecoder !== 'undefined') {
        // 流式分块读取：避免一次性载入数 MB 文本
        var reader = r.body.getReader();
        var decoder = new TextDecoder('utf-8');
        var buf = '';
        var started = false;
        function pump() {
          return reader.read().then(function (res) {
            if (res.done) {
              if (buf) { pushLines(buf); buf = ''; }
              flushAll();
              finish();
              if (targetLine >= 0) seekTo(targetLine);
              return;
            }
            buf += decoder.decode(res.value, { stream: true });
            bytesRead += res.value.length;
            var nl = buf.lastIndexOf('\n');
            if (nl >= 0 && buf.length > 200000) {
              var chunk = buf.slice(0, nl + 1); buf = buf.slice(nl + 1);
              pushLines(chunk);
            }
            return pump();
          });
        }
        function pushLines(chunk) {
          var ls = chunk.split('\n');
          if (!started) {
            $('#kb-body').innerHTML = staticHead;
            state = { para: [], list: null, listOrdered: false, code: [] };
            started = true;
          }
          for (var i = 0; i < ls.length; i++) {
            var t = ls[i];
            if (t.charCodeAt(t.length - 1) === 13) t = t.slice(0, -1); // 去 \r
            processLine(t);
          }
          scheduleRender();
        }
        return pump();
      }
      // 回退：整读
      return r.text().then(function (txt) {
        lines = txt.split('\n');
        $('#kb-body').innerHTML = staticHead;
        state = { para: [], list: null, listOrdered: false, code: [] };
        renderBatch();
        if (targetLine >= 0) seekTo(targetLine);
      });
    }).catch(function (e) {
      $('#kb-body').innerHTML = '<div class="kb-empty">全文加载失败：' + (e.message || e) +
        '<br><a href="' + ROOT + rel(CORPUS_FILE) + '" target="_blank">直接打开原始 TXT ↗</a></div>';
    });
  }

  /* 节流：避免频繁重绘 */
  var renderScheduled = false;
  function scheduleRender() {
    if (renderScheduled) return;
    renderScheduled = true;
    requestAnimationFrame(function () { renderScheduled = false; updateProgress(); });
  }

  /* ---------- 批量渲染 ---------- */
  function flushPara() {
    if (state.para.length) {
      pushBlock('<p>' + esc(state.para.join(' ')) + '</p>', state.paraStart, rendered - 1);
      state.para = [];
    }
  }
  function flushList() {
    if (state.list) {
      pushBlock('<' + state.listTag + '>' + state.list.join('') + '</' + state.listTag + '>', state.listStart, rendered - 1);
      state.list = null;
    }
  }
  function flushCode() {
    if (state.code.length >= 2) {
      pushBlock('<pre><code>' + esc(state.code.join('\n')) + '</code></pre>', state.codeStart, rendered - 1);
    } else if (state.code.length) {
      state.paraStart = state.codeStart; state.para = state.para.concat(state.code); state.para.push(''); state.code = [];
    }
    state.code = [];
  }
  function esc(s) { return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
  function pushBlock(html, s, e) {
    var div = document.createElement('div');
    div.innerHTML = html;
    var el = div.firstChild;
    el.setAttribute('data-s', s); el.setAttribute('data-e', e);
    $('#kb-body').appendChild(el);
  }
  function emit(html, s, e) { flushAll(); pushBlock(html, s, e); }
  function flushAll() { flushPara(); flushList(); flushCode(); }

  function processLine(raw) {
    var idx = rendered;
    var t = raw.trim();
    rendered = idx + 1;
    var sm = /^=+\s*来源[:：]\s*(.+?)\s*=+$/.exec(t);
    if (sm) {
      flushAll();
      emit('<div class="kb-src-mark"><span class="ic">📄</span><span class="path">来源文件：' + esc(sm[1]) + '</span></div>', idx, idx);
      return;
    }
    if (!t) { flushAll(); return; }
    var lvl = window.KB ? KB.headingLevel(t) : 0;
    if (lvl) {
      flushAll();
      emit('<h' + (lvl + 1) + ' data-ln="' + idx + '">' + esc(t) + '</h' + (lvl + 1) + '>', idx, idx);
      return;
    }
    var listM = /^\s*(\d{1,3}[.、)）]|[（(][0-9一二三四五六七八九十]{1,3}[)）]|[•·▪])\s*/.exec(raw);
    if (listM) {
      flushPara(); flushCode();
      var ordered = /\d/.test(listM[1].charAt(0)) || /[（(]/.test(listM[1]);
      if (!state.list) { state.list = []; state.listTag = ordered ? 'ol' : 'ul'; state.listStart = idx; }
      else if (state.listTag !== (ordered ? 'ol' : 'ul')) { flushList(); state.list = []; state.listTag = ordered ? 'ol' : 'ul'; state.listStart = idx; }
      state.list.push('<li>' + esc(raw.replace(listM[0], '')) + '</li>');
      return;
    }
    if (window.KB && KB.isCodeLine(t)) {
      flushPara(); flushList();
      if (!state.code.length) state.codeStart = idx;
      state.code.push(raw);
      return;
    }
    flushList(); flushCode();
    if (!state.para.length) state.paraStart = idx;
    state.para.push(t);
  }

  /* 回退整读模式的批量渲染（仅当无 ReadableStream 时） */
  function renderBatch() {
    var end = Math.min(rendered + BATCH, lines.length);
    for (var i = rendered; i < end; i++) processLine(lines[i]);
    if (rendered >= lines.length) { flushAll(); finish(); return; }
    updateProgress();
    requestAnimationFrame(function () {
      var sentinel = $('#kb-sentinel');
      if (sentinel && sentinel.getBoundingClientRect().top < window.innerHeight * 2) renderBatch();
    });
  }
  function updateProgress() {
    var bar = $('#kb-prog-bar');
    // 流式模式下无法精确预知总行数，用"已读字节/总字符"近似进度
    var pct = META.chars ? Math.min(100, Math.round(bytesRead / META.chars * 100)) : 0;
    if (bar) { bar.style.width = pct + '%'; }
    var box = $('#kb-prog');
    if (box && (pct >= 100 || done)) box.style.display = 'none';
  }
  function finish() {
    if (done) return; done = true;
    updateProgress();
    if (window.KB) KB.renderMath($('#kb-body'));
    if (targetLine >= 0) seekTo(targetLine);
  }

  /* ---------- 跳转到指定行（来自搜索结果） ---------- */
  function seekTo(ln) {
    if (rendered <= ln) { renderTo(ln + 5); }
    var els = document.querySelectorAll('#kb-body [data-s]');
    for (var i = 0; i < els.length; i++) {
      var el = els[i], s = +el.getAttribute('data-s'), e = +el.getAttribute('data-e');
      if (ln >= s && ln <= e) {
        el.classList.add('kb-line-hl');
        el.scrollIntoView({ block: 'center' });
        return;
      }
    }
  }
  function renderTo(n) {
    while (rendered < n && rendered < lines.length) processLine(rendered);
    if (rendered >= lines.length) flushAll();
    updateProgress();
  }

  /* ---------- 侧栏目录 ---------- */
  function renderToc() {
    var side = $('#kb-side');
    var h = '';
    /* 来源列表 */
    if (META.sources && META.sources.length) {
      h += '<h4>来源文件（' + META.sources.length + '）</h4>';
      META.sources.forEach(function (s, i) {
        h += '<div class="toc-item" data-ln="' + s.start + '"><span class="no">' + (i + 1) + '</span>' + esc(s.short) + '</div>';
      });
    }
    /* 章节标题 */
    var heads = (META.headings || []).slice(0, 400);
    if (heads.length) {
      h += '<h4>章节目录</h4>';
      heads.forEach(function (x) {
        h += '<div class="toc-item" data-ln="' + x.line + '" style="padding-left:' + (9 + Math.max(0, x.level - 2) * 10) + 'px">' + esc(x.text.slice(0, 26)) + '</div>';
      });
    }
    side.innerHTML = h || '<div class="kb-empty" style="padding:20px 8px">未识别到章节标题</div>';
    side.querySelectorAll('.toc-item').forEach(function (it) {
      it.addEventListener('click', function () {
        seekTo(+it.getAttribute('data-ln'));
        closeSide();
      });
    });
    /* 高亮当前可见标题 */
    window.addEventListener('scroll', throttle(function () {
      if (done) markActiveHeading();
    }, 400), { passive: true });
  }
  function markActiveHeading() {
    var items = document.querySelectorAll('#kb-side .toc-item[data-ln]');
    if (!items.length) return;
    var top = window.scrollY + 120, cur = null;
    document.querySelectorAll('#kb-body h2[data-ln],#kb-body h3[data-ln],#kb-body h4[data-ln]').forEach(function (h) {
      if (h.offsetTop <= top) cur = h.getAttribute('data-ln');
    });
    items.forEach(function (it) {
      it.classList.toggle('on', it.getAttribute('data-ln') === cur && cur != null);
    });
  }
  function throttle(fn, ms) { var last = 0; return function () { var now = Date.now(); if (now - last >= ms) { last = now; fn(); } }; }

  /* ---------- 右侧信息栏 & 工具 ---------- */
  function bindAside() {
    var printBtn = document.querySelector('.js-print');
    if (printBtn) printBtn.addEventListener('click', function () {
      if (!done) { renderTo(lines.length); finish(); }
      setTimeout(function () { window.print(); }, 300);
    });
    var copyBtn = document.querySelector('.js-copy');
    if (copyBtn) copyBtn.addEventListener('click', function () {
      fetch(ROOT + rel(CORPUS_FILE)).then(function (r) { return r.text(); }).then(function (t) {
        if (navigator.clipboard) return navigator.clipboard.writeText(t);
        var ta = document.createElement('textarea'); ta.value = t; document.body.appendChild(ta);
        ta.select(); document.execCommand('copy'); ta.remove();
      }).then(function () {
        copyBtn.textContent = '✓ 已复制全文';
        setTimeout(function () { copyBtn.textContent = '复制全文'; }, 2000);
      }).catch(function () { copyBtn.textContent = '复制失败'; });
    });
    var sizeBtn = document.querySelector('.js-size');
    if (sizeBtn) sizeBtn.addEventListener('click', function () {
      $('#kb-body').classList.toggle('reading-mode');
    });
    var sideBtn = document.querySelector('.kb-mob-toc-btn');
    var mask = $('#kb-side-mask');
    if (sideBtn) sideBtn.addEventListener('click', function () {
      $('#kb-side').classList.add('open'); if (mask) mask.classList.add('show');
    });
    if (mask) mask.addEventListener('click', closeSide);

    /* 学习辅助：收藏 / 书签 / 进度（依赖 study-tools.js） */
    var ST = window.StudyTools;
    var favBtn = document.querySelector('.js-fav');
    if (favBtn && ST) {
      var docId = 'corpus:' + META.categoryId + ':' + META.file;
      var refreshFav = function () { favBtn.textContent = ST.isFav(docId) ? '★ 已收藏' : '☆ 收藏'; };
      refreshFav();
      favBtn.addEventListener('click', function () { ST.toggleFav(docId, 'corpus', META.displayTitle); refreshFav(); });
    }
    var bmBtn = document.querySelector('.js-bookmark');
    if (bmBtn && ST) {
      bmBtn.addEventListener('click', function () {
        var curLine = currentLine();
        ST.addBookmark('corpus:' + META.categoryId + ':' + META.file, curLine);
        bmBtn.textContent = '🔖 已标记';
        setTimeout(function () { bmBtn.textContent = '🔖 加书签'; }, 1500);
      });
    }
    /* 记录最近阅读 + 滚动保存进度 */
    if (ST) {
      ST.recent('corpus:' + META.categoryId + ':' + META.file, META.displayTitle, META.categoryName);
      window.addEventListener('scroll', throttle(function () {
        var ln = currentLine();
        var pct = document.documentElement.scrollHeight ? Math.round(window.scrollY / (document.documentElement.scrollHeight - window.innerHeight) * 100) : 0;
        ST.setProgress('corpus:' + META.categoryId + ':' + META.file, ln, pct);
      }, 1500), { passive: true });
    }
  }
  function currentLine() {
    var els = document.querySelectorAll('#kb-body [data-s]'), best = 0;
    var top = window.scrollY + 100;
    els.forEach(function (el) {
      if (el.offsetTop <= top) best = +el.getAttribute('data-s');
    });
    return best;
  }
  function closeSide() {
    $('#kb-side').classList.remove('open');
    var mask = $('#kb-side-mask'); if (mask) mask.classList.remove('show');
  }

  document.addEventListener('DOMContentLoaded', init);
})();
