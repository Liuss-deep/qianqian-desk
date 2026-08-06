/* ============ 存储层 + 每日刷新引擎 ============ */
window.S = (function () {
  const KEY = "qianqian.desk.v1";

  const defaults = {
    profile: { name:"浅浅", city:"", avatar:"浅" },
    coins: 0,
    todos: {},          // {date:[{id,t,pri,done}]}
    review: {},         // {date:{good,bad,next,mood,score}}
    bills: [],          // [{id,date,type,cat,amt,note}]
    budget: 3000,
    savings: { balance:0, goal:0, salaryDay:15, log:[] }, // 存款储蓄
    finDone: [],        // 已完成理财课索引
    finRead: {},        // {date:true} 金融知识已读
    stockRead: {},      // {date:true} 股市每日一学已读
    bookLog: {},        // {date:{title,pages,note}}
    bookShelf: [],      // 想读清单
    wordBox: {},        // {word:{lvl,last}}
    sceneDone: {},      // {date:[sceneIdx]}
    listenDone: [],     // 已完成精听索引
    menu: {},           // {date:{name,custom,ing,steps}}
    myRecipes: [],      // 自定义菜谱
    photos: {},         // {date:[photoId]}
    questDone: {},      // {date:[questId]}
    streak: 0, lastCheck:"",
    badges: [],
    account: { name:"", slogan:"", tags:[], created:"" },
    mediaDone: [],      // 起号路线完成
    posts: [],          // 内容发布记录
    scripts: [],        // 脚本拆解记录
    tipRead: {},        // 剪辑技巧已读
    editNotes: [],      // 剪辑技巧笔记 [{id,date,title,note}]
    muses: [],          // 碎碎念记录 [{id,ts,date,type,text,photoId}]
    newsCache: null,
    trendCache: null,
    podcastCache: null,
    wordCache: null,
    podHeard: [],
    podWant: [],
    seedOffset: 0,
    lock: { enabled:false, pin:"" }
  };

  let d = load();

  /* ---------- 云同步（多设备实时共享） ---------- */
  const SYNC_URL_KEY = "qianqian.sync.url";
  const SYNC_AT_KEY  = "qianqian.sync.at";
  let syncURL = "";
  let lastSyncAt = 0;
  let pushTimer = null;
  try { syncURL = localStorage.getItem(SYNC_URL_KEY) || ""; } catch(e){}
  try { lastSyncAt = Number(localStorage.getItem(SYNC_AT_KEY) || 0) || 0; } catch(e){}

  function load(){
    try{
      const raw = localStorage.getItem(KEY);
      if(!raw) return JSON.parse(JSON.stringify(defaults));
      const o = JSON.parse(raw);
      return Object.assign(JSON.parse(JSON.stringify(defaults)), o);
    }catch(e){ return JSON.parse(JSON.stringify(defaults)); }
  }
  function persist(){ try{ localStorage.setItem(KEY, JSON.stringify(d)); }catch(e){} }
  function save(){ persist(); schedulePush(); }

  /* ---------- 日期 ---------- */
  function today(){
    const t = new Date();
    return t.getFullYear()+"-"+String(t.getMonth()+1).padStart(2,"0")+"-"+String(t.getDate()).padStart(2,"0");
  }
  function ymd(dt){ return dt.getFullYear()+"-"+String(dt.getMonth()+1).padStart(2,"0")+"-"+String(dt.getDate()).padStart(2,"0"); }
  function dayNum(ds){ // 距离 1970 的天数，用作 seed
    const p = (ds||today()).split("-").map(Number);
    return Math.floor(Date.UTC(p[0],p[1]-1,p[2]) / 86400000);
  }
  function prettyDate(){
    const t = new Date();
    const wk = ["周日","周一","周二","周三","周四","周五","周六"][t.getDay()];
    return (t.getMonth()+1)+"月"+t.getDate()+"日 · "+wk;
  }
  function greet(){
    const h = new Date().getHours();
    if(h<6) return "夜深了，早点休息";
    if(h<11) return "早安，新的一天开始了";
    if(h<14) return "中午好，记得好好吃饭";
    if(h<18) return "下午好，再坚持一下";
    if(h<22) return "晚上好，今天辛苦啦";
    return "该收工了，明天见";
  }

  /* ---------- 每日固定伪随机 ---------- */
  function pick(arr, salt){
    if(!arr || !arr.length) return null;
    const n = dayNum() * 31 + (salt||0) * 977 + d.seedOffset * 13;
    return arr[Math.abs(n) % arr.length];
  }
  function pickIdx(len, salt){
    const n = dayNum() * 31 + (salt||0) * 977 + d.seedOffset * 13;
    return Math.abs(n) % len;
  }
  function pickMany(arr, count, salt){
    const out = [], used = new Set();
    let i = 0;
    while(out.length < Math.min(count, arr.length) && i < arr.length*4){
      const k = Math.abs(dayNum()*17 + (salt||0)*613 + i*401 + d.seedOffset*7) % arr.length;
      if(!used.has(k)){ used.add(k); out.push(arr[k]); }
      i++;
    }
    return out;
  }

  /* 地球 Online 今日任务：按日期哈希打散，相邻两天明显不同，且多端一致 */
  function hashU32(x){
    x = x >>> 0;
    x = Math.imul(x ^ (x >>> 15), 0x85ebca6b) >>> 0;
    x = Math.imul(x ^ (x >>> 13), 0xc2b2ae35) >>> 0;
    return (x ^ (x >>> 16)) >>> 0;
  }
  function dailyQuests(arr, count){
    if(!arr || !arr.length) return [];
    const h = hashU32(dayNum());
    const out = [], used = new Set();
    let i = 0, guard = 0;
    while(out.length < Math.min(count, arr.length) && guard < arr.length*4){
      const k = hashU32(h + i*2654435761) % arr.length;
      if(!used.has(k)){ used.add(k); out.push(arr[k]); }
      i++; guard++;
    }
    return out;
  }

  /* ---------- 待办 ---------- */
  function todos(date){ const k = date||today(); if(!d.todos[k]) d.todos[k]=[]; return d.todos[k]; }
  function addTodo(t, pri){
    if(!t.trim()) return;
    todos().push({ id:Date.now()+""+Math.floor(Math.random()*99), t:t.trim(), pri:pri||"normal", done:false });
    save();
  }
  function toggleTodo(id){
    const a = todos(), it = a.find(x=>x.id===id);
    if(it){ it.done = !it.done; if(it.done) addCoin(5,"完成待办"); save(); }
  }
  function delTodo(id){ d.todos[today()] = todos().filter(x=>x.id!==id); save(); }

  /* ---------- 积分 ---------- */
  function addCoin(n, why){
    d.coins += n; save();
    checkBadges();
    if(window.UI) UI.coinPop(n, why);
  }
  function level(){
    const c = d.coins;
    const lv = Math.floor(Math.sqrt(c/40)) + 1;
    const cur = Math.pow(lv-1,2)*40, next = Math.pow(lv,2)*40;
    const names = ["新生玩家","见习居民","日常修行者","生活策划师","时间管理员","自律主理人","人生规划师","地球观察员","高阶玩家","传说居民"];
    return { lv, name: names[Math.min(lv-1, names.length-1)], cur, next, pct: Math.min(100, Math.round((c-cur)/(next-cur)*100)) };
  }

  /* ---------- 连续打卡 ---------- */
  function checkIn(){
    const t = today();
    if(d.lastCheck === t) return d.streak;
    const y = new Date(); y.setDate(y.getDate()-1);
    d.streak = (d.lastCheck === ymd(y)) ? d.streak+1 : 1;
    d.lastCheck = t; save(); checkBadges();
    return d.streak;
  }

  /* ---------- 徽章 ---------- */
  function checkBadges(){
    const got = new Set(d.badges);
    const add = id => { if(!got.has(id)){ d.badges.push(id); got.add(id); if(window.UI) UI.toast("🏅 解锁成就：" + (DB.badges.find(b=>b.id===id)||{}).n); } };
    const doneCount = Object.values(d.questDone).reduce((s,a)=>s+a.length,0);
    if(doneCount>=1) add("b_first");
    if(d.coins>=100) add("b_100");
    if(d.coins>=500) add("b_500");
    if(d.coins>=1000) add("b_1000");
    if(d.streak>=3) add("b_streak3");
    if(d.streak>=7) add("b_streak7");
    if(d.streak>=30) add("b_streak30");
    if(d.bills.length>=10) add("b_ledger");
    if(Object.keys(d.bookLog).length>=7) add("b_book");
    if(Object.values(d.wordBox).filter(w=>w.lvl>=2).length>=50) add("b_word");
    if(Object.values(d.photos).reduce((s,a)=>s+a.length,0)>=5) add("b_cook");
    if(d.posts.length>=10) add("b_post");
    if((d.muses||[]).length>=30) add("b_muse");
    save();
  }

  /* ---------- 账单统计 ---------- */
  function monthBills(ymStr){
    const ym = ymStr || today().slice(0,7);
    return d.bills.filter(b=>b.date.slice(0,7)===ym);
  }
  function sum(list, type){ return list.filter(b=>b.type===type).reduce((s,b)=>s+Number(b.amt),0); }

  /* ---------- 存款储蓄 ---------- */
  function sv(){ if(!d.savings) d.savings = { balance:0, goal:0, salaryDay:15, log:[] }; return d.savings; }
  function addSaving(amt, note, dir){
    amt = Number(amt);
    if(!amt || amt<=0) return false;
    const s = sv();
    s.balance = Math.max(0, (s.balance||0) + (dir==="out" ? -amt : amt));
    s.log = s.log || [];
    s.log.unshift({ id:Date.now()+"", date:today(), dir:dir==="out"?"out":"in", amt, note:(note||"").trim() });
    save(); return true;
  }
  function setSalaryDay(n){ n = Number(n); if(n>=1 && n<=28){ sv().salaryDay = n; save(); } }
  function setGoal(g){ g = Number(g); if(g>=0){ sv().goal = g; save(); } }
  function daysToSalary(){
    const s = (sv().salaryDay)||15;
    const t = new Date(), y = t.getFullYear(), m = t.getMonth();
    let next = new Date(y, m, s);
    if(next < t) next = new Date(y, m+1, s);
    return Math.max(0, Math.round((next - t)/86400000));
  }

  /* ---------- 图片存储（IndexedDB，file:// 下回退 localStorage base64） ---------- */
  const LS_PHOTO_PREFIX = "qq_photo_";
  let dbp = null, _idbOk = true;
  function blobToB64(blob){
    return new Promise((res,rej)=>{
      const fr = new FileReader();
      fr.onload = ()=>res(String(fr.result).split(",")[1]);
      fr.onerror = ()=>rej(new Error("read fail"));
      fr.readAsDataURL(blob);
    });
  }
  function b64ToBlob(b64, type){
    try{
      const bin = atob(b64), len = bin.length, arr = new Uint8Array(len);
      for(let i=0;i<len;i++) arr[i] = bin.charCodeAt(i);
      return new Blob([arr], { type: type||"image/jpeg" });
    }catch(e){ return null; }
  }
  function idb(){
    if(!_idbOk) return Promise.reject(new Error("idb disabled"));
    if(dbp) return dbp;
    dbp = new Promise((res,rej)=>{
      try{
        if(!window.indexedDB){ _idbOk=false; rej(new Error("no idb")); return; }
        const r = indexedDB.open("qianqian_photos", 1);
        r.onupgradeneeded = e => { e.target.result.createObjectStore("img"); };
        r.onsuccess = e => res(e.target.result);
        r.onerror = ()=>{ _idbOk=false; rej(new Error("open fail")); };
      }catch(e){ _idbOk=false; rej(e); }
    });
    return dbp;
  }
  async function putImg(id, blob){
    try{
      const db = await idb();
      await new Promise(res=>{ const tx=db.transaction("img","readwrite"); tx.objectStore("img").put(blob,id); tx.oncomplete=()=>res(); tx.onerror=()=>res(); });
      return true;
    }catch(e){
      // 回退：localStorage 存 base64
      try{ const b64 = await blobToB64(blob); localStorage.setItem(LS_PHOTO_PREFIX+id, b64); return true; }catch(_){ return false; }
    }
  }
  async function getImg(id){
    try{
      const db = await idb();
      const r = await new Promise(res=>{ const tx=db.transaction("img","readonly"); const q=tx.objectStore("img").get(id); q.onsuccess=()=>res(q.result); q.onerror=()=>res(null); });
      if(r) return r;
    }catch(e){}
    // 回退：localStorage
    try{ const b64 = localStorage.getItem(LS_PHOTO_PREFIX+id); if(b64){ const b=b64ToBlob(b64); if(b) return b; } }catch(e){}
    return null;
  }
  async function delImg(id){
    try{ const db=await idb(); const tx=db.transaction("img","readwrite"); tx.objectStore("img").delete(id); }catch(e){}
    try{ localStorage.removeItem(LS_PHOTO_PREFIX+id); }catch(e){}
  }

  /* 通用：把图片文件压缩成适合存储的 blob（复用于餐桌/碎碎念） */
  function compressImage(file){
    return new Promise(res=>{
      const img = new Image();
      img.onload = ()=>{
        const max = 1100;
        let w = img.width, h = img.height;
        if(w>max || h>max){ const r = Math.min(max/w, max/h); w = w*r|0; h = h*r|0; }
        try{
          const cv = document.createElement("canvas"); cv.width=w; cv.height=h;
          cv.getContext("2d").drawImage(img,0,0,w,h);
          cv.toBlob(b=>res(b||file), "image/jpeg", .82);
        }catch(e){ res(file); }
      };
      img.onerror = ()=>res(file);
      img.src = URL.createObjectURL(file);
    });
  }

  /* ---------- 碎碎念（记录身边的事） ---------- */
  function museList(){
    return (d.muses||[]).slice().sort((a,b)=>b.ts-a.ts);
  }
  async function addMuse(text, type, blob){
    const known = ["note","complain","beauty","photo"];
    type = known.includes(type) ? type : "note";
    const entry = { id:"m"+Date.now()+""+Math.floor(Math.random()*99), ts:Date.now(), date:today(), type, text:(text||"").trim(), photoId:null };
    if(blob){
      try{
        const b = await compressImage(blob);
        const id = "mp"+Date.now()+""+Math.floor(Math.random()*99);
        await putImg(id, b);
        entry.photoId = id;
      }catch(e){}
    }
    d.muses = d.muses || [];
    d.muses.push(entry);
    save();
    checkBadges();
    addCoin(3, "记录碎碎念");
    return entry;
  }
  async function delMuse(id){
    const m = (d.muses||[]).find(x=>x.id===id);
    if(m && m.photoId) await delImg(m.photoId);
    d.muses = (d.muses||[]).filter(x=>x.id!==id);
    save();
  }

  /* ---------- 远程每日推送 ---------- */
  async function fetchDaily(){
    const get = async (p, cacheKey, fb) => {
      // 单文件 / 离线模式：优先使用内嵌数据（无需 fetch）
      if(window.__EMBEDDED__ && window.__EMBEDDED__[cacheKey]){
        try{ const j = window.__EMBEDDED__[cacheKey]; d[cacheKey] = j; save(); return j; }catch(e){}
      }
      try{
        // 6 秒超时保护：避免 fetch 在某些本地 / 预览环境下永远 pending 而卡死界面
        let ctrl = null, to = null;
        if(typeof AbortController !== "undefined"){
          ctrl = new AbortController();
          to = setTimeout(()=>{ try{ ctrl.abort(); }catch(e){} }, 6000);
        }
        const r = await fetch(p + "?t=" + Date.now(), { cache:"no-store", signal: ctrl?ctrl.signal:undefined });
        if(to) clearTimeout(to);
        if(!r.ok) throw 0;
        const j = await r.json();
        // news/trend/podcast 数据用 items/xhs 字段判定
        if(j && (j.items || j.xhs)){ d[cacheKey] = j; save(); return j; }
        throw 0;
      }catch(e){ return d[cacheKey] || fb; }
    };
    // 新闻兜底：当 latest 非「今天」（自动化 08:30 未成功推送）时，降级为本地轮换锦囊，避免展示过期新闻
    function buildNewsFallback(){
      const tips = (DB.newsTips && DB.newsTips.length) ? DB.newsTips : null;
      if(tips && tips.length){
        const idx = Math.abs(dayNum() % tips.length);
        const t = tips[idx];
        return {
          date:"",
          note:"⚠️ 今日新闻推送尚未更新（通常每天 08:30 自动生成）。先送你一条锦囊：",
          items:[ { t:t.t, d:t.d } ]
        };
      }
      return DB.fallbackNews;
    }
    // 热点兜底：当 latest 非「今天」（自动化 08:00 未成功推送）时，降级为本地常青选题，避免展示过期热点
    function buildTrendFallback(){
      const base = DB.fallbackTrends || { xhs:[], dy:[], script:{ title:"", rows:[] } };
      const day = dayNum();
      const rot = (arr, n) => {
        if(!arr || !arr.length) return [];
        const out = [], used = new Set();
        let i = 0;
        while(out.length < n && i < arr.length * 3){
          const k = (Math.imul(day, 2654435761) + i * 40503) % arr.length;
          if(!used.has(k)){ used.add(k); out.push(arr[k]); }
          i++;
        }
        return out.length ? out : arr.slice(0, n);
      };
      return {
        date:"",
        note:"⚠️ 今日热点（08:00）推送尚未更新，先送你一组常青选题参考；推送恢复后会自动替换为当日真实热榜。",
        xhs: rot(base.xhs, 3),
        dy: rot(base.dy, 3),
        script: base.script || { title:"", rows:[] }
      };
    }
    async function fetchWord(){
      const sb = getSupa();
      if(sb){
        try{
          const { data, error } = await sb.from("app_state").select("data").eq("id","daily_word").maybeSingle();
          if(!error && data && data.data && data.data.item){
            d.wordCache = data.data; save();
            return data.data;
          }
        }catch(e){}
      }
      return await get("data/daily/word-latest.json","wordCache", DB.fallbackWord);
    }
    // 新闻：优先读 Supabase（与 daily_word 同表，即时生效、免部署）；离线/失败再回退静态 JSON
    async function fetchNews(){
      const sb = getSupa();
      if(sb){
        try{
          const { data, error } = await sb.from("app_state").select("data").eq("id","daily_news").maybeSingle();
          if(!error && data && data.data && Array.isArray(data.data.items) && data.data.items.length){
            d.newsCache = data.data; save();
            return data.data;
          }
        }catch(e){}
      }
      return await get("data/daily/news-latest.json","newsCache", DB.fallbackNews);
    }
    // 热点：同上，Supabase 表 id='daily_trends'
    async function fetchTrend(){
      const sb = getSupa();
      if(sb){
        try{
          const { data, error } = await sb.from("app_state").select("data").eq("id","daily_trends").maybeSingle();
          if(!error && data && data.data && (Array.isArray(data.data.xhs) || Array.isArray(data.data.items))){
            d.trendCache = data.data; save();
            return data.data;
          }
        }catch(e){}
      }
      return await get("data/daily/trends-latest.json","trendCache", DB.fallbackTrends);
    }
    const [news, trend, podcast, word] = await Promise.all([
      fetchNews(),
      fetchTrend(),
      get("data/daily/podcasts-latest.json","podcastCache", DB.fallbackPodcasts),
      fetchWord()
    ]);
    // 新闻 / 热点非今日则降级到本地兜底（避免停留在昨天的过期内容）
    const newsOut = (news && news.date === S.today()) ? news : buildNewsFallback();
    const trendOut = (trend && trend.date === S.today()) ? trend : buildTrendFallback();
    return { news: newsOut, trend: trendOut, podcast, word };
  }

  function reset(){ localStorage.removeItem(KEY); location.reload(); }
  function exportData(){ return JSON.stringify(d, null, 2); }
  function importData(txt){
    try{ const o = JSON.parse(txt); d = Object.assign(JSON.parse(JSON.stringify(defaults)), o); save(); return true; }
    catch(e){ return false; }
  }

  /* ---------- 云同步实现 ---------- */
  function normURL(u){
    u = (u || "").trim();
    if(!u) return "";
    if(!/^https?:\/\//i.test(u)) u = "http://" + u;
    return u.replace(/\/+$/, "");
  }
  /* ---------- Supabase 同步后端（多设备共享同一张表 = 自动互通） ---------- */
  const SUPABASE_URL  = "https://qjpirlacyxrnfruvwguv.supabase.co";
  const SUPABASE_ANON = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFqcGlybGFjeXhybmZydXZ3Z3V2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODU4NzQ2MzgsImV4cCI6MjEwMTQ1MDYzOH0.r4EaveGbgOdXcCs9gfUayGrenxE6eQ0CgJVB4Wt6vmI";
  const SB_ROW = "global";
  let _sb = null;
  function getSupa(){
    if(_sb !== null) return _sb;
    try{
      if(typeof window !== "undefined" && window.supabase && window.supabase.createClient){
        _sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON, { auth:{ persistSession:false, autoRefreshToken:false } });
      } else { _sb = false; }
    }catch(e){ _sb = false; }
    return _sb;
  }
  function syncEnabled(){ return !!getSupa(); }

  function getSyncURL(){ return syncURL; }
  function syncInfo(){ return { url: syncEnabled() ? SUPABASE_URL : "", at:lastSyncAt }; }

  function schedulePush(){
    if(!syncEnabled()) return;
    clearTimeout(pushTimer);
    pushTimer = setTimeout(pushSync, 800);   // 防抖：连续改动只推一次
  }
  async function pushSync(){
    const sb = getSupa(); if(!sb) return;
    const at = Date.now();
    try{
      const { error } = await sb.from("app_state").upsert({ id: SB_ROW, data: d, updated_at: new Date(at).toISOString() });
      if(!error){ lastSyncAt = at; try{ localStorage.setItem(SYNC_AT_KEY, String(at)); }catch(e){} }
    }catch(e){ /* 离线则静默失败，下次保存再推 */ }
  }
  async function pullRaw(){
    const sb = getSupa(); if(!sb) return null;
    try{
      const { data, error } = await sb.from("app_state").select("data,updated_at").eq("id", SB_ROW).maybeSingle();
      if(error || !data) return null;
      const raw = data.updated_at || "";
      // Supabase 返回的 updated_at 形如 "2026-08-05T02:32:24.289+00:00"（带偏移量、不以 Z 结尾）。
      // 直接给偏移量时间戳加 "Z" 会变成 "...+00:00Z"，被 Date 解析为 NaN —— 曾导致 pull 永不触发、双端无法同步。
      // 用 Date.parse 同时兼容 "+00:00" 与 "Z" 两种写法。
      const at = raw ? (Date.parse(raw) || new Date(raw).getTime() || 0) : 0;
      return { at, state: data.data };
    }catch(e){ return null; }
  }
  async function testSupa(){
    const r = await pullRaw();
    return r !== null;
  }
  async function pullSync(){
    if(!syncEnabled()) return;
    const j = await pullRaw();
    if(j && j.at && j.at > lastSyncAt){
      d = Object.assign(JSON.parse(JSON.stringify(defaults)), j.state || {});
      lastSyncAt = j.at;
      try{ localStorage.setItem(SYNC_AT_KEY, String(lastSyncAt)); }catch(e){}
      persist();
      if(window.UI) UI.toast("☁️ 已同步到最新数据");
      if(window.App) App.refresh();
    }
  }
  async function connectSync(){
    if(!syncEnabled()) return;
    const raw = await pullRaw();
    const localFresh = (lastSyncAt === 0);
    if(!raw || !raw.at){ await pushSync(); return; }       // 无远程数据：本机作为种子上传
    const remoteState = raw.state || {};
    const remoteEmpty = Object.keys(remoteState).length === 0;
    if(localFresh){
      if(remoteEmpty){ await pushSync(); }                  // 云端只有空占位 → 本机数据上传
      else { d = Object.assign(JSON.parse(JSON.stringify(defaults)), remoteState); lastSyncAt = raw.at; try{ localStorage.setItem(SYNC_AT_KEY, String(lastSyncAt)); }catch(e){} persist(); }
    } else {
      if(raw.at > lastSyncAt){ d = Object.assign(JSON.parse(JSON.stringify(defaults)), remoteState); lastSyncAt = raw.at; try{ localStorage.setItem(SYNC_AT_KEY, String(lastSyncAt)); }catch(e){} persist(); }
      else if(raw.at < lastSyncAt){ await pushSync(); }
    }
  }
  async function setSyncURL(u){
    if(!u){ syncURL = ""; lastSyncAt = 0; try{ localStorage.removeItem(SYNC_URL_KEY); localStorage.removeItem(SYNC_AT_KEY); }catch(e){} return; }
    syncURL = "supabase"; try{ localStorage.setItem(SYNC_URL_KEY, syncURL); }catch(e){}
    if(syncEnabled()){ await connectSync(); if(window.App) App.refresh(); }
  }
  // 自动开启：检测到 Supabase 环境即连接共享表，多设备打开任意一端自动互通（零配置）
  async function autoDetectSync(){
    if(syncURL) return;
    if(!syncEnabled()) return;
    syncURL = "supabase"; try{ localStorage.setItem(SYNC_URL_KEY, syncURL); }catch(e){}
  }
  let _rtCh = null;
  function subscribeRealtime(){
    const sb = getSupa(); if(!sb || _rtCh) return;
    try{
      _rtCh = sb.channel("app_state_global").on(
        "postgres_changes",
        { event:"UPDATE", schema:"public", table:"app_state", filter:"id=eq." + SB_ROW },
        () => { pullSync(); }
      ).subscribe();
    }catch(e){ _rtCh = null; }
  }
  async function initSync(){
    await autoDetectSync();
    if(!syncEnabled()) return;
    await connectSync();            // 启动时先拉取/上传种子
    setInterval(pullSync, 20000);   // 每 20 秒拉一次，保证多端近实时
    subscribeRealtime();            // 实时推送（表已加入 supabase_realtime publication）
  }

  /* ---------- 应用锁 ---------- */
  function hashPin(p){
    let h = 5381;
    for(let i=0;i<p.length;i++){ h = ((h<<5)+h + p.charCodeAt(i)) >>> 0; }
    return "p" + h.toString(36);
  }
  function lockEnabled(){ return !!(d.lock && d.lock.enabled); }
  function setPin(p){ d.lock = d.lock || { enabled:false, pin:"" }; d.lock.enabled = true; d.lock.pin = hashPin(p); save(); }
  function verifyPin(p){ return !!(d.lock && d.lock.pin) && d.lock.pin === hashPin(p); }
  function disableLock(){ if(!d.lock) d.lock = { enabled:false, pin:"" }; d.lock.enabled = false; d.lock.pin = ""; save(); }
  function changePin(oldP, newP){ if(!verifyPin(oldP)) return false; d.lock.pin = hashPin(newP); save(); return true; }

  return { get d(){return d;}, save, persist, today, ymd, dayNum, prettyDate, greet,
           pick, pickIdx, pickMany, dailyQuests, todos, addTodo, toggleTodo, delTodo,
           addCoin, level, checkIn, checkBadges, monthBills, sum,
           sv, addSaving, setSalaryDay, setGoal, daysToSalary,
           putImg, getImg, delImg, compressImage, fetchDaily, reset, exportData, importData,
           museList, addMuse, delMuse,
           normURL, getSyncURL, syncInfo, pushSync, pullSync, connectSync, setSyncURL, initSync, testSupa,
           lockEnabled, setPin, verifyPin, disableLock, changePin };
})();
