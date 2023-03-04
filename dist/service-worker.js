let cacheName = "store-c1";
let cacheFiles = [
  "index.html",
  "src/main.js",
  "src/App.vue",
  "src/components/Lesson.vue",
  "src/components/Checkout.vue",
  "src/assets/images/maths.png",
  "src/assets/images/computer.png",
  "src/assets/images/eng.png",
  "src/assets/images/music.png",
  "src/assets/images/physics.png",
  "src/assets/images/pound.png",
  "src/assets/images/sports.png",
];
self.addEventListener("install", function (e) {
  console.log("[Service Worker] Install");
  e.waitUntil(
    caches.open(cacheName).then(function (cache) {
      console.log("[Service Worker] Caching files");
      return cache.addAll(cacheFiles);
    })
  );
});
self.addEventListener("fetch", function (e) {
  e.respondWith(
    caches.match(e.request).then(function (cachedFile) {
      //return the file if it is not in the cache
      if (cachedFile) {
        console.log(
          "[Service Worker] Resource fetched from the cache for: " +
            e.request.url
        );
        return cachedFile;
      } else {
        return fetch(e.request).then(function (response) {
          return caches.open(cacheName).then(function (cache) {
            //add the new file to the cache
            cache.put(e.request, response.clone());
            console.log(
              "[Service Worker] Resource fetched and saved in the cache for: " +
                e.request.url
            );
            return response;
          });
        });
      }
    })
  );
});
