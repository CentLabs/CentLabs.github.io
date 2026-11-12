/* ============================================================
   JayDreamy AI Portal — 核心脚本
   功能：导航、全局搜索、数据加载、筛选、提示词复制、toast
   ============================================================ */
(function () {
  'use strict';

  var AI_BASE = '/ai/';

  /* ---------- 工具函数 ---------- */
  function $(sel, ctx) { return (ctx || document).querySelector(sel); }
  function $$(sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); }
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function toast(msg) {
    var t = $('#aiToast');
    if (!t) { t = document.createElement('div'); t.id = 'aiToast'; t.className = 'ai-toast'; document.body.appendChild(t); }
    t.textContent = msg;
    t.classList.add('show');
    clearTimeout(t._timer);
    t._timer = setTimeout(function () { t.classList.remove('show'); }, 2200);
  }
  function fetchJSON(url) {
    return fetch(url).then(function (r) {
      if (!r.ok) throw new Error('HTTP ' + r.status);
      return r.json();
    });
  }

  /* ---------- 导航：移动端菜单 + 高亮 ---------- */
  function initNav() {
    var toggle = $('#aiNavToggle');
    var links = $('#aiNavLinks');
    if (toggle && links) {
      toggle.addEventListener('click', function () {
        links.classList.toggle('open');
      });
    }
    // 高亮当前页
    var path = location.pathname.replace(/\/+$/, '') || '/ai';
    $$('.ai-nav-links a').forEach(function (a) {
      var href = a.getAttribute('href');
      if (href && path.indexOf(href.replace(/\/+$/, '')) === 0 && href !== AI_BASE) {
        a.classList.add('active');
      } else if (href === AI_BASE && path === AI_BASE) {
        a.classList.add('active');
      }
    });
  }

  /* ---------- 全局搜索索引 ---------- */
  var searchIndex = null;
  function loadSearchIndex() {
    if (searchIndex) return Promise.resolve(searchIndex);
    return fetchJSON(AI_BASE + 'data/search.json')
      .then(function (data) { searchIndex = data; return data; })
      .catch(function () { searchIndex = []; return []; });
  }
  function initSearch() {
    var input = $('#aiSearchInput');
    var box = $('#aiSearchSuggest');
    if (!input || !box) return;
    var btn = $('#aiSearchBtn');

    function doSearch() {
      var q = input.value.trim().toLowerCase();
      box.innerHTML = '';
      if (!q) { box.classList.remove('open'); return; }
      loadSearchIndex().then(function (items) {
        var hits = [];
        items.forEach(function (it) {
          var score = 0;
          var hay = (it.title + ' ' + (it.kw || '')).toLowerCase();
          if (hay.indexOf(q) >= 0) score = 2;
          else {
            var words = q.split(/\s+/);
            var all = words.every(function (w) { return hay.indexOf(w) >= 0; });
            if (all) score = 1;
          }
          if (score) hits.push({ it: it, score: score });
        });
        hits.sort(function (a, b) { return b.score - a.score; });
        hits = hits.slice(0, 8);
        if (!hits.length) {
          box.innerHTML = '<a style="cursor:default">未找到相关结果</a>';
        } else {
          hits.forEach(function (h) {
            var a = document.createElement('a');
            a.href = h.it.url;
            a.innerHTML = '<span>' + esc(h.it.title) + '</span><span class="tag">' + esc(h.it.cat || '') + '</span>';
            box.appendChild(a);
          });
        }
        box.classList.add('open');
      });
    }

    var debounce;
    input.addEventListener('input', function () {
      clearTimeout(debounce);
      debounce = setTimeout(doSearch, 180);
    });
    input.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') doSearch();
    });
    if (btn) btn.addEventListener('click', doSearch);
    document.addEventListener('click', function (e) {
      if (!box.contains(e.target) && e.target !== input) box.classList.remove('open');
    });
  }

  /* ---------- 通用渲染 ---------- */
  function renderGrid(containerId, items, renderFn) {
    var c = document.getElementById(containerId);
    if (!c) return;
    if (!items || !items.length) {
      c.innerHTML = '<div class="ai-empty">暂无数据</div>';
      return;
    }
    c.innerHTML = items.map(renderFn).join('');
  }

  /* ---------- 筛选 ---------- */
  function initFilters(onChange) {
    var bar = $('#aiFilters');
    if (!bar) return;
    bar.addEventListener('click', function (e) {
      var btn = e.target.closest('.ai-filter');
      if (!btn) return;
      $$('.ai-filter', bar).forEach(function (b) { b.classList.remove('active'); });
      btn.classList.add('active');
      if (onChange) onChange(btn.getAttribute('data-filter'));
    });
  }

  /* ---------- 提示词复制 ---------- */
  function initCopy() {
    document.addEventListener('click', function (e) {
      var btn = e.target.closest('.ai-copy');
      if (!btn) return;
      var text = btn.getAttribute('data-copy') || '';
      function done() {
        var old = btn.textContent;
        btn.textContent = '已复制 ✓';
        btn.classList.add('copied');
        setTimeout(function () { btn.textContent = old; btn.classList.remove('copied'); }, 1600);
      }
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(done).catch(function () { fallback(); });
      } else { fallback(); }
      function fallback() {
        var ta = document.createElement('textarea');
        ta.value = text; document.body.appendChild(ta); ta.select();
        try { document.execCommand('copy'); done(); } catch (err) { toast('复制失败，请手动复制'); }
        document.body.removeChild(ta);
      }
    });
  }

  /* ---------- 页面初始化入口：根据 body data-page 分发 ---------- */
  document.addEventListener('DOMContentLoaded', function () {
    initNav();
    initSearch();
    initCopy();

    var page = document.body.getAttribute('data-page');
    var handler = window.AI_PAGE && window.AI_PAGE[page];
    if (handler && typeof handler.init === 'function') {
      handler.init();
    }
  });

  /* ---------- 暴露给各页面的渲染辅助 ---------- */
  window.AI = {
    AI_BASE: AI_BASE,
    $: $, $$: $$, esc: esc, toast: toast,
    fetchJSON: fetchJSON, renderGrid: renderGrid, initFilters: initFilters
  };
})();
