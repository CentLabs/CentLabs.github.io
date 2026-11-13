/* Study Library 2.1 - 学习辅助：最近阅读 / 阅读进度 / 收藏 / 书签（localStorage） */
(function () {
  'use strict';
  var KEY = {
    recent: 'kb-recent',      // 最近阅读 [{id,title,cat,ts}]
    progress: 'kb-progress',  // 阅读进度 {id: {line, ts, pct}}
    fav: 'kb-fav',            // 收藏（知识点/文档）[{id,type,title,ts}]
    bookmark: 'kb-bookmark'   // 书签（阅读页内标记）{id: [{line,note,ts}]}
  };
  function load(k) { try { return JSON.parse(localStorage.getItem(k) || '[]'); } catch (e) { return []; } }
  function loadObj(k) { try { return JSON.parse(localStorage.getItem(k) || '{}'); } catch (e) { return {}; } }
  function save(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }

  var ST = window.StudyTools = {};

  /* 最近阅读 */
  ST.recent = function (id, title, cat) {
    var arr = load(KEY.recent).filter(function (x) { return x.id !== id; });
    arr.unshift({ id: id, title: title, cat: cat, ts: Date.now() });
    save(KEY.recent, arr.slice(0, 30));
  };
  ST.getRecent = function () { return load(KEY.recent); };

  /* 阅读进度 */
  ST.setProgress = function (id, line, pct) {
    var o = loadObj(KEY.progress);
    o[id] = { line: line, pct: pct, ts: Date.now() };
    save(KEY.progress, o);
  };
  ST.getProgress = function (id) { return loadObj(KEY.progress)[id] || null; };

  /* 收藏 */
  ST.toggleFav = function (id, type, title) {
    var arr = load(KEY.fav);
    var i = arr.findIndex(function (x) { return x.id === id; });
    if (i >= 0) { arr.splice(i, 1); save(KEY.fav, arr); return false; }
    arr.unshift({ id: id, type: type, title: title, ts: Date.now() });
    save(KEY.fav, arr.slice(0, 200));
    return true;
  };
  ST.isFav = function (id) { return load(KEY.fav).some(function (x) { return x.id === id; }); };
  ST.getFav = function () { return load(KEY.fav); };

  /* 书签（阅读页内） */
  ST.addBookmark = function (id, line, note) {
    var o = loadObj(KEY.bookmark);
    o[id] = o[id] || [];
    o[id].push({ line: line, note: note || '', ts: Date.now() });
    save(KEY.bookmark, o);
  };
  ST.getBookmark = function (id) { return loadObj(KEY.bookmark)[id] || []; };

  /* 清除全部学习数据 */
  ST.clearAll = function () {
    [KEY.recent, KEY.progress, KEY.fav, KEY.bookmark].forEach(function (k) { try { localStorage.removeItem(k); } catch (e) {} });
  };
})();
