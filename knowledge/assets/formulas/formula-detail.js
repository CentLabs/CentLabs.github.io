/* ===== 公式详情页脚本 ===== */
(function(){
  var LATEX = window.__F_LATEX__ || '';
  var latexEl = document.getElementById('fLatex');
  var formulaBox = document.getElementById('fFormula');

  // KaTeX 渲染核心公式
  function renderLatex(){
    if(!latexEl) return;
    if(window.katex){
      try{
        katex.render(LATEX, latexEl, {throwOnError:false, displayMode:true});
      }catch(e){
        latexEl.textContent = LATEX;
      }
    }else{
      latexEl.textContent = LATEX;
    }
  }

  // 复制工具（兼容桌面与移动端）
  function copyText(text, btn){
    function done(){
      if(!btn) return;
      var orig = btn.textContent;
      btn.textContent = '✓ 已复制';
      btn.classList.add('copied');
      setTimeout(function(){ btn.textContent = orig; btn.classList.remove('copied'); }, 1500);
    }
    function fallback(){
      var ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.left = '-9999px';
      document.body.appendChild(ta);
      ta.select();
      try{ document.execCommand('copy'); done(); }catch(e){ alert('复制失败，请手动复制'); }
      document.body.removeChild(ta);
    }
    if(navigator.clipboard && navigator.clipboard.writeText){
      navigator.clipboard.writeText(text).then(done).catch(fallback);
    }else{
      fallback();
    }
  }

  // 提取渲染后公式的纯文本
  function getRenderedText(){
    if(latexEl){
      return latexEl.textContent || latexEl.innerText || '';
    }
    return '';
  }

  var btnCopyFormula = document.getElementById('btnCopyFormula');
  var btnCopyLatex = document.getElementById('btnCopyLatex');
  var btnZoom = document.getElementById('btnZoom');

  if(btnCopyFormula){
    btnCopyFormula.addEventListener('click', function(){
      copyText(getRenderedText(), this);
    });
  }
  if(btnCopyLatex){
    btnCopyLatex.addEventListener('click', function(){
      copyText(LATEX, this);
    });
  }

  // 放大查看
  if(btnZoom){
    btnZoom.addEventListener('click', function(){
      var overlay = document.createElement('div');
      overlay.className = 'f-zoom-overlay';
      overlay.innerHTML = '<div class="f-zoom-box"><button class="f-zoom-close">✕</button><div class="f-zoom-latex"></div></div>';
      document.body.appendChild(overlay);
      var zoomLatex = overlay.querySelector('.f-zoom-latex');
      if(window.katex){
        try{ katex.render(LATEX, zoomLatex, {throwOnError:false, displayMode:true}); }
        catch(e){ zoomLatex.textContent = LATEX; }
      }else{
        zoomLatex.textContent = LATEX;
      }
      // 触发显示动画
      requestAnimationFrame(function(){ overlay.classList.add('on'); });
      function close(){
        overlay.classList.remove('on');
        setTimeout(function(){ overlay.remove(); }, 200);
      }
      overlay.querySelector('.f-zoom-close').addEventListener('click', close);
      overlay.addEventListener('click', function(e){ if(e.target === overlay) close(); });
    });
  }

  renderLatex();
})();
