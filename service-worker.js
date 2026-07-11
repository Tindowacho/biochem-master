/* =========================================================
   Biochem Master service worker
   Offline-first application shell with runtime study-data caching.
   ========================================================= */

"use strict";

const CACHE_VERSION = "v14";
const STATIC_CACHE = `biochem-master-static-${CACHE_VERSION}`;
const DATA_CACHE = `biochem-master-data-${CACHE_VERSION}`;

const APP_SHELL = [
  "./",
  "./index.html",
  "./styles.css",
  "./app.js",
  "./manifest.json",
  "./data/index.json",
  "./icons/icon-192.png",
  "./icons/icon-512.png"
];

/** Cache the essential shell required to open the application offline. */
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => cache.addAll(APP_SHELL))
  );
  self.skipWaiting();
});

/** Remove stale caches after a new application version activates. */
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => ![STATIC_CACHE, DATA_CACHE].includes(key))
          .map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

/** Return the app shell for navigation requests, even when offline. */
async function handleNavigation(request) {
  try {
    const response = await fetch(request);
    const cache = await caches.open(STATIC_CACHE);
    cache.put("./index.html", response.clone());
    return response;
  } catch (error) {
    return (
      (await caches.match(request)) ||
      (await caches.match("./index.html"))
    );
  }
}

/** Serve static assets cache-first and refresh them in the background. */
async function handleStaticAsset(request) {
  const cached = await caches.match(request);

  const networkPromise = fetch(request)
    .then(async (response) => {
      if (response.ok) {
        const cache = await caches.open(STATIC_CACHE);
        cache.put(request, response.clone());
      }
      return response;
    })
    .catch(() => null);

  return cached || networkPromise;
}

/** Serve JSON data cache-first so every loaded unit remains available offline. */
async function handleStudyData(request) {
  const cache = await caches.open(DATA_CACHE);
  const cached = await cache.match(request);

  if (cached) {
    fetch(request)
      .then((response) => {
        if (response.ok) cache.put(request, response.clone());
      })
      .catch(() => {});
    return cached;
  }

  const response = await fetch(request);
  if (response.ok) cache.put(request, response.clone());
  return response;
}

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  if (request.mode === "navigate") {
    event.respondWith(handleNavigation(request));
    return;
  }

  if (url.pathname.includes("/data/") && url.pathname.endsWith(".json")) {
    event.respondWith(handleStudyData(request));
    return;
  }

  event.respondWith(handleStaticAsset(request));
});

/** Allow the page to request explicit caching of newly discovered unit files. */
self.addEventListener("message", (event) => {
  if (event.data?.type !== "CACHE_UNIT_URLS") return;

  const urls = Array.isArray(event.data.urls) ? event.data.urls : [];

  event.waitUntil(
    caches.open(DATA_CACHE).then((cache) =>
      Promise.allSettled(
        urls.map((url) => cache.add(url))
      )
    )
  );
});
