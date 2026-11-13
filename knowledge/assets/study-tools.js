/* Study Library 2.1 - 学习辅助：最近阅读 / 阅读进度 / 收藏 / 书签（localStorage） */
(function () {
  'use strict';
  var KEY = {
    recent: 'kb-recent',      // 最近阅读 [{id,title,cat,ts}]
    progress: 'kb-progress',  // 阅读进度 {id: {line, ts, pct}}
    fav: 'kb-fav',            // 收藏（知识点/文档）[{id,type,title,ts}]
    bookmark: 'kb-bookmark',  // 书签（阅读页内标记）{id: [{line,note,ts}]}
    wrong: 'kb-wrong',        // 错题本 [{id,title,cat,ts,note}]
    srs: 'kb-srs'             // 间隔复习 {id: {state, due, seen, last}}
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
    [KEY.recent, KEY.progress, KEY.fav, KEY.bookmark, KEY.wrong, KEY.srs].forEach(function (k) { try { localStorage.removeItem(k); } catch (e) {} });
  };

  /* ========== 错题本 ========== */
  ST.toggleWrong = function (id, title, cat) {
    var arr = load(KEY.wrong);
    var i = arr.findIndex(function (x) { return x.id === id; });
    if (i >= 0) { arr.splice(i, 1); save(KEY.wrong, arr); return false; }
    arr.unshift({ id: id, title: title, cat: cat, ts: Date.now(), note: '' });
    save(KEY.wrong, arr.slice(0, 500));
    return true;
  };
  ST.isWrong = function (id) { return load(KEY.wrong).some(function (x) { return x.id === id; }); };
  ST.getWrong = function () { return load(KEY.wrong); };

  /* ========== 间隔复习（简化 SRS） ==========
     state: 'mastered' 已掌握 | 'review' 待复习 | 'easy-wrong' 容易出错
     due: 下次复习时间戳。复习后按间隔递增：1天→3天→7天→15天→30天
  */
  var INTERVALS = [1, 3, 7, 15, 30];  // 天数
  ST.setMastery = function (id, title, cat, state) {
    var o = loadObj(KEY.srs);
    var cur = o[id] || { seen: 0, last: 0, due: 0 };
    cur.state = state;
    cur.title = title; cur.cat = cat;
    cur.last = Date.now();
    if (state === 'mastered') {
      // 掌握：进入长间隔，索引前进
      cur.seen = Math.min((cur.seen || 0) + 1, INTERVALS.length - 1);
      cur.due = Date.now() + INTERVALS[cur.seen] * 86400000;
    } else if (state === 'easy-wrong') {
      cur.seen = 0;
      cur.due = Date.now() + INTERVALS[0] * 86400000;  // 1 天后复习
    } else { // review
      cur.due = Date.now() + INTERVALS[0] * 86400000;
    }
    o[id] = cur;
    save(KEY.srs, o);
    return cur;
  };
  ST.getMastery = function (id) { return loadObj(KEY.srs)[id] || null; };
  ST.getSRS = function () { return loadObj(KEY.srs); };

  // 今日待复习列表（due 已到）
  ST.getDue = function () {
    var now = Date.now();
    var o = loadObj(KEY.srs);
    return Object.keys(o).map(function (k) { return { id: k, title: o[k].title, cat: o[k].cat, state: o[k].state, due: o[k].due }; })
      .filter(function (x) { return x.state !== 'mastered' && x.due <= now; })
      .sort(function (a, b) { return a.due - b.due; });
  };
})();
