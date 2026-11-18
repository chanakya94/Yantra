const C='yantra-v1';
self.addEventListener('install',e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(['./','./index.html'])).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>e.waitUntil(clients.claim()));
self.addEventListener('fetch',e=>{
  const u=new URL(e.request.url);
  const same=u.origin===location.origin;
  const cdn=['cdn.jsdelivr.net','esm.run','fonts.googleapis.com','fonts.gstatic.com'].includes(u.hostname);
  if(e.request.method!=='GET'||!(same||cdn))return;
  e.respondWith(caches.open(C).then(async c=>{
    if(same){
      try{const r=await fetch(e.request);if(r.ok)c.put(e.request,r.clone());return r}
      catch(_){return (await c.match(e.request))||(await c.match('./index.html'))}
    }
    const hit=await c.match(e.request);if(hit)return hit;
    const r=await fetch(e.request);if(r.ok)c.put(e.request,r.clone());return r;
  }));
});
