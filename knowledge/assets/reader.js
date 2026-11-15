/* Study Library 2.0 - 阅读页引擎：增量渲染 TXT 语料为 HTML 阅读视图 */
(function () {
  'use strict';
  var META = window.READER_META;           // 构建期注入的元数据
  var CORPUS_FILE = META.file;            // corpus/xxx.txt（相对 knowledge 根）
  var $ = function (s) { return document.querySelector(s); };

  var lines = [], rendered = 0, BATCH = 400, state = null, targetLine = -1, done = false, bytesRead = 0;

  /* 目录条目（「标题……页码」）→ 正文文章位置映射（构建期注入） */
  var TOC_TARGET = {};
  (META.tocEntries || []).forEach(function (e) {
    TOC_TARGET[e.line] = e.target;
  });

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
            state = { para: [], list: null, listOrdered: false, code: [], garbled: 0, garbledStart: 0 };
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
        state = { para: [], list: null, listOrdered: false, code: [], garbled: 0, garbledStart: 0 };
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
      var text = state.para.join(' ');
      var start = state.paraStart, end = rendered - 1;
      /* 超长段落（OCR 丢失换行导致粘连）按句末标点智能拆分，提升可读性 */
      if (text.length > 200) {
        var parts = text.split(/(?<=[。；！？!?])\s*/);
        var buf = '';
        parts.forEach(function (seg, i) {
          if ((buf + seg).length > 120 && buf) {
            pushBlock('<p>' + highlightInline(buf) + '</p>', start, end);
            buf = seg;
          } else {
            buf += seg;
          }
        });
        if (buf) pushBlock('<p>' + highlightInline(buf) + '</p>', start, end);
      } else {
        pushBlock('<p>' + highlightInline(text) + '</p>', start, end);
      }
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
  /* 连续乱码行合并为一个占位提示（而非每行一个提示） */
  function flushGarbled() {
    if (state.garbled > 0) {
      var n = state.garbled;
      pushBlock('<div class="kb-garbled" data-s="' + state.garbledStart + '" data-e="' + (rendered - 1) + '">' +
        '<span class="ic">⚠️</span> 此处有 ' + n + ' 行内容为扫描公式/特殊字体，原始文本无法还原（请查看原 PDF）</div>',
        state.garbledStart, rendered - 1);
      state.garbled = 0;
    }
  }
  function esc(s) { return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }

  /* ---------- 乱码行识别与折叠 ----------
     扫描版 PDF 的公式/特殊字体经 OCR 后会产生乱码（拉丁扩展字符、制表符、希腊字母等），
     这类内容"原始文本不可还原"。识别后折叠成一行占位提示，而非满屏乱码。
     判定规则保守：仅当行内「扩展非 ASCII 字符」≥3 且无中文、且占比 >30% 时才判为乱码，
     避免误伤正常代码（void Traverse…）、公式（O(n log n)）、填空题（________）等。 */
  var GARBLED_RE = /[\u00a0-\u024f\u0250-\u02ff\u0370-\u03ff\u0400-\u04ff\u1e00-\u1eff\u2500-\u25ff\u2550-\u256c\u20a0-\u20bf\u2100-\u214f\u0080-\u009f]/g;
  function isGarbled(s) {
    if (!s) return false;
    var m = s.match(GARBLED_RE);
    if (!m || m.length < 3) return false;
    if (/[\u4e00-\u9fa5]/.test(s)) return false;          // 含中文 → 正常
    return m.length / s.length > 0.3;                       // 扩展字符占比 >30%
  }

  /* ---------- 智能正文增强：小标题识别 + 关键词高亮 ----------
     语料是扫描版 PDF 的 OCR 提取文本，结构参差、可能含乱码字节。
     识别规则保守：只命中"明显是小标题/引导词"的行，避免误伤正文与乱码。 */

  /* 更宽松的小标题识别（相比 KB.headingLevel 多覆盖语料常见写法） */
  function smartHeading(s) {
    var t = s.trim();
    if (!t || t.length > 48) return 0;
    if (/^=+/.test(t)) return 0;
    // 纯标题行特征：短、无句末标点、不以标点/连接词开头
    if (/[。；，,]$/.test(t)) return 0;
    if (/^(的|和|与|及|或|但|而|并|以|对|在|从|由|因|所|是|这|那|则|就|都|也|还|又|再|更|很|不|没|了|着|过|要|能|会|可|应|需|将|把|被|让|使|为)\b/.test(t)) return 0;
    // （一）（1）【1】① 等编号小标题
    if (/^[(（【\[]?\s*[0-9一二三四五六七八九十]{1,3}\s*[)）】\].、:：]?\s*[\u4e00-\u9fa5A-Za-z]/.test(t) && t.length <= 22) return 3;
    // 【xxx】/ [xxx] 包裹的短语标题（可后接少量正文文字）
    if (/^[【\[]\s*[^】\]]{1,20}\s*[】\]]\s*[\u4e00-\u9fa5A-Za-z0-9]{0,20}$/.test(t) && t.length <= 32) return 3;
    // 一、二、… 或 1. 2. 等编号 + 短标题
    if (/^[一二三四五六七八九十]{1,3}[、.．]\s*\S{1,20}$/.test(t) && t.length <= 24) return 3;
    // 常见小节标题引导词（结尾冒号，短句）
    if (/^(定义|概念|含义|特点|特征|性质|原则|方法|步骤|分类|作用|意义|区别|联系|注意|重点|难点|考点|易错|总结|小结|结论|概述|简介|背景|目的|要求|说明|示例|举例|例如|解析|分析|答案|技巧|规律|公式|定理|推论|性质|证明|解答|思路|要点)\s*[:：]?\s*$/.test(t) && t.length <= 16) return 3;
    return 0;
  }

  /* 关键词/术语引导词高亮：把「XX：」形式的引导词加粗着色 */
  var TERM_RE = /^(定义|概念|含义|特点|特征|性质|原则|方法|步骤|分类|作用|意义|区别|联系|注意|重点|难点|考点|易错|易错点|总结|小结|结论|概述|背景|目的|要求|说明|示例|举例|例如|解析|分析|答案|技巧|规律|公式|定理|推论|证明|解答|思路|要点|核心|关键|适用范围|使用场景)\s*[:：]\s*/;
  function highlightInline(t) {
    var s = esc(t);
    // 引导词加粗着色（仅在行首出现时）
    s = s.replace(TERM_RE, function (m) {
      return '<b class="kb-term">' + m.replace(/\s*[:：]\s*$/, '') + '</b>：';
    });
    // 行内「重点/注意/易错」短词着色（保守：仅匹配明确的强调短语）
    s = s.replace(/((?:易错点|易错|重点|注意|关键|核心要点|总结|结论))(?=\s*[:：])/g, '<b class="kb-term warn">$1</b>');
    return s;
  }
  function pushBlock(html, s, e) {
    var div = document.createElement('div');
    div.innerHTML = html;
    var el = div.firstChild;
    el.setAttribute('data-s', s); el.setAttribute('data-e', e);
    $('#kb-body').appendChild(el);
  }
  function emit(html, s, e) { flushAll(); pushBlock(html, s, e); }
  function flushAll() { flushPara(); flushList(); flushCode(); flushGarbled(); }

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

    /* 过滤页眉/推广噪声行：扫码关注、广告、页码等，不出现在正文 */
    if (/^(更多计算机考研资料|请扫码咨询|扫码关注公众号|扫码关注|关注公众号|更多资料|考研资料|QQ|微信|公众号|添加|加群|进群|点赞|收藏|转发|转发即可)/.test(t) && t.length <= 30) {
      flushAll();
      return;
    }
    /* 纯页码 / 纯数字行（OCR 页眉页脚噪声） */
    if (/^\d{1,4}$/.test(t)) { flushAll(); return; }

    /* 乱码行：扫描公式/特殊字体的 OCR 乱码，折叠成占位提示（连续乱码行合并） */
    if (isGarbled(t)) {
      if (state.garbled === 0) { flushPara(); flushList(); flushCode(); state.garbledStart = idx; }
      state.garbled++;
      return;
    }

    var lvl = window.KB ? KB.headingLevel(t) : 0;
    if (!lvl) lvl = smartHeading(t);
    if (lvl) {
      flushAll();
      emit('<h' + (lvl + 1) + ' data-ln="' + idx + '">' + esc(t) + '</h' + (lvl + 1) + '>', idx, idx);
      return;
    }

    /* 目录条目行：「标题……页码」/「标题 ................ 页码」，渲染为目录样式；
       若构建期已映射到正文文章位置（tocEntries.target），点击可跳转对应文章 */
    var tocM = /^(.+?)\s*[.·…]{3,}\s*(\d{1,4})$/.exec(t);
    if (tocM && tocM[1].length <= 60) {
      flushAll();
      var tt = TOC_TARGET[idx];
      var linkAttr = (tt != null) ? (' data-ln="' + tt + '" data-toc="1"') : '';
      emit('<div class="kb-toc-entry' + (tt != null ? ' clickable' : '') + '"' + linkAttr + '><span class="t">' + esc(tocM[1]) + '</span><span class="p">' + esc(tocM[2]) + '</span></div>', idx, idx);
      return;
    }

    var listM = /^\s*(\d{1,3}[.、)）]|[（(][0-9一二三四五六七八九十]{1,3}[)）]|[•·▪]|[①②③④⑤⑥⑦⑧⑨⑩]|[a-zA-Z][.、)）])\s*/.exec(raw);
    if (listM) {
      flushPara(); flushCode();
      var ordered = /\d/.test(listM[1].charAt(0)) || /[（(]/.test(listM[1]) || /[①②③④⑤⑥⑦⑧⑨⑩]/.test(listM[1]);
      if (!state.list) { state.list = []; state.listTag = ordered ? 'ol' : 'ul'; state.listStart = idx; }
      else if (state.listTag !== (ordered ? 'ol' : 'ul')) { flushList(); state.list = []; state.listTag = ordered ? 'ol' : 'ul'; state.listStart = idx; }
      state.list.push('<li>' + highlightInline(raw.replace(listM[0], '')) + '</li>');
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
    /* 阅读页正文是扫描版 PDF 的提取文本，其中的 $ / $$ 多为乱码字节而非公式；
       在这里跑 KaTeX 会把乱码误渲染成"公式"。公式渲染只在精读工作台、
       知识点卡片详情等结构化内容上做（见 kb.js / study.html / card.html）。 */
    /* if (window.KB) KB.renderMath($('#kb-body')); */
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

  /* ---------- 侧栏目录：树形可折叠 ---------- */
  function renderToc() {
    var side = $('#kb-side');
    var h = '';

    /* 来源文件（可折叠分组） */
    if (META.sources && META.sources.length) {
      h += '<div class="toc-group open"><div class="toc-group-head"><span class="arw">▾</span>来源文件（' + META.sources.length + '）</div>';
      h += '<div class="toc-group-body">';
      META.sources.forEach(function (s, i) {
        h += '<div class="toc-item" data-ln="' + s.start + '"><span class="no">' + (i + 1) + '</span>' + esc(s.short) + '</div>';
      });
      h += '</div></div>';
    }

    /* 章节目录：只保留章级（level 2）与节级（level 3），构建树形折叠结构；
       level 4 的细碎分点（如“（1）基础阶段”）不出现在目录里，避免又长又乱。
       无子节（下面没有 level 3）的章，直接渲染为可点击的章节点，避免展开后空白。 */
    var heads = (META.headings || []).filter(function (x) { return x.level === 2 || x.level === 3; }).slice(0, 300);
    if (heads.length) {
      h += '<div class="toc-group open"><div class="toc-group-head"><span class="arw">▾</span>章节目录</div>';
      h += '<div class="toc-group-body">';
      /* 先分组：每个 level2 章收集其下的 level3 节 */
      var chapters = [];
      var cur = null;
      heads.forEach(function (x) {
        if (x.level === 2) {
          cur = { ch: x, kids: [] };
          chapters.push(cur);
        } else if (x.level === 3) {
          if (cur) cur.kids.push(x);
          else chapters.push({ ch: null, kids: [x] });
        }
      });
      chapters.forEach(function (c) {
        if (c.ch == null) {
          /* 无章的节，直接罗列为叶子 */
          c.kids.forEach(function (k) {
            h += '<div class="toc-item toc-leaf" data-ln="' + k.line + '">' + esc(k.text.slice(0, 24)) + '</div>';
          });
        } else if (c.kids.length === 0) {
          /* 无子节的章：渲染为可点击章节点（无箭头、无空白） */
          h += '<div class="toc-item toc-chapter-leaf" data-ln="' + c.ch.line + '">' + esc(c.ch.text.slice(0, 24)) + '</div>';
        } else {
          /* 有子节的章：可折叠 */
          h += '<div class="toc-chapter open"><div class="toc-chapter-head" data-ln="' + c.ch.line + '"><span class="arw">▾</span>' + esc(c.ch.text.slice(0, 24)) + '</div>';
          h += '<div class="toc-chapter-body">';
          c.kids.forEach(function (k) {
            h += '<div class="toc-item toc-leaf" data-ln="' + k.line + '">' + esc(k.text.slice(0, 24)) + '</div>';
          });
          h += '</div></div>';
        }
      });
      h += '</div></div>';
    }

    side.innerHTML = h || '<div class="kb-empty" style="padding:20px 8px">未识别到章节标题</div>';

    /* 折叠/展开 + 跳转交互（事件委托）：
       点「▾/▸ 箭头」→ 折叠/展开；点章标题文字 → 跳转到正文对应位置 */
    side.addEventListener('click', function (e) {
      var head = e.target.closest('.toc-group-head, .toc-chapter-head');
      if (head) {
        /* 点箭头才折叠；点标题文字则跳转 */
        if (e.target.closest('.arw')) {
          var grp = head.parentElement;
          grp.classList.toggle('open');
          var arw = head.querySelector('.arw');
          if (arw) arw.textContent = grp.classList.contains('open') ? '▾' : '▸';
        } else {
          var ln = head.getAttribute('data-ln');
          if (ln != null) { seekTo(+ln); closeSide(); }
        }
        return;
      }
      var item = e.target.closest('.toc-item');
      if (item) {
        seekTo(+item.getAttribute('data-ln'));
        closeSide();
      }
    });

    /* 高亮当前可见标题 */
    window.addEventListener('scroll', throttle(function () {
      if (done) markActiveHeading();
    }, 400), { passive: true });
  }
  function markActiveHeading() {
    var items = document.querySelectorAll('#kb-side .toc-item[data-ln],#kb-side .toc-chapter-head[data-ln]');
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
    /* 正文内目录条目（.kb-toc-entry）点击 → 跳到对应文章 */
    var body = $('#kb-body');
    if (body) body.addEventListener('click', function (e) {
      var entry = e.target.closest('.kb-toc-entry.clickable');
      if (entry && entry.getAttribute('data-ln') != null) {
        seekTo(+entry.getAttribute('data-ln'));
      }
    });

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

    /* 左栏折叠（桌面端）：切换 .side-collapsed，收起后正文变宽 */
    var sideToggle = document.querySelector('#kb-side-toggle .kb-btn');
    if (sideToggle) {
      var layout = document.querySelector('.kb-read-layout');
      var collapsed = false;
      try { collapsed = localStorage.getItem('kb-side-collapsed') === '1'; } catch (e) {}
      var applyCollapse = function () {
        if (layout) layout.classList.toggle('side-collapsed', collapsed);
        sideToggle.innerHTML = collapsed ? '▶ 展开目录' : '◀ 收起目录';
      };
      applyCollapse();
      sideToggle.addEventListener('click', function () {
        collapsed = !collapsed;
        try { localStorage.setItem('kb-side-collapsed', collapsed ? '1' : '0'); } catch (e) {}
        applyCollapse();
      });
    }

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
