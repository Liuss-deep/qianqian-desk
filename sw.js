/* 浅浅的工作台 · Service Worker
   作用：让网站可被"安装"成独立 App（无浏览器地址栏）；
        每日数据 / 同步接口 / JS 资源：永远走网络（保证代码最新，不被缓存拖死）；
        静态资源（图标/CSS/HTML 骨架）缓存优先，断网也能打开。 */
const CACHE = "qq-desk-v2";
const SHELL = [
  // 只 precache 装桌面必须的"骨架"资源。**绝对不要 precache JS**，否则代码改了用户永远看不到。
  "/", "/index.html", "/manifest.json",
  "/assets/css/app.css",
  "/assets/icon.svg",
  "/assets/icon-192.png", "/assets/icon-512.png",
  "/assets/icon-maskable-192.png", "/assets/icon-maskable-512.png"
];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL).catch(() => {})).then(() => self.skipWaiting()));
});
self.addEventListener("activate", (e) => {
  // 删掉旧版本缓存（v1 等），逼浏览器装 v2 的 SHELL
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener("fetch", (e) => {
  if (e.request.method !== "GET") { e.respondWith(fetch(e.request)); return; }
  const url = new URL(e.request.url);
  // 1) 每日数据 / 同步接口：永远走网络（带缓存兜底）
  if (url.pathname.startsWith("/data/") || url.pathname.startsWith("/api/") || url.host.includes("supabase")) {
    e.respondWith(fetch(e.request).catch(() => caches.match(e.request)));
    return;
  }
  // 2) JS 资源 / index.html：**网络优先**（代码改了一定要拿到最新），失败才用缓存
  const isJSorHTML = url.pathname.endsWith(".js") || url.pathname.endsWith(".html") || url.pathname === "/";
  if (isJSorHTML) {
    e.respondWith(
      fetch(e.request, { cache: "no-store" }).then(res => {
        if (res && res.ok) {
          const copy = res.clone();
          caches.open(CACHE).then(c => c.put(e.request, copy));
        }
        return res;
      }).catch(() => caches.match(e.request))
    );
    return;
  }
  // 3) 其他静态资源（图标/CSS）：缓存优先，断网兜底
  e.respondWith(
    caches.match(e.request).then(cached => {
      const net = fetch(e.request).then(res => {
        if (res && res.ok) caches.open(CACHE).then(c => c.put(e.request, res.clone()));
        return res;
      }).catch(() => cached);
      return cached || net;
    })
  );
});
