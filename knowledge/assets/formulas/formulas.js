/* ===== 公式库列表页脚本 ===== */
(function(){
  var FORMULAS = window.__FORMULAS__ || [];
  var SUBJECTS = window.__SUBJECTS__ || {};

  var state = {
    q: '',
    subject: 'all',
    chapter: 'all',
    category: 'all',
    importance: 'all'
  };

  var grid = document.getElementById('fGrid');
  var empty = document.getElementById('fEmpty');
  var filtersBox = document.getElementById('fFilters');
  var countEl = document.getElementById('fCount');
  var latexObserver = null;

  // 收集所有章节、类型、重要程度选项；记录章节所属学科用于联动
  var chapters = [], categories = [], importances = [], chapterSubject = {};
  FORMULAS.forEach(function(f){
    if(chapters.indexOf(f.chapter) < 0) chapters.push(f.chapter);
    chapterSubject[f.chapter] = f.subject;
    if(categories.indexOf(f.category) < 0) categories.push(f.category);
    var imp = String(f.importance || 3);
    if(importances.indexOf(imp) < 0) importances.push(imp);
  });
  importances.sort(function(a,b){return b-a;});

  // 章节筛选按当前学科联动：选定学科后只显示该学科的章节
  function syncChapterChips(){
    var s = state.subject;
    [].slice.call(filtersBox.querySelectorAll('.f-chap-chip')).forEach(function(c){
      c.style.display = (s === 'all' || c.getAttribute('data-subject') === s) ? '' : 'none';
    });
  }

  function buildFilters(){
    var html = '<span class="f-filter-label">学科</span>';
    html += '<span class="f-chip on" data-k="subject" data-v="all">全部</span>';
    Object.keys(SUBJECTS).forEach(function(k){
      html += '<span class="f-chip" data-k="subject" data-v="'+k+'" style="--c:'+SUBJECTS[k].color+'">'+SUBJECTS[k].name+'</span>';
    });
    html += '<span class="f-filter-label" style="margin-left:8px">章节</span>';
    html += '<span class="f-chip on" data-k="chapter" data-v="all">全部</span>';
    chapters.forEach(function(c){
      html += '<span class="f-chip f-chap-chip" data-k="chapter" data-v="'+c+'" data-subject="'+(chapterSubject[c]||'')+'">'+c+'</span>';
    });
    html += '<span class="f-filter-label" style="margin-left:8px">类型</span>';
    html += '<span class="f-chip on" data-k="category" data-v="all">全部</span>';
    categories.forEach(function(c){
      html += '<span class="f-chip" data-k="category" data-v="'+c+'">'+c+'</span>';
    });
    // 重要程度（仅当有明确标记时展示）
    html += '<span class="f-filter-label" style="margin-left:8px">重要</span>';
    html += '<span class="f-chip on" data-k="importance" data-v="all">全部</span>';
    importances.forEach(function(imp){
      html += '<span class="f-chip" data-k="importance" data-v="'+imp+'">'+imp+'★</span>';
    });
    filtersBox.innerHTML = html;

    // 绑定筛选事件
    [].slice.call(filtersBox.querySelectorAll('.f-chip')).forEach(function(chip){
      chip.addEventListener('click', function(){
        var k = chip.getAttribute('data-k');
        var v = chip.getAttribute('data-v');
        state[k] = v;
        // 切换学科时，若原章节不属于新学科则重置为全部，并联动章节筛选项
        if(k === 'subject'){
          if(v !== 'all' && state.chapter !== 'all' && chapterSubject[state.chapter] !== v){
            state.chapter = 'all';
            [].slice.call(filtersBox.querySelectorAll('.f-chip[data-k="chapter"]')).forEach(function(c){
              c.classList.toggle('on', c.getAttribute('data-v') === 'all');
            });
          }
          syncChapterChips();
        }
        // 更新同类 chip 的 on 状态
        [].slice.call(filtersBox.querySelectorAll('.f-chip[data-k="'+k+'"]')).forEach(function(c){
          c.classList.toggle('on', c.getAttribute('data-v') === state[k]);
        });
        render();
      });
    });
    syncChapterChips();
  }

  function match(f){
    if(state.subject !== 'all' && f.subject !== state.subject) return false;
    if(state.chapter !== 'all' && f.chapter !== state.chapter) return false;
    if(state.category !== 'all' && f.category !== state.category) return false;
    if(state.importance !== 'all' && String(f.importance||3) !== state.importance) return false;
    if(state.q){
      var hay = [f.name, f.summary, f.latex, f.chapter, (f.tags||[]).join(' '), f.category, f.id]
        .join(' ').toLowerCase();
      if(hay.indexOf(state.q) < 0) return false;
    }
    return true;
  }

  function esc(s){return String(s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}

  function render(){
    var list = FORMULAS.filter(match);
    countEl.textContent = list.length;
    if(!list.length){
      grid.innerHTML = '';
      empty.style.display = 'block';
      return;
    }
    empty.style.display = 'none';
    grid.innerHTML = list.map(function(f){
      var subj = SUBJECTS[f.subject] || {};
      var tags = (f.tags||[]).map(function(t){return '<span class="f-tag">'+esc(t)+'</span>';}).join('');
      return '<a class="f-card" href="'+f.subject+'/'+f.id+'/" style="--c:'+(subj.color||'#888')+'">'+
        '<div class="f-card-head"><span class="f-card-id">'+esc(f.id)+'</span>'+
        '<span class="f-card-cat">'+esc(f.category||'')+'</span></div>'+
        '<h3 class="f-card-name">'+esc(f.name)+'</h3>'+
        '<div class="f-card-latex" data-latex="'+esc(f.latex)+'"></div>'+
        '<p class="f-card-summary">'+esc(f.summary||'')+'</p>'+
        '<div class="f-card-tags">'+tags+'</div>'+
      '</a>';
    }).join('');

    // KaTeX 按需渲染：只渲染进入视口（含预取区）的公式，避免首屏一次性渲染全部公式
    if(window.katex){
      function renderOne(el){
        if(el.getAttribute('data-rendered')) return;
        var latex = el.getAttribute('data-latex');
        try{ katex.render(latex, el, {throwOnError:false, displayMode:false}); }
        catch(e){ el.textContent = latex; }
        el.setAttribute('data-rendered', '1');
      }
      var cells = [].slice.call(grid.querySelectorAll('.f-card-latex'));
      if(latexObserver) latexObserver.disconnect();
      if(window.IntersectionObserver){
        latexObserver = new IntersectionObserver(function(entries){
          entries.forEach(function(en){
            if(en.isIntersecting){ renderOne(en.target); latexObserver.unobserve(en.target); }
          });
        }, {rootMargin:'300px 0px'});
        cells.forEach(function(el){ latexObserver.observe(el); });
      } else {
        cells.forEach(renderOne);
      }
    }
  }

  // 搜索
  var q = document.getElementById('fq');
  q.addEventListener('input', function(){
    state.q = this.value.trim().toLowerCase();
    render();
  });

  buildFilters();
  render();
})();
