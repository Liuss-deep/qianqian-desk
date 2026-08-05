/* ============ UI 工具 ============ */
window.UI = (function () {
  const $ = s => document.querySelector(s);
  const esc = s => String(s==null?"":s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

  let toastTimer;
  function toast(msg){
    const t = $("#toast"); if(!t) return;
    t.textContent = msg; t.classList.add("on");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(()=>t.classList.remove("on"), 1900);
  }
  function coinPop(n, why){
    toast("+" + n + " 积分 · " + (why||"打卡"));
    const el = $("#coinNum");
    if(el){ el.classList.remove("pop"); void el.offsetWidth; el.classList.add("pop"); }
    syncCoin();
  }
  function syncCoin(){ const el = $("#coinNum"); if(el) el.textContent = S.d.coins; }

  /* 底部弹层 */
  function sheet(title, html, onOpen){
    $("#sheetTitle").textContent = title;
    $("#sheetBody").innerHTML = html;
    $("#sheet").classList.add("on");
    $("#sheetMask").classList.add("on");
    if(onOpen) setTimeout(onOpen, 40);
  }
  function closeSheet(){
    $("#sheet").classList.remove("on");
    $("#sheetMask").classList.remove("on");
  }

  /* 环形进度 */
  function ring(pct, size, color){
    size = size || 66; color = color || "#8FA98E";
    const r = size/2 - 5, c = 2*Math.PI*r;
    return `<div class="ring" style="width:${size}px;height:${size}px">
      <svg width="${size}" height="${size}">
        <circle cx="${size/2}" cy="${size/2}" r="${r}" fill="none" stroke="rgba(255,255,255,.65)" stroke-width="6"/>
        <circle cx="${size/2}" cy="${size/2}" r="${r}" fill="none" stroke="${color}" stroke-width="6"
          stroke-linecap="round" stroke-dasharray="${c}" stroke-dashoffset="${c*(1-pct/100)}"
          style="transition:stroke-dashoffset .7s cubic-bezier(.3,1,.4,1)"/>
      </svg>
      <div class="ring-txt">${Math.round(pct)}%</div></div>`;
  }

  /* 搜索链接 */
  const weread = t => "https://weread.qq.com/web/search/books?keyword=" + encodeURIComponent(t);
  const douban = t => "https://search.douban.com/book/subject_search?search_text=" + encodeURIComponent(t);
  const jd     = t => "https://search.jd.com/Search?keyword=" + encodeURIComponent(t);
  const xcf    = t => "https://www.xiachufang.com/search/?keyword=" + encodeURIComponent(t);

  /* 事件委托注册 */
  const handlers = {};
  function on(action, fn){ handlers[action] = fn; }
  document.addEventListener("click", e => {
    const el = e.target.closest("[data-act]");
    if(!el) return;
    const fn = handlers[el.dataset.act];
    if(fn){ e.preventDefault(); fn(el, e); }
  });

  return { $, esc, toast, coinPop, syncCoin, sheet, closeSheet, ring, weread, douban, jd, xcf, on };
})();
