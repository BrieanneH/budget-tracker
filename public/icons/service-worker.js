const FILES_TO_CACHE =[
    '/',
    '/index.html',
    '/index.js',
    '/db.js',
    '/manifest.webmanifest',
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

//active

self.addEventListener("activate", function (evt){
    evt.waitUntil(
        caches.keys().then(keyList => {
            return Promise.all(
                keyList.map(key => {
                    if(key !== CACHE_NAME && key !== DATA_CACHE_NAME {
                        console.log("Removing past cache data", key);
                        return caches.delete(key);

                    }
                
                })
            );
        })
    )
});