const V='iec-v11',SHELL=['./','index.html','manifest.webmanifest','content.json','icons/icon-192.png','icons/icon-512.png','icons/icon-maskable-512.png','icons/apple-touch-icon.png','icons/cover.jpg'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(SHELL)));self.skipWaiting()});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==V).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
  const r=e.request,u=new URL(r.url);
  if(r.method!=='GET'||r.headers.has('range')||/\.(mp4|mp3)$/i.test(u.pathname))return; // media streams: browser handles
  if(u.origin===location.origin){
    if(u.pathname.endsWith('content.json')||r.mode==='navigate'||u.pathname.endsWith('index.html')||u.pathname.endsWith('/')){ // network-first so content updates arrive
      e.respondWith(fetch(r).then(x=>{const c=x.clone();caches.open(V).then(h=>h.put(r,c));return x}).catch(()=>caches.match(r)));return}
    e.respondWith(caches.match(r).then(m=>m||fetch(r).catch(()=>caches.match('index.html'))));return}
  if(u.hostname==='cdn.jsdelivr.net'){ // images & PDFs: cache-first
    e.respondWith(caches.match(r).then(m=>m||fetch(r).then(x=>{if(x.ok||x.type==='opaque'){const c=x.clone();caches.open(V+'-media').then(h=>h.put(r,c))}return x})))}
});
