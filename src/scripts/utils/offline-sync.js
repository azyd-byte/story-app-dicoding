import { OfflineStoryIdb } from "../data/idb-helper";
import { addStory } from "../data/api";
import { showToast } from "./toast";

export async function syncOfflineStories() {
  const token = localStorage.getItem("token");
  if (!token) return;

  const offlineStories = await OfflineStoryIdb.getAllOfflineStories();
  if (!offlineStories || offlineStories.length === 0) return;

  console.log(`[OfflineSync] Found ${offlineStories.length} pending offline stories to sync.`);

  let successCount = 0;

  for (const item of offlineStories) {
    try {
      const formData = new FormData();
      formData.append("description", item.description);

      if (item.photo) {
        let photoFile;
        if (item.photo.buffer) {
          photoFile = new File([item.photo.buffer], item.photo.name || "photo.jpg", {
            type: item.photo.type || "image/jpeg",
          });
        } else {
          photoFile = item.photo;
        }
        formData.append("photo", photoFile);
      }

      if (item.lat && item.lon) {
        formData.append("lat", item.lat);
        formData.append("lon", item.lon);
      }

      const result = await addStory(formData, token);
      if (!result.error) {
        await OfflineStoryIdb.deleteOfflineStory(item.id);
        successCount++;
      } else {
        console.error("[OfflineSync] API rejected story item:", result.message);
      }
    } catch (err) {
      console.error("[OfflineSync] Error syncing story item:", err);
    }
  }

  if (successCount > 0) {
    showToast(`[Koneksi Pulih] ${successCount} story offline berhasil di-sync ke server!`, "success");
    if (location.hash === "" || location.hash === "#/") {
      window.dispatchEvent(new HashChangeEvent("hashchange"));
    }
  }
}

export function initOfflineSyncListener() {
  window.addEventListener("online", async () => {
    console.log("[OfflineSync] Internet connection restored. Syncing offline data...");
    await syncOfflineStories();
  });
}
