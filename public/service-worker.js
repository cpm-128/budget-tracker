const APP_PREFIX = 'BudgetTracker-';
const VERSION = 'version_01';
const CACHE_NAME = APP_PREFIX + VERSION;

// DEFINE which files to cache
const FILES_TO_CACHE = [
    './index.html',
    './css/styles.css',
    './js/index.js'
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