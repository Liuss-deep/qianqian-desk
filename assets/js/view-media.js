/* ============ 自媒体页 ============ */
window.ViewMedia = (function () {
  const { esc } = UI;
  let tab = "plan";
  let dailyData = null;

  const NAME_POOL = [
    { n:"浅浅的人生进度条", s:"记录一个普通女孩把日子过成作品的每一天", tags:["生活记录","理财成长","雅思日记","一人食"] },
    { n:"浅浅在升级", s:"地球 Online 玩家一枚，每天完成一点小任务", tags:["自我成长","游戏化生活","打卡日记"] },
    { n:"浅浅的生活切片", s:"把平凡日子切成一片一片，认真看看", tags:["生活方式","治愈日常","慢生活"] },
    { n:"浅浅想变好", s:"存钱、读书、考雅思，一个都不能少", tags:["存钱记录","考雅思","自律"] }
  ];

  function acct(){
    const a = S.d.account;
    if(!a.name){
      const p = NAME_POOL[0];
      a.name = p.n; a.slogan = p.s; a.tags = p.tags; a.created = S.today(); S.save();
    }
    return a;
  }

  function render(){
    return `
    <div class="page-hero">
      <div class="date">CREATOR</div>
      <h2>自媒体计划</h2>
      <p>先记录，再运营，最后变现。顺序错了会很累。</p>
    </div>
    <div class="chips">
      ${[["plan","🚀 账号与规划"],["hot","🔥 每日热点"],["edit","✂️ 剪辑技巧"],["script","🧩 脚本拆解"]].map(c=>
        `<button class="chip ${tab===c[0]?"on":""}" data-act="dTab" data-t="${c[0]}">${c[1]}</button>`).join("")}
    </div>
    ${tab==="plan"?plan():tab==="hot"?hot():tab==="edit"?edit():script()}`;
  }

  /* ---------- 账号与规划 ---------- */
  function plan(){
    const a = acct();
    const days = Math.max(1, S.dayNum() - S.dayNum(a.created) + 1);
    const done = S.d.mediaDone;
    const pct = Math.round(done.length/DB.mediaPath.length*100);
    return `
    <div class="acct">
      <div class="lb">MY ACCOUNT · 第 ${days} 天</div>
      <h3>${esc(a.name)}</h3>
      <p class="slogan">${esc(a.slogan)}</p>
      <div class="acct-tags">${(a.tags||[]).map(t=>`<span>#${esc(t)}</span>`).join("")}</div>
      <div style="display:flex;gap:8px;margin-top:14px;position:relative;z-index:1">
        <button class="btn sm ghost" data-act="editAcct">编辑</button>
        <button class="btn sm ghost" data-act="renameAcct">换个名字</button>
      </div>
    </div>

    <div class="card">
      <div class="sec-head"><h2><span class="dot" style="background:var(--terra)"></span>账号定位三问</h2></div>
      <div class="lesson"><div class="lesson-n" style="background:var(--rose-s);color:var(--rose)">谁</div>
        <div class="lesson-b"><h5>给谁看</h5><p>20–30 岁、想认真生活但常常被生活推着走的女生。她们和你面对一样的问题：钱不够、时间不够、想变好但坚持不了。</p></div></div>
      <div class="lesson"><div class="lesson-n" style="background:var(--mist-s);color:var(--mist)">看</div>
        <div class="lesson-b"><h5>看什么</h5><p>四条内容线交替更新：一人食 / 存钱记账 / 雅思备考 / 每日复盘。四条线都指向同一个人设：正在变好的普通人。</p></div></div>
      <div class="lesson"><div class="lesson-n" style="background:var(--sage-s);color:var(--sage)">你</div>
        <div class="lesson-b"><h5>为什么是你</h5><p>因为你在真实地过这一切，而不是在教别人怎么过。真实是你唯一且最强的壁垒。</p></div></div>
    </div>

    <div class="card">
      <div class="sec-head"><h2><span class="dot" style="background:var(--clay)"></span>30 天起号路线</h2>
        <span class="more">${done.length}/${DB.mediaPath.length}</span></div>
      <div class="bar" style="margin-bottom:15px"><i style="width:${pct}%;background:var(--terra)"></i></div>
      ${DB.mediaPath.map((x,i)=>{
        const d = done.includes(i);
        return `<div class="step ${d?"on":""}">
          <div class="step-line"><div class="step-dot"></div>${i<DB.mediaPath.length-1?'<div class="step-bar"></div>':""}</div>
          <div class="step-b">
            <div class="wk">${esc(x.wk)}</div>
            <h5>${esc(x.t)}</h5>
            <p>${esc(x.d)}</p>
            <button class="btn sm ${d?"soft":"ghost"}" data-act="mStep" data-i="${i}" style="margin-top:8px">${d?"已完成 ✓":"标记完成"}</button>
          </div></div>`;
      }).join("")}
    </div>

    <div class="card">
      <div class="sec-head"><h2><span class="dot" style="background:var(--sand)"></span>变现路径</h2></div>
      ${DB.monetize.map(m=>`<div class="lesson">
        <div class="lesson-n" style="background:${m.c}22;color:${m.c};width:auto;padding:0 8px;border-radius:9px;font-size:10px">${esc(m.s)}</div>
        <div class="lesson-b"><h5>${esc(m.t)}</h5><p>${esc(m.d)}</p></div></div>`).join("")}
      <div class="scene-tip" style="background:var(--rose-s);color:#8B6A6E">
        ⚠️ 提醒：不要在 1000 粉之前买课、买设备、买涨粉服务。这个阶段唯一该投入的是时间。</div>
    </div>

    <div class="card">
      <div class="sec-head"><h2><span class="dot" style="background:var(--lilac)"></span>发布记录</h2>
        <span class="more">共 ${S.d.posts.length} 条</span></div>
      <div style="display:flex;gap:8px;margin-bottom:10px">
        <input class="inp" id="pTitle" placeholder="这条内容的标题…" style="flex:1" />
        <select class="inp" id="pPlat" style="flex:0 0 92px"><option>小红书</option><option>抖音</option><option>视频号</option><option>B站</option></select>
      </div>
      <button class="btn block" data-act="addPost">记录一条发布 · +30 积分</button>
      <div style="margin-top:12px">
        ${S.d.posts.length ? S.d.posts.slice().reverse().slice(0,8).map((p,i)=>`<div class="bill">
            <div class="bill-e">${p.plat==="抖音"?"🎵":p.plat==="小红书"?"📕":p.plat==="B站"?"📺":"🎬"}</div>
            <div class="bill-b"><h5>${esc(p.t)}</h5><p>${esc(p.date)} · ${esc(p.plat)}</p></div>
            <button class="lk" data-act="postData" data-i="${S.d.posts.length-1-i}">填数据</button></div>`).join("")
          : `<div class="empty"><span class="em">🎬</span>第一条永远是最难的<br>发出来就赢了 90% 的人</div>`}
      </div>
    </div>`;
  }

  /* ---------- 每日热点 ---------- */
  function hot(){
    return `
    <div class="card">
      <div class="sec-head"><h2><span class="dot" style="background:var(--rose)"></span>昨日热门 · 08:00 推送</h2>
        <span class="more" data-act="refreshHot">刷新</span></div>
      <div id="hotBox"><div class="empty">正在读取今日推送…</div></div>
    </div>

    <div class="card">
      <div class="sec-head"><h2><span class="dot" style="background:var(--mist)"></span>选题灵感生成器</h2></div>
      <div id="ideaBox">${ideas()}</div>
      <button class="btn ghost block" data-act="reIdea" style="margin-top:12px">🎲 再来一批</button>
    </div>`;
  }

  function ideas(){
    const A = ["我用 30 天","作为一个普通人，我","没人告诉我","如果你也","我花了 3 个月才明白","打工人版"];
    const B = ["存下了第一笔应急金","把雅思从 5.5 刷到 6.5","坚持了每天做饭","开始记账","学会了剪视频","把生活过明白了"];
    const C = ["（附完整方法）","真的太治愈了","后悔没早点知道","这 5 点最关键","踩过的坑都在这"];
    const out = [];
    for(let i=0;i<5;i++){
      const r = Math.abs(S.dayNum()*37 + i*911 + S.d.seedOffset*53);
      out.push(A[r%A.length] + B[(r>>3)%B.length] + C[(r>>6)%C.length]);
    }
    return out.map((t,i)=>`<div class="hot">
      <div class="hot-n" style="background:var(--lilac)">${i+1}</div>
      <div class="hot-b"><h5>${esc(t)}</h5>
      <p>建议形式：${["图文九宫格","口播短视频","沉浸式无口播","前后对比图","清单式笔记"][i%5]}</p></div></div>`).join("");
  }

  /* ---------- 剪辑技巧 ---------- */
  function edit(){
    const t = S.pick(DB.editTips, 10);
    const read = S.d.tipRead[S.today()];
    const more = S.pickMany(DB.editTips, 4, 21).filter(x=>x.t!==t.t).slice(0,3);
    return `
    <div class="tip-card">
      <div class="n">今日剪辑技巧 · DAY ${S.dayNum()%365+1}</div>
      <h4>${esc(t.t)}</h4>
      <p>${esc(t.d)}</p>
      <ol class="tip-steps">${t.steps.map(s=>`<li>${esc(s)}</li>`).join("")}</ol>
      <button class="btn block ${read?"soft":""}" data-act="readTip" style="margin-top:14px">${read?"今天已学 ✓":"学会了 · +15 积分"}</button>
    </div>

    <div class="card">
      <div class="sec-head"><h2><span class="dot" style="background:var(--sage)"></span>再看三条</h2>
        <span class="more" data-act="allTips">全部 ${DB.editTips.length} 条 ›</span></div>
      ${more.map(x=>`<div class="lesson">
        <div class="lesson-n" style="background:var(--lilac-s);color:var(--lilac)">✂️</div>
        <div class="lesson-b"><h5>${esc(x.t)}</h5><p>${esc(x.d)}</p></div></div>`).join("")}
    </div>

    <div class="card">
      <div class="sec-head"><h2><span class="dot" style="background:var(--sand)"></span>新手工具建议</h2></div>
      <div class="kv"><span>剪辑</span><b>剪映（手机端够用）</b></div>
      <div class="kv"><span>封面</span><b>稿定 / Canva 模板</b></div>
      <div class="kv"><span>配乐</span><b>剪映音乐库（注意商用授权）</b></div>
      <div class="kv"><span>拍摄</span><b>手机 + 一个三脚架就够</b></div>
      <div class="kv"><span>提词</span><b>剪映「提词器」或备忘录</b></div>
      <div class="scene-tip">设备不是瓶颈，选题和表达才是。前 50 条视频不要花钱买任何设备。</div>
    </div>

    <div class="card">
      <div class="sec-head"><h2><span class="dot" style="background:var(--clay)"></span>我的剪辑笔记</h2>
        <span class="more">${S.d.editNotes.length} 条</span></div>
      <div class="fld"><label>标题 / 灵感来源（如某条技巧或某个视频）</label><input class="inp" id="etTitle" placeholder="例如：转场节奏 / @某某第 12 秒的卡点" /></div>
      <div class="fld"><label>记下来的一点</label><textarea class="inp" id="etNote" placeholder="今天学到或想试的具体做法、坑、灵感……"></textarea></div>
      <button class="btn block" data-act="saveEditNote">保存笔记 · +15 积分</button>
      ${S.d.editNotes.length ? `<div style="margin-top:14px">${S.d.editNotes.slice().reverse().slice(0,6).map((s,i)=>
        `<div class="bill"><div class="bill-e">📝</div>
          <div class="bill-b"><h5>${esc(s.title||"无标题")}</h5><p>${esc(s.date)}</p></div>
          <button class="lk" data-act="openEditNote" data-i="${S.d.editNotes.length-1-i}">查看</button></div>`).join("")}</div>` : ""}
    </div>`;
  }

  /* ---------- 脚本拆解 ---------- */
  function script(){
    return `
    <div class="card">
      <div class="sec-head"><h2><span class="dot" style="background:var(--terra)"></span>五段式拆解框架</h2></div>
      ${DB.scriptFrame.map((f,i)=>`<div class="lesson">
        <div class="lesson-n" style="background:var(--terra-s);color:var(--terra);width:auto;padding:0 8px;border-radius:9px;font-size:10px">${esc(f.p)}</div>
        <div class="lesson-b"><h5>${esc(f.q)}</h5><p>常见做法：${esc(f.eg)}</p></div></div>`).join("")}
    </div>

    <div class="card">
      <div class="sec-head"><h2><span class="dot" style="background:var(--rose)"></span>今日拆解范例</h2></div>
      <div id="demoBox"><div class="empty">加载中…</div></div>
    </div>

    <div class="card">
      <div class="sec-head"><h2><span class="dot" style="background:var(--mist)"></span>我的拆解笔记</h2>
        <span class="more">${S.d.scripts.length} 篇</span></div>
      <div class="fld"><label>拆解的视频（标题或链接）</label><input class="inp" id="scT" placeholder="例如：@某某《一个人住的第 300 天》" /></div>
      ${DB.scriptFrame.map((f,i)=>`<div class="fld">
        <label>${esc(f.p)} — ${esc(f.q)}</label>
        <input class="inp" id="sc${i}" placeholder="${esc(f.eg.split(" / ")[0])}" /></div>`).join("")}
      <div class="fld"><label>我能抄走的一点</label><textarea class="inp" id="scTake" placeholder="下一条视频我要用上的具体做法"></textarea></div>
      <button class="btn block" data-act="saveScript">保存拆解 · +25 积分</button>
      ${S.d.scripts.length ? `<div style="margin-top:14px">${S.d.scripts.slice().reverse().slice(0,6).map((s,i)=>
        `<div class="bill"><div class="bill-e">🧩</div>
          <div class="bill-b"><h5>${esc(s.t)}</h5><p>${esc(s.date)}</p></div>
          <button class="lk" data-act="openScript" data-i="${S.d.scripts.length-1-i}">查看</button></div>`).join("")}</div>` : ""}
    </div>`;
  }

  /* ---------- 渲染后 ---------- */
  async function afterRender(){
    if(!dailyData) dailyData = await S.fetchDaily();
    const tr = dailyData.trend || DB.fallbackTrends;

    const box = document.getElementById("hotBox");
    if(box){
      box.innerHTML = (tr.date?`<div class="tiny" style="margin-bottom:9px">📅 ${esc(tr.date)} 数据</div>`:"")
      + `<div class="tiny" style="font-weight:700;color:#C0555F;margin:4px 0 6px">📕 小红书热门话题</div>`
      + (tr.xhs||[]).map((x,i)=>`<div class="hot">
          <div class="hot-n" style="background:#C0736F">${i+1}</div>
          <div class="hot-b"><h5>${esc(x.t)}</h5><p>${esc(x.d||"")}</p></div></div>`).join("")
      + `<div class="tiny" style="font-weight:700;color:#4A4842;margin:14px 0 6px">🎵 抖音热门内容</div>`
      + (tr.dy||[]).map((x,i)=>`<div class="hot">
          <div class="hot-n" style="background:#5C5A57">${i+1}</div>
          <div class="hot-b"><h5>${esc(x.t)}</h5><p>${esc(x.d||"")}</p></div></div>`).join("")
      + (tr.note?`<div class="scene-tip" style="margin-top:12px">${esc(tr.note)}</div>`:"");
    }

    const demo = document.getElementById("demoBox");
    if(demo){
      const sc = tr.script || DB.fallbackTrends.script;
      demo.innerHTML = `<h4 style="margin:0 0 11px;font-size:14.5px;font-weight:650">${esc(sc.title)}</h4>`
        + (sc.rows||[]).map(r=>`<div class="lesson">
            <div class="lesson-n" style="background:var(--rose-s);color:var(--rose);width:auto;padding:0 7px;border-radius:8px;font-size:10px">${esc(r.p)}</div>
            <div class="lesson-b"><h5 style="font-weight:600;font-size:13px">${esc(r.c)}</h5>
            <p>🔍 ${esc(r.w)}</p></div></div>`).join("");
    }
  }

  /* ---------- 事件 ---------- */
  UI.on("dTab", el=>{ tab = el.dataset.t; App.refresh(); });
  UI.on("editAcct", ()=>{
    const a = acct();
    UI.sheet("编辑账号信息", `
      <div class="fld"><label>账号名</label><input class="inp" id="acN" value="${esc(a.name)}" /></div>
      <div class="fld"><label>一句话简介</label><textarea class="inp" id="acS">${esc(a.slogan)}</textarea></div>
      <div class="fld"><label>标签（逗号分隔）</label><input class="inp" id="acT" value="${esc((a.tags||[]).join("，"))}" /></div>
      <button class="btn block" data-act="saveAcct">保存</button>`);
  });
  UI.on("saveAcct", ()=>{
    const a = S.d.account;
    a.name = document.getElementById("acN").value.trim() || a.name;
    a.slogan = document.getElementById("acS").value.trim();
    a.tags = document.getElementById("acT").value.split(/[，,]/).map(x=>x.trim()).filter(Boolean);
    S.save(); UI.closeSheet(); App.refresh(); UI.toast("已更新");
  });
  UI.on("renameAcct", ()=>{
    UI.sheet("换个账号名", NAME_POOL.map((p,i)=>`
      <button class="card tight" style="width:100%;text-align:left;margin-bottom:10px" data-act="useName" data-i="${i}">
        <h4 style="margin:0;font-size:16px;font-weight:660">${esc(p.n)}</h4>
        <p style="margin:5px 0 0;font-size:12px;color:var(--ink-2);line-height:1.7">${esc(p.s)}</p>
        <div style="display:flex;gap:5px;margin-top:8px;flex-wrap:wrap">${p.tags.map(t=>
          `<span class="pill" style="background:var(--card-2);color:var(--ink-3)">#${esc(t)}</span>`).join("")}</div>
      </button>`).join("") + `<div class="scene-tip">起名三原则：好念、好记、能长出系列感。名字里带「浅浅」，是为了让内容和人绑定。</div>`);
  });
  UI.on("useName", el=>{
    const p = NAME_POOL[Number(el.dataset.i)];
    Object.assign(S.d.account, { name:p.n, slogan:p.s, tags:p.tags });
    S.save(); UI.closeSheet(); App.refresh(); UI.toast("账号名已更新");
  });
  UI.on("mStep", el=>{
    const i = Number(el.dataset.i);
    if(S.d.mediaDone.includes(i)){ S.d.mediaDone = S.d.mediaDone.filter(x=>x!==i); S.save(); }
    else { S.d.mediaDone.push(i); S.save(); S.addCoin(40,"完成起号阶段"); }
    App.refresh();
  });
  UI.on("addPost", ()=>{
    const t = document.getElementById("pTitle").value.trim();
    if(!t) return UI.toast("写个标题吧");
    S.d.posts.push({ t, plat:document.getElementById("pPlat").value, date:S.today(), data:null });
    S.save(); S.addCoin(30,"发布内容"); App.refresh();
  });
  UI.on("postData", el=>{
    const i = Number(el.dataset.i), p = S.d.posts[i], dt = p.data||{};
    UI.sheet(p.t, `
      <div class="grid2">
        <div class="fld"><label>曝光</label><input class="inp" id="d0" type="number" value="${dt.v||""}" /></div>
        <div class="fld"><label>点赞</label><input class="inp" id="d1" type="number" value="${dt.l||""}" /></div>
        <div class="fld"><label>收藏</label><input class="inp" id="d2" type="number" value="${dt.c||""}" /></div>
        <div class="fld"><label>评论</label><input class="inp" id="d3" type="number" value="${dt.m||""}" /></div>
      </div>
      <div class="scene-tip">完播低 → 改前 3 秒；收藏低 → 加干货密度；评论低 → 结尾加提问。</div>
      <button class="btn block" data-act="savePostData" data-i="${i}" style="margin-top:12px">保存数据</button>`);
  });
  UI.on("savePostData", el=>{
    const i = Number(el.dataset.i);
    S.d.posts[i].data = { v:document.getElementById("d0").value, l:document.getElementById("d1").value,
      c:document.getElementById("d2").value, m:document.getElementById("d3").value };
    S.save(); UI.closeSheet(); UI.toast("数据已记录");
  });
  UI.on("refreshHot", async ()=>{ dailyData=null; UI.toast("正在获取…"); await afterRender(); UI.toast("已更新"); });
  UI.on("reIdea", ()=>{ S.d.seedOffset++; S.save(); document.getElementById("ideaBox").innerHTML = ideas(); });
  UI.on("readTip", ()=>{
    if(S.d.tipRead[S.today()]) return UI.toast("今天已学过啦");
    S.d.tipRead[S.today()] = true; S.save(); S.addCoin(15,"剪辑技巧"); App.refresh();
  });
  UI.on("allTips", ()=>{
    UI.sheet("全部剪辑技巧（"+DB.editTips.length+"）", DB.editTips.map(x=>`
      <div class="card tight" style="margin-bottom:10px">
        <h4 style="margin:0 0 5px;font-size:14.5px">${esc(x.t)}</h4>
        <p style="margin:0;font-size:12.5px;line-height:1.75;color:var(--ink-2)">${esc(x.d)}</p>
        <ol style="margin:8px 0 0;padding-left:16px;font-size:12px;line-height:1.8;color:var(--ink-3)">
          ${x.steps.map(s=>`<li>${esc(s)}</li>`).join("")}</ol></div>`).join(""));
  });
  UI.on("saveScript", ()=>{
    const t = document.getElementById("scT").value.trim();
    if(!t) return UI.toast("填一下拆解的视频");
    const rows = DB.scriptFrame.map((f,i)=>({ p:f.p, v:document.getElementById("sc"+i).value.trim() }));
    S.d.scripts.push({ t, date:S.today(), rows, take:document.getElementById("scTake").value.trim() });
    S.save(); S.addCoin(25,"脚本拆解"); App.refresh();
  });
  UI.on("openScript", el=>{
    const s = S.d.scripts[Number(el.dataset.i)];
    UI.sheet(s.t, s.rows.map(r=>`<div class="lesson">
      <div class="lesson-n" style="background:var(--mist-s);color:var(--mist);width:auto;padding:0 7px;border-radius:8px;font-size:10px">${esc(r.p)}</div>
      <div class="lesson-b"><p style="margin:0">${esc(r.v||"（未填写）")}</p></div></div>`).join("")
      + `<div class="scene-tip">✍️ 我能抄走的：${esc(s.take||"未填写")}</div>`);
  });
  UI.on("saveEditNote", ()=>{
    const title = document.getElementById("etTitle").value.trim();
    const note = document.getElementById("etNote").value.trim();
    if(!title && !note) return UI.toast("写点什么再保存吧");
    S.d.editNotes.push({ id:Date.now()+"", date:S.today(), title, note });
    S.save(); S.addCoin(15,"剪辑笔记"); App.refresh();
  });
  UI.on("openEditNote", el=>{
    const s = S.d.editNotes[Number(el.dataset.i)];
    UI.sheet(esc(s.title||"无标题"), `
      <div class="tiny" style="margin-bottom:10px;color:var(--ink-3)">📅 ${esc(s.date)}</div>
      <div class="card tight" style="white-space:pre-wrap;line-height:1.8;font-size:13.5px;color:var(--ink-2)">${esc(s.note||"（没有正文）")}</div>
      <button class="btn block soft" data-act="delEditNote" data-i="${el.dataset.i}" style="margin-top:14px">🗑 删除这条笔记</button>`);
  });
  UI.on("delEditNote", el=>{
    const i = Number(el.dataset.i);
    UI.sheet("删除这条剪辑笔记？", `
      <p style="margin:0 0 16px;color:var(--ink-2);font-size:13.5px">删除后无法恢复，确定要删掉吗？</p>
      <div style="display:flex;gap:10px">
        <button class="btn ghost" data-act="closeSheet" style="flex:1">再想想</button>
        <button class="btn" data-act="doDelEditNote" data-i="${i}" style="flex:1;background:#C0736F;border-color:#C0736F;color:#fff">确认删除</button>
      </div>`);
  });
  UI.on("doDelEditNote", el=>{
    const i = Number(el.dataset.i);
    S.d.editNotes.splice(i,1); S.save(); UI.closeSheet(); App.refresh(); UI.toast("已删除");
  });

  return { render, afterRender };
})();
