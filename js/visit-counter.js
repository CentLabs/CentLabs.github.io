/* JayDreamy visit counter
   The theme's built-in counter used a protocol-relative URL
   (//busuanzi.ibruce.info/...) that silently returned no data in some
   networks, leaving the Info card's UV / PV fields blank. This script replaces
   it with a self-contained counter:

     1. absolute-HTTPS busuanzi JSONP first -> keeps the existing UV/PV history
     2. Vercount API as fallback -> independent service, CORS enabled
     3. the successful source is remembered so numbers never jump between them
     4. last known values are cached in localStorage, so a network failure
        never leaves the counters blank

   The theme script is neutralised via CDN.busuanzi -> /js/noop.js, so exactly
   one request is made per page view (PV is not double counted).

   Fills the theme placeholders (#busuanzi_value_site_uv / _site_pv /
   _page_pv, including the article "Post View" field) and a footer line that is
   present on every page, including /resources/. */
(function () {
  'use strict';

  var CACHE_KEY = 'jd_visit_data_v1';
  var SRC_KEY = 'jd_visit_source_v1';
  var VERCOUNT_API = 'https://events.vercount.one/api/v2/log';
  var BUSUANZI_API = 'https://busuanzi.ibruce.info/busuanzi';
  var UV_COOKIE = 'jd_visit_uv_' + location.host.replace(/[^a-zA-Z0-9_-]/g, '_');
  var TIMEOUT = 4500;

  function cacheGet() {
    try { return JSON.parse(localStorage.getItem(CACHE_KEY) || 'null'); } catch (e) { return null; }
  }
  function cacheSet(d) {
    try { localStorage.setItem(CACHE_KEY, JSON.stringify(d)); } catch (e) {}
  }
  function sourceGet() {
    try { return localStorage.getItem(SRC_KEY) || ''; } catch (e) { return ''; }
  }
  function sourceSet(s) {
    try { localStorage.setItem(SRC_KEY, s); } catch (e) {}
  }
  function fmt(n) { return Number(n || 0).toLocaleString('zh-CN'); }
  function normalize(d) {
    if (!d) return null;
    if (d.site_pv == null && d.page_pv == null && d.site_uv == null) return null;
    return {
      site_uv: Number(d.site_uv) || 0,
      site_pv: Number(d.site_pv) || 0,
      page_pv: Number(d.page_pv) || 0
    };
  }
  function isNewUv() {
    if (document.cookie.indexOf(UV_COOKIE + '=1') !== -1) return false;
    try { document.cookie = UV_COOKIE + '=1; path=/; max-age=31536000; samesite=lax'; } catch (e) {}
    return true;
  }

  function mountFooter() {
    var wrap = document.getElementById('footer-wrap');
    if (!wrap || document.getElementById('jd-visit')) return;
    var div = document.createElement('div');
    div.id = 'jd-visit';
    div.style.cssText = 'margin-top:8px;font-size:12px;line-height:1.8;opacity:.78;letter-spacing:.2px;';
    div.innerHTML = '本页浏览 <b data-jd="page">--</b> 次 · 本站累计 <b data-jd="pv">--</b> 次 · 访客 <b data-jd="uv">--</b> 人';
    wrap.appendChild(div);
  }

  function fill(d) {
    if (!d) return;
    var ids = {
      busuanzi_value_site_uv: d.site_uv,
      busuanzi_value_site_pv: d.site_pv,
      busuanzi_value_page_pv: d.page_pv
    };
    Object.keys(ids).forEach(function (id) {
      var el = document.getElementById(id);
      if (el) el.textContent = fmt(ids[id]);
    });
    var foot = document.getElementById('jd-visit');
    if (foot && foot.querySelectorAll) {
      var vals = { page: d.page_pv, pv: d.site_pv, uv: d.site_uv };
      Object.keys(vals).forEach(function (k) {
        var nodes = foot.querySelectorAll('[data-jd="' + k + '"]');
        for (var i = 0; i < nodes.length; i++) nodes[i].textContent = fmt(vals[k]);
      });
    }
  }

  function vercount(cb) {
    if (typeof fetch !== 'function') { cb(null); return; }
    var ctl = typeof AbortController !== 'undefined' ? new AbortController() : null;
    var done = false;
    var timer = setTimeout(function () {
      if (!done) { done = true; if (ctl) ctl.abort(); cb(null); }
    }, TIMEOUT);
    var opts = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: location.href.split('#')[0], isNewUv: isNewUv() })
    };
    if (ctl) opts.signal = ctl.signal;
    fetch(VERCOUNT_API, opts)
      .then(function (r) { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); })
      .then(function (j) {
        if (done) return;
        done = true; clearTimeout(timer);
        cb(normalize((j && j.data) || j));
      })
      .catch(function () {
        if (done) return;
        done = true; clearTimeout(timer); cb(null);
      });
  }

  function busuanzi(cb) {
    var host = document.head || document.body || document.documentElement;
    if (!host || !document.createElement) { cb(null); return; }
    var name = 'BusuanziCallback_' + Date.now() + '_' + Math.floor(Math.random() * 1e6);
    var script = document.createElement('script');
    var done = false;
    var timer;
    function cleanup() {
      clearTimeout(timer);
      try { delete window[name]; } catch (e) { window[name] = undefined; }
      if (script.parentNode) script.parentNode.removeChild(script);
    }
    function finish(d) {
      if (done) return;
      done = true; cleanup(); cb(d);
    }
    timer = setTimeout(function () { finish(null); }, TIMEOUT);
    window[name] = function (d) { finish(normalize(d)); };
    script.src = BUSUANZI_API + '?jsonpCallback=' + name;
    script.onerror = function () { finish(null); };
    host.appendChild(script);
  }

  mountFooter();
  fill(cacheGet()); // show the last known numbers immediately, never a blank

  // Prefer busuanzi to keep the site's existing history; remember whichever
  // source actually works so the numbers never switch back and forth.
  var preferred = sourceGet();
  var order = preferred === 'vercount'
    ? ['vercount', 'busuanzi']
    : ['busuanzi', 'vercount'];

  function attempt(i) {
    if (i >= order.length) return; // cached values (or '--') stay visible
    var src = order[i];
    var settled = false;
    var guard = setTimeout(function () {
      if (!settled) { settled = true; attempt(i + 1); }
    }, TIMEOUT + 800);
    var done = function (d) {
      if (settled) return;
      settled = true; clearTimeout(guard);
      if (!d) { attempt(i + 1); return; }
      sourceSet(src);
      cacheSet(d);
      fill(d);
    };
    if (src === 'vercount') vercount(done); else busuanzi(done);
  }
  attempt(0);
})();
