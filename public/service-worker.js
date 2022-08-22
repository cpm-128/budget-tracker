const APP_PREFIX = 'BudgetTracker-';
const VERSION = 'version_01';
const CACHE_NAME = APP_PREFIX + VERSION;
const DATA_CACHE_NAME = 'data-cache-v1';

// DEFINE which files to cache
const FILES_TO_CACHE = [
    '/',
    '/index.html',
    '/css/styles.css',
    '/js/index.js',
    '/icons/icon-72x72.png',
    '/icons/icon-96x96.png',
    '/icons/icon-128x128.png',
    '/icons/icon-144x144.png',
    '/icons/icon-152x152.png',
    '/icons/icon-192x192.png',
    '/icons/icon-384x384.png',
    '/icons/icon-512x512.png'
];

// INSTALL the service worker, adding files to the precache
self.addEventListener('install', function (e) {
    e.waitUntil(
        caches.open(CACHE_NAME).then(function (cache) {
            console.log('>> installing cache >> ', CACHE_NAME)
            return cache.addAll(FILES_TO_CACHE)
        })
    )
})

// ACTIVATE the service worker, clearing out any old data from cache and tell service worker how to manage caches
self.addEventListener('activate', function (e) {
    e.waitUntil(
        caches.keys().then(function (keyList) {
            let cacheKeeplist = keyList.filter(function (key) {
                return key.indexOf(APP_PREFIX);
            });
            cacheKeeplist.push(CACHE_NAME);
            return Promise.all(keyList.map(function (key, i) {
                if (cacheKeeplist.indexOf(key) === -1) {
                    console.log('>> deleting cache >> ' + keyList[i] );
                    return caches.delete(keyList[i]);
                }
            }));
        })
    );
});

// FETCH the browser should check the cache when there is not network connection
self.addEventListener('fetch', function (e) {
    // only if api is in the url, open the cache to allow it to fetch the event request. then clone  the response
    if (e.request.url.includes('/api/')) {
        console.log('>> fetch request >> ' + e.request.url)
        e.respondWith(
            caches.open(DATA_CACHE_NAME).then(cache => {
                return fetch(e.request)
                    .then(response => {
                        // clone response and store in cache
                        if (response.status === 200) {
                            cache.put(e.request.url, response.clone());
                        }
                        return response;
                    })
                    .catch(err => {
                        // request failed, retrieve from cache
                        return cache.match(e.request);
                    });
            })
            .catch(err => console.log(err))
        );
        return;
    }

    e.respondWith(
        fetch(e.request).catch(function () {
            return caches.match(e.request).then(function (response) {
                if (response) {
                    return response
                } else if (e.request.headers.get('accept').includes('text/html')) {
                    // return the cached index.html for all requests for all html pages
                    return caches.match('/');
                }
            });

        })
    );
});