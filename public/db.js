//was originally calling db, instead realying on the cache calls
//https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API/Using_Service_Workers

conosle.log("service worker repsonding");

const FILES_TO_CACHE = [
    '/',
    './index.html',
    './favicon.ico',
    './index.js',
    './style.css',
    './manifest.webmanifest',
    './icons/192x192.png',
    './icons/icon-512x512.png',
    './db.js',
    'https://cdn.jsdelivr.net/npm/chart.js@2.8.0',
    'https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css',
    'https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/fonts/fontawesome-webfont.woff?v=4.7.0',
    'https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/fonts/fontawesome-webfont.woff2?v=4.7.0'
];
const CACHE_NAME = 'static-cache-v2'
const DATA_CACHE_NAME = 'data-cache-v1'

//keeping to install phase until the cache is opened
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(chache => {
                console.log('pre-cache sucessful')
                retutn caches.addAll(FILES_TO_CACHE)
            })
    )
    self.skipWaiting()

});

//settig up activation, getting back all keys,
// creating an array promisse to check keys and chache names
self.addEventListener('active', event =>{
    event.waitUntil(
        cahces.keys()
        
            .then(keyList =>{
              
               return Promise.all(
                    keyList.map(key => {
                        //delete old name if current data !== names
                      if (key !== CACHE_NAME && key !== DATA_CACHE_NAME){
                           cossole.log('removing old data')

                          return caches.delete(key)
                        }
                    })

                )
            })

    
    )
    self.client.claim()
})

//creating functing for fetching, 
self.addEventListener('fetch', event =>{
    if (event.request.url.includes('/api')){
        console.log(`[Service Worker] Fetch (data) ${event.request.url}`)
        event.respondWith(
            caches.open(DATA_CACHE_NAME)
            .then(cache =>{
                return fetch(event.request)
                .then(response => {
                        //200 = good request
                    if (response.status === 200) {
                        // clone the cache response and save url
                        cache.put(event.request.url, response.clone())
                    }
                    
                    return response
                })
                
                .catch(error => {
                    console.log(error)
                    return cache.match(event.request)
                }) 
        })
    )
    return
    }

//if the item does not have '/api' use open with CACHE_NAME instead
 event.respondWith(
    caches.open(CACHE_NAME)
    .then(cache => {
        reutn cache.match(event.request)
            .then(cache =>{
                return cache.match(event.request) //if response exists return
                .then(response => {
                    return response || fetch(event.response)//if not use this to make a request
                })

            })
    })
 ) 
});

