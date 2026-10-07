const C='py-notepad-v1';
self.addEventListener('install',()=>self.skipWaiting());
self.addEventListener('activate',e=>e.waitUntil(clients.claim()));
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;
  const same=new URL(e.request.url).origin===location.origin;
  e.respondWith(caches.open(C).then(async c=>{
    const hit=await c.match(e.request);
    if(!same&&hit)return hit;               // Python runtime files: cache-first
    try{const r=await fetch(e.request);if(r.ok||r.type==='opaque')c.put(e.request,r.clone());return r}
    catch(x){return hit||Response.error()}   // app files: network-first, offline fallback
  }));
});
