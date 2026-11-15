/* Study Library 2.7 - 全文检索引擎
   文档级 bigram 倒排预筛 · 并发 8 路下载 · Worker 常驻文本缓存 · 多关键词 AND · 学科筛选
   同时服务于 search.html 独立页与 study.html 全文检索视图

   正确性保证：预筛是「文档级超集」（无假阴性），行级 AND 匹配、行号、提前终止条件
   与旧版完全一致；索引缺失 / 签名不符 / 单字关键词 / bigram 未收录时自动回退全库检索。 */
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
    var workerSeq = 0, idxPromise = null, fastOnly = false, savedSel = null;
    var lastQuery = '', lastTerms = [];

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

    /* 「仅精读」快速检索：默认不改变任何勾选，用户主动开启才收窄范围 */
    if (chipsBox && cfg.showChips) {
      var fastChip = document.createElement('div');
      fastChip.className = 'kb-chip'; fastChip.id = 'kb-fast-only';
      fastChip.setAttribute('data-fast', '1');
      fastChip.textContent = '⚡ 仅精读（快）';
      fastChip.title = '只检索 21 份逐章精读文档（约 0.97 MB），关闭后恢复原有范围';
      function syncChips() {
        chipsBox.querySelectorAll('.kb-chip[data-cat]').forEach(function (c) {
          c.classList.toggle('on', !!selected[c.getAttribute('data-cat')]);
        });
      }
      fastChip.onclick = function () {
        fastOnly = !fastOnly;
        fastChip.classList.toggle('on', fastOnly);
        if (fastOnly) {
          savedSel = {}; Object.keys(selected).forEach(function (k) { savedSel[k] = selected[k]; });
          Object.keys(selected).forEach(function (k) { selected[k] = (k === 'chapters'); });
        } else if (savedSel) {
          Object.keys(savedSel).forEach(function (k) { selected[k] = savedSel[k]; });
        }
        syncChips();
        if (qInput.value.trim()) runSearch(qInput.value);
      };
      chipsBox.appendChild(fastChip);
    }

    function esc(s) { return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
    /* Blob Worker 的 base URL 是 blob:<origin>/<uuid>，相对路径在其中无法解析，
       必须在主线程把清单里的文件路径解析成绝对 URL 再 postMessage。 */
    function absUrl(u) { try { return new URL(u, location.href).href; } catch (e) { return u; } }
    function mark(text, terms) {
      var s = esc(text);
      terms.forEach(function (t) {
        var re = new RegExp('(' + t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')', 'gi');
        s = s.replace(re, '<mark>$1</mark>');
      });
      return s;
    }

    /* 载入清单：顺序必须与 build_search_index.py 一致（先 corpus，再 chapters） */
    function loadManifest() {
      if (manifest.length) return Promise.resolve(manifest);
      return Promise.all([
        fetch(cfg.root + 'data/corpus.json').then(function (r) { return r.json(); }),
        fetch(cfg.root + 'data/chapters.json').then(function (r) { return r.json(); })
      ]).then(function (rs) {
        corpus = rs[0]; chapters = rs[1];
        corpus.forEach(function (c) {
          manifest.push({ type: 'corpus', cat: c.categoryId, id: c.id || c.file.replace(/^corpus\//, '').replace(/\.txt$/, ''), name: c.displayTitle || c.name, file: cfg.root + c.file, rawFile: c.file, chars: c.chars });
        });
        chapters.forEach(function (c) {
          manifest.push({ type: 'chapter', cat: c.categoryId, id: c.id, name: c.title, file: cfg.root + c.file, rawFile: c.file, chars: c.chars });
        });
        return manifest;
      });
    }
    function manifestSig(m) {
      return m.map(function (f) { return f.rawFile + ':' + (f.chars == null ? 0 : f.chars); }).join('|');
    }

    /* ---------- 构建期 bigram 倒排索引（SBIX-1） ---------- */
    function loadIndex() {
      if (idxPromise) return idxPromise;
      idxPromise = fetch(cfg.root + 'data/search-index.meta.json').then(function (r) {
        if (!r.ok) throw new Error('meta ' + r.status);
        return r.json();
      }).then(function (meta) {
        if (!meta || meta.format !== 'sbix-1' || meta.version !== 1 || meta.headerSize !== 16) throw new Error('索引版本不符');
        return fetch(cfg.root + meta.indexFile).then(function (r) {
          if (!r.ok) throw new Error('bin ' + r.status);
          return r.arrayBuffer();
        }).then(function (buf) { return { meta: meta, dv: new DataView(buf) }; });
      }).catch(function (e) {
        console.warn('[KB] 检索索引不可用，自动回退全库检索：', e && e.message);
        return null;
      });
      return idxPromise;
    }
    /* 二分查找 bigram -> docId 列表；返回 null 表示索引未收录，必须回退全库（防漏结果） */
    function lookupIds(keyBuf, dv, entryCount) {
      var lo = 0, hi = entryCount - 1, base = 16;
      while (lo <= hi) {
        var mid = (lo + hi) >> 1;
        var off = dv.getUint32(base + mid * 4, true);
        var kl = dv.getUint8(off), n = Math.min(kl, keyBuf.length), cmp = 0;
        for (var j = 0; j < n; j++) {
          var a = dv.getUint8(off + 1 + j), b = keyBuf[j];
          if (a !== b) { cmp = a - b; break; }
        }
        if (cmp === 0) cmp = kl - keyBuf.length;
        if (cmp === 0) {
          var cnt = dv.getUint8(off + 1 + kl), ids = [], p = off + 2 + kl;
          for (var k = 0; k < cnt; k++) ids.push(dv.getUint8(p + k));
          return ids;
        }
        if (cmp < 0) lo = mid + 1; else hi = mid - 1;
      }
      return null;
    }
    /* 返回 {docId:1} 候选集；null = 不做预筛（全库） */
    function prefilter(terms, idx, m) {
      if (!idx || !idx.meta || !idx.dv) return null;
      if (idx.meta.docCount !== m.length || idx.meta.sig !== manifestSig(m)) return null;
      var enc = (typeof TextEncoder !== 'undefined') ? new TextEncoder() : null;
      if (!enc) return null;
      var cand = null;
      for (var t = 0; t < terms.length; t++) {
        var w = terms[t].toLowerCase();
        if (w.length < 2) return null;              // 单字无法拆 bigram -> 全库
        var ids = null;
        for (var i = 0; i < w.length - 1; i++) {
          var r = lookupIds(enc.encode(w.slice(i, i + 2)), idx.dv, idx.meta.entryCount);
          if (r === null) return null;              // 任一 bigram 未收录 -> 全库
          if (ids === null) ids = r;
          else {
            var s = {}; r.forEach(function (x) { s[x] = 1; });
            ids = ids.filter(function (x) { return s[x]; });
          }
          if (!ids.length) break;
        }
        if (!ids) return null;
        var set = {}; ids.forEach(function (x) { set[x] = 1; });
        if (cand === null) cand = set;
        else {
          var nc = {}; Object.keys(cand).forEach(function (k) { if (set[k]) nc[k] = 1; });
          cand = nc;
        }
      }
      return cand;
    }

    /* ---------- Worker：并发下载 + 按文件顺序处理 + 常驻文本缓存 ----------
       下载并发（conc=8）以压满带宽；文本处理严格按 files 顺序推进，
       保证 results / totalHits / 提前终止条件与旧版串行实现逐项一致。
       失败不再静默忽略：累计 failed 并上报，单次网络抖动重试一次。 */
    var WORKER_SRC = [
      'var cache=new Map(), cacheChars=0, CACHE_MAX=24*1024*1024, job=0;',
      'function addCache(k,t){',
      ' if(cache.has(k))return;',
      ' cache.set(k,t);cacheChars+=t.length;',
      ' while(cacheChars>CACHE_MAX&&cache.size>1){',
      '  var oldest=cache.keys().next().value;cacheChars-=cache.get(oldest).length;cache.delete(oldest);',
      ' }',
      '}',
      'function load(f,tries){',
      ' return fetch(f.file).then(function(r){if(!r.ok)throw new Error("HTTP "+r.status);return r.text();})',
      '  .catch(function(err){if(tries>0)return load(f,tries-1);throw err;});',
      '}',
      'self.onmessage=function(e){',
      ' var my=++job,seq=e.data.seq,files=e.data.files,',
      '     terms=e.data.terms.map(function(t){return t.toLowerCase();}),',
      '     max=e.data.max,conc=e.data.conc||8;',
      ' var results=[],totalHits=0,failed=0,nextFetch=0,nextProc=0,inflight=0;',
      ' var stopped=false,finished=false,texts={},bad={};',
      ' function stale(){return my!==job;}',
      ' function progress(){',
      '  self.postMessage({seq:seq,progress:nextProc,of:files.length,results:results.length,',
      '   total:totalHits,failed:failed,partial:true});',
      ' }',
      ' function finish(){',
      '  if(finished||stale())return;finished=true;stopped=true;',
      '  results.sort(function(a,b){return a.i-b.i||a.line-b.line;});',
      '  self.postMessage({seq:seq,done:true,total:totalHits,results:results,failed:failed});',
      ' }',
      ' function processOne(f,t){',
      '  var lines=t.split("\\n"),hits=0,ln;',
      '  for(var i=0;i<lines.length;i++){',
      '   ln=lines[i];',
      '   if(!ln||ln.length>500)continue;',
      '   var low=ln.toLowerCase(),ok=true;',
      '   for(var j=0;j<terms.length;j++){if(low.indexOf(terms[j])<0){ok=false;break;}}',
      '   if(ok){hits++;totalHits++;',
      '    if(hits<=40&&results.length<max){results.push({i:f.i,type:f.type,cat:f.cat,',
      '     id:f.id,name:f.name,line:i+1,text:ln.trim().slice(0,300)});}',
      '   }',
      '  }',
      ' }',
      ' function drain(){',
      '  if(stale()||stopped||finished)return;',
      '  while(nextProc<files.length){',
      '   var f=files[nextProc];',
      '   if(!(f.i in texts)&&!bad[f.i])break;',
      '   if(!bad[f.i])processOne(f,texts[f.i]);',
      '   delete texts[f.i];',
      '   nextProc++;progress();',
      '   if(results.length>=max||totalHits>3000){stopped=true;break;}',
      '  }',
      '  if(nextProc>=files.length||stopped)finish();',
      ' }',
      ' function pump(){',
      '  if(stale()||stopped||finished)return;',
      '  while(nextFetch<files.length&&inflight<conc){',
      '   var f=files[nextFetch++],key=f.file;inflight++;',
      '   (function(f,key){',
      '    if(cache.has(key)){texts[f.i]=cache.get(key);inflight--;drain();pump();return;}',
      '    load(f,1).then(function(t){',
      '     if(stale())return;',
      '     addCache(key,t);texts[f.i]=t;inflight--;drain();pump();',
      '    },function(){',
      '     if(stale())return;',
      '     bad[f.i]=1;failed++;inflight--;drain();pump();',
      '    });',
      '   })(f,key);',
      '  }',
      '  if(files.length===0)finish();',
      ' }',
      ' pump();',
      '};'
    ].join('\n');

    function ensureWorker() {
      if (worker) return true;
      try { worker = new Worker(URL.createObjectURL(new Blob([WORKER_SRC], { type: 'text/javascript' }))); }
      catch (e) {
        prog.style.display = 'none';
        hitsBox.innerHTML = '<div class="kb-empty">当前浏览器不支持 Worker，无法全文检索</div>';
        return false;
      }
      worker.onerror = function (ev) {
        prog.style.display = 'none';
        statBox.textContent = '检索线程异常';
        hitsBox.innerHTML = '<div class="kb-empty">检索线程异常：' + esc(ev.message || '未知错误') +
          '<br><button class="kb-btn" style="margin-top:10px" id="kb-retry-search">重试</button></div>';
        var rb = document.getElementById('kb-retry-search');
        if (rb) rb.onclick = function () { worker = null; runSearch(qInput.value); };
        try { worker.terminate(); } catch (e) {}
        worker = null;
      };
      worker.onmessage = function (ev) {
        var d = ev.data;
        if (abort || !d || d.seq !== workerSeq) return;
        if (d.progress != null && d.of) bar.style.width = Math.round(d.progress / d.of * 100) + '%';
        if (d.partial) {
          statBox.textContent = '已检索 ' + d.progress + ' / ' + d.of + ' 个文档 · 命中 ' + d.total + ' 行' +
            (d.failed ? ' · ⚠️ ' + d.failed + ' 个文档加载失败' : '');
          return;
        }
        if (d.done) {
          prog.style.display = 'none';
          statBox.textContent = '关键词「' + lastQuery + '」共命中 ' + d.total + ' 行 · 展示 ' + d.results.length + ' 条' +
            (d.failed ? ' · ⚠️ ' + d.failed + ' 个文档加载失败' : '');
          renderResults(d.results, lastTerms, d.total, d.failed || 0, lastQuery);
        }
      };
      return true;
    }

    function runSearch(q) {
      var terms = q.trim().split(/\s+/).filter(Boolean);
      if (!terms.length) { hitsBox.innerHTML = '<div class="kb-empty">请输入关键词</div>'; statBox.textContent = ''; return; }
      if (!ensureWorker()) return;
      abort = false;
      var seq = ++workerSeq;
      lastQuery = q; lastTerms = terms;
      prog.style.display = 'block'; bar.style.width = '3%';
      statBox.textContent = '正在准备检索…';
      hitsBox.innerHTML = '';
      Promise.all([loadManifest(), loadIndex()]).then(function (rs) {
        if (seq !== workerSeq || abort) return;
        var m = rs[0], idx = rs[1];
        var cand = prefilter(terms, idx, m);
        var files = m.map(function (f, i) {
          return {
            i: i, type: f.type, cat: f.cat, id: f.id, name: f.name,
            file: absUrl(f.file), _catKey: f.type === 'chapter' ? 'chapters' : f.cat
          };
        }).filter(function (f) {
          var ok = selected[f._catKey];
          if (cfg.fixedCat) ok = ok && f.cat === cfg.fixedCat;
          if (cand) ok = ok && !!cand[f.i];
          return ok;
        });
        mount.setAttribute('data-kb-prefilter', cand ? 'on' : 'fallback');
        mount.setAttribute('data-kb-candidates', String(files.length));
        if (!cand && !files.length) {
          prog.style.display = 'none';
          statBox.textContent = '';
          hitsBox.innerHTML = '<div class="kb-empty">请至少选择一个检索范围</div>';
          return;
        }
        statBox.textContent = '正在检索 ' + files.length + ' 个文档' +
          (cand ? '（已从 ' + m.length + ' 个中预筛，省去 ' + (m.length - files.length) + ' 个）' : '（全库）') + '…';
        if (!files.length) {
          prog.style.display = 'none';
          statBox.textContent = '关键词「' + q + '」共命中 0 行 · 展示 0 条';
          renderResults([], terms, 0, 0, q);
          return;
        }
        worker.postMessage({ seq: seq, files: files, terms: terms, max: cfg.maxHits, conc: 8 });
      }).catch(function (err) {
        if (seq !== workerSeq) return;
        prog.style.display = 'none';
        statBox.textContent = '清单加载失败';
        hitsBox.innerHTML = '<div class="kb-empty">检索清单加载失败：' + esc(err && err.message || err) +
          '<br><button class="kb-btn" style="margin-top:10px" id="kb-retry-search">重试</button></div>';
        var rb = document.getElementById('kb-retry-search');
        if (rb) rb.onclick = function () { runSearch(q); };
      });
    }

    function renderResults(res, terms, total, failed, q) {
      if (!res.length) {
        if (failed) {
          hitsBox.innerHTML = '<div class="kb-empty">⚠️ 有 ' + failed + ' 个文档加载失败（网络波动），本次结果不完整，请勿据此判断「无匹配」。' +
            '<br><button class="kb-btn" style="margin-top:10px" id="kb-retry-search">重新检索</button></div>';
          var rb = document.getElementById('kb-retry-search');
          if (rb) rb.onclick = function () { runSearch(q || qInput.value); };
        } else {
          hitsBox.innerHTML = '<div class="kb-empty">未命中。尝试更换或减少关键词（多词为 AND 关系，同时满足才命中）。</div>';
        }
        return;
      }
      var html = failed
        ? '<div class="kb-empty" style="border:1px dashed var(--line-strong);margin-bottom:10px">⚠️ 有 ' + failed +
          ' 个文档加载失败（网络波动），以下结果可能不完整。可稍后重新检索。</div>'
        : '';
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
      destroy: function () { abort = true; if (worker) { worker.terminate(); worker = null; } }
    };
  };
})();
