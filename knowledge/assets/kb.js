/* Study Library 2.0 - 共享脚本：主题 / 导航 / Markdown 渲染 / KaTeX 懒加载 */
(function () {
  'use strict';
  var KB = window.KB = {};

  /* ---------- 主题 ---------- */
  KB.applyTheme = function (t) {
    if (t !== 'dark' && t !== 'light') t = (window.matchMedia && matchMedia('(prefers-color-scheme: dark)').matches) ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', t);
    try { localStorage.setItem('kb-theme', t); } catch (e) {}
    return t;
  };
  KB.initTheme = function () {
    var saved = null;
    try { saved = localStorage.getItem('kb-theme'); } catch (e) {}
    KB.applyTheme(saved);
    document.querySelectorAll('.js-theme').forEach(function (b) {
      b.addEventListener('click', function () {
        var cur = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        KB.applyTheme(cur);
      });
    });
  };

  /* ---------- 导航（移动端折叠） ---------- */
  KB.initNav = function (active) {
    document.querySelectorAll('.kb-nav-links a').forEach(function (a) {
      if (active && a.getAttribute('data-nav') === active) a.classList.add('on');
    });
    var burger = document.querySelector('.kb-nav-burger');
    var links = document.querySelector('.kb-nav-links');
    if (burger && links) burger.addEventListener('click', function () { links.classList.toggle('open'); });
  };

  /* ---------- KaTeX 本地渲染（$$..$$ / $..$ / \(..\) / \[..\]） ----------
     历史坑：两个动态插入的 <script> 默认 async，auto-render 可能先于 katex 核心执行，
     它捕获到 undefined 的 katex，渲染时抛 "Cannot read properties of undefined
     (reading 'ParseError')"；异常又被 try/catch 吞掉 → 库看似加载成功，公式却全是源码。
     修复：改用站点自带 vendor（不依赖 CDN），且必须在 katex 核心 onload 之后
     才插入 auto-render；同时补上 $...$ 行内分隔符。 */
  var katexState = 'none', katexBase = null;
  function mathWarn(e) { if (window.console && console.warn) console.warn('[KB] math:', e); }
  /* kb.js 自身被不同层级的页面引用（assets/、../assets/、../../../assets/），
     运行时从 script 标签的绝对 src 推导 vendor 根路径。 */
  function katexAssetBase() {
    if (katexBase) return katexBase;
    var s = document.querySelector('script[src*="kb.js"]');
    katexBase = (s ? s.src.replace(/kb\.js.*$/, '') : 'assets/') + 'vendor/katex/';
    return katexBase;
  }
  function katexFlush() {
    (KB._katexQueue || []).splice(0).forEach(function (f) { try { f(); } catch (e) { mathWarn(e); } });
  }
  KB.renderMath = function (root) {
    if (!root) return;
    if (katexState === 'fail') return;
    if (katexState !== 'ready') { loadKatex(function () { doRender(root); }); return; }
    doRender(root);
  };
  function loadKatex(cb) {
    if (katexState === 'loading') { KB._katexQueue.push(cb); return; }
    katexState = 'loading'; KB._katexQueue = [cb];
    var base = katexAssetBase();
    var fail = function (msg) { katexState = 'fail'; mathWarn(msg); katexFlush(); };
    var css = document.createElement('link');
    css.rel = 'stylesheet'; css.href = base + 'katex.min.css';
    document.head.appendChild(css);
    var core = document.createElement('script');
    core.src = base + 'katex.min.js';
    core.onload = function () {
      if (!window.katex) { fail('katex core unavailable after load'); return; }
      var ar = document.createElement('script');
      ar.src = base + 'auto-render.min.js';
      ar.onload = function () {
        if (!window.renderMathInElement) { fail('auto-render unavailable after load'); return; }
        katexState = 'ready'; katexFlush();
      };
      ar.onerror = function () { fail('auto-render load failed: ' + ar.src); };
      document.head.appendChild(ar);
    };
    core.onerror = function () { fail('katex core load failed: ' + core.src); };
    document.head.appendChild(core);
  }
  function doRender(root) {
    if (!root || !window.katex || !window.renderMathInElement) return;
    try {
      renderMathInElement(root, {
        delimiters: [
          { left: '$$', right: '$$', display: true },
          { left: '\\[', right: '\\]', display: true },
          { left: '\\(', right: '\\)', display: false },
          { left: '$', right: '$', display: false }
        ],
        throwOnError: false,
        ignoredTags: ['script', 'noscript', 'style', 'textarea', 'pre', 'code', 'option'],
        ignoredClasses: ['katex', 'kb-math-raw']
      });
    } catch (e) { mathWarn(e); }
  }

  /* ---------- 轻量 Markdown → HTML（离线可用，标题带锚点 id） ---------- */
  function esc(s) { return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
  KB.esc = esc;
  function slug(s) { var h = 5381; s = String(s); for (var i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) >>> 0; return 'h' + h.toString(36); }
  function inline(s) {
    s = esc(s);
    s = s.replace(/`([^`]+)`/g, '<code>$1</code>');
    s = s.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    s = s.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
    return s;
  }
  KB.md2html = function (src) {
    var blocks = [];
    src = src.replace(/```([\w-]*)\n([\s\S]*?)```/g, function (m, lang, code) {
      blocks.push('<pre><code>' + esc(code.replace(/\n$/, '')) + '</code></pre>');
      return '\u0001B' + (blocks.length - 1) + '\u0001';
    });
    src = src.replace(/\$\$([\s\S]*?)\$\$/g, function (m, f) {
      return '\u0001MATH' + esc(f.trim()).replace(/\n/g, '\u0002') + '\u0001';
    });
    var lines = src.split('\n'), out = [], i = 0, used = {};
    while (i < lines.length) {
      var L = lines[i];
      if (/^\u0001B\d+\u0001$/.test(L.trim())) { out.push(L.trim()); i++; continue; }
      if (/^\u0001MATH/.test(L.trim())) {
        var f = L.trim().replace(/^\u0001MATH/, '').replace(/\u0001$/, '').replace(/\u0002/g, '\n');
        out.push('<div class="math-block">$$' + f + '$$</div>'); i++; continue;
      }
      if (/^\s*$/.test(L)) { i++; continue; }
      if (/^---+$/.test(L.trim())) { out.push('<hr>'); i++; continue; }
      var h = /^(#{1,6})\s+(.*)$/.exec(L);
      if (h) {
        var id = slug(h[2]); if (used[id]) id += '_' + used[id]++;
        out.push('<h' + h[1].length + ' id="' + id + '">' + inline(h[2]) + '</h' + h[1].length + '>');
        i++; continue;
      }
      if (/^>/.test(L)) {
        var buf = [];
        while (i < lines.length && /^>/.test(lines[i])) { buf.push(lines[i].replace(/^>\s?/, '')); i++; }
        out.push('<blockquote>' + inline(buf.join(' ')) + '</blockquote>'); continue;
      }
      if (/^\s*\|/.test(L) && i + 1 < lines.length && /^\s*\|[\s:|-]+\|/.test(lines[i + 1])) {
        var rows = [];
        var cells = function (r) { return r.trim().replace(/^\|/, '').replace(/\|$/, '').split('|').map(function (x) { return x.trim(); }); };
        rows.push(cells(L)); i += 2;
        while (i < lines.length && /^\s*\|/.test(lines[i])) { rows.push(cells(lines[i])); i++; }
        var t = '<table><thead><tr>' + rows[0].map(function (c) { return '<th>' + inline(c) + '</th>'; }).join('') + '</tr></thead><tbody>';
        for (var r = 1; r < rows.length; r++) t += '<tr>' + rows[r].map(function (c) { return '<td>' + inline(c) + '</td>'; }).join('') + '</tr>';
        out.push(t + '</tbody></table>'); continue;
      }
      if (/^\s*([-*+]|\d+[.)])\s+/.test(L)) {
        var ordered = /^\s*\d+[.)]\s+/.test(L), lb = [];
        while (i < lines.length && /^\s*([-*+]|\d+[.)])\s+/.test(lines[i])) {
          lb.push('<li>' + inline(lines[i].replace(/^\s*([-*+]|\d+[.)])\s+/, '')) + '</li>'); i++;
        }
        out.push('<' + (ordered ? 'ol' : 'ul') + '>' + lb.join('') + '</' + (ordered ? 'ol' : 'ul') + '>'); continue;
      }
      var pb = [L]; i++;
      while (i < lines.length && !/^\s*$/.test(lines[i]) && !/^(#{1,6}\s|>|\||[-*+]\s|\d+[.)]\s|---|\u0001)/.test(lines[i])) { pb.push(lines[i]); i++; }
      out.push('<p>' + inline(pb.join(' ')) + '</p>');
    }
    return out.join('\n').replace(/\u0001B(\d+)\u0001/g, function (m, n) { return blocks[+n]; });
  };

  /* ---------- 行文本阅读器公共工具（阅读页使用） ---------- */
  /* 判断一行是否为明确的章节标题；返回层级 2/3/4 或 0 */
  KB.headingLevel = function (line) {
    var s = line.trim();
    if (!s || s.length > 60) return 0;
    if (/^=====/.test(s)) return 0;
    if (/^第\s*([0-9零一二三四五六七八九十百千]+)\s*(章|讲|篇)/.test(s) && s.length < 50) return 2;
    if (/^第\s*([0-9零一二三四五六七八九十百千]+)\s*(节|部分|课|天|单元)\s/.test(s) && s.length < 50) return 3;
    if (/^(Chapter|CHAPTER|Section|SECTION|Lecture|Unit|Part)\s+[0-9IVX]+/i.test(s) && s.length < 60) return 3;
    if (/^[一二三四五六七八九十]{1,3}[、.．]\s*\S/.test(s) && s.length <= 40 && !/[。；，,]|\.\.\./.test(s)) return 3;
    if (/^[(（][一二三四五六七八九十0-9]{1,3}[)）]\s*\S/.test(s) && s.length <= 40 && !/[。；，]/.test(s)) return 4;
    return 0;
  };
  /* 是否为代码特征行 */
  KB.isCodeLine = function (s) {
    var t = s.trim();
    return /^#include\s*[<"]/.test(t) || /^#define\s/.test(t) || /^(int|void|char|float|double|struct|typedef|class|public|private|unsigned|long|bool|static)\s+[A-Za-z_]\w*\s*\(/.test(t) ||
      /^(printf|scanf|cout|cin|return|if|for|while|else|malloc|free|switch|case)\s*[({]/.test(t) ||
      (/\w\s*\(.*\)\s*;?\s*$/.test(t) && /[;{}]/.test(t) && t.length < 90);
  };

  document.addEventListener('DOMContentLoaded', function () {
    KB.initTheme();
    if (window.KB_AUTO_NAV !== false || window.KB_NAV_ACTIVE) KB.initNav(window.KB_NAV_ACTIVE || '');
    /* 静态卡片里的行内公式（首页精选/易错、学科页知识点分组）自动渲染；
       阅读页不带 data-kb-math，不会被扫描版 PDF 的乱码 $ 触发。 */
    var maths = document.querySelectorAll('[data-kb-math]');
    for (var i = 0; i < maths.length; i++) KB.renderMath(maths[i]);
  });
})();
