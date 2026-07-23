const CACHE_NAME = "storyapp-v1";
const DATA_CACHE_NAME = "storyapp-data-v1";

const STATIC_ASSETS = [
  "/",
  "/index.html",
  "/favicon.png",
  "/manifest.json",
];

// INSTALL SERVICE WORKER & PRECACHE APP SHELL
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("[ServiceWorker] Precaching App Shell");
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

// ACTIVATE SERVICE WORKER & CLEANUP OLD CACHES
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME && cacheName !== DATA_CACHE_NAME) {
            console.log("[ServiceWorker] Removing old cache:", cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// FETCH EVENT WITH DYNAMIC CACHING STRATEGY
self.addEventListener("fetch", (event) => {
  const { request } = event;

  // ONLY INTERCEPT GET REQUESTS
  if (request.method !== "GET") {
    return;
  }

  const url = new URL(request.url);

  // Strategy for Story API & Images: Stale-While-Revalidate / Network First with Cache Fallback
  if (
    url.origin === "https://story-api.dicoding.dev" ||
    request.destination === "image"
  ) {
    event.respondWith(
      caches.open(DATA_CACHE_NAME).then(async (cache) => {
        try {
          const response = await fetch(request);
          if (response.status === 200) {
            cache.put(request, response.clone());
          }
          return response;
        } catch (error) {
          console.log("[ServiceWorker] Network failed, serving from cache:", request.url);
          const cachedResponse = await cache.match(request);
          if (cachedResponse) {
            return cachedResponse;
          }
          throw error;
        }
      })
    );
    return;
  }

  // Strategy for Static Assets (App Shell): Cache First with Network Fallback
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(request).catch(() => {
        return caches.match("/index.html");
      });
    })
  );
});

// PUSH NOTIFICATION EVENT LISTENER
self.addEventListener("push", (event) => {
  console.log("[ServiceWorker] Push Received");

  let notificationData = {
    title: "Story Baru Dibuat!",
    options: {
      body: "Ada story baru yang berhasil ditambahkan.",
      icon: "/images/icon-192.png",
      badge: "/images/icon-192.png",
      data: {
        url: "/#/",
      },
      actions: [
        {
          action: "open_story",
          title: "Lihat Story",
        },
      ],
    },
  };

  if (event.data) {
    try {
      const payload = event.data.json();
      if (payload.title) {
        notificationData.title = payload.title;
      }
      if (payload.options) {
        notificationData.options = {
          ...notificationData.options,
          ...payload.options,
        };
      }
    } catch (e) {
      notificationData.options.body = event.data.text();
    }
  }

  event.waitUntil(
    self.registration.showNotification(
      notificationData.title,
      notificationData.options
    )
  );
});

// NOTIFICATION CLICK EVENT LISTENER
self.addEventListener("notificationclick", (event) => {
  console.log("[ServiceWorker] Notification click received");
  event.notification.close();

  const targetUrl = event.notification.data?.url || "/#/";

  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((windowClients) => {
      for (let client of windowClients) {
        if (client.url.includes(targetUrl) && "focus" in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
    })
  );
});
