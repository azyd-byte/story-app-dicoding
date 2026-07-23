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
import Swal from "sweetalert2";

function updateNav() {
  const token = localStorage.getItem("token");

  const login = document.getElementById("nav-login");
  const register = document.getElementById("nav-register");
  const logout = document.getElementById("nav-logout");

  if (!login || !register || !logout) return;

  if (token) {
    login.style.display = "none";
    register.style.display = "none";
    logout.style.display = "flex";
  } else {
    login.style.display = "flex";
    register.style.display = "flex";
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
    
    Swal.fire({
      title: "Konfirmasi Keluar",
      text: "Apakah Anda yakin ingin keluar dari akun Anda?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Ya, Keluar",
      cancelButtonText: "Batal",
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "var(--text-muted)",
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem("token");
        Swal.fire({
          icon: "success",
          title: "Logout Berhasil",
          text: "Anda telah keluar.",
          timer: 1000,
          showConfirmButton: false,
        });
        setTimeout(() => {
          location.hash = "/login";
        }, 1000);
      }
    });
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
