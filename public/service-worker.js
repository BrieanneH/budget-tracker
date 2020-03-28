//  referenced: https://github.com/w3c/ServiceWorker/issues/1237
//              https://books.google.com/books?id=G4ZcDgAAQBAJ&newbks=1&newbks_redir=0&printsec=frontcover#v=onepage&q&f=false

const FILES_TO_CACHE =[
    '/',
    '/index.html',
    '/index.js',
    '/db.js',
    '/style.css'
];

const CACHE_NAME = "static-cache-v2";
const DATA_CACHE_NAME = "data-cache-v1";

//install

self.addEventListener("install", function (evt){
    evt.waitUntil(
        caches.open(CACHE_NAME).then(cache=> {
            console.log ("files were pre-cached successfully!");
            return cache.addAll(FILES_TO_CACHE);
        })
    );

    self.skipWaiting();
});

//active, pg.227

self.addEventListener("activate", function (evt){
    evt.waitUntil(
        caches.keys().then(keyList => {
            return Promise.all(
                keyList.map(key => {
                    if(key !== CACHE_NAME && key !== DATA_CACHE_NAME) {
                        console.log("Removing past cache data", key);
                        return caches.delete(key);

                    }
                
                })
            );
        })
    )
});

self.clients.claim();


self.addEventListener("fetch", function (evt){
    if(evt.request.url.includes("/api/")) {
        evt.respondWith(
            caches.open(DATA_CACHE_NAME).then(cache =>{
                return fetch(evt.request)
                .then(response => {
                    //if repsonse is okay, clone and store within the cache
                    if (response.status === 200){
                        cache.put(evt.request.url, response.clone());
                    }

                    return response;

                })
                //if network request failed then try to get it from the cache
                .catch(err => {
                    return cache.match(evt.request);
                });

            }).catch(err => console.log(err))

            
        );
        return;

    }

    evt.respondWith(
        caches.match(evt.request).then(function (response){
            return res || fetch (evt.request);
        })

    
    );


});



