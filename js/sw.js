const VERSION = "v1";

const CACHE_NAME = `les-aventures-du-pb-et-billy-${VERSION}`;

const APP_STATIC_RESOURCES = [
    "/saga_de_billy",
    "/saga_de_billy/",
    "/saga_de_billy/index.html",
    "/saga_de_billy/page/billy.html",
    "/saga_de_billy/js/index.js",
    "/saga_de_billy/js/sw.js",
    "/saga_de_billy/js/modules/data/billy.js",
    "/saga_de_billy/js/modules/data/book.js",
    "/saga_de_billy/js/modules/data/caractere.js",
    "/saga_de_billy/js/modules/data/materiel.js",
    "/saga_de_billy/js/modules/data/objet.js",
    "/saga_de_billy/js/modules/data/succes.js",
    "/saga_de_billy/js/modules/data/stat.js",
    "/saga_de_billy/js/modules/view/display.js",
    "/saga_de_billy/js/modules/view/events.js",
    "/saga_de_billy/js/modules/view/utilities.js",
    "/saga_de_billy/img/FDCN.svg",
    "/saga_de_billy/img/CDSI.svg",
    "/saga_de_billy/img/LDV.svg",
    "/saga_de_billy/img/PYRO_R.svg",
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
        event.respondWith(caches.match("/saga_de_billy"));
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