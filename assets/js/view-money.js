/* ============ 理财页 ============ */
window.ViewMoney = (function () {
  const { esc } = UI;
  let tab = "ledger";
  let billType = "out", billCat = "food";
  let billDate = S.today();

  function render(){
    return `
    <div class="page-hero">
      <div class="date">FINANCE</div>
      <h2>理财学习</h2>
      <p>记录 → 看懂 → 改变。先把钱的流向看清楚，再谈投资。</p>
    </div>
    <div class="chips">
      ${[["ledger","💰 每日记账"],["know","🧠 金融知识"],["stock","📊 股市学习"],["path","📈 理财课程"]].map(c=>
        `<button class="chip ${tab===c[0]?"on":""}" data-act="mTab" data-t="${c[0]}">${c[1]}</button>`).join("")}
    </div>
    ${tab==="ledger" ? ledger() : tab==="know" ? know() : tab==="stock" ? stock() : path()}`;
  }

  /* ---------- 记账 ---------- */
  function ledger(){
    const m = S.monthBills();
    const out = S.sum(m,"out"), inc = S.sum(m,"in");
    const budget = S.d.budget || 3000;
    const sv = S.sv();
    const sPct = sv.goal>0 ? Math.min(100, Math.round(sv.balance/sv.goal*100)) : 0;
    const sDays = S.daysToSalary();
    const bpct = Math.min(100, out/budget*100);
    const todayBills = S.d.bills.filter(b=>b.date===billDate);
    const recent = S.d.bills.slice().sort((a,b)=>b.date<a.date?-1:1).reverse().slice(0,12);

    // 分类占比
    const byCat = {};
    m.filter(b=>b.type==="out").forEach(b=>{ byCat[b.cat]=(byCat[b.cat]||0)+Number(b.amt); });
    const catList = Object.entries(byCat).sort((a,b)=>b[1]-a[1]).slice(0,5);

    // 近 7 天柱状
    const days = [];
    for(let i=6;i>=0;i--){
      const dt = new Date(); dt.setDate(dt.getDate()-i);
      const k = S.ymd(dt);
      days.push({ k, lbl:(dt.getMonth()+1)+"/"+dt.getDate(),
        v: S.d.bills.filter(b=>b.date===k && b.type==="out").reduce((s,b)=>s+Number(b.amt),0) });
    }
    const mx = Math.max(1, ...days.map(d=>d.v));

    return `
    <div class="card money-hero" style="background:linear-gradient(135deg,#DFE5E9 0%,#EDE6E2 100%);border:1px solid rgba(255,255,255,.6)">
      <div style="display:flex;justify-content:space-between;align-items:flex-end">
        <div>
          <div class="tiny" style="color:#77706A;font-weight:600;letter-spacing:1px">本月支出</div>
          <div class="amt out">¥${out.toFixed(2)}</div>
        </div>
        <div style="text-align:right">
          <div class="tiny" style="color:#77706A;font-weight:600">本月收入</div>
          <div style="font-size:17px;font-weight:650;color:var(--down)">¥${inc.toFixed(2)}</div>
        </div>
      </div>
      <div style="margin-top:14px">
        <div style="display:flex;justify-content:space-between;font-size:11px;color:#77706A;font-weight:600;margin-bottom:5px">
          <span>预算 ¥${budget}</span><span>${bpct>=100?"已超支":"剩余 ¥"+(budget-out).toFixed(0)}</span>
        </div>
        <div class="bar"><i style="width:${bpct}%;background:${bpct>85?"var(--up)":"var(--sage)"}"></i></div>
      </div>
      <div style="display:flex;gap:8px;margin-top:13px">
        <button class="btn sm ghost" data-act="setBudget">改预算</button>
        <button class="btn sm ghost" data-act="monthReport">月度报告</button>
      </div>
    </div>

    <div class="card savings-hero" style="background:linear-gradient(135deg,#E6EDE8 0%,#EDE9F0 100%);border:1px solid rgba(255,255,255,.6)">
      <div style="display:flex;justify-content:space-between;align-items:flex-end">
        <div>
          <div class="tiny" style="color:#6f8a78;font-weight:600;letter-spacing:1px">💰 存款储蓄</div>
          <div style="font-size:30px;font-weight:680;color:#4f7d63;margin-top:2px">¥${sv.balance.toFixed(2)}</div>
        </div>
        <div style="text-align:right">
          <div class="tiny" style="color:#77706A;font-weight:600">储蓄目标</div>
          <div style="font-size:16px;font-weight:650;color:#8a7a5e">${sv.goal?("¥"+sv.goal.toFixed(0)):"未设"}</div>
        </div>
      </div>
      ${sv.goal?`<div style="margin-top:12px">
        <div style="display:flex;justify-content:space-between;font-size:11px;color:#77706A;font-weight:600;margin-bottom:5px">
          <span>目标进度</span><span>${sPct}%</span></div>
        <div class="bar"><i style="width:${sPct}%;background:var(--sage)"></i></div></div>`:""}
      <div class="tiny" style="margin-top:11px;color:#6b6358;line-height:1.7">
        📅 发工资日：每月 <b style="color:#8a6d3b">${sv.salaryDay}</b> 号左右 ·
        <b style="color:#4f7d63">距下次还有 ${sDays} 天</b>
      </div>
      <div style="display:flex;gap:7px;margin-top:12px;flex-wrap:wrap">
        <button class="btn sm ghost" data-act="depIn">存入</button>
        <button class="btn sm ghost" data-act="depOut">取出</button>
        <button class="btn sm ghost" data-act="salaryGot">记工资到账</button>
      </div>
      <div style="display:flex;gap:7px;margin-top:8px">
        <button class="btn sm ghost" data-act="setSalary">改工资日</button>
        <button class="btn sm ghost" data-act="setGoal">设目标</button>
      </div>
    </div>

    ${sv.log && sv.log.length ? `<div class="card">
      <div class="sec-head"><h2><span class="dot" style="background:var(--sage)"></span>储蓄明细</h2>
        <span class="more">共 ${sv.log.length} 笔</span></div>
      ${sv.log.slice(0,8).map(r=>`<div class="bill">
        <div class="bill-e">${r.dir==="out"?"🏧":"🐖"}</div>
        <div class="bill-b"><h5>${esc(r.note||(r.dir==="out"?"取出":"存入"))}</h5><p>${r.date.slice(5)} · ${r.dir==="out"?"取出":"存入"}</p></div>
        <div class="bill-a" style="color:${r.dir==="out"?"var(--up)":"var(--down)"}">${r.dir==="out"?"−":"+"}${Number(r.amt).toFixed(2)}</div>
      </div>`).join("")}
    </div>` : ""}

    <div class="card">
      <div class="sec-head"><h2><span class="dot" style="background:var(--sand)"></span>快速记一笔</h2>
        <span class="more">${billDate===S.today()?"今天":"该日"} ${todayBills.length} 笔</span></div>
      <div style="display:flex;gap:8px;margin-bottom:12px">
        <button class="chip ${billType==="out"?"on":""}" data-act="bType" data-v="out" style="flex:1;text-align:center">支出</button>
        <button class="chip ${billType==="in"?"on":""}" data-act="bType" data-v="in" style="flex:1;text-align:center">收入</button>
      </div>
      <div class="cat-pick">
        ${(billType==="out"?DB.cats:DB.incomeCats).map(c=>
          `<button class="cat-i ${billCat===c.k?"on":""}" data-act="bCat" data-v="${c.k}">
            <span class="e">${c.e}</span><span class="l">${c.l}</span></button>`).join("")}
      </div>
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:12px">
        <span class="tiny" style="color:#8a8a85;font-weight:600;white-space:nowrap">记账日期</span>
        <input class="inp" id="bDate" type="date" value="${billDate}" max="${S.today()}" style="flex:1;min-width:0" />
      </div>
      <div style="display:flex;gap:8px">
        <input class="inp" id="bAmt" type="number" inputmode="decimal" placeholder="金额" style="flex:0 0 108px" />
        <input class="inp" id="bNote" placeholder="备注（可不填）" style="flex:1" />
      </div>
      <button class="btn block" data-act="addBill" style="margin-top:10px">记下这一笔 · +5 积分</button>
    </div>

    <div class="card">
      <div class="sec-head"><h2><span class="dot" style="background:var(--sage)"></span>近 7 天支出</h2></div>
      <div class="barchart">
        ${days.map(d=>`<div class="b" title="¥${d.v}"><i style="height:${d.v/mx*100}%"></i></div>`).join("")}
      </div>
      <div class="bar-lbl">${days.map(d=>`<span>${d.lbl}</span>`).join("")}</div>
      ${catList.length ? `<div style="margin-top:14px">
        <div class="tiny" style="font-weight:700;margin-bottom:8px">本月支出结构</div>
        ${catList.map(([k,v])=>{
          const c = DB.cats.find(x=>x.k===k) || {e:"✨",l:k};
          return `<div style="margin-bottom:9px">
            <div style="display:flex;justify-content:space-between;font-size:12px;margin-bottom:4px">
              <span>${c.e} ${c.l}</span><b>¥${v.toFixed(0)} · ${(v/out*100).toFixed(0)}%</b></div>
            <div class="bar"><i style="width:${v/out*100}%;background:var(--clay)"></i></div></div>`;
        }).join("")}</div>` : ""}
    </div>

    <div class="card">
      <div class="sec-head"><h2><span class="dot" style="background:var(--mist)"></span>最近账单</h2></div>
      ${recent.length ? recent.map(b=>{
        const c = [...DB.cats,...DB.incomeCats].find(x=>x.k===b.cat) || {e:"✨",l:"其他"};
        return `<div class="bill">
          <div class="bill-e">${c.e}</div>
          <div class="bill-b"><h5>${esc(b.note||c.l)}</h5><p>${b.date.slice(5)} · ${c.l}</p></div>
          <div class="bill-a" style="color:${b.type==="out"?"var(--up)":"var(--down)"}">${b.type==="out"?"−":"+"}${Number(b.amt).toFixed(2)}</div>
          <button class="todo-x" data-act="delBill" data-id="${b.id}">✕</button>
        </div>`;
      }).join("") : `<div class="empty"><span class="em">🪙</span>还没有记录，从今天的第一笔开始</div>`}
    </div>`;
  }

  /* ---------- 金融知识 ---------- */
  function know(){
    const k = S.pick(DB.finance, 2);
    const more = S.pickMany(DB.finance, 4, 9).filter(x=>x.t!==k.t).slice(0,3);
    const read = !!S.d.finRead[S.today()];
    return `
    <div class="card" style="background:linear-gradient(135deg,#EDEAF1,#F1EDE6);border:1px solid var(--line-2)">
      <div class="tiny" style="letter-spacing:1.6px;font-weight:700;color:var(--lilac)">今日金融知识 · ${esc(k.k)}</div>
      <h3 style="margin:9px 0 8px;font-size:19px;font-weight:670">${esc(k.t)}</h3>
      <p style="margin:0;font-size:13.5px;line-height:1.85;color:var(--ink-2)">${esc(k.d)}</p>
      <button class="btn block ${read?"soft":""}" data-act="readFin" style="margin-top:14px">${read?"今天已学习 ✓":"我学会了 · +10 积分"}</button>
    </div>

    <div class="card">
      <div class="sec-head"><h2><span class="dot" style="background:var(--sand)"></span>再读三条</h2>
        <span class="more">共 ${DB.finance.length} 条</span></div>
      ${more.map(x=>`<div class="lesson">
        <div class="lesson-n" style="background:var(--sand-s);color:#8C7550">${esc(x.k.slice(0,1))}</div>
        <div class="lesson-b"><h5>${esc(x.t)}</h5><p>${esc(x.d)}</p></div></div>`).join("")}
      <button class="btn ghost block" data-act="allFin" style="margin-top:12px">查看全部知识卡</button>
    </div>

    <div class="card">
      <div class="sec-head"><h2><span class="dot" style="background:var(--sage)"></span>今日理财三问</h2></div>
      <div class="kv"><span>今天有没有冲动消费？</span><b>${S.d.bills.filter(b=>b.date===S.today()&&b.type==="out").length} 笔支出</b></div>
      <div class="kv"><span>本月结余率</span><b>${(()=>{const m=S.monthBills(),i=S.sum(m,"in"),o=S.sum(m,"out");return i>0?((i-o)/i*100).toFixed(0)+"%":"待记录";})()}</b></div>
      <div class="kv"><span>应急金进度（目标 3 个月开支）</span><b>${(()=>{const m=S.monthBills();const o=S.sum(m,"out")||1;return "¥"+(o*3).toFixed(0)+" 目标";})()}</b></div>
    </div>`;
  }

  /* ---------- 股市学习 ---------- */
  function stockCard(title, color, item, read, act){
    return `
    <div class="card" style="border:1px solid var(--line-2)">
      <div class="tiny" style="letter-spacing:1.2px;font-weight:700;color:${color}">${title}</div>
      <h3 style="margin:9px 0 8px;font-size:18px;font-weight:670">${esc(item.t)}</h3>
      <p style="margin:0;font-size:13.5px;line-height:1.85;color:var(--ink-2)">${esc(item.d)}</p>
      ${act?`<button class="btn block ${read?"soft":""}" data-act="${act}" style="margin-top:14px">${read?"今天已学习 ✓":"我学会了 · +10 积分"}</button>`:""}
    </div>`;
  }
  function stockList(title, arr, items, allKey){
    return `
    <div class="card">
      <div class="sec-head"><h2><span class="dot" style="background:var(--sand)"></span>${title}</h2>
        <span class="more">共 ${arr.length} 条</span></div>
      ${items.map(x=>`<div class="lesson">
        <div class="lesson-n" style="background:var(--sand-s);color:#8C7550">📌</div>
        <div class="lesson-b"><h5>${esc(x.t)}</h5><p>${esc(x.d)}</p></div></div>`).join("")}
      <button class="btn ghost block" data-act="${allKey}" style="margin-top:12px">查看全部</button>
    </div>`;
  }
  function stock(){
    const basics = S.pick(DB.stockBasics, 1);
    const basicsMore = S.pickMany(DB.stockBasics, 5, 9).filter(x=>x.t!==basics.t).slice(0,3);
    const moves = S.pick(DB.stockMoves, 2);
    const movesMore = S.pickMany(DB.stockMoves, 4, 13).filter(x=>x.t!==moves.t).slice(0,2);
    const news = S.pick(DB.stockNews, 3);
    const newsMore = S.pickMany(DB.stockNews, 4, 17).filter(x=>x.t!==news.t).slice(0,2);
    const read = !!S.d.stockRead[S.today()];
    return `
    <div class="card" style="background:linear-gradient(135deg,#EDEAF1,#F1EDE6);border:1px solid var(--line-2)">
      <div class="tiny" style="letter-spacing:1.4px;font-weight:700;color:var(--lilac)">零基础起步 · 股市学习</div>
      <p style="margin:8px 0 0;font-size:13px;line-height:1.8;color:var(--ink-2)">不用懂代码，先把概念看清。每天轮换一卡，配合「靠谱信息源」看真实行情，慢慢就有感觉了。</p>
    </div>

    ${stockCard("📘 基础知识 · 每日一学", "var(--lilac)", basics, read, "readStock")}
    ${stockList("再读三条基础知识", DB.stockBasics, basicsMore, "allBasics")}

    ${stockCard("📊 股市变化 · 今日规律", "var(--sand)", moves, null, null)}
    ${stockList("延伸：更多市场规律", DB.stockMoves, movesMore, "allMoves")}

    ${stockCard("📰 股市新闻 · 怎么读", "var(--sage)", news, null, null)}
    ${stockList("延伸：更多读新闻的方法", DB.stockNews, newsMore, "allNews")}

    <div class="card">
      <div class="sec-head"><h2><span class="dot" style="background:var(--clay)"></span>靠谱信息源</h2></div>
      <p class="tiny" style="line-height:1.8;margin-bottom:10px">新手只看权威源，少刷小作文。点开即可查看实时行情与资讯。</p>
      <div style="display:flex;flex-wrap:wrap;gap:8px">
        ${DB.stockSources.map(s=>`<a class="lk" href="${s.u}" target="_blank" rel="noopener">${s.e} ${s.n}</a>`).join("")}
      </div>
    </div>`;
  }

  /* ---------- 理财课程 ---------- */
  function path(){
    const done = S.d.finDone;
    const pct = Math.round(done.length/DB.finPath.length*100);
    return `
    <div class="card">
      <div class="sec-head"><h2><span class="dot" style="background:var(--lilac)"></span>12 周理财入门路径</h2>
        <span class="more">${done.length}/${DB.finPath.length}</span></div>
      <div class="bar" style="margin-bottom:14px"><i style="width:${pct}%;background:var(--lilac)"></i></div>
      ${DB.finPath.map((x,i)=>{
        const d = done.includes(i);
        return `<div class="lesson ${d?"done":""}">
          <div class="lesson-n">${d?"✓":"W"+(i+1)}</div>
          <div class="lesson-b"><h5>${esc(x.t)}</h5><p>${esc(x.d)}</p></div>
          <button class="q-go ${d?"done":""}" data-act="finLesson" data-i="${i}" style="align-self:center">${d?"已完成":"完成"}</button>
        </div>`;
      }).join("")}
    </div>

    <div class="card">
      <div class="sec-head"><h2><span class="dot" style="background:var(--clay)"></span>理财书单</h2></div>
      ${DB.books.filter(b=>/理财|财富|投资|商业|财商/.test(b.tag)).map(b=>`
        <div class="book">
          <div class="book-c" style="background:${b.c}">${esc(b.t.slice(0,6))}</div>
          <div class="book-b">
            <h5>${esc(b.t)}</h5><div class="au">${esc(b.a)} · ${esc(b.tag)}</div>
            <div class="de">${esc(b.d)}</div>
            <div class="book-links">
              <a class="lk" href="${UI.weread(b.t)}" target="_blank" rel="noopener">微信读书</a>
              <a class="lk" href="${UI.douban(b.t)}" target="_blank" rel="noopener">豆瓣</a>
            </div>
          </div>
        </div>`).join("")}
    </div>`;
  }

  /* ---------- 事件 ---------- */
  UI.on("mTab", el=>{ tab = el.dataset.t; App.refresh(); });
  UI.on("bType", el=>{ billType = el.dataset.v; billCat = billType==="out"?"food":"salary"; App.refresh(); });
  UI.on("bCat", el=>{ billCat = el.dataset.v; App.refresh(); });
  UI.on("addBill", ()=>{
    const a = document.getElementById("bAmt").value;
    if(!a || Number(a)<=0) return UI.toast("请输入金额");
    S.d.bills.push({ id:Date.now()+"", date:(document.getElementById("bDate")||{}).value || billDate, type:billType, cat:billCat,
      amt:Number(a), note:document.getElementById("bNote").value.trim() });
    S.save(); S.addCoin(5,"记账"); App.refresh();
  });
  UI.on("delBill", el=>{ S.d.bills = S.d.bills.filter(b=>b.id!==el.dataset.id); S.save(); App.refresh(); });
  UI.on("setBudget", ()=>{
    UI.sheet("设置月度预算", `
      <div class="fld"><label>本月可支配预算（元）</label>
        <input class="inp" id="bgInp" type="number" value="${S.d.budget}" /></div>
      <p class="tiny" style="line-height:1.8;margin-bottom:14px">建议：月收入 × 60%。留出 20% 储蓄、20% 投资。</p>
      <button class="btn block" data-act="saveBudget">保存</button>`);
  });
  UI.on("saveBudget", ()=>{
    const v = Number(document.getElementById("bgInp").value);
    if(v>0){ S.d.budget = v; S.save(); UI.closeSheet(); App.refresh(); UI.toast("预算已更新"); }
  });
  UI.on("readFin", ()=>{
    if(S.d.finRead[S.today()]) return UI.toast("今天已经学过啦");
    S.d.finRead[S.today()] = true; S.save(); S.addCoin(10,"金融知识"); App.refresh();
  });
  UI.on("allFin", ()=>{
    UI.sheet("全部金融知识卡（"+DB.finance.length+"）",
      DB.finance.map(x=>`<div class="card tight" style="margin-bottom:10px">
        <div class="tiny" style="font-weight:700;color:var(--sand)">${esc(x.k)}</div>
        <h4 style="margin:5px 0 5px;font-size:14.5px">${esc(x.t)}</h4>
        <p style="margin:0;font-size:12.5px;line-height:1.75;color:var(--ink-2)">${esc(x.d)}</p></div>`).join(""));
  });
  UI.on("finLesson", el=>{
    const i = Number(el.dataset.i);
    if(S.d.finDone.includes(i)){ S.d.finDone = S.d.finDone.filter(x=>x!==i); S.save(); }
    else { S.d.finDone.push(i); S.save(); S.addCoin(30,"完成理财课"); }
    App.refresh();
  });
  UI.on("monthReport", ()=>{
    const m = S.monthBills(), out=S.sum(m,"out"), inc=S.sum(m,"in");
    const byCat = {}; m.filter(b=>b.type==="out").forEach(b=>byCat[b.cat]=(byCat[b.cat]||0)+Number(b.amt));
    const top = Object.entries(byCat).sort((a,b)=>b[1]-a[1]);
    const days = new Set(m.map(b=>b.date)).size || 1;
    UI.sheet(S.today().slice(0,7)+" 月度报告", `
      <div class="card tight"><div class="kv"><span>总支出</span><b style="color:var(--up)">¥${out.toFixed(2)}</b></div>
      <div class="kv"><span>总收入</span><b style="color:var(--down)">¥${inc.toFixed(2)}</b></div>
      <div class="kv"><span>结余</span><b>¥${(inc-out).toFixed(2)}</b></div>
      <div class="kv"><span>结余率</span><b>${inc>0?((inc-out)/inc*100).toFixed(1)+"%":"—"}</b></div>
      <div class="kv"><span>日均支出</span><b>¥${(out/days).toFixed(2)}</b></div>
      <div class="kv"><span>记账天数</span><b>${days} 天</b></div></div>
      <div class="card tight"><div class="tiny" style="font-weight:700;margin-bottom:8px">支出排行</div>
      ${top.length?top.map(([k,v])=>{const c=DB.cats.find(x=>x.k===k)||{e:"✨",l:k};
        return `<div class="kv"><span>${c.e} ${c.l}</span><b>¥${v.toFixed(0)}</b></div>`;}).join(""):'<div class="empty">暂无数据</div>'}</div>
      <div class="scene-tip">${out>S.d.budget?"本月已超预算，看看排行第一的分类还有没有压缩空间。":"控制得不错，继续保持。可以考虑把结余的一部分转入定投。"}</div>`);
  });

  /* ---------- 存款储蓄 ---------- */
  UI.on("depIn", ()=>{
    UI.sheet("存入存款", `
      <div class="fld"><label>存入金额（元）</label>
        <input class="inp" id="depAmt" type="number" inputmode="decimal" placeholder="例如 500" /></div>
      <div class="fld"><label>备注（可选）</label>
        <input class="inp" id="depNote" placeholder="例如 工资结余" /></div>
      <button class="btn block" data-act="doDep" data-dir="in">确认存入 · +3 积分</button>`);
  });
  UI.on("depOut", ()=>{
    UI.sheet("取出存款", `
      <div class="fld"><label>取出金额（元）</label>
        <input class="inp" id="depAmt" type="number" inputmode="decimal" placeholder="例如 200" /></div>
      <div class="fld"><label>用途（可选）</label>
        <input class="inp" id="depNote" placeholder="例如 买大件" /></div>
      <button class="btn block" data-act="doDep" data-dir="out">确认取出</button>`);
  });
  UI.on("doDep", el=>{
    const amt = document.getElementById("depAmt").value;
    if(!amt || Number(amt)<=0) return UI.toast("请输入金额");
    if(!S.addSaving(amt, document.getElementById("depNote").value, el.dataset.dir)) return UI.toast("金额无效");
    S.addCoin(3,"存款"); UI.closeSheet(); App.refresh();
  });
  UI.on("salaryGot", ()=>{
    UI.sheet("记一笔工资到账", `
      <p class="tiny" style="line-height:1.8;margin-bottom:12px">这笔会同时记为「工资收入」并存入你的存款储蓄。</p>
      <div class="fld"><label>工资金额（元）</label>
        <input class="inp" id="salAmt" type="number" inputmode="decimal" placeholder="例如 8000" /></div>
      <button class="btn block" data-act="doSalary">记到账 · 工资+存款</button>`);
  });
  UI.on("doSalary", ()=>{
    const a = document.getElementById("salAmt").value;
    if(!a || Number(a)<=0) return UI.toast("请输入金额");
    S.d.bills.push({ id:Date.now()+"", date:S.today(), type:"in", cat:"salary", amt:Number(a), note:"工资到账" });
    S.addSaving(a, "工资到账", "in");
    S.save(); S.addCoin(5,"记账"); UI.closeSheet(); App.refresh();
  });
  UI.on("setSalary", ()=>{
    UI.sheet("设置发工资日", `
      <div class="fld"><label>每月几号发工资（1–28）</label>
        <input class="inp" id="salDay" type="number" value="${S.sv().salaryDay}" /></div>
      <p class="tiny" style="line-height:1.8;margin-bottom:12px">App 会显示「距下次发工资还有几天」。</p>
      <button class="btn block" data-act="saveSalary">保存</button>`);
  });
  UI.on("saveSalary", ()=>{
    const v = Number(document.getElementById("salDay").value);
    if(v>=1 && v<=28){ S.setSalaryDay(v); UI.closeSheet(); App.refresh(); UI.toast("已更新发工资日"); }
    else UI.toast("请输入 1–28");
  });
  UI.on("setGoal", ()=>{
    UI.sheet("设置储蓄目标", `
      <div class="fld"><label>目标存款（元）</label>
        <input class="inp" id="goalInp" type="number" value="${S.sv().goal}" /></div>
      <p class="tiny" style="line-height:1.8;margin-bottom:12px">比如先定一个小目标：3 万元应急金。</p>
      <button class="btn block" data-act="saveGoal">保存</button>`);
  });
  UI.on("saveGoal", ()=>{
    const v = Number(document.getElementById("goalInp").value);
    if(v>=0){ S.setGoal(v); UI.closeSheet(); App.refresh(); UI.toast("目标已更新"); }
  });

  /* ---------- 股市学习 ---------- */
  UI.on("readStock", ()=>{
    if(S.d.stockRead[S.today()]) return UI.toast("今天已经学过啦");
    S.d.stockRead[S.today()] = true; S.save(); S.addCoin(10,"股市知识"); App.refresh();
  });
  UI.on("allBasics", ()=> UI.sheet("全部股市基础知识（"+DB.stockBasics.length+"）",
    DB.stockBasics.map(x=>`<div class="card tight" style="margin-bottom:10px">
      <h4 style="margin:5px 0 5px;font-size:14.5px">${esc(x.t)}</h4>
      <p style="margin:0;font-size:12.5px;line-height:1.75;color:var(--ink-2)">${esc(x.d)}</p></div>`).join("")));
  UI.on("allMoves", ()=> UI.sheet("全部股市变化规律（"+DB.stockMoves.length+"）",
    DB.stockMoves.map(x=>`<div class="card tight" style="margin-bottom:10px">
      <h4 style="margin:5px 0 5px;font-size:14.5px">${esc(x.t)}</h4>
      <p style="margin:0;font-size:12.5px;line-height:1.75;color:var(--ink-2)">${esc(x.d)}</p></div>`).join("")));
  UI.on("allNews", ()=> UI.sheet("全部股市新闻读法（"+DB.stockNews.length+"）",
    DB.stockNews.map(x=>`<div class="card tight" style="margin-bottom:10px">
      <h4 style="margin:5px 0 5px;font-size:14.5px">${esc(x.t)}</h4>
      <p style="margin:0;font-size:12.5px;line-height:1.75;color:var(--ink-2)">${esc(x.d)}</p></div>`).join("")));

  function afterRender(){
    const el = document.getElementById("bDate");
    if(el) el.addEventListener("change", ()=>{ billDate = el.value || S.today(); App.refresh(); });
  }
  return { render, afterRender };
})();
