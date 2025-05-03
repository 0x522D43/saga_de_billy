const VERSION = "v1";

const CACHE_NAME = `les-aventures-du-pb-et-billy-${VERSION}`;

const APP_STATIC_RESOURCES = [
    "/",
    "/index.html",
    "/page/billy.html",
    "/js/index.js",
    "/js/modules/data/billy.js",
    "/js/modules/data/book.js",
    "/js/modules/data/caractere.js",
    "/js/modules/data/materiel.js",
    "/js/modules/data/objet.js",
    "/js/modules/data/succes.js",
    "/js/modules/data/stat.js",
    "/js/modules/view/display.js",
    "/js/modules/view/event.js",
    "/js/modules/view/utilities.js",
    "/img/FDCN.svg",
    "/img/CDSI.svg",
    "/img/LDV.svg",
    "/img/PYRO.svg",
];


self.addEventListener("install", (event) => {
    event.waitUntil(
        (async () => {
            const cache = await caches.open(CACHE_NAME);
            cache.addAll(APP_STATIC_RESOURCES);
        })(),
    );
});

self.addEventListener("activate", (event) => {
    event.waitUntil(
        (async () => {
            const names = await caches.keys();
            await Promise.all(names
                .filter(name => name !== CACHE_NAME)
                .map(caches.delete)
            );
            await clients.claim();
        })(),
    );
});

self.addEventListener("fetch", (event) => {
    // when seeking an HTML page
    if (event.request.mode === "navigate") {
        // Return to the index.html page
        event.respondWith(caches.match("/"));
        return;
    }

    // For every other request type
    event.respondWith(
        (async () => {
            const cache = await caches.open(CACHE_NAME);
            const cachedResponse = await cache.match(event.request.url);
            if (cachedResponse) {
                // Return the cached response if it's available.
                return cachedResponse;
            }
            // Respond with a HTTP 404 response status.
            return new Response(null, { status: 404 });
        })(),
    );
});