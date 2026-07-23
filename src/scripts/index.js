// CSS imports
import "../styles/styles.css";
import "leaflet/dist/leaflet.css";

import App from "./pages/app";
import {
  registerServiceWorker,
  isPushSubscribed,
  togglePushSubscription,
} from "./utils/sw-register";
import { initOfflineSyncListener, syncOfflineStories } from "./utils/offline-sync";

function updateNav() {
  const token = localStorage.getItem("token");

  const login = document.getElementById("nav-login");
  const register = document.getElementById("nav-register");
  const logout = document.getElementById("nav-logout");

  if (!login || !register || !logout) return;

  if (token) {
    login.style.display = "none";
    register.style.display = "none";
    logout.style.display = "block";
  } else {
    login.style.display = "block";
    register.style.display = "block";
    logout.style.display = "none";
  }
}

function setupLogout() {
  const logoutBtn = document.getElementById("nav-logout");

  if (!logoutBtn) return;

  logoutBtn.replaceWith(logoutBtn.cloneNode(true));

  const newLogoutBtn = document.getElementById("nav-logout");

  newLogoutBtn.addEventListener("click", (e) => {
    e.preventDefault();
    localStorage.removeItem("token");
    setTimeout(() => {
      location.hash = "/login";
    }, 50);
  });
}

async function setupPushNotificationBtn() {
  const pushBtn = document.getElementById("push-notification-btn");
  if (!pushBtn) return;

  const updateBtnText = (subscribed) => {
    pushBtn.textContent = subscribed ? "Notifikasi: On" : "Notifikasi: Off";
    pushBtn.style.background = subscribed ? "var(--primary)" : "transparent";
    pushBtn.style.color = subscribed ? "white" : "var(--primary)";
  };

  const subscribed = await isPushSubscribed();
  updateBtnText(subscribed);

  pushBtn.addEventListener("click", async () => {
    const isSubscribedNow = await togglePushSubscription();
    updateBtnText(isSubscribedNow);
  });
}

document.addEventListener("DOMContentLoaded", async () => {
  // Register Service Worker for PWA
  await registerServiceWorker();
  initOfflineSyncListener();

  // Trigger sync if online
  if (navigator.onLine) {
    syncOfflineStories();
  }

  const app = new App({
    content: document.querySelector("#main-content"),
    drawerButton: document.querySelector("#drawer-button"),
    navigationDrawer: document.querySelector("#navigation-drawer"),
  });

  await app.renderPage();
  updateNav();
  setupLogout();
  setupPushNotificationBtn();

  window.addEventListener("hashchange", async () => {
    await app.renderPage();
    updateNav();
    setupLogout();
    setupPushNotificationBtn();
  });
});
