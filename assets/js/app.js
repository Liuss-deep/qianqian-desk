/* ============ 应用主控 ============ */
window.App = (function () {
  const { $, esc } = UI;
  const views = { today:ViewToday, money:ViewMoney, learn:ViewLearn, life:ViewLife, media:ViewMedia, muse:ViewMuse };
  const titles = {
    today:["浅浅的工作台","今天也要慢慢变好呀"],
    money:["理财学习","看清钱的流向，才有选择权"],
    learn:["学习中心","阅读 · 雅思 · 每天一点点"],
    life:["生活日常","好好吃饭，认真通关"],
    media:["自媒体计划","记录生活，也经营生活"],
    muse:["碎碎念","把身边的小事收进来"]
  };
  let cur = "today";
  let scrollMem = {};
  let unlocked = false;
  let pinBuf = "";
  let hiddenAt = 0;

  function refresh(keepScroll){
    if(maybeLock()){ showLock(); return; }
    hideLock();
    const sc = $("#screen");
    const pos = sc.scrollTop;
    sc.innerHTML = views[cur].render();
    if(keepScroll !== false) sc.scrollTop = pos;
    UI.syncCoin();
    const v = views[cur];
    if(v.afterRender) v.afterRender();
  }

  function go(tab){
    if(!views[tab]) return;
    scrollMem[cur] = $("#screen").scrollTop;
    cur = tab;
    document.querySelectorAll(".tab").forEach(b=>b.classList.toggle("active", b.dataset.tab===tab));
    $("#topTitle").textContent = titles[tab][0];
    $("#topSub").textContent = tab==="today" ? S.greet() : titles[tab][1];
    if(maybeLock()){ showLock(); return; }
    hideLock();
    const sc = $("#screen");
    sc.innerHTML = views[cur].render();
    sc.scrollTop = scrollMem[tab] || 0;
    UI.syncCoin();
    if(views[cur].afterRender) views[cur].afterRender();
  }

  /* ---------- 应用锁 ---------- */
  function maybeLock(){ return S.lockEnabled() && !unlocked; }
  function lockInner(){
    const name = S.d.profile.name || "浅浅";
    const dots = Array.from({length:8},(_,i)=>`<i class="${i<pinBuf.length?'on':''}"></i>`).join("");
    return `<div class="lock-inner">
      <div class="lock-ava">${esc(name.slice(0,1))}</div>
      <h3 class="lock-hi">${esc(name)}的工作台</h3>
      <p class="lock-sub">输入密码以进入</p>
      <div class="lock-dots">${dots}</div>
      <div class="lock-kp">
        ${[1,2,3,4,5,6,7,8,9].map(k=>`<button class="lkp" data-act="lockKey" data-k="${k}">${k}</button>`).join("")}
        <button class="lkp lkp-x" data-act="lockKey" data-k="del">⌫</button>
        <button class="lkp" data-act="lockKey" data-k="0">0</button>
        <button class="lkp lkp-go" data-act="lockKey" data-k="ok">解锁</button>
      </div>
      <button class="lock-forgot" data-act="lockForgot">忘记密码？</button>
    </div>`;
  }
  function showLock(){ const ll = $("#lockLayer"); ll.innerHTML = lockInner(); ll.classList.add("on"); }
  function hideLock(){ const ll = $("#lockLayer"); ll.classList.remove("on"); ll.innerHTML = ""; }
  function renderLock(wrong){
    const ll = $("#lockLayer");
    ll.innerHTML = lockInner();
    if(wrong){ const el = ll.querySelector(".lock-inner"); if(el) el.classList.add("wrong"); }
  }
  function submitLock(){
    if(pinBuf.length < 4){ UI.toast("密码至少 4 位"); return; }
    if(!S.verifyPin(pinBuf)){ pinBuf=""; renderLock(true); UI.toast("密码错误，再试试"); return; }
    pinBuf=""; unlocked=true; hideLock(); refresh();
  }

  /* ---------- 设置 ---------- */
  function syncStatText(){
    if(!S.getSyncURL()) return "未开启";
    const at = S.syncInfo().at;
    const when = at ? new Date(at).toLocaleString() : "—";
    return "✅ Supabase 云端同步 · 最后同步 " + when;
  }
  function settings(){
    const total = Object.values(S.d.photos).reduce((s,a)=>s+a.length,0);
    UI.sheet("设置", `
      <div class="fld"><label>你的名字</label><input class="inp" id="stName" value="${esc(S.d.profile.name)}" /></div>
      <div class="card tight">
        <div class="kv"><span>累计积分</span><b>${S.d.coins}</b></div>
        <div class="kv"><span>当前等级</span><b>Lv.${S.level().lv} ${esc(S.level().name)}</b></div>
        <div class="kv"><span>连续打卡</span><b>${S.d.streak} 天</b></div>
        <div class="kv"><span>记账笔数</span><b>${S.d.bills.length}</b></div>
        <div class="kv"><span>读书打卡</span><b>${Object.keys(S.d.bookLog).length} 天</b></div>
        <div class="kv"><span>掌握单词</span><b>${Object.values(S.d.wordBox).filter(w=>w.lvl>=2).length}</b></div>
        <div class="kv"><span>餐桌照片</span><b>${total} 张</b></div>
        <div class="kv"><span>碎碎念</span><b>${S.d.muses.length} 条</b></div>
        <div class="kv"><span>发布内容</span><b>${S.d.posts.length} 条</b></div>
      </div>

        <div class="card tight">
          <div class="tiny" style="font-weight:700;margin-bottom:8px">⏰ 每日自动推送</div>
          <div class="kv"><span>08:00 平台热点</span><b style="color:var(--sage)">已配置</b></div>
          <div class="kv"><span>08:30 每日新闻</span><b style="color:var(--sage)">已配置</b></div>
          <div class="kv"><span>09:00 精选播客</span><b style="color:var(--sage)">已配置</b></div>
          <p class="tiny" style="line-height:1.8;margin:9px 0 0">助手会在这些时间点生成内容，写入
          <code style="font-size:10.5px">data/daily/</code> 下的 JSON 文件。App 每次打开会自动读取最新一份，读不到时使用本地缓存。播客在学习页「🎧 播客」里看。</p>
        </div>

      <div class="card tight">
        <div class="tiny" style="font-weight:700;margin-bottom:8px">🔒 应用锁</div>
        <div class="kv"><span>当前状态</span><b style="color:${S.lockEnabled()?'var(--sage)':'var(--ink-3)'}">${S.lockEnabled()?"已开启":"未开启"}</b></div>
        ${S.lockEnabled()
          ? `<div style="display:flex;gap:8px;margin-top:9px">
               <button class="btn ghost" data-act="lockChange" style="flex:1">修改密码</button>
               <button class="btn ghost" data-act="lockDisable" style="flex:1;color:var(--up)">关闭应用锁</button>
             </div>`
          : `<button class="btn ghost block" data-act="lockEnable" style="margin-top:9px">开启应用锁</button>`}
        <p class="tiny" style="line-height:1.8;margin:9px 0 0">开启后，每次打开工作台都需输入密码。密码仅保存本机，忘记只能清空数据重设。</p>
      </div>

      <div class="card tight">
        <div class="tiny" style="font-weight:700;margin-bottom:8px">☁️ 多设备云同步</div>
        <div class="kv"><span>同步状态</span><b id="syncStat">${syncStatText()}</b></div>
        <div style="display:flex;gap:8px;margin-top:9px">
          <button class="btn ghost" data-act="syncNow" style="flex:1">立即同步</button>
          ${S.getSyncURL() ? `<button class="btn ghost" data-act="syncOff" style="flex:1;color:var(--up)">断开同步</button>` : `<button class="btn ghost" data-act="syncOn" style="flex:1">开启同步</button>`}
        </div>
        <p class="tiny" style="line-height:1.8;margin:9px 0 0">数据通过 Supabase 云端实时同步：手机和电脑打开任意一端都会自动共享打卡、积分、待办、复盘、账单、碎碎念等。照片默认仅存本机。</p>
      </div>

      <div class="card tight">
        <div class="tiny" style="font-weight:700;margin-bottom:8px">📲 添加到主屏幕（像 App 一样用）</div>
        <div class="tiny" style="line-height:1.9">
          <b>iPhone（Safari）</b>：打开网址 → 点底部「分享」图标 → <b>添加到主屏幕</b> → 完成。<br>
          <b>安卓（Chrome）</b>：打开网址 → 点右上「⋯」→ <b>添加到主屏幕 / 安装应用</b>。<br>
          <b>电脑（Chrome/Edge）</b>：打开网址 → 点右上「⋯」→ <b>投射、保存和分享 → 创建快捷方式</b>，勾选「作为窗口打开」→ 桌面就多了一个图标。
        </div>
      </div>

      <div style="display:flex;gap:8px;margin-top:6px">
        <button class="btn ghost" data-act="exportData" style="flex:1">导出数据</button>
        <button class="btn ghost" data-act="importData" style="flex:1">导入数据</button>
      </div>
      <button class="btn ghost block" data-act="resetAll" style="margin-top:9px;color:var(--up)">清空所有数据</button>
      <p class="tiny" style="text-align:center;margin-top:14px;line-height:1.8">
        未开启云同步时，数据只保存在本机浏览器；开启后实时备份到同步服务器<br>浅浅的工作台 v1.0</p>`);
  }

  UI.on("go", el=>go(el.dataset.tab));
  UI.on("exportData", ()=>{
    const blob = new Blob([S.exportData()], { type:"application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "浅浅的工作台-备份-" + S.today() + ".json";
    a.click(); UI.toast("已导出备份文件");
  });
  UI.on("importData", ()=>{
    UI.sheet("导入数据", `<div class="fld"><label>粘贴之前导出的 JSON</label>
      <textarea class="inp" id="impTxt" style="min-height:180px" placeholder='{"coins":...}'></textarea></div>
      <button class="btn block" data-act="doImport">确认导入（会覆盖当前数据）</button>`);
  });
  UI.on("doImport", ()=>{
    if(S.importData(document.getElementById("impTxt").value)){ UI.toast("导入成功"); setTimeout(()=>location.reload(),700); }
    else UI.toast("格式不正确");
  });
  UI.on("resetAll", ()=>{
    UI.sheet("确认清空？", `<p style="font-size:13.5px;line-height:1.8;color:var(--ink-2)">
      这会删除所有待办、复盘、账单、打卡、照片记录，且无法恢复。<br><br>建议先导出一份备份。</p>
      <button class="btn block" data-act="doReset" style="background:var(--up);margin-top:10px">我确定，清空</button>
      <button class="btn ghost block" data-act="closeSheet" style="margin-top:9px">再想想</button>`);
  });
  UI.on("doReset", ()=>S.reset());
  UI.on("closeSheet", ()=>UI.closeSheet());

  /* ---------- 应用锁交互 ---------- */
  UI.on("lockKey", el=>{
    const k = el.dataset.k;
    if(k === "del"){ pinBuf = pinBuf.slice(0,-1); }
    else if(k === "ok"){ submitLock(); return; }
    else if(/^\d$/.test(k)){ if(pinBuf.length < 8) pinBuf += k; }
    renderLock(false);
  });
  UI.on("lockForgot", ()=>{
    UI.sheet("忘记密码", `<p style="font-size:13.5px;line-height:1.8;color:var(--ink-2)">
      密码只保存在你本机，无法找回。<br>只能<b>清空全部数据</b>后重新使用（应用锁也会关闭）。<br><br>建议先导出一份备份。</p>
      <button class="btn block" data-act="doLockReset" style="background:var(--up);margin-top:10px">清空数据并重置</button>
      <button class="btn ghost block" data-act="closeSheet" style="margin-top:9px">再想想</button>`);
  });
  UI.on("doLockReset", ()=>S.reset());
  UI.on("lockEnable", ()=>{
    UI.sheet("设置应用锁密码", `
      <p class="tiny" style="line-height:1.8;margin-bottom:10px">设置一个 4–8 位数字密码，下次打开工作台时需要它。</p>
      <div class="fld"><label>输入密码</label><input type="tel" inputmode="numeric" maxlength="8" id="lp1" class="inp" placeholder="4–8 位数字"></div>
      <div class="fld"><label>再次输入</label><input type="tel" inputmode="numeric" maxlength="8" id="lp2" class="inp" placeholder="再输一次"></div>
      <button class="btn block" data-act="doLockSet">确定开启</button>`);
  });
  UI.on("doLockSet", ()=>{
    const a = $("#lp1").value, b = $("#lp2").value;
    if(!/^\d{4,8}$/.test(a)){ UI.toast("密码需为 4–8 位数字"); return; }
    if(a !== b){ UI.toast("两次输入不一致"); return; }
    S.setPin(a); unlocked = true; UI.closeSheet(); UI.toast("🔒 应用锁已开启"); settings();
  });
  UI.on("lockChange", ()=>{
    UI.sheet("修改密码", `
      <div class="fld"><label>当前密码</label><input type="tel" inputmode="numeric" maxlength="8" id="lp0" class="inp"></div>
      <div class="fld"><label>新密码</label><input type="tel" inputmode="numeric" maxlength="8" id="lp1" class="inp"></div>
      <div class="fld"><label>再次输入新密码</label><input type="tel" inputmode="numeric" maxlength="8" id="lp2" class="inp"></div>
      <button class="btn block" data-act="doLockChange">确定修改</button>`);
  });
  UI.on("doLockChange", ()=>{
    const o = $("#lp0").value, a = $("#lp1").value, b = $("#lp2").value;
    if(!S.verifyPin(o)){ UI.toast("当前密码错误"); return; }
    if(!/^\d{4,8}$/.test(a)){ UI.toast("新密码需为 4–8 位数字"); return; }
    if(a !== b){ UI.toast("两次输入不一致"); return; }
    S.changePin(o, a); unlocked = true; UI.closeSheet(); UI.toast("✅ 密码已修改"); settings();
  });
  UI.on("lockDisable", ()=>{
    UI.sheet("关闭应用锁", `<p class="tiny" style="line-height:1.8;margin-bottom:10px">请输入当前密码确认关闭。</p>
      <div class="fld"><label>当前密码</label><input type="tel" inputmode="numeric" maxlength="8" id="lp0" class="inp"></div>
      <button class="btn block" data-act="doLockDisable" style="background:var(--up)">确认关闭</button>`);
  });
  UI.on("doLockDisable", ()=>{
    const o = $("#lp0").value;
    if(!S.verifyPin(o)){ UI.toast("密码错误"); return; }
    S.disableLock(); UI.closeSheet(); UI.toast("应用锁已关闭"); settings();
  });

  /* ---------- 云同步面板 ---------- */
  UI.on("syncTest", async ()=>{
    UI.toast("正在测试云端连接…");
    const ok = await S.testSupa();
    UI.toast(ok ? "✅ Supabase 云端连接正常" : "❌ 无法连接云端");
    settings();
  });
  UI.on("syncNow", async ()=>{
    if(!S.getSyncURL()){ await S.setSyncURL("supabase"); }
    await S.pushSync(); await S.pullSync(); UI.toast("☁️ 已同步"); settings();
  });
  UI.on("syncOn", async ()=>{
    await S.setSyncURL("supabase"); UI.toast("✅ 已开启云端同步"); settings();
  });
  UI.on("syncOff", async ()=>{
    await S.setSyncURL(""); UI.toast("已断开同步"); settings();
  });

  /* ---------- 启动 ---------- */
  function init(){
    S.checkIn();
    S.initSync();
    document.querySelectorAll(".tab").forEach(b=>b.addEventListener("click", ()=>go(b.dataset.tab)));
    $("#sheetClose").addEventListener("click", UI.closeSheet);
    $("#sheetMask").addEventListener("click", UI.closeSheet);
    $("#btnSetting").addEventListener("click", settings);
    $("#btnCoin").addEventListener("click", ()=>go("life"));
    $("#avatar").textContent = (S.d.profile.name||"浅").slice(0,1);

    // 保存名字
    document.addEventListener("input", e=>{
      if(e.target.id === "stName"){
        S.d.profile.name = e.target.value.trim() || "浅浅"; S.save();
        $("#avatar").textContent = S.d.profile.name.slice(0,1);
      }
    });

    // 跨天自动刷新
    let lastDay = S.today();
    setInterval(()=>{ if(S.today() !== lastDay){ lastDay = S.today(); S.checkIn(); go(cur); UI.toast("新的一天，工作台已更新"); } }, 60000);
    document.addEventListener("visibilitychange", ()=>{
      if(document.hidden){ hiddenAt = Date.now(); return; }
      const longAway = hiddenAt && (Date.now()-hiddenAt > 60000);
      hiddenAt = 0;
      if(longAway && S.lockEnabled()) unlocked = false;
      if(S.today() !== lastDay){ lastDay = S.today(); S.checkIn(); go(cur); }
      else if(longAway && S.lockEnabled()) refresh();
    });

    go("today");
    setTimeout(()=>{
      const st = S.d.streak;
      if(st > 1) UI.toast("👋 欢迎回来，已连续来到工作台 " + st + " 天");
    }, 800);
  }

  return { refresh, go, init };
})();

document.addEventListener("DOMContentLoaded", App.init);
