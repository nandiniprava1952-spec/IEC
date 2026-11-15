const V='iec-v39',SHELL=['./','index.html','manifest.webmanifest','content.json','icons/icon-192.png','icons/icon-512.png','icons/icon-maskable-512.png','icons/apple-touch-icon.png','icons/cover-full.jpg','icons/cover-asha-cycle.jpg','lib/pdf.min.js','lib/pdf.worker.min.js','update-kit.js'];
// install: download every app file and report the real progress to the page (drives the update ring).
// The new version then WAITS; it is switched on only when the user taps "Update" (see update-kit.js).
self.addEventListener('install',e=>{e.waitUntil((async()=>{const c=await caches.open(V);let n=0,dead=0;
  const say=async p=>{const l=await self.clients.matchAll({includeUncontrolled:true,type:'window'});if(!dead)l.forEach(w=>w.postMessage({type:'upk-progress',v:V,pct:p}))};
  await say(0);
  try{await Promise.all(SHELL.map(async u=>{const r=await fetch(new Request(u,{cache:'reload'}));if(!r.ok)throw new Error(u);await c.put(u,r);await say(Math.round(++n/SHELL.length*100))}))}catch(x){dead=1;throw x}})())});
self.addEventListener('message',e=>{const d=e.data;if(d==='SKIP_WAITING'||(d&&d.type==='SKIP_WAITING'))self.skipWaiting()});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==V&&x!==V+'-media').map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
  const r=e.request,u=new URL(r.url);
  if(r.method!=='GET'||r.headers.has('range')||/\.(mp4|mp3)$/i.test(u.pathname))return; // media streams: browser handles
  if(u.origin===location.origin){
    if(u.pathname.endsWith('content.json')||r.mode==='navigate'||u.pathname.endsWith('index.html')||u.pathname.endsWith('/')){ // network-first so updates arrive
      e.respondWith(fetch(r).then(x=>{const c=x.clone();caches.open(V).then(h=>h.put(r,c));return x}).catch(()=>caches.match(r).then(m=>m||caches.match('index.html'))));return}
    e.respondWith(caches.match(r).then(m=>m||fetch(r).catch(()=>caches.match('index.html'))));return}
  if(u.hostname==='cdn.jsdelivr.net'){ // images & PDFs: cache-first
    e.respondWith(caches.match(r).then(m=>m||fetch(r).then(x=>{if(x.ok||x.type==='opaque'){const c=x.clone();caches.open(V+'-media').then(h=>h.put(r,c))}return x})))}
});
