/* ============ 生活页：食谱 + 地球 Online ============ */
window.ViewLife = (function () {
  const { esc } = UI;
  let tab = "food";

  function render(){
    return `
    <div class="page-hero">
      <div class="date">DAILY LIFE</div>
      <h2>好好吃饭 · 认真生活</h2>
      <p>厨房是最容易获得成就感的地方，而生活本身就是一场长线游戏。</p>
    </div>
    <div class="chips">
      ${[["food","🍳 今日食谱"],["mine","📔 我的菜单"],["photo","📷 拍照打卡"],["weight","⚖️ 体重记录"],["game","🌏 地球 Online"]].map(c=>
        `<button class="chip ${tab===c[0]?"on":""}" data-act="fTab" data-t="${c[0]}">${c[1]}</button>`).join("")}
    </div>
    ${tab==="food"?food():tab==="mine"?mine():tab==="photo"?photo():tab==="weight"?weight():game()}`;
  }

  /* ---------- 菜单数据结构助手（支持一天多道菜） ---------- */
  // menu[k] 可存 { items:[菜名,...] } 或旧格式 { name }；统一返回数组
  function menuItems(m){ return m ? (m.items || (m.name ? [m.name] : [])) : []; }

  function addMenuDish(k, name){
    const m = S.d.menu[k] || {};
    const arr = menuItems(m);
    if(arr.includes(name)){ UI.toast("已经在菜单里啦"); return -1; }
    const isNew = arr.length === 0;
    arr.push(name);
    S.d.menu[k] = { items: arr };
    S.save();
    return isNew ? 1 : 0; // 1=当天首道，0=追加
  }

  /* ---------- 今日食谱 ---------- */
  function food(){
    const r = S.pick(DB.recipes, 7);
    const more = S.pickMany(DB.recipes, 4, 13).filter(x=>x.n!==r.n).slice(0,3);
    const menu = S.d.menu[S.today()];
    const items = menuItems(menu);
    return `
    ${items.length ? `<div class="card" style="background:var(--sage-s);border-color:var(--sage)">
      <div class="tiny" style="font-weight:700;color:#5F7563">今天已定 ${items.length} 道：</div>
      ${items.map(x=>`<div class="menu-item"><span>${esc(x)}</span><em class="lk sm" data-act="rmMenuItem" data-k="${S.today()}" data-n="${esc(x)}">✕</em></div>`).join("")}
      <button class="btn ghost sm" data-act="clearMenu" style="margin-top:10px">清空今日菜单</button>
    </div>` : ""}

    <div class="recipe">
      <div class="recipe-top">
        <div class="tiny" style="font-weight:700;color:#8A7A66;letter-spacing:1.4px">今日推荐</div>
        <h4 style="margin-top:6px">${esc(r.n)}</h4>
        <div class="recipe-meta"><span>⏱ ${esc(r.t)}</span><span>🎯 ${esc(r.lv)}</span><span>🔥 ${esc(r.kcal)}</span></div>
      </div>
      <div class="recipe-body">
        <h6>食材</h6><p>${esc(r.ing)}</p>
        <h6>做法</h6><ol>${r.steps.map(s=>`<li>${esc(s)}</li>`).join("")}</ol>
        <div class="scene-tip" style="background:var(--sand-s);color:#8A7A66">💡 ${esc(r.tip)}</div>
        <div style="display:flex;gap:8px;margin-top:13px">
          <button class="btn" data-act="pickMenu" data-n="${esc(r.n)}" style="flex:1">就做这个</button>
          <a class="btn ghost" href="${UI.xcf(r.n)}" target="_blank" rel="noopener" style="flex:0 0 auto">下厨房 ›</a>
        </div>
      </div>
    </div>

    <div class="card">
      <div class="sec-head"><h2><span class="dot" style="background:var(--clay)"></span>换个口味</h2>
        <span class="more" data-act="allRecipe">全部 ${DB.recipes.length} 道 ›</span></div>
      ${more.map(x=>`<div class="bill">
        <div class="bill-e">🍽</div>
        <div class="bill-b"><h5>${esc(x.n)}</h5><p>${esc(x.t)} · ${esc(x.lv)} · ${esc(x.kcal)}</p></div>
        <button class="lk" data-act="openRecipe" data-n="${esc(x.n)}">看做法</button></div>`).join("")}
      <button class="btn ghost block" data-act="shuffle" style="margin-top:12px">🎲 随机换一批</button>
    </div>

    <div class="card">
      <div class="sec-head"><h2><span class="dot" style="background:var(--olive)"></span>本周菜单规划</h2>
        <span class="more" data-act="planDay" data-k="${S.ymd(new Date())}">规划今天 ›</span></div>
      ${(()=>{const out=[];const wd=["周日","周一","周二","周三","周四","周五","周六"];
        for(let i=0;i<7;i++){const dt=new Date();dt.setDate(dt.getDate()+i);
        const k=S.ymd(dt);const arr=menuItems(S.d.menu[k]);
        if(arr.length){
          const txt = arr.length<=2 ? arr.join("、") : arr.slice(0,2).join("、")+" +"+(arr.length-2);
          out.push(`<div class="kv day-row" data-act="planDay" data-k="${k}">
            <span>${wd[dt.getDay()]} ${dt.getMonth()+1}/${dt.getDate()}</span>
            <span><b>${esc(txt)}</b> <em class="lk sm" data-act="clearDayMenu" data-k="${k}">清</em></span></div>`);
        } else {
          out.push(`<div class="kv day-row" data-act="planDay" data-k="${k}">
            <span>${wd[dt.getDay()]} ${dt.getMonth()+1}/${dt.getDate()}</span>
            <span class="tiny day-add">＋ 安排</span></div>`);
        }
        }
        return out.join("");})()}
    </div>`;
  }

  /* ---------- 安排某一天菜单 ---------- */
  function planDaySheet(k){
    const dt = new Date(k + "T00:00:00");
    const wd = ["周日","周一","周二","周三","周四","周五","周六"][dt.getDay()];
    const cur = S.d.menu[k];
    const items = menuItems(cur);
    const recs = DB.recipes || [];
    const mine = S.d.myRecipes || [];
    const body = `
      <div class="tiny" style="margin-bottom:8px;color:var(--ink-3)">${wd} ${dt.getMonth()+1}/${dt.getDate()} · 可安排多道菜</div>
      ${items.length?`<div class="menu-list">${items.map(x=>`<div class="menu-item"><span>${esc(x)}</span><em class="lk sm" data-act="rmMenuItem" data-k="${k}" data-n="${esc(x)}">✕</em></div>`).join("")}</div>`
        :`<div class="tiny" style="margin-bottom:10px;color:var(--ink-3)">还没安排，挑几道吧～</div>`}
      <div class="fld"><label>再加一道（自定义）</label>
        <div style="display:flex;gap:8px">
          <input class="inp" id="dayMenuName" placeholder="写个想吃的，如 番茄牛腩" style="flex:1" />
          <button class="btn" data-act="setDayMenu" data-k="${k}" style="flex:0 0 auto">加上</button>
        </div>
      </div>
      ${recs.length?`<div class="sec-head" style="margin-top:4px"><h2>从菜谱库选</h2></div>
        <div class="chips">${recs.slice(0,30).map(r=>`<button class="chip" data-act="setDayMenu" data-k="${k}" data-n="${esc(r.n)}">${esc(r.n)}</button>`).join("")}</div>`:""}
      ${mine.length?`<div class="sec-head" style="margin-top:10px"><h2>我的私房菜</h2></div>
        <div class="chips">${mine.slice(0,30).map(r=>`<button class="chip" data-act="setDayMenu" data-k="${k}" data-n="${esc(r.n)}">${esc(r.n)}</button>`).join("")}</div>`:""}
      ${items.length?`<button class="btn ghost block" data-act="clearDayMenu" data-k="${k}" style="margin-top:14px">🗑 清空这天</button>`:""}
    `;
    UI.sheet("安排 " + wd, body);
  }

  /* ---------- 我的菜单 ---------- */
  function mine(){
    return `
    <div class="card">
      <div class="sec-head"><h2><span class="dot" style="background:var(--sand)"></span>添加我的菜谱</h2></div>
      <div class="fld"><label>菜名</label><input class="inp" id="mrN" placeholder="例如：外婆的红烧肉" /></div>
      <div class="fld"><label>食材</label><input class="inp" id="mrI" placeholder="五花肉 500g、冰糖、姜…" /></div>
      <div class="fld"><label>做法（每行一步）</label><textarea class="inp" id="mrS" placeholder="1. 五花肉切块焯水&#10;2. 炒糖色…"></textarea></div>
      <div style="display:flex;gap:8px">
        <input class="inp" id="mrT" placeholder="用时，如 40 分钟" style="flex:1" />
        <input class="inp" id="mrL" placeholder="难度" style="flex:1" />
      </div>
      <button class="btn block" data-act="addRecipe" style="margin-top:11px">保存菜谱 · +10 积分</button>
    </div>

    <div class="card">
      <div class="sec-head"><h2><span class="dot" style="background:var(--terra)"></span>我的私房菜</h2>
        <span class="more">${S.d.myRecipes.length} 道</span></div>
      ${S.d.myRecipes.length ? S.d.myRecipes.map((x,i)=>`<div class="bill">
          <div class="bill-e">📔</div>
          <div class="bill-b"><h5>${esc(x.n)}</h5><p>${esc(x.t||"—")} · ${esc(x.lv||"自定义")}</p></div>
          <button class="lk" data-act="openMine" data-i="${i}">查看</button>
          <button class="todo-x" data-act="delMine" data-i="${i}">✕</button></div>`).join("")
        : `<div class="empty"><span class="em">📔</span>把你会做的菜记下来<br>以后不用再想「今天吃什么」</div>`}
    </div>`;
  }

  /* ---------- 拍照打卡 ---------- */
  function photo(){
    const t = S.today();
    const ids = S.d.photos[t] || [];
    const allDays = Object.keys(S.d.photos).filter(k=>S.d.photos[k].length).sort().reverse().slice(0,6);
    const total = Object.values(S.d.photos).reduce((s,a)=>s+a.length,0);
    return `
    <div class="card">
      <div class="sec-head"><h2><span class="dot" style="background:var(--rose)"></span>今日餐桌</h2>
        <span class="more">累计 ${total} 张</span></div>
      <input type="file" id="fileInp" accept="image/*" style="display:none" />
      <div class="gal" id="todayGal">
        ${ids.map(id=>`<div class="shot" data-pid="${id}">
          <div class="ph"><span class="em">🖼</span>加载中</div>
          <button class="del" data-act="delPhoto" data-id="${id}">✕</button></div>`).join("")}
        <button class="shot" data-act="pickPhoto" style="border-style:dashed">
          <div class="ph"><span class="em">📷</span>拍照 / 相册</div></button>
      </div>
      <div class="tiny" style="margin-top:11px;line-height:1.8">照片保存在你的手机本地（IndexedDB），不会上传到任何服务器。每天第一张 +15 积分。</div>
    </div>

    ${allDays.length>1 ? `<div class="card">
      <div class="sec-head"><h2><span class="dot" style="background:var(--sand)"></span>美食相册</h2></div>
      ${allDays.filter(k=>k!==t).map(k=>`<div style="margin-bottom:14px">
        <div class="tiny" style="font-weight:700;margin-bottom:7px">${k}</div>
        <div class="gal">${S.d.photos[k].map(id=>`<div class="shot" data-pid="${id}"><div class="ph"><span class="em">🖼</span></div></div>`).join("")}</div>
      </div>`).join("")}
    </div>` : ""}`;
  }

  /* ---------- 地球 Online ---------- */
  function game(){
    const t = S.today();
    const qs = S.dailyQuests(DB.quests, 6);
    const done = S.d.questDone[t] || [];
    const lv = S.level();
    const gotBadge = new Set(S.d.badges);
    const todayPts = qs.filter(q=>done.includes(q.t)).reduce((s,q)=>s+q.p,0);
    const maxPts = qs.reduce((s,q)=>s+q.p,0);

    return `
    <div class="earth">
      <div class="earth-top">
        <div>
          <div class="earth-lv">LEVEL ${lv.lv} · ${esc(lv.name)}</div>
          <h3 class="earth-t">地球 Online</h3>
          <div class="tiny" style="color:#6F7A6E;margin-top:5px">已连续在线 ${S.d.streak} 天 · 总积分 ${S.d.coins}</div>
        </div>
        <div class="earth-badge">🌏</div>
      </div>
      <div class="exp-row">
        <div class="lb"><span>经验值</span><span>${S.d.coins - lv.cur} / ${lv.next - lv.cur}</span></div>
        <div class="bar" style="background:rgba(255,255,255,.5)"><i style="width:${lv.pct}%;background:#7E9683"></i></div>
      </div>
    </div>

    <div class="card">
      <div class="sec-head"><h2><span class="dot" style="background:var(--olive)"></span>今日任务</h2>
        <span class="more">${todayPts} / ${maxPts} 积分</span></div>
      ${qs.map(q=>{
        const d = done.includes(q.t);
        return `<div class="quest ${d?"done":""}">
          <div class="q-e">${q.e}</div>
          <div class="q-b"><h5>${esc(q.t)} <span class="pill" style="background:var(--olive-s);color:#7A7E5E">${esc(q.tag)}</span></h5>
            <p>${esc(q.d)} · +${q.p} 积分</p></div>
          <button class="q-go ${d?"done":""}" data-act="quest" data-q="${esc(q.t)}" data-p="${q.p}">${d?"✓":"完成"}</button>
        </div>`;
      }).join("")}
      ${done.length>=qs.length ? `<div class="scene-tip" style="background:var(--sage-s);color:#5F7563;margin-top:12px">
        🎉 今日全部任务完成！你在地球的这一天，过得很扎实。</div>` : ""}
    </div>

    <div class="card">
      <div class="sec-head"><h2><span class="dot" style="background:var(--sand)"></span>成就徽章</h2>
        <span class="more">${gotBadge.size} / ${DB.badges.length}</span></div>
      <div class="badges">
        ${DB.badges.map(b=>`<div class="badge ${gotBadge.has(b.id)?"on":""}" data-act="badgeInfo" data-n="${esc(b.n)}" data-c="${esc(b.c)}">
          <div class="b">${b.e}</div><div class="n">${esc(b.n)}</div></div>`).join("")}
      </div>
    </div>

    <div class="card">
      <div class="sec-head"><h2><span class="dot" style="background:var(--mist)"></span>本周战绩</h2></div>
      ${(()=>{const out=[];for(let i=6;i>=0;i--){const dt=new Date();dt.setDate(dt.getDate()-i);
        const k=S.ymd(dt);const n=(S.d.questDone[k]||[]).length;
        out.push(`<div style="margin-bottom:9px">
          <div style="display:flex;justify-content:space-between;font-size:11.5px;margin-bottom:4px">
            <span>${dt.getMonth()+1}/${dt.getDate()} ${["周日","周一","周二","周三","周四","周五","周六"][dt.getDay()]}</span>
            <b>${n} 个任务</b></div>
          <div class="bar"><i style="width:${Math.min(100,n/6*100)}%;background:var(--olive)"></i></div></div>`);}
        return out.join("");})()}
    </div>`;
  }

  /* ---------- 每日体重记录 ---------- */
  function weightChart(hist){
    if(!hist || hist.length < 2) return `<div class="tiny" style="color:var(--ink-3);text-align:center;padding:16px 0">记录满 2 天，就能画出变化曲线 📈</div>`;
    const W = 320, H = 116, padX = 16, padY = 16;
    const kgs = hist.map(x=>x.kg);
    let min = Math.min(...kgs), max = Math.max(...kgs);
    if(min === max){ min -= 1; max += 1; }
    const n = hist.length;
    const x = i => padX + (W - 2*padX) * (n === 1 ? .5 : i/(n-1));
    const y = v => padY + (H - 2*padY) * (1 - (v - min)/(max - min));
    const line = hist.map((r,i)=>`${x(i).toFixed(1)},${y(r.kg).toFixed(1)}`).join(" ");
    const area = `M ${x(0).toFixed(1)},${(H-padY).toFixed(1)} L ` + hist.map((r,i)=>`${x(i).toFixed(1)},${y(r.kg).toFixed(1)}`).join(" L ") + ` L ${x(n-1).toFixed(1)},${(H-padY).toFixed(1)} Z`;
    const last = hist[n-1];
    return `<svg viewBox="0 0 ${W} ${H}" style="width:100%;height:auto;display:block;margin-top:2px">
      <defs><linearGradient id="wgGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#B7C2B0" stop-opacity="0.38"/>
        <stop offset="100%" stop-color="#B7C2B0" stop-opacity="0"/></linearGradient></defs>
      <path d="${area}" fill="url(#wgGrad)" />
      <polyline points="${line}" fill="none" stroke="#7E9683" stroke-width="2.4" stroke-linejoin="round" stroke-linecap="round"/>
      <circle cx="${x(n-1).toFixed(1)}" cy="${y(last.kg).toFixed(1)}" r="3.6" fill="#7E9683"/>
    </svg>
    <div class="tiny" style="text-align:center;color:var(--ink-3);margin-top:2px">${hist[0].date.slice(5)} → ${last.date.slice(5)} · 区间 ${last.kg>hist[0].kg?'+':''}${+(last.kg-hist[0].kg).toFixed(1)} kg</div>`;
  }

  function weight(){
    const t = S.today();
    const todayW = S.getWeight(t);
    const st = S.weightStats();
    const hist = st ? st.hist.slice(-14) : [];     // 图表用最近 14 条
    const recent = st ? st.hist.slice(-7).reverse() : [];
    const deltaCls = st && st.delta!==null ? (st.delta < 0 ? "var(--green,#2e9e5b)" : st.delta > 0 ? "var(--red,#d9534f)" : "var(--ink-2)") : "var(--ink-2)";
    return `
    <div class="card">
      <div class="sec-head"><h2><span class="dot" style="background:var(--clay)"></span>今日体重</h2>
        ${todayW?`<span class="more">已记录</span>`:`<span class="more">还没记</span>`}</div>
      <div class="fld"><label>体重（kg）</label>
        <div style="display:flex;gap:8px">
          <input class="inp" id="wKg" type="number" step="0.1" min="20" max="300" inputmode="decimal" placeholder="如 55.5" value="${todayW?todayW.kg:""}" style="flex:1" />
          <button class="btn" data-act="saveWeight" style="flex:0 0 auto">记录</button>
        </div>
      </div>
      <div class="fld"><label>备注（可选）</label>
        <input class="inp" id="wNote" placeholder="如 晨起空腹 / 昨晚吃多了" value="${todayW?(todayW.note||""):""}" />
      </div>
      ${todayW?`<div class="scene-tip" style="background:var(--sand-s);color:#8A7A66;margin-top:12px">✅ 今天已记录 <b>${todayW.kg} kg</b>${todayW.note?` · ${esc(todayW.note)}`:""}</div>`:""}
    </div>

    ${st ? `<div class="card">
      <div class="sec-head"><h2><span class="dot" style="background:var(--olive)"></span>趋势</h2>
        <span class="more">共 ${st.count} 天记录</span></div>
      <div style="display:flex;gap:12px;margin-bottom:8px">
        <div style="flex:1"><div class="tiny" style="color:var(--ink-3)">当前</div><div style="font-size:20px;font-weight:700">${st.last.kg}<span style="font-size:12px;color:var(--ink-3)"> kg</span></div></div>
        <div style="flex:1"><div class="tiny" style="color:var(--ink-3)">较上次</div><div style="font-size:20px;font-weight:700;color:${deltaCls}">${st.delta===null?"—":(st.delta>0?"+":"")+st.delta}</div></div>
        <div style="flex:1"><div class="tiny" style="color:var(--ink-3)">最低/最高</div><div style="font-size:15px;font-weight:700">${st.min} / ${st.max}</div></div>
      </div>
      ${weightChart(hist)}
    </div>` : `<div class="card"><div class="empty"><span class="em">⚖️</span>记录体重，看清自己的变化<br>每天同一时间称，数据更准</div></div>`}

    ${recent.length ? `<div class="card">
      <div class="sec-head"><h2><span class="dot" style="background:var(--sand)"></span>最近记录</h2></div>
      ${recent.map(r=>`<div class="kv">
        <span>${r.date.slice(5)}</span>
        <span><b>${r.kg} kg</b>${r.note?` <span class="tiny">${esc(r.note)}</span>`:""} <em class="lk sm" data-act="delWeight" data-k="${r.date}">删</em></span>
      </div>`).join("")}
    </div>` : ""}`;
  }

  /* ---------- 渲染后：加载图片 ---------- */
  async function afterRender(){
    const shots = document.querySelectorAll(".shot[data-pid]");
    for(const el of shots){
      const blob = await S.getImg(el.dataset.pid);
      if(blob){
        const url = URL.createObjectURL(blob);
        const img = new Image(); img.src = url;
        const ph = el.querySelector(".ph"); if(ph) ph.replaceWith(img);
      }
    }
    const fi = document.getElementById("fileInp");
    if(fi && !fi._bound){
      fi._bound = true;
      fi.addEventListener("change", async e => {
        const f = e.target.files[0]; if(!f) return;
        const id = "p" + Date.now();
        const blob = await compress(f);
        await S.putImg(id, blob);
        const t = S.today();
        S.d.photos[t] = S.d.photos[t] || [];
        const first = S.d.photos[t].length === 0;
        S.d.photos[t].push(id); S.save();
        if(first) S.addCoin(15,"餐桌打卡"); else UI.toast("已保存");
        S.checkBadges();
        e.target.value = "";
        App.refresh();
      });
    }
  }

  function compress(file){
    return new Promise(res=>{
      const img = new Image();
      img.onload = ()=>{
        const max = 1100;
        let { width:w, height:h } = img;
        if(w>max || h>max){ const r = Math.min(max/w, max/h); w = w*r|0; h = h*r|0; }
        const cv = document.createElement("canvas"); cv.width=w; cv.height=h;
        cv.getContext("2d").drawImage(img,0,0,w,h);
        cv.toBlob(b=>res(b||file), "image/jpeg", .82);
      };
      img.onerror = ()=>res(file);
      img.src = URL.createObjectURL(file);
    });
  }

  /* ---------- 事件 ---------- */
  UI.on("fTab", el=>{ tab = el.dataset.t; App.refresh(); });
  UI.on("planDay", el=>{ planDaySheet(el.dataset.k); });
  UI.on("setDayMenu", el=>{
    const k = el.dataset.k;
    let n = el.dataset.n;
    if(!n){ const inp = document.getElementById("dayMenuName"); n = inp ? inp.value.trim() : ""; }
    if(!n){ UI.toast("先写个菜名吧"); return; }
    const r = addMenuDish(k, n);
    UI.closeSheet();
    if(r===1) S.addCoin(3,"安排菜单"); else if(r===0) S.addCoin(1,"加一道菜");
    App.refresh();
    if(r!==-1) planDaySheet(k); // 追加后刷新规划面板，方便继续加
  });
  UI.on("rmMenuItem", el=>{
    const k = el.dataset.k, n = el.dataset.n;
    const m = S.d.menu[k]; if(!m) return;
    const arr = menuItems(m).filter(x=>x!==n);
    if(arr.length) S.d.menu[k] = { items: arr }; else delete S.d.menu[k];
    S.save();
    const inSheet = !!el.closest("#sheetBody");
    App.refresh();
    if(inSheet) planDaySheet(k);
  });
  UI.on("clearDayMenu", el=>{
    delete S.d.menu[el.dataset.k];
    S.save(); UI.closeSheet(); App.refresh();
  });
  UI.on("pickMenu", el=>{
    const r = addMenuDish(S.today(), el.dataset.n);
    if(r===1) S.addCoin(10,"确定今日菜单"); else if(r===0) S.addCoin(3,"加一道菜");
    App.refresh();
  });
  UI.on("clearMenu", ()=>{ delete S.d.menu[S.today()]; S.save(); App.refresh(); });
  UI.on("shuffle", ()=>{ S.d.seedOffset++; S.save(); UI.toast("换一批菜谱"); App.refresh(); });
  UI.on("openRecipe", el=>{
    const r = DB.recipes.find(x=>x.n===el.dataset.n); if(!r) return;
    UI.sheet(r.n, `<div class="recipe-meta" style="margin-bottom:12px"><span>⏱ ${esc(r.t)}</span><span>🎯 ${esc(r.lv)}</span><span>🔥 ${esc(r.kcal)}</span></div>
      <h6 style="font-size:11px;color:var(--ink-3);font-weight:700;letter-spacing:.6px">食材</h6>
      <p style="font-size:13px;line-height:1.8;color:var(--ink-2)">${esc(r.ing)}</p>
      <h6 style="font-size:11px;color:var(--ink-3);font-weight:700;letter-spacing:.6px">做法</h6>
      <ol style="font-size:13px;line-height:1.9;color:var(--ink-2);padding-left:18px">${r.steps.map(s=>`<li>${esc(s)}</li>`).join("")}</ol>
      <div class="scene-tip" style="background:var(--sand-s);color:#8A7A66">💡 ${esc(r.tip)}</div>
      <div style="display:flex;gap:8px;margin-top:14px">
        <button class="btn" data-act="pickMenu" data-n="${esc(r.n)}" style="flex:1">就做这个</button>
        <a class="btn ghost" href="${UI.xcf(r.n)}" target="_blank" rel="noopener">下厨房</a></div>`);
  });
  UI.on("allRecipe", ()=>{
    UI.sheet("全部菜谱（"+DB.recipes.length+" 道）", DB.recipes.map(x=>`<div class="bill">
      <div class="bill-e">🍽</div>
      <div class="bill-b"><h5>${esc(x.n)}</h5><p>${esc(x.t)} · ${esc(x.lv)} · ${esc(x.kcal)}</p></div>
      <button class="lk" data-act="openRecipe" data-n="${esc(x.n)}">做法</button></div>`).join(""));
  });
  UI.on("addRecipe", ()=>{
    const n = document.getElementById("mrN").value.trim();
    if(!n) return UI.toast("先给菜起个名字");
    S.d.myRecipes.push({ n, ing:document.getElementById("mrI").value.trim(),
      steps:document.getElementById("mrS").value.split("\n").filter(x=>x.trim()),
      t:document.getElementById("mrT").value.trim(), lv:document.getElementById("mrL").value.trim() });
    S.save(); S.addCoin(10,"新增菜谱"); App.refresh();
  });
  UI.on("openMine", el=>{
    const r = S.d.myRecipes[Number(el.dataset.i)];
    UI.sheet(r.n, `<p style="font-size:13px;line-height:1.8;color:var(--ink-2)"><b>食材：</b>${esc(r.ing||"—")}</p>
      <ol style="font-size:13px;line-height:1.9;color:var(--ink-2);padding-left:18px">${(r.steps||[]).map(s=>`<li>${esc(s)}</li>`).join("")||"<li>暂无步骤</li>"}</ol>
      <button class="btn block" data-act="pickMenu" data-n="${esc(r.n)}">今天就做它</button>`);
  });
  UI.on("delMine", el=>{ S.d.myRecipes.splice(Number(el.dataset.i),1); S.save(); App.refresh(); });
  UI.on("pickPhoto", ()=>{ document.getElementById("fileInp").click(); });
  UI.on("delPhoto", async el=>{
    const id = el.dataset.id;
    await S.delImg(id);
    const t = S.today();
    S.d.photos[t] = (S.d.photos[t]||[]).filter(x=>x!==id); S.save(); App.refresh();
  });
  UI.on("badgeInfo", el=>{ UI.toast(el.dataset.n + " · " + el.dataset.c); });
  UI.on("saveWeight", ()=>{
    const kgEl = document.getElementById("wKg");
    const noteEl = document.getElementById("wNote");
    const v = kgEl ? kgEl.value.trim() : "";
    if(!v){ UI.toast("先填个体重吧"); return; }
    const r = S.addWeight(v, noteEl ? noteEl.value : "");
    if(!r.ok){ UI.toast(r.msg); return; }
    UI.toast(r.isNew ? "已记录 · +2 积分" : "已更新今天的体重");
    App.refresh();
  });
  UI.on("delWeight", el=>{
    delete S.d.weight[el.dataset.k];
    S.save(); App.refresh();
  });

  return { render, afterRender };
})();
