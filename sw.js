self.addEventListener('install', async event => {
    console.log('install event')
  });
  
  self.addEventListener('fetch', async event => {
    console.log('fetch event')
  });
  
  const cacheName = 'BSNL-WA-Cache';
  const staticAssets = [
    './',
    './styles/applayout.css',
    './styles/circleProgress.css',
    './index.html',
    './app.js',
    './js/jquery-3.4.1.min.js',
    './js/main.js',
    './js/motion.js',
    './js/response.json',
    './img/settings tool icon.png',




  ];
  
  self.addEventListener('install', async event => {
    const cache = await caches.open(cacheName); 
    await cache.addAll(staticAssets); 
  });
  
  self.addEventListener('fetch', event => {
    const req = event.request;
    if (/.*(json)$/.test(req.url)) {
      event.respondWith(networkFirst(req));
    } else {
      event.respondWith(cacheFirst(req));
    }
    
  });
  
  async function cacheFirst(req) {
    const cache = await caches.open(cacheName); 
    const cachedResponse = await cache.match(req); 
    return cachedResponse || fetch(req); 
  }