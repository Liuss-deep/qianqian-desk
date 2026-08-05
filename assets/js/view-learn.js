/* ============ 学习页：阅读 + 雅思 ============ */
window.ViewLearn = (function () {
  const { esc } = UI;
  let tab = "read";
  let wordIdx = 0, flipped = false, showAns = false;
  let podFetchedOnce = false;

  function render(){
    return `
    <div class="page-hero">
      <div class="date">LEARNING</div>
      <h2>每日阅读 & 雅思</h2>
      <p>输入决定输出。每天读一点、背一点、听一点，考试和内容都会有回报。</p>
    </div>
    <div class="chips">
      ${[["read","📚 每日阅读"],["scene","💬 情景练习"],["word","🔤 单词记忆"],["listen","🎬 影视精听"],["podcast","🎧 播客"]].map(c=>
        `<button class="chip ${tab===c[0]?"on":""}" data-act="lTab" data-t="${c[0]}">${c[1]}</button>`).join("")}
    </div>
    ${tab==="read"?read():tab==="scene"?scene():tab==="word"?word():tab==="listen"?listen():podcast()}
    ${phraseLibCard()}`;
  }

  /* ---------- 每日阅读 ---------- */
  function read(){
    const today = S.pick(DB.books, 3);
    const rec = S.pickMany(DB.books, 6, 11).filter(b=>b.t!==today.t).slice(0,5);
    const log = S.d.bookLog[S.today()];
    const total = Object.keys(S.d.bookLog).length;
    const pages = Object.values(S.d.bookLog).reduce((s,x)=>s+Number(x.pages||0),0);

    return `
    <div class="card" style="background:linear-gradient(135deg,#E9EEE9,#F2ECE5);border:1px solid var(--line-2)">
      <div class="tiny" style="letter-spacing:1.6px;font-weight:700;color:var(--sage)">今日推荐 · ${esc(today.tag)}</div>
      <div style="display:flex;gap:14px;margin-top:11px">
        <div class="book-c" style="background:${today.c};width:62px;height:84px;font-size:11px">${esc(today.t.slice(0,7))}</div>
        <div style="flex:1;min-width:0">
          <h3 style="margin:0;font-size:17px;font-weight:670">${esc(today.t)}</h3>
          <div class="au" style="font-size:11.5px;color:var(--ink-3);margin:4px 0 7px">${esc(today.a)} · 约 ${today.min} 分钟/章</div>
          <p style="margin:0;font-size:12.5px;line-height:1.75;color:var(--ink-2)">${esc(today.d)}</p>
        </div>
      </div>
      <div class="book-links" style="margin-top:12px">
        <a class="lk" href="${UI.weread(today.t)}" target="_blank" rel="noopener">📖 微信读书</a>
        <a class="lk" href="${UI.douban(today.t)}" target="_blank" rel="noopener">🔖 豆瓣</a>
        <a class="lk" href="${UI.jd(today.t)}" target="_blank" rel="noopener">🛒 购买</a>
        <button class="lk" data-act="wantRead" data-t="${esc(today.t)}">＋ 想读</button>
      </div>
    </div>

    <div class="card">
      <div class="sec-head"><h2><span class="dot" style="background:var(--clay)"></span>今日读书打卡</h2>
        <span class="more">累计 ${total} 天 · ${pages} 页</span></div>
      ${log ? `<div class="scene-tip" style="background:var(--sage-s);color:#5F7563">
          今天已打卡：《${esc(log.title)}》${log.pages} 页<br>${esc(log.note||"")}</div>`
        : `<div class="fld"><label>书名</label><input class="inp" id="bkT" placeholder="正在读的书" value="${esc(today.t)}" /></div>
          <div class="fld"><label>读了多少页</label><input class="inp" id="bkP" type="number" placeholder="例如 25" /></div>
          <div class="fld"><label>一句话摘录 / 感想</label><textarea class="inp" id="bkN" placeholder="打动你的一句话就够了"></textarea></div>
          <button class="btn block" data-act="logBook">完成打卡 · +15 积分</button>`}
    </div>

    <div class="card">
      <div class="sec-head"><h2><span class="dot" style="background:var(--mist)"></span>本期热销 & 高分书单</h2>
        <span class="more" data-act="allBooks">全部 ${DB.books.length} 本 ›</span></div>
      ${rec.map(b=>bookRow(b)).join("")}
    </div>

    ${S.d.bookShelf.length ? `<div class="card">
      <div class="sec-head"><h2><span class="dot" style="background:var(--sand)"></span>我的想读清单</h2></div>
      ${S.d.bookShelf.map(t=>`<div class="kv"><span>${esc(t)}</span>
        <span><a class="lk" href="${UI.weread(t)}" target="_blank" rel="noopener">去读</a>
        <button class="todo-x" data-act="delShelf" data-t="${esc(t)}">✕</button></span></div>`).join("")}
    </div>` : ""}`;
  }

  function bookRow(b){
    return `<div class="book">
      <div class="book-c" style="background:${b.c}">${esc(b.t.slice(0,6))}</div>
      <div class="book-b">
        <h5>${esc(b.t)}</h5>
        <div class="au">${esc(b.a)} · ${esc(b.tag)}</div>
        <div class="de">${esc(b.d)}</div>
        <div class="book-links">
          <a class="lk" href="${UI.weread(b.t)}" target="_blank" rel="noopener">微信读书</a>
          <a class="lk" href="${UI.douban(b.t)}" target="_blank" rel="noopener">豆瓣</a>
          <button class="lk" data-act="wantRead" data-t="${esc(b.t)}">＋ 想读</button>
        </div>
      </div></div>`;
  }

  /* ---------- 情景练习 ---------- */
  function scene(){
    const idx = S.pickIdx(DB.ieltsScenes.length, 4);
    const sc = DB.ieltsScenes[idx];
    const done = (S.d.sceneDone[S.today()]||[]).includes(idx);
    return `
    <div class="card">
      <div class="sec-head"><h2><span class="dot" style="background:var(--mist)"></span>今日场景</h2>
        <span class="more" data-act="allScene">切换场景 ›</span></div>
      <div class="movie-hd" style="background:linear-gradient(135deg,#E4EBF0,#EFEAE4)">
        <h4>${esc(sc.s)}</h4>
        <p>跟读 3 遍 → 遮住中文复述 → 录音对比</p>
      </div>
      ${sc.lines.map(l=>`<div class="dlg">
        <div class="who">${esc(l.w)}</div>
        <div class="en">${esc(l.en)}</div>
        <div class="cn">${esc(l.cn)}</div></div>`).join("")}
      <div class="scene-tip">💡 ${esc(sc.tip)}</div>
      <div style="margin-top:12px">
        <div class="tiny" style="font-weight:700;margin-bottom:7px">本场景高分表达</div>
        <div style="display:flex;gap:6px;flex-wrap:wrap">
          ${sc.words.map(w=>`<span class="pill" style="background:var(--mist-s);color:#5B6C78">${esc(w)}</span>`).join("")}
        </div>
      </div>
      <button class="btn block ${done?"soft":""}" data-act="doneScene" data-i="${idx}" style="margin-top:14px">
        ${done?"今日已练习 ✓":"完成练习 · +20 积分"}</button>
    </div>

    <div class="card">
      <div class="sec-head"><h2><span class="dot" style="background:var(--lilac)"></span>全部场景库</h2></div>
      ${DB.ieltsScenes.map((x,i)=>`<div class="kv">
        <span>${esc(x.s)}</span>
        <button class="lk" data-act="openScene" data-i="${i}">查看</button></div>`).join("")}
    </div>`;
  }

  /* ---------- 单词记忆 ---------- */
  function word(){
    const list = S.pickMany(DB.ieltsWords, 10, 6);
    if(wordIdx >= list.length) wordIdx = 0;
    const w = list[wordIdx];
    const box = S.d.wordBox[w.w] || { lvl:0 };
    const learned = Object.values(S.d.wordBox).filter(x=>x.lvl>=2).length;

    return `
    <div class="card">
      <div class="sec-head"><h2><span class="dot" style="background:var(--sage)"></span>今日词卡</h2>
        <span class="more">${wordIdx+1} / ${list.length} · 已掌握 ${learned}</span></div>
      <div class="bar" style="margin-bottom:14px"><i style="width:${(wordIdx)/list.length*100}%"></i></div>
      <div class="flash" data-act="flip">
        ${!flipped ? `<div class="w">${esc(w.w)}</div><div class="ph">${esc(w.p)}</div>
            <div class="hint">轻点卡片查看释义</div>`
          : `<div class="w" style="font-size:23px">${esc(w.w)}</div>
             <div class="mean">${esc(w.m)}</div>
             <div class="ex">${esc(w.e)}</div>
             <div class="ph">${esc(w.ec)}</div>`}
      </div>
      <div class="grid3" style="margin-top:13px">
        <button class="btn ghost sm" data-act="wRate" data-v="0">不认识</button>
        <button class="btn soft sm" data-act="wRate" data-v="1">模糊</button>
        <button class="btn sm" data-act="wRate" data-v="2">认识</button>
      </div>
      <div class="tiny" style="text-align:center;margin-top:10px">熟练度：${["未学","眼熟","掌握","牢记"][Math.min(box.lvl,3)]}</div>
    </div>

    <div class="card">
      <div class="sec-head"><h2><span class="dot" style="background:var(--sand)"></span>今日词表</h2>
        <span class="more">共 ${DB.ieltsWords.length} 词</span></div>
      ${list.map((x,i)=>{
        const b = S.d.wordBox[x.w]||{lvl:0};
        const c = ["#C4BDB4","#C9A06A","#8FA98E","#7F9E86"][Math.min(b.lvl,3)];
        return `<div class="kv" style="${i===wordIdx?"background:var(--card-2);border-radius:9px;padding:9px 8px":""}">
          <span><b>${esc(x.w)}</b> <span class="tiny">${esc(x.m)}</span></span>
          <span class="pill" style="background:${c}22;color:${c}">${["新","眼熟","掌握","牢记"][Math.min(b.lvl,3)]}</span></div>`;
      }).join("")}
    </div>`;
  }

  /* ---------- 影视精听 ---------- */
  function listen(){
    const idx = S.pickIdx(DB.listening.length, 8);
    const l = DB.listening[idx];
    const done = S.d.listenDone.includes(idx);
    let txt = esc(l.text);
    if(showAns){
      let k = 0;
      txt = txt.replace(/___/g, () => `<span class="blank">${esc(l.ans[k++]||"")}</span>`);
    } else {
      txt = txt.replace(/___/g, '<span class="blank">&nbsp;&nbsp;&nbsp;</span>');
    }
    return `
    <div class="card">
      <div class="movie-hd">
        <h4>🎬 ${esc(l.film)}</h4>
        <p>${esc(l.scene)} · 难度 ${esc(l.lvl)}</p>
      </div>
      <div class="tiny" style="font-weight:700;margin-bottom:8px">听写填空</div>
      <div style="font-size:15px;line-height:2.1;padding:14px;background:var(--card-2);border-radius:14px">${txt}</div>
      <div style="display:flex;gap:8px;margin-top:12px">
        <button class="btn ghost" data-act="toggleAns" style="flex:1">${showAns?"隐藏答案":"显示答案"}</button>
        <button class="btn ${done?"soft":""}" data-act="doneListen" data-i="${idx}" style="flex:1">${done?"已完成 ✓":"完成 · +20"}</button>
      </div>
      ${showAns?`<div style="margin-top:12px;padding:13px;background:var(--sage-s);border-radius:13px;font-size:13px;line-height:1.8;color:#5F7563">
        <b>完整台词</b><br>${esc(l.full)}</div>`:""}
      <div class="scene-tip">💡 ${esc(l.note)}</div>
    </div>

    <div class="card">
      <div class="sec-head"><h2><span class="dot" style="background:var(--clay)"></span>精听方法（每次 15 分钟）</h2></div>
      ${[["1","盲听 2 遍","不看文本，抓大意，能听懂多少算多少"],
         ["2","逐句听写","一句一停，反复听到写不出为止"],
         ["3","对照原文","标记听错的地方，分析是连读、弱读还是生词"],
         ["4","跟读 3 遍","模仿语调和节奏，这一步决定口语提升"],
         ["5","复述","合上文本，用自己的话说一遍情节"]].map(x=>
        `<div class="lesson"><div class="lesson-n">${x[0]}</div>
        <div class="lesson-b"><h5>${x[1]}</h5><p>${x[2]}</p></div></div>`).join("")}
    </div>

    <div class="card">
      <div class="sec-head"><h2><span class="dot" style="background:var(--lilac)"></span>精听片段库</h2>
        <span class="more">${S.d.listenDone.length}/${DB.listening.length} 已完成</span></div>
      ${DB.listening.map((x,i)=>`<div class="kv">
        <span>${esc(x.film)} <span class="tiny">· ${esc(x.lvl)}</span></span>
        <span>${S.d.listenDone.includes(i)?'<span class="pill" style="background:var(--sage-s);color:var(--sage)">已练</span>':
          `<button class="lk" data-act="openListen" data-i="${i}">练习</button>`}</span></div>`).join("")}
    </div>`;
  }

  /* ---------- 播客 ---------- */
  function podcast(){
    const pc = S.d.podcastCache;
    const picks = (pc && pc.items && pc.items.length) ? pc.items : DB.fallbackPodcasts.items;
    const theme = (pc && pc.theme) || DB.fallbackPodcasts.theme;
    const date = pc && pc.date ? pc.date : "";
    const heard = S.d.podHeard || [];
    const want = S.d.podWant || [];
    const lib = S.pickMany(DB.podcasts, 6, 3);

    return `
    <div class="card" style="background:linear-gradient(135deg,#EFE7F0,#F2ECE5);border:1px solid var(--line-2)">
      <div class="tiny" style="letter-spacing:1.6px;font-weight:700;color:var(--lilac)">🎧 今日精选播客 · 09:00 推送</div>
      <div style="font-size:15px;font-weight:670;margin-top:8px">${esc(theme)}</div>
      ${date?`<div class="tiny" style="margin-top:4px">📅 ${esc(date)} 推送</div>`:""}
    </div>

    ${picks.map(p=>{
      const isHeard = heard.includes(p.t);
      return `<div class="card">
        <div style="display:flex;gap:10px;align-items:flex-start">
          <div style="width:44px;height:44px;border-radius:12px;background:var(--lilac-s);display:flex;align-items:center;justify-content:center;font-size:22px;flex:0 0 auto">🎙️</div>
          <div style="flex:1;min-width:0">
            <h3 style="margin:0;font-size:15.5px;font-weight:670">${esc(p.t)}</h3>
            <div class="au" style="font-size:11px;color:var(--ink-3)">${esc(p.host||"")} · ${esc(p.where||"小宇宙")}</div>
            <span class="pill" style="background:var(--lilac-s);color:var(--lilac);margin-top:5px;display:inline-block">${esc(p.tag||"")}</span>
          </div>
        </div>
        <p style="margin:10px 0 0;font-size:12.5px;line-height:1.75;color:var(--ink-2)">${esc(p.d||"")}</p>
        ${p.why?`<div class="scene-tip" style="margin-top:9px;background:var(--lilac-s);color:#7A6B86">💡 为什么今天听它：${esc(p.why)}</div>`:""}
        <div style="display:flex;gap:8px;margin-top:11px">
          <button class="btn ${isHeard?"soft":""}" data-act="hearPod" data-t="${esc(p.t)}" style="flex:1">${isHeard?"已听完 ✓":"我听完了 · +10"}</button>
          <button class="lk" data-act="wantPod" data-t="${esc(p.t)}">${want.includes(p.t)?"✓ 已收藏":"＋ 想听"}</button>
        </div>
      </div>`;
    }).join("")}

    <div class="card">
      <div class="sec-head"><h2><span class="dot" style="background:var(--sage)"></span>节目库 · 随便翻翻</h2>
        <span class="more" data-act="allPods">全部 ${DB.podcasts.length} 档 ›</span></div>
      ${lib.map(podRow).join("")}
    </div>

    <div class="scene-tip">🎧 听播客的平台：小宇宙（中文最全）、苹果播客、喜马拉雅、Spotify、网易云音乐都支持订阅。通勤 / 运动 / 做家务时听，最不费精力。</div>

    ${want.length?`<div class="card">
      <div class="sec-head"><h2><span class="dot" style="background:var(--sand)"></span>我的想听清单</h2></div>
      ${want.map(t=>`<div class="kv"><span>${esc(t)}</span>
        <button class="todo-x" data-act="delWantPod" data-t="${esc(t)}">✕</button></div>`).join("")}
    </div>`:""}`;
  }

  function podRow(p){
    const want = S.d.podWant||[];
    return `<div class="kv">
      <div style="min-width:0;flex:1">
        <b>${esc(p.t)}</b> <span class="tiny">· ${esc(p.tag||"")}</span>
        <div class="au" style="font-size:11px">${esc(p.host||"")}</div>
      </div>
      <span><button class="lk" data-act="wantPod" data-t="${esc(p.t)}">${want.includes(p.t)?"已收藏":"＋ 想听"}</button></span>
    </div>`;
  }

  /* ---------- 词库入口（每日一句已搬到「今日」页，这里只做浏览） ---------- */
  function phraseLibCard(){
    const list = DB.phraseLibrary || [];
    const seen = S.d.wordSeen || [];
    const sample = list.slice(0, 4);
    return `
    <div class="card">
      <div class="sec-head">
        <h2><span class="dot" style="background:var(--clay)"></span>词库 · 短句 & 小词</h2>
        <span class="more" data-act="allPhrases">全部 ${list.length} 条 ›</span>
      </div>
      <p class="tiny" style="line-height:1.8;margin:0 0 10px">每天 12:30 自动推送一条。「每日一句」已搬到「今日」页打开就能看到。这里是全部收录：跨文化的小词和短句，慢慢翻，慢慢记。</p>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">
        ${sample.map(p=>`<div style="background:var(--card-2);border-radius:11px;padding:10px 11px">
          <div style="font-weight:670;font-size:13px">${esc(p.type==="quote"?(p.q||"").slice(0,18)+( (p.q||"").length>18?"…":"" ):p.w)}</div>
          <div class="tiny" style="margin-top:3px;color:var(--ink-3)">${esc(p.type==="quote"?"中文短句":p.lang)} · ${esc(p.tag||"")}</div>
        </div>`).join("")}
      </div>
    </div>`;
  }

  /* ---------- 事件 ---------- */
  UI.on("lTab", el=>{ tab = el.dataset.t; flipped=false; showAns=false; App.refresh(); });
  UI.on("wantRead", el=>{
    const t = el.dataset.t;
    if(S.d.bookShelf.includes(t)) return UI.toast("已在清单里");
    S.d.bookShelf.push(t); S.save(); UI.toast("已加入想读清单"); App.refresh();
  });
  UI.on("delShelf", el=>{ S.d.bookShelf = S.d.bookShelf.filter(x=>x!==el.dataset.t); S.save(); App.refresh(); });
  UI.on("logBook", ()=>{
    const t = document.getElementById("bkT").value.trim();
    const p = document.getElementById("bkP").value;
    if(!t) return UI.toast("填一下书名");
    S.d.bookLog[S.today()] = { title:t, pages:Number(p||0), note:document.getElementById("bkN").value.trim() };
    S.save(); S.addCoin(15,"读书打卡"); App.refresh();
  });
  UI.on("allBooks", ()=>{
    UI.sheet("全部书单（"+DB.books.length+" 本）", DB.books.map(bookRow).join(""));
  });
  UI.on("doneScene", el=>{
    const t=S.today(); const a = S.d.sceneDone[t] = S.d.sceneDone[t]||[];
    const i = Number(el.dataset.i);
    if(a.includes(i)) return UI.toast("今天已练习过");
    a.push(i); S.save(); S.addCoin(20,"情景练习"); App.refresh();
  });
  UI.on("openScene", el=>{
    const sc = DB.ieltsScenes[Number(el.dataset.i)];
    UI.sheet(sc.s, sc.lines.map(l=>`<div class="dlg"><div class="who">${esc(l.w)}</div>
      <div class="en">${esc(l.en)}</div><div class="cn">${esc(l.cn)}</div></div>`).join("")
      + `<div class="scene-tip">💡 ${esc(sc.tip)}</div>
         <div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:12px">
         ${sc.words.map(w=>`<span class="pill" style="background:var(--mist-s);color:#5B6C78">${esc(w)}</span>`).join("")}</div>`);
  });
  UI.on("allScene", ()=>{ S.d.seedOffset++; S.save(); UI.toast("换一个场景"); App.refresh(); });
  UI.on("flip", ()=>{ flipped = !flipped; App.refresh(); });
  UI.on("wRate", el=>{
    const list = S.pickMany(DB.ieltsWords, 10, 6);
    const w = list[wordIdx];
    const v = Number(el.dataset.v);
    const box = S.d.wordBox[w.w] = S.d.wordBox[w.w] || { lvl:0 };
    box.lvl = v===0 ? 0 : Math.min(3, (box.lvl||0) + (v===2?2:1));
    box.last = S.today(); S.save();
    flipped = false;
    if(wordIdx < list.length-1){ wordIdx++; }
    else { wordIdx = 0; S.addCoin(25,"完成今日词卡"); UI.toast("🎉 今日 10 词全部过完！"); }
    App.refresh();
  });
  UI.on("toggleAns", ()=>{ showAns = !showAns; App.refresh(); });
  UI.on("doneListen", el=>{
    const i = Number(el.dataset.i);
    if(S.d.listenDone.includes(i)) return UI.toast("已完成过啦");
    S.d.listenDone.push(i); S.save(); S.addCoin(20,"影视精听"); App.refresh();
  });
  UI.on("openListen", el=>{
    const l = DB.listening[Number(el.dataset.i)];
    UI.sheet(l.film, `<div class="movie-hd"><h4>${esc(l.scene)}</h4><p>难度 ${esc(l.lvl)}</p></div>
      <div style="font-size:15px;line-height:2;padding:14px;background:var(--card-2);border-radius:14px">${esc(l.text).replace(/___/g,'<span class="blank">&nbsp;&nbsp;</span>')}</div>
      <div style="margin-top:12px;padding:13px;background:var(--sage-s);border-radius:13px;font-size:13px;line-height:1.8;color:#5F7563"><b>答案</b><br>${esc(l.full)}</div>
      <div class="scene-tip">💡 ${esc(l.note)}</div>`);
  });

  UI.on("hearPod", el=>{
    const t = el.dataset.t;
    if((S.d.podHeard||[]).includes(t)) return UI.toast("今天已经记过啦");
    S.d.podHeard = S.d.podHeard || [];
    S.d.podHeard.push(t); S.save(); S.addCoin(10,"听播客"); App.refresh();
  });
  UI.on("wantPod", el=>{
    const t = el.dataset.t;
    S.d.podWant = S.d.podWant || [];
    if(S.d.podWant.includes(t)){ S.d.podWant = S.d.podWant.filter(x=>x!==t); UI.toast("已取消收藏"); }
    else { S.d.podWant.push(t); S.save(); UI.toast("已加入想听清单"); }
    App.refresh();
  });
  UI.on("delWantPod", el=>{ S.d.podWant = (S.d.podWant||[]).filter(x=>x!==el.dataset.t); S.save(); App.refresh(); });
  UI.on("allPods", ()=>{
    UI.sheet("节目库（"+DB.podcasts.length+" 档）", DB.podcasts.map(p=>`
      <div class="kv"><div style="min-width:0;flex:1">
        <b>${esc(p.t)}</b> <span class="tiny">· ${esc(p.tag||"")}</span>
        <div class="au" style="font-size:11px">${esc(p.host||"")} · ${esc(p.where||"")}</div>
        <div class="de" style="font-size:11.5px;margin-top:2px">${esc(p.d||"")}</div>
      </div><span><button class="lk" data-act="wantPod" data-t="${esc(p.t)}">${(S.d.podWant||[]).includes(p.t)?"已收藏":"＋ 想听"}</button></span></div>`).join(""));
  });
  UI.on("refreshPod", async ()=>{ podFetchedOnce=false; UI.toast("获取中…"); await S.fetchDaily(); App.refresh(); });

  /* 词库浏览（学习页底部入口） */
  UI.on("allPhrases", ()=>{
    const seen = S.d.wordSeen || [];
    const list = DB.phraseLibrary || [];
    UI.sheet("词库（"+list.length+" 条）", list.map(p=>{
      const key = p.type === "quote" ? (p.q || "") : p.w;
      const isSeen = p.type !== "quote" && seen.includes(p.w);
      const head = p.type === "quote"
        ? `<b style="font-size:13.5px;line-height:1.5">${esc(p.q)}</b>
           ${p.src?`<div class="tiny" style="color:var(--ink-3);margin-top:2px">— ${esc(p.src)}</div>`:""}
           <div style="font-size:12.5px;line-height:1.7;margin-top:6px;color:var(--ink-2)">${esc(p.line)}</div>`
        : `<div style="display:flex;align-items:center;gap:7px;flex-wrap:wrap">
             <b style="font-size:14.5px">${esc(p.w)}</b>
             <span class="pill" style="background:var(--clay-s);color:var(--clay);font-size:10.5px">${esc(p.lang)}</span>
             <span class="tiny" style="color:var(--ink-3)">${esc(p.tag)}</span>
             ${isSeen?'<span class="pill" style="background:var(--sage-s);color:var(--sage);font-size:10.5px">已记</span>':""}
           </div>
           <div class="tiny" style="margin-top:3px">${esc(p.p)}</div>
           <div style="font-size:12.5px;line-height:1.7;margin-top:5px;color:var(--ink-2)">${esc(p.line)}</div>`;
      return `<div class="kv" style="align-items:flex-start;padding:9px 0">${head}</div>`;
    }).join(""));
  });

  async function afterRender(){
    // 进入播客页时拉取当日 09:00 推送
    if(tab === "podcast"){
      if(!podFetchedOnce){
        podFetchedOnce = true;
        await S.fetchDaily();
        App.refresh();
      }
      return;
    }
    // 离开播客时重置标记，下次进入重新拉取
    podFetchedOnce = false;
  }

  return { render, afterRender };
})();
