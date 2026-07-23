import { subscribePushNotification, unsubscribePushNotification } from "../data/api";
import { showToast } from "./toast";

const VAPID_PUBLIC_KEY =
  "BCCs2eonMI-6H2ctvFaWg-UYdDv387Vno_bzUzALpB442r2lCnsHmtrx8biyPi_E-1fSGABK_Qs_GlvPoJJqxbk";

function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, "+")
    .replace(/_/g, "/");

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export async function registerServiceWorker() {
  if (!("serviceWorker" in navigator)) {
    console.log("Service Worker is not supported by this browser.");
    return null;
  }

  try {
    const registration = await navigator.serviceWorker.register("/sw.js");
    console.log("ServiceWorker registration successful with scope:", registration.scope);
    return registration;
  } catch (error) {
    console.error("ServiceWorker registration failed:", error);
    return null;
  }
}

export async function isPushSubscribed() {
  if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
    return false;
  }
  const registration = await navigator.serviceWorker.ready;
  const subscription = await registration.pushManager.getSubscription();
  return !!subscription;
}

export async function togglePushSubscription() {
  const token = localStorage.getItem("token");
  if (!token) {
    showToast("Silakan login terlebih dahulu untuk mengaktifkan notifikasi.", "info");
    return false;
  }

  if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
    showToast("Browser Anda tidak mendukung Web Push Notification.", "error");
    return false;
  }

  const registration = await navigator.serviceWorker.ready;
  let subscription = await registration.pushManager.getSubscription();

  if (subscription) {
    // UNSUBSCRIBE
    try {
      const endpoint = subscription.endpoint;
      await subscription.unsubscribe();
      await unsubscribePushNotification(endpoint, token);
      showToast("Berhasil berhenti berlangganan notifikasi.", "info");
      return false;
    } catch (error) {
      console.error("Error unsubscribing:", error);
      showToast("Gagal memproses penghentian notifikasi.", "error");
      return true;
    }
  } else {
    // SUBSCRIBE
    try {
      const convertedKey = urlBase64ToUint8Array(VAPID_PUBLIC_KEY);
      subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: convertedKey,
      });

      const subscriptionJSON = subscription.toJSON();
      const payload = {
        endpoint: subscriptionJSON.endpoint,
        keys: {
          p256dh: subscriptionJSON.keys.p256dh,
          auth: subscriptionJSON.keys.auth,
        },
      };

      const result = await subscribePushNotification(payload, token);
      if (!result.error) {
        showToast("Berhasil berlangganan Push Notification!", "success");
        return true;
      } else {
        showToast(`Gagal berlangganan: ${result.message}`, "error");
        await subscription.unsubscribe();
        return false;
      }
    } catch (error) {
      console.error("Error subscribing:", error);
      showToast("Gagal mengaktifkan notifikasi. Pastikan izin notifikasi diberikan.", "error");
      return false;
    }
  }
}
