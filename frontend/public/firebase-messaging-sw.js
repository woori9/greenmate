/* eslint-disable no-restricted-globals */
/* eslint-disable no-undef */
// Scripts for firebase and firebase messaging
importScripts(
  'https://www.gstatic.com/firebasejs/9.6.11/firebase-app-compat.js',
);
importScripts(
  'https://www.gstatic.com/firebasejs/9.6.11/firebase-messaging-compat.js',
);

importScripts(
  'https://storage.googleapis.com/workbox-cdn/releases/5.1.2/workbox-sw.js',
);

const CACHE = 'pwabuilder-page';

const offlineFallbackPage = 'offline.html';

self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

self.addEventListener('install', async event => {
  event.waitUntil(
    caches.open(CACHE).then(cache => cache.add(offlineFallbackPage)),
  );
});

if (workbox.navigationPreload.isSupported()) {
  workbox.navigationPreload.enable();
}

self.addEventListener('fetch', event => {
  // Set Firebase configuration, once available
  const urlParams = new URLSearchParams(location.search);
  self.firebaseConfig = Object.fromEntries(urlParams);

  if (event.request.mode === 'navigate') {
    event.respondWith(
      (async () => {
        try {
          const preloadResp = await event.preloadResponse;

          if (preloadResp) {
            return preloadResp;
          }

          const networkResp = await fetch(event.request);
          return networkResp;
        } catch (error) {
          const cache = await caches.open(CACHE);
          const cachedResp = await cache.match(offlineFallbackPage);
          return cachedResp;
        }
      })(),
    );
  }
});

// "Default" Firebase configuration (prevents errors)
const defaultConfig = {
  apiKey: true,
  projectId: true,
  messagingSenderId: true,
  appId: true,
};

let messaging = null;

if (firebase.messaging.isSupported()) {
  firebase.initializeApp(self.firebaseConfig || defaultConfig);
  messaging = firebase.messaging();
} else {
  console.log('no support firebase');
}

if (messaging) {
  messaging.onBackgroundMessage(function (payload) {
    console.log('Received background message ', payload);

    const notificationTitle = payload.data.title;
    const notificationOptions = {
      body: payload.data.body,
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
  });
}
