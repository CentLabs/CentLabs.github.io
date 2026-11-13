/* Study Library 2.0 - 全文检索引擎（Web Worker 按需加载 · 多关键词 AND · 学科筛选）
   同时服务于 search.html 独立页与 study.html 全文检索视图 */
(function () {
  'use strict';
  var DEFAULTS = {
    mount: '#kb-search-app',      // 挂载点
    root: './',                   // knowledge 根相对路径（页面所处深度决定）
    fixedCat: null,               // 锁定学科（学科页内嵌时用）
    showChips: true,              // 是否显示学科筛选
    onOpenCorpus: null,           // 打开语料自定义回调(id, line)
    onOpenChapter: null,          // 打开章节自定义回调(id, line)
    placeholder: '输入关键词，多个词用空格分隔（如：洛必达 三次握手 / 定语从句）',
    maxHits: 400
  };
  window.KBSearch = function (opts) {
    var cfg = {}; Object.keys(DEFAULTS).forEach(function (k) { cfg[k] = opts && opts[k] != null ? opts[k] : DEFAULTS[k]; });
    var mount = typeof cfg.mount === 'string' ? document.querySelector(cfg.mount) : cfg.mount;
    var CATS = ['politics', 'english', 'mathematics', 'computer-408', 'chapters'];
    var CAT_NAME = { politics: '政治', english: '英语', mathematics: '数学', 'computer-408': '计算机408', chapters: '精读文档' };
    var CAT_COLOR = { politics: 'var(--pol)', english: 'var(--eng)', mathematics: 'var(--math)', 'computer-408': 'var(--cs)', chapters: 'var(--accent)' };
    var corpus = [], chapters = [], worker = null, selected = {}, manifest = [], abort = false;

    mount.innerHTML =
      '<div class="kb-searchbar" style="margin:0 0 14px;max-width:none">' +
      '<div class="box"><span>🔍</span><input class="kb-sq" placeholder="' + cfg.placeholder + '">' +
      '<button class="kb-btn" style="height:38px">清空</button></div>' +
      '<button class="go">检 索</button></div>' +
      (cfg.showChips ? '<div class="kb-chip-row kb-schips"></div>' : '') +
      '<div class="kb-prog" style="display:none"><div class="bar kb-sbar"></div></div>' +
      '<div class="kb-sstat" style="font-size:13px;color:var(--text-3);margin:4px 0 12px"></div>' +
      '<div class="kb-shits"></div>';

    var qInput = mount.querySelector('.kb-sq'), hitsBox = mount.querySelector('.kb-shits'),
      statBox = mount.querySelector('.kb-sstat'), prog = mount.querySelector('.kb-prog'),
      bar = mount.querySelector('.kb-sbar'), chipsBox = mount.querySelector('.kb-schips');

    /* 学科筛选 chips：fixedCat = 学科内检索（该科语料 + 该科精读） */
    var filterable = cfg.fixedCat ? [cfg.fixedCat, 'chapters'] : CATS;
    filterable.forEach(function (c) {
      selected[c] = true;
      if (chipsBox) {
        var chip = document.createElement('div');
        chip.className = 'kb-chip on'; chip.textContent = CAT_NAME[c]; chip.dataset.cat = c;
        chip.onclick = function () { chip.classList.toggle('on'); selected[c] = chip.classList.contains('on'); };
        chipsBox.appendChild(chip);
      }
    });

    function esc(s) { return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
    function mark(text, terms) {
      var s = esc(text);
      terms.forEach(function (t) {
        var re = new RegExp('(' + t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')', 'gi');
        s = s.replace(re, '<mark>$1</mark>');
      });
      return s;
    }

    /* 载入清单 */
    function loadManifest() {
      if (manifest.length) return Promise.resolve(manifest);
      return Promise.all([
        fetch(cfg.root + 'data/corpus.json').then(function (r) { return r.json(); }),
        fetch(cfg.root + 'data/chapters.json').then(function (r) { return r.json(); })
      ]).then(function (rs) {
        corpus = rs[0]; chapters = rs[1];
        corpus.forEach(function (c) {
          manifest.push({ type: 'corpus', cat: c.categoryId, id: c.id || c.file.replace(/^corpus\//, '').replace(/\.txt$/, ''), name: c.displayTitle || c.name, file: cfg.root + c.file, chars: c.chars });
        });
        chapters.forEach(function (c) {
          manifest.push({ type: 'chapter', cat: c.categoryId, id: c.id, name: c.title, file: cfg.root + c.file, chars: c.chars });
        });
        return manifest;
      });
    }

    /* Worker：逐文件 fetch + 逐行 AND 匹配 */
    var WORKER_SRC = [
      'self.onmessage=function(e){',
      ' var files=e.data.files, terms=e.data.terms.map(function(t){return t.toLowerCase();}), max=e.data.max;',
      ' var results=[], idx=0, totalHits=0;',
      ' function next(){',
      '  if(idx>=files.length||results.length>=max||totalHits>3000){self.postMessage({done:true,total:totalHits,results:results});return;}',
      '  var f=files[idx];',
      '  fetch(f.file).then(function(r){if(!r.ok)throw 0;return r.text();})',
      '  .then(function(t){',
      '   var lines=t.split("\\n"), hits=0, ln;',
      '   for(var i=0;i<lines.length;i++){',
      '    ln=lines[i];',
      '    if(!ln||ln.length>500)continue;',
      '    var low=ln.toLowerCase(), ok=true;',
      '    for(var j=0;j<terms.length;j++){if(low.indexOf(terms[j])<0){ok=false;break;}}',
      '    if(ok){hits++;totalHits++;',
      '     if(hits<=40&&results.length<max){results.push({i:f.i,type:f.type,cat:f.cat,id:f.id,name:f.name,line:i+1,text:ln.trim().slice(0,300)});}',
      '    }',
      '   }',
      '   idx++;self.postMessage({progress:idx,of:files.length,results:results.length,total:totalHits,partial:true,inc:[{i:f.i,type:f.type,cat:f.cat,id:f.id,name:f.name,hits:Math.min(hits,40),lines:null}]});',
      '   setTimeout(next,0);',
      '  }).catch(function(){idx++;self.postMessage({progress:idx,of:files.length,results:results.length,total:totalHits,partial:true});setTimeout(next,0);});',
      ' };',
      ' next();',
      '};'
    ].join('\n');

    function runSearch(q) {
      var terms = q.trim().split(/\s+/).filter(Boolean);
      if (!terms.length) { hitsBox.innerHTML = '<div class="kb-empty">请输入关键词</div>'; statBox.textContent = ''; return; }
      if (worker) { worker.terminate(); }
      abort = false;
      var seq = 0;
      loadManifest().then(function (m) {
        var files = m.map(function (f, i) {
          var catKey = f.type === 'chapter' ? 'chapters' : f.cat;
          return { i: i, type: f.type, cat: f.cat, id: f.id, name: f.name, file: f.file, _catKey: catKey };
        }).filter(function (f) {
          var ok = selected[f._catKey];
          if (cfg.fixedCat) ok = ok && f.cat === cfg.fixedCat;
          return ok;
        });
        if (!files.length) { hitsBox.innerHTML = '<div class="kb-empty">请至少选择一个检索范围</div>'; return; }
        prog.style.display = 'block'; bar.style.width = '3%';
        statBox.textContent = '正在按需加载并检索 ' + files.length + ' 个文档…';
        hitsBox.innerHTML = '';
        try { worker = new Worker(URL.createObjectURL(new Blob([WORKER_SRC], { type: 'text/javascript' }))); }
        catch (e) { hitsBox.innerHTML = '<div class="kb-empty">当前浏览器不支持 Worker，无法全文检索</div>'; return; }
        var shown = 0;
        worker.onmessage = function (ev) {
          if (abort) return;
          var d = ev.data;
          if (d.progress != null) bar.style.width = Math.round(d.progress / d.of * 100) + '%';
          if (d.partial) {
            statBox.textContent = '已检索 ' + d.progress + ' / ' + d.of + ' 个文档 · 命中 ' + d.total + ' 行';
            var inc = d.inc && d.inc[0];
            if (inc && inc.hits > 0) {
              shown++;
              var box = document.createElement('div');
              box.className = 'kb-note';
              box.textContent = '📄 [' + CAT_NAME[inc.type === 'chapter' ? 'chapters' : inc.cat] + '] ' + inc.name + ' 命中 ' + inc.hits + ' 行，检索完成后展示…';
              hitsBox.appendChild(box);
            }
            return;
          }
          if (d.done) {
            prog.style.display = 'none';
            worker.terminate(); worker = null;
            statBox.textContent = '关键词「' + q + '」共命中 ' + d.total + ' 行 · 展示 ' + d.results.length + ' 条';
            renderResults(d.results, terms, d.total);
          }
        };
        worker.postMessage({ files: files, terms: terms, max: cfg.maxHits });
      });
    }

    function renderResults(res, terms, total) {
      if (!res.length) {
        hitsBox.innerHTML = '<div class="kb-empty">未命中。尝试更换或减少关键词（多词为 AND 关系，同时满足才命中）。</div>';
        return;
      }
      var html = '';
      res.forEach(function (h) {
        var catKey = h.type === 'chapter' ? 'chapters' : h.cat;
        html += '<div class="kb-hit" data-type="' + h.type + '" data-id="' + esc(h.id) + '" data-line="' + h.line + '">' +
          '<div class="h-title"><span class="cat-chip" style="--cat:' + CAT_COLOR[catKey] + '">' + CAT_NAME[catKey] + '</span>' + esc(h.name.slice(0, 46)) +
          ' <span style="color:var(--text-3);font-weight:400;font-size:12px">· 第 ' + h.line + ' 行</span></div>' +
          '<div class="h-ctx">' + mark(h.text, terms) + '</div></div>';
      });
      hitsBox.innerHTML = html;
      hitsBox.querySelectorAll('.kb-hit').forEach(function (el) {
        el.addEventListener('click', function () {
          var t = el.getAttribute('data-type'), id = el.getAttribute('data-id'), line = el.getAttribute('data-line');
          if (t === 'corpus') {
            var cat = manifest.find(function (f) { return f.type === 'corpus' && f.id === id; });
            var cid = cat ? cat.cat : '';
            if (cfg.onOpenCorpus) cfg.onOpenCorpus(id, line, cid);
            else location.href = cfg.root + 'read/' + cid + '/' + id + '/index.html#L' + line;
          } else {
            if (cfg.onOpenChapter) cfg.onOpenChapter(id, line);
            else location.href = cfg.root + 'study.html#/chapter/' + id + '/L' + line;
          }
        });
      });
    }

    /* 绑定 */
    mount.querySelector('.kb-searchbar .go').onclick = function () { runSearch(qInput.value); };
    qInput.addEventListener('keydown', function (e) { if (e.key === 'Enter') runSearch(qInput.value); });
    mount.querySelector('.kb-searchbar .kb-btn').onclick = function () { qInput.value = ''; qInput.focus(); };

    /* 对外接口 */
    return {
      search: function (q) { qInput.value = q; runSearch(q); },
      destroy: function () { abort = true; if (worker) worker.terminate(); }
    };
  };
})();
