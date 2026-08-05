/* ============ 碎碎念：记录身边的小事 ============ */
window.ViewMuse = (function () {
  const { esc } = UI;
  let curType = "note";      // 当前选中的类型
  let draft = "";            // 输入框草稿（切换类型时不丢）
  let pendingBlob = null;    // 待发布的照片文件
  let pendingUrl = null;     // 预览用的 object URL

  function timeStr(ts){
    const dt = new Date(ts);
    const p = n => String(n).padStart(2,"0");
    return (dt.getMonth()+1)+"月"+dt.getDate()+"日 "+p(dt.getHours())+":"+p(dt.getMinutes());
  }

  function render(){
    const list = S.museList();
    const types = Object.values(DB.museTypes).map(t=>
      `<button class="chip ${curType===t.key?"on":""}" data-act="museType" data-k="${t.key}">${t.emoji} ${t.label}</button>`).join("");

    const prev = pendingUrl
      ? `<div class="muse-prev"><img class="muse-prev-img" src="${pendingUrl}"/>
           <button class="muse-prev-x" data-act="musePrevX" title="移除">✕</button></div>`
      : "";

    return `
    <div class="page-hero">
      <div class="date">LITTLE THINGS</div>
      <h2>碎碎念</h2>
      <p>拍到的好看、小抱怨、小美好，都记下来吧——记录本身就有意义。</p>
    </div>

    <!-- 记录区 -->
    <div class="card muse-compose">
      <div class="chips" style="margin-bottom:11px">${types}</div>
      <textarea class="inp" id="museInp" placeholder="今天发生了什么？随手记一句，或拍张好看的照片…">${esc(draft)}</textarea>
      <input type="file" id="museFile" accept="image/*" style="display:none" />
      ${prev}
      <div class="muse-actions">
        <button class="lk" data-act="musePick">📷 拍照 / 相册</button>
        <button class="btn" data-act="musePost" style="flex:1">记录下来 · +3</button>
      </div>
      <div class="tiny" style="margin-top:9px;line-height:1.7">照片保存在你的手机本地（IndexedDB），不上传任何服务器。每天多记几条，慢慢就攒成了一本自己的小日记。</div>
    </div>

    <!-- 时间线 -->
    <div class="card">
      <div class="sec-head">
        <h2><span class="dot" style="background:var(--terra)"></span>我的碎碎念</h2>
        <span class="more">${list.length} 条</span>
      </div>
      ${list.length ? list.map(museCard).join("") :
        `<div class="empty"><span class="em">📝</span>还没有记录<br>把今天让你在意的一件小事写下来吧</div>`}
    </div>
    `;
  }

  function museCard(m){
    const t = DB.museTypes[m.type] || DB.museTypes.note;
    return `
    <div class="muse-card">
      <div class="muse-head">
        <span class="pill" style="background:var(${t.s});color:var(${t.color})">${t.emoji} ${t.label}</span>
        <span class="muse-time">${timeStr(m.ts)}</span>
        <button class="todo-x" data-act="museDel" data-id="${m.id}" title="删除">✕</button>
      </div>
      ${m.text ? `<div class="muse-text">${esc(m.text)}</div>` : ""}
      ${m.photoId ? `<div class="muse-ph" data-pid="${m.photoId}"><span class="em">🖼</span></div>` : ""}
    </div>`;
  }

  function clearPending(){
    pendingBlob = null;
    if(pendingUrl){ try{ URL.revokeObjectURL(pendingUrl); }catch(e){} pendingUrl = null; }
  }

  async function afterRender(){
    // 草稿同步
    const inp = document.getElementById("museInp");
    if(inp && !inp._bound){
      inp._bound = true;
      inp.addEventListener("input", ()=>{ draft = inp.value; });
    }
    // 选图
    const fi = document.getElementById("museFile");
    if(fi && !fi._bound){
      fi._bound = true;
      fi.addEventListener("change", e=>{
        const f = e.target.files && e.target.files[0];
        if(!f) return;
        pendingBlob = f;
        if(pendingUrl) URL.revokeObjectURL(pendingUrl);
        pendingUrl = URL.createObjectURL(f);
        App.refresh();
        e.target.value = "";
      });
    }
    // 删除预览图
    const prevX = document.querySelector(".muse-prev-x");
    if(prevX && !prevX._bound){
      prevX._bound = true;
      prevX.addEventListener("click", (ev)=>{ ev.stopPropagation(); clearPending(); App.refresh(); });
    }
    // 加载时间线里的照片
    const phs = document.querySelectorAll(".muse-ph[data-pid]");
    for(const el of phs){
      const blob = await S.getImg(el.dataset.pid);
      if(blob){
        const url = URL.createObjectURL(blob);
        const img = new Image(); img.src = url; img.className = "muse-img";
        img.onload = ()=>{ try{ URL.revokeObjectURL(url); }catch(e){} };
        el.innerHTML = ""; el.appendChild(img);
      }
    }
  }

  /* ---------- 事件 ---------- */
  UI.on("museType", el=>{ curType = el.dataset.k; App.refresh(); });
  UI.on("musePick", ()=>{ const fi = document.getElementById("museFile"); if(fi) fi.click(); });
  UI.on("musePost", async ()=>{
    const inp = document.getElementById("museInp");
    const text = inp ? inp.value.trim() : "";
    if(!text && !pendingBlob) return UI.toast("写点什么，或加张照片吧");
    await S.addMuse(text, curType, pendingBlob);
    draft = ""; clearPending();
    UI.toast("已记录 ✦");
    App.refresh();
  });
  UI.on("museDel", async el=>{
    await S.delMuse(el.dataset.id);
    UI.toast("已删除");
    App.refresh();
  });

  return { render, afterRender };
})();
