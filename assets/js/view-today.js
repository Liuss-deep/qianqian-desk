/* ============ 今日页 ============ */
window.ViewToday = (function () {
  const { esc, ring } = UI;
  let dailyData = null;

  const WEEK = ["周日","周一","周二","周三","周四","周五","周六"];

  /* 每日一句类型元数据：标题 + 主题色，让每天看起来都不一样 */
  const WORD_META = {
    "en-quote":  { tag:"🌟 每日名句",    color:"#C9A27E" },
    "zh-quote":  { tag:"📜 中文名言",    color:"#A3B4C2" },
    "trivia":    { tag:"❄️ 冷知识",      color:"#9FB3A4" },
    "challenge": { tag:"🎯 今日小挑战",  color:"#C0736F" },
    "question":  { tag:"💭 今日一问",     color:"#C79AA0" },
    "proverb":   { tag:"🪞 一句话箴言",  color:"#CBB999" }
  };
  const MOODS = ["😌","🥰","😐","😮‍💨","🥲"];
  const MOOD_TXT = ["平静","满足","普通","疲惫","低落"];
  function dateStr(dt){
    return dt.getFullYear()+"-"+String(dt.getMonth()+1).padStart(2,"0")+"-"+String(dt.getDate()).padStart(2,"0");
  }
  function pastDays(n){
    const out=[]; const now=new Date();
    for(let i=0;i<n;i++){ const dt=new Date(now); dt.setDate(now.getDate()-i); out.push(dateStr(dt)); }
    return out;
  }
  function savedReviews(){ return Object.keys(S.d.review).filter(k=>S.d.review[k]&&S.d.review[k].saved); }

  function render(){
    const t = S.today();
    const list = S.todos(t);
    const doneN = list.filter(x=>x.done).length;
    const pct = list.length ? doneN/list.length*100 : 0;
    const q = S.pick(DB.quotes, 1);
    const lv = S.level();
    const rv = S.d.review[t] || {};
    const quests = S.pickMany(DB.quests, 4, 5);
    const qDone = S.d.questDone[t] || [];

    return `
    <div class="hero-card">
      <div class="hero-top">
        <div style="flex:1;min-width:0">
          <div class="hero-date">${S.prettyDate()}</div>
          <h3 class="hero-h">${esc(S.greet())}</h3>
          <p class="hero-quote">${esc(q)}</p>
        </div>
        ${ring(pct, 66, "#8FA98E")}
      </div>
      <div class="hero-stats">
        <div><b>${S.d.streak}</b>连续打卡</div>
        <div><b>${doneN}/${list.length}</b>今日待办</div>
        <div><b>Lv.${lv.lv}</b>${esc(lv.name)}</div>
      </div>
    </div>

    <div class="grid3" style="margin-bottom:14px">
      ${quick("💰","记账","money")}
      ${quick("📖","阅读","learn")}
      ${quick("🍳","今日菜","life")}
    </div>

    <!-- 待办 -->
    <div class="card">
      <div class="sec-head">
        <h2><span class="dot" style="background:var(--sage)"></span>今日待办</h2>
        <span class="more">${doneN} / ${list.length} 已完成</span>
      </div>
      <div id="todoList">${list.length ? list.map(todoRow).join("") :
        `<div class="empty"><span class="em">🌿</span>还没有安排，写下今天最想做的三件事</div>`}</div>
      <div class="add-row">
        <input class="inp" id="todoInp" placeholder="添加一件今天要做的事…" />
        <button class="btn" data-act="addTodo">添加</button>
      </div>
      <div style="display:flex;gap:6px;margin-top:9px;flex-wrap:wrap">
        ${["读书 20 分钟","背 20 个雅思单词","记账","运动 20 分钟","剪一条视频"].map(s=>
          `<button class="lk" data-act="quickTodo" data-t="${esc(s)}">+ ${esc(s)}</button>`).join("")}
      </div>
    </div>

    <!-- 地球 Online 迷你 -->
    <div class="card">
      <div class="sec-head">
        <h2><span class="dot" style="background:var(--olive)"></span>地球 Online · 今日任务</h2>
        <span class="more" data-act="go" data-tab="life">全部 ›</span>
      </div>
      ${quests.slice(0,3).map(qq=>{
        const done = qDone.includes(qq.t);
        return `<div class="quest ${done?"done":""}">
          <div class="q-e">${qq.e}</div>
          <div class="q-b"><h5>${esc(qq.t)}</h5><p>${esc(qq.d)} · +${qq.p} 积分</p></div>
          <button class="q-go ${done?"done":""}" data-act="quest" data-q="${esc(qq.t)}" data-p="${qq.p}">${done?"已完成":"完成"}</button>
        </div>`;
      }).join("")}
    </div>

    <!-- 每日一句 -->
    <div class="card">
      <div class="sec-head">
        <h2><span class="dot" style="background:#C9A27E"></span>每日一句 · 08:30 更新</h2>
      </div>
      <div id="phraseBox"><div class="empty">正在读取今日一句…</div></div>
    </div>

    <!-- 每日新闻 -->
    <div class="card">
      <div class="sec-head">
        <h2><span class="dot" style="background:var(--mist)"></span>每日新闻 · 08:30 推送</h2>
        <span class="more" data-act="refreshNews">刷新</span>
      </div>
      <div id="newsBox"><div class="empty">正在读取今日推送…</div></div>
    </div>

    <!-- 每日复盘 -->
    <div class="card">
      <div class="sec-head">
        <h2><span class="dot" style="background:var(--clay)"></span>每日复盘</h2>
        <span class="more">${rv.saved ? "今天已复盘 ✓" : "睡前 5 分钟"}</span>
      </div>
      <div class="mood-row">
        ${[["😌","平静"],["🥰","满足"],["😐","普通"],["😮‍💨","疲惫"],["🥲","低落"]].map((m,i)=>
          `<button class="mood ${rv.mood===i?"on":""}" data-act="mood" data-i="${i}">
            <span class="e">${m[0]}</span><span class="l">${m[1]}</span></button>`).join("")}
      </div>
      <div class="rv-q">
        <h4>✅ 今天做成了什么？</h4>
        <textarea class="inp" id="rvGood" placeholder="哪怕只是按时起床、认真吃了一顿饭…">${esc(rv.good||"")}</textarea>
      </div>
      <div class="rv-q">
        <h4>🌀 哪里可以更好？</h4>
        <textarea class="inp" id="rvBad" placeholder="不用自责，只是观察">${esc(rv.bad||"")}</textarea>
      </div>
      <div class="rv-q">
        <h4>🎯 明天最重要的一件事</h4>
        <textarea class="inp" id="rvNext" placeholder="只写一件，写多了等于没写">${esc(rv.next||"")}</textarea>
      </div>
      <div class="rv-q">
        <h4>⭐️ 给今天打个分</h4>
        <div class="stars" id="stars">${[1,2,3,4,5].map(i=>
          `<span class="star ${(rv.score||0)>=i?"on":""}" data-act="star" data-i="${i}">★</span>`).join("")}</div>
      </div>
      <button class="btn block" data-act="saveReview" style="margin-top:6px">保存今日复盘 · +20 积分</button>
    </div>

    <!-- 最近复盘 -->
    ${recentReviews()}

    <!-- 回顾一下 -->
    ${reviewSummaryCard()}
    `;
  }

  function quick(e,l,tab){
    return `<button class="card tight" style="margin:0;text-align:center;padding:13px 4px" data-act="go" data-tab="${tab}">
      <div style="font-size:21px">${e}</div>
      <div style="font-size:11.5px;font-weight:650;color:var(--ink-2);margin-top:4px">${l}</div></button>`;
  }

  function todoRow(x){
    const priColor = { high:"#C0736F", normal:"#A3B4C2", low:"#C4BDB4" }[x.pri] || "#A3B4C2";
    const priTxt = { high:"重要", normal:"常规", low:"随缘" }[x.pri] || "常规";
    return `<div class="todo ${x.done?"done":""}">
      <div class="tbox ${x.done?"on":""}" data-act="toggleTodo" data-id="${x.id}"></div>
      <div class="todo-body">
        <div class="todo-t">${esc(x.t)}</div>
        <div class="todo-m"><span class="pill" style="background:${priColor}22;color:${priColor}">${priTxt}</span></div>
      </div>
      <button class="todo-x" data-act="delTodo" data-id="${x.id}">✕</button>
    </div>`;
  }

  function recentReviews(){
    const keys = Object.keys(S.d.review).filter(k=>S.d.review[k].saved).sort().reverse().slice(1,6);
    if(!keys.length) return "";
    const emo = ["😌","🥰","😐","😮‍💨","🥲"];
    return `<div class="card">
      <div class="sec-head"><h2><span class="dot" style="background:var(--lilac)"></span>最近复盘</h2>
        <span class="more" data-act="openAllReviews">查看全部 ›</span></div>
      ${keys.map(k=>{
        const r = S.d.review[k];
        return `<div class="news-i">
          <div class="news-n" style="background:var(--lilac-s);color:var(--lilac)">${emo[r.mood]||"·"}</div>
          <div class="news-b"><h5>${k.slice(5)} · ${"★".repeat(r.score||0)}</h5>
          <p>${esc((r.good||"").slice(0,52) || "（未填写）")}</p></div>
        </div>`;
      }).join("")}
    </div>`;
  }

  function reviewSummaryCard(){
    const total = savedReviews().length;
    if(!total) return "";
    const wk = pastDays(7).filter(k=>S.d.review[k]&&S.d.review[k].saved).length;
    const moPrefix = S.today().slice(0,7);
    const mo = savedReviews().filter(k=>k.startsWith(moPrefix)).length;
    return `<div class="card">
      <div class="sec-head"><h2><span class="dot" style="background:var(--sage)"></span>回顾一下</h2>
        <span class="more">已复盘 ${total} 天</span></div>
      <p class="tiny" style="margin:0 0 11px;line-height:1.6;color:var(--ink-3)">本周 ${wk} 天 · 本月 ${mo} 天。回头看看，你一直在往前走。</p>
      <div style="display:flex;gap:10px">
        <button class="btn" data-act="weekReview" style="flex:1">🗓 一周回看</button>
        <button class="btn ghost" data-act="monthReview" style="flex:1">🌙 月末小总结</button>
      </div>
    </div>`;
  }

  function reviewRecapBody(rs){
    const avg = (rs.reduce((a,r)=>a+(r.score||0),0)/rs.length).toFixed(1);
    const moodCount=[0,0,0,0,0]; rs.forEach(r=>{ if(r.mood>=0&&r.mood<5) moodCount[r.mood]++; });
    const topMood = moodCount.indexOf(Math.max.apply(null,moodCount));
    const goods = rs.map(r=>r.good).filter(Boolean).slice(0,3);
    const nexts = rs.map(r=>r.next).filter(Boolean).slice(0,3);
    return `
      <div class="rev-stat">
        <div><b>${rs.length}</b><span>复盘天数</span></div>
        <div><b>${avg}</b><span>平均评分</span></div>
        <div><b>${MOODS[topMood]}</b><span>主心情</span></div>
      </div>
      ${goods.length?`<div class="rv-q"><h4>✅ 这段日子你做成了</h4>${goods.map(g=>`<p class="rv-p">· ${esc(g.slice(0,60))}</p>`).join("")}</div>`:""}
      ${nexts.length?`<div class="rv-q"><h4>🎯 你立过的 flag</h4>${nexts.map(n=>`<p class="rv-p">· ${esc(n.slice(0,60))}</p>`).join("")}</div>`:""}
      <div class="scene-tip">每写下一天的复盘，都是在给未来的自己留一封信。继续呀。</div>`;
  }

  // 复盘完成后的个性化点评 / 鼓励（综合评分、心情、待办完成率、写了什么）
  function buildReviewNote(r, ctx){
    const score = r.score||0, mood = (typeof r.mood==="number"?r.mood:2);
    const good = (r.good||"").trim(), next = (r.next||"").trim();
    const total = ctx.total, doneN = ctx.doneN;
    const rate = total ? Math.round(doneN/total*100) : 0;
    const seed = (S.dayNum()%3);

    let open;
    if(mood===3||mood===4){
      open = [
        "今天辛苦了，允许自己先好好歇一口气。",
        "觉得累或低落的时候，还坐下来复盘，这本身就是一种温柔的勇敢。",
        "疲惫和低落都不是你的错，它们只是提醒你：该抱抱自己了。"
      ];
    } else if(score>=4){
      open = [
        "今天很不错呀，看得出来你是认真在生活的人。",
        "这一天被你过得有模有样，值得给自己鼓个掌。",
        "稳稳的一天，你又把想要的生活往前推了一点点。"
      ];
    } else if(score>=3){
      open = [
        "平平淡淡也是好日子，你把它稳稳接住了。",
        "不算惊艳，但真实又完整，这就够了。",
        "今天没崩，本身就已经是一种胜利。"
      ];
    } else {
      open = [
        "今天有点晃，但你还坐在这里复盘，这已经很了不起。",
        "乱一点没关系，明天是崭新的草稿。",
        "哪怕只做好了一件事，也值得被自己看见。"
      ];
    }
    const o = open[seed];

    let mid;
    if(total===0){
      mid = "今天没列待办也完全 OK，想做的事写下来，明天会轻盈一些。";
    } else if(rate>=80){
      mid = `今天待办完成了 ${rate}%，这份执行力就藏在这些小事里。`;
    } else if(rate>=50){
      mid = `待办完成了 ${rate}%，没做完的别急，它们会等到你的。`;
    } else {
      mid = `待办只完成了 ${rate}%，没关系——能写完这篇复盘，说明你没松开今天。`;
    }

    let goodLine = "";
    if(good){
      const g = good.slice(0,18);
      goodLine = `你写下的「${g}」，这样的小成就是一种底气，记得留住它。`;
    }

    let tail;
    if(next){
      tail = `明天最重要的事你心里已经有了：「${next.slice(0,16)}」。带着它，睡个好觉吧。`;
    } else {
      tail = "如果还没想好明天最重要的事，睡前挑一个最小的，明天会更容易开始。";
    }

    let bonus = "";
    if(ctx.streak>=3) bonus = ` 你已经连续打卡 ${ctx.streak} 天了，这份坚持本身就是光。`;

    return [o, mid, goodLine, tail, bonus].filter(Boolean).join(" ");
  }

  async function afterRender(){
    const box = document.getElementById("newsBox");
    if(!box) return;
    if(!dailyData) dailyData = await S.fetchDaily();
    // 每日一句（类型轮换：名句 / 冷知识 / 小挑战 / 今日一问 / 箴言）
    const pbox = document.getElementById("phraseBox");
    if(pbox){
      const w = dailyData.word || DB.fallbackWord;
      const it = w.item || {};
      const meta = WORD_META[it.type] || WORD_META["en-quote"];
      // 卡片标题随类型变化，让每天都不一样
      const card = pbox.closest(".card");
      if(card){ const hd = card.querySelector(".sec-head h2"); if(hd) hd.innerHTML = `<span class="dot" style="background:${meta.color}"></span>${meta.tag} · 08:30 更新`; }
      let h = "";
      if(w.date) h += `<div class="tiny" style="margin-bottom:8px;color:#8a8a85">📅 ${esc(w.date)} 推送</div>`;
      h += `<div class="tiny" style="margin-bottom:10px;color:${meta.color};font-weight:700;letter-spacing:.3px">${meta.tag}</div>`;
      if(it.text) h += `<div style="font-size:17px;line-height:1.85;font-weight:600;color:#3f3f3b">${esc(it.text)}</div>`;
      if(it.zh && it.type!=="zh-quote") h += `<div style="margin-top:10px;font-size:14px;line-height:1.7;color:#6e6e6a">${esc(it.zh)}</div>`;
      if(it.author) h += `<div style="margin-top:8px;color:${meta.color};font-size:13px">— ${esc(it.author)}</div>`;
      if(it.type==="challenge" && it.tag) h += `<div style="margin-top:10px;display:inline-block;padding:3px 11px;border-radius:20px;background:${meta.color}1a;color:${meta.color};font-size:12px;font-weight:600">#${esc(it.tag)}</div>`;
      if(w.note) h += `<div class="scene-tip" style="margin-top:10px">${esc(w.note)}</div>`;
      pbox.innerHTML = h;
    }
    const n = dailyData.news || DB.fallbackNews;
    const items = n.items || [];
    box.innerHTML = (n.date ? `<div class="tiny" style="margin-bottom:8px">📅 ${esc(n.date)} 推送</div>` : "")
      + items.map((it,i)=>`<div class="news-i">
        <div class="news-n">${i+1}</div>
        <div class="news-b"><h5>${esc(it.t)}</h5><p>${esc(it.d||"")}</p></div>
      </div>`).join("")
      + (n.note ? `<div class="scene-tip" style="margin-top:10px">${esc(n.note)}</div>` : "");

  }


  /* ---------- 事件 ---------- */
  UI.on("addTodo", ()=>{
    const i = document.getElementById("todoInp");
    if(!i.value.trim()) return UI.toast("先写点什么吧");
    S.addTodo(i.value); i.value=""; App.refresh();
  });
  UI.on("quickTodo", el=>{ S.addTodo(el.dataset.t); App.refresh(); });
  UI.on("toggleTodo", el=>{ S.toggleTodo(el.dataset.id); App.refresh(); });
  UI.on("delTodo", el=>{ S.delTodo(el.dataset.id); App.refresh(); });
  UI.on("mood", el=>{
    const t=S.today(); S.d.review[t]=S.d.review[t]||{};
    S.d.review[t].mood = Number(el.dataset.i); S.save();
    document.querySelectorAll(".mood").forEach((m,i)=>m.classList.toggle("on", i===Number(el.dataset.i)));
  });
  UI.on("star", el=>{
    const t=S.today(); S.d.review[t]=S.d.review[t]||{};
    S.d.review[t].score = Number(el.dataset.i); S.save();
    document.querySelectorAll("#stars .star").forEach((s,i)=>s.classList.toggle("on", i < Number(el.dataset.i)));
  });
  UI.on("saveReview", ()=>{
    const t = S.today();
    const r = S.d.review[t] = S.d.review[t] || {};
    r.good = document.getElementById("rvGood").value;
    r.bad  = document.getElementById("rvBad").value;
    r.next = document.getElementById("rvNext").value;
    const first = !r.saved;
    r.saved = true; S.save();
    if(first) S.addCoin(20,"完成复盘");
    if(first && r.next) S.addTodo("【昨日待办】"+r.next, "high");   // 仅首次写入，避免重复生成待办
    App.refresh();
    // 复盘结束 → 生成今日小结（点评 / 鼓励）
    const list = S.todos(t);
    const ctx = { total: list.length, doneN: list.filter(x=>x.done).length, streak: S.d.streak };
    const note = buildReviewNote(r, ctx);
    UI.sheet("今日小结 · 复盘完成", `
      <div class="rev-stat">
        <div><b>${"★".repeat(r.score||0)||"—"}</b><span>今日评分</span></div>
        <div><b>${MOODS[r.mood]||"·"}</b><span>${MOOD_TXT[r.mood]||"—"}</span></div>
        <div><b>${ctx.total?Math.round(ctx.doneN/ctx.total*100)+"%":"—"}</b><span>待办完成</span></div>
      </div>
      <div class="rev-note">${esc(note)}</div>
    `);
  });
  UI.on("refreshNews", async ()=>{ dailyData = null; UI.toast("正在获取…"); await afterRender(); UI.toast("已更新"); });
  UI.on("quest", el=>{
    const t=S.today(); const arr = S.d.questDone[t] = S.d.questDone[t]||[];
    const name = el.dataset.q;
    if(arr.includes(name)) return UI.toast("今天已经完成啦");
    arr.push(name); S.save(); S.addCoin(Number(el.dataset.p), name); App.refresh();
  });


  /* ---------- 复盘归档 / 回顾 ---------- */
  UI.on("openAllReviews", ()=>{
    const keys = savedReviews().sort().reverse();
    if(!keys.length) return UI.toast("还没有复盘记录");
    UI.sheet("复盘归档（"+keys.length+" 天）", keys.map(k=>{
      const r = S.d.review[k];
      const dt = new Date(k+"T00:00:00");
      const wd = WEEK[dt.getDay()];
      return `<div class="rv-row" data-act="rvDetail" data-k="${k}">
        <div class="rv-em">${MOODS[r.mood]||"·"}</div>
        <div class="rv-mid"><b>${k.slice(5)} ${wd}</b><span>${"★".repeat(r.score||0)||"未评分"}</span></div>
        <div class="rv-go">›</div>
      </div>`;
    }).join(""));
  });
  UI.on("rvDetail", el=>{
    const k = el.dataset.k; const r = S.d.review[k]; if(!r) return;
    const row = (h,p)=> p ? `<div class="rv-q"><h4>${h}</h4><p class="rv-p">${esc(p)}</p></div>` : "";
    UI.sheet(k+" 的复盘", `
      <div style="display:flex;align-items:center;gap:11px;margin-bottom:6px">
        <div style="font-size:30px">${MOODS[r.mood]||"·"}</div>
        <div><div style="font-weight:700;font-size:15px">${"★".repeat(r.score||0)||"未评分"}</div>
        <div class="tiny" style="color:var(--ink-3)">心情 · ${MOOD_TXT[r.mood]||"—"}</div></div>
      </div>
      ${row("✅ 做成了什么", r.good)}
      ${row("🌀 可以更好", r.bad)}
      ${row("🎯 明天最重要", r.next)}
    `);
  });
  UI.on("weekReview", ()=>{
    const rs = pastDays(7).map(k=>S.d.review[k]).filter(r=>r&&r.saved);
    if(!rs.length) return UI.toast("这周还没有复盘记录～");
    UI.sheet("本周回看（"+rs.length+" 天）", reviewRecapBody(rs));
  });
  UI.on("monthReview", ()=>{
    const p = S.today().slice(0,7);
    const rs = savedReviews().filter(k=>k.startsWith(p)).sort().map(k=>S.d.review[k]);
    if(!rs.length) return UI.toast("这个月还没开始复盘呢～");
    const ms = Number(p.slice(5));
    UI.sheet((ms)+" 月小总结（"+rs.length+" 天）", reviewRecapBody(rs));
  });

  return { render, afterRender };
})();
