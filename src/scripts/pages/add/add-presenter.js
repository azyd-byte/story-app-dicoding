import L from "leaflet";
import { addStory } from "../../data/api";
import { OfflineStoryIdb } from "../../data/idb-helper";
import { showToast } from "../../utils/toast";
import { setupLeafletMarkerIcons } from "../../utils/map-icon";

async function fileToSerializable(file) {
  if (!file) return null;
  try {
    const buffer = await file.arrayBuffer();
    return {
      buffer,
      name: file.name || "photo.jpg",
      type: file.type || "image/jpeg",
    };
  } catch (e) {
    console.error("Error converting file to ArrayBuffer:", e);
    return null;
  }
}

export default class AddPresenter {
  stream = null;
  selectedLat = null;
  selectedLon = null;
  capturedFile = null;
  isCaptured = false;
  map = null;
  marker = null;

  constructor({ view }) {
    this.view = view;
  }

  async openCamera() {
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({ video: true });
      this.view.showCameraPreview(this.stream);

      const video = document.getElementById("video");
      if (video) {
        await video.play();
        await new Promise((resolve) => setTimeout(resolve, 300));
      }
    } catch (error) {
      console.error(error);
      showToast("Gagal mengakses kamera. Pastikan izin kamera diberikan.", "error");
    }
  }

  async capturePhoto() {
    const video = document.getElementById("video");
    const canvas = document.getElementById("canvas");

    if (!video || !video.videoWidth || !video.videoHeight) {
      showToast("Kamera belum siap, tunggu sebentar...", "info");
      return;
    }

    const MAX_WIDTH = 1024;
    let width = video.videoWidth;
    let height = video.videoHeight;

    if (width > MAX_WIDTH) {
      height = Math.round((height * MAX_WIDTH) / width);
      width = MAX_WIDTH;
    }

    const context = canvas.getContext("2d");
    canvas.width = width;
    canvas.height = height;
    context.drawImage(video, 0, 0, width, height);

    await new Promise((resolve) => {
      canvas.toBlob(
        (blob) => {
          if (blob) {
            this.capturedFile = new File([blob], "photo.jpg", {
              type: "image/jpeg",
            });
            this.isCaptured = true;
          }
          resolve();
        },
        "image/jpeg",
        0.7
      );
    });

    if (!this.capturedFile) {
      showToast("Gagal mengambil gambar dari kamera.", "error");
      return;
    }

    this.stopCamera();
    this.view.showCapturedImage();
    showToast("Foto berhasil diambil!", "success");
  }

  stopCamera() {
    if (this.stream) {
      this.stream.getTracks().forEach((track) => track.stop());
      this.stream = null;
    }
  }

  initMap() {
    const mapContainer = document.getElementById("map");
    if (!mapContainer) return;

    setupLeafletMarkerIcons();
    this.map = L.map("map").setView([-2.5, 118], 5);
    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(this.map);

    this.map.on("click", (e) => {
      const { lat, lng } = e.latlng;
      this.selectedLat = lat;
      this.selectedLon = lng;

      this.view.updateLocationDisplay(lat, lng);

      if (this.marker) {
        this.map.removeLayer(this.marker);
      }

      this.marker = L.marker([lat, lng]).addTo(this.map);
    });
  }

  async saveStoryOffline(description, file) {
    try {
      const serializablePhoto = await fileToSerializable(file);
      await OfflineStoryIdb.putOfflineStory({
        description,
        photo: serializablePhoto,
        lat: this.selectedLat,
        lon: this.selectedLon,
      });
      showToast("Story disimpan di IndexedDB (Offline)! Akan ter-sync saat online.", "success");
      setTimeout(() => {
        location.hash = "/";
      }, 1000);
    } catch (err) {
      console.error("Gagal menyimpan story ke IndexedDB:", err);
      showToast("Gagal menyimpan story offline: " + (err.message || err), "error");
    }
  }

  async submitStory({ description, uploadedFile }) {
    const token = localStorage.getItem("token");
    if (!token) {
      showToast("Sesi login berakhir. Silakan login kembali.", "error");
      location.hash = "/login";
      return;
    }

    const file = uploadedFile || this.capturedFile;

    if (!file) {
      showToast("Unggah foto atau ambil foto dari kamera terlebih dahulu!", "info");
      return;
    }

    if (!description || !description.trim()) {
      showToast("Deskripsi cerita tidak boleh kosong!", "info");
      return;
    }

    if (!navigator.onLine) {
      await this.saveStoryOffline(description, file);
      return;
    }

    const formData = new FormData();
    formData.append("description", description.trim());
    formData.append("photo", file);

    if (
      this.selectedLat !== null &&
      this.selectedLon !== null &&
      this.selectedLat !== undefined &&
      this.selectedLon !== undefined
    ) {
      formData.append("lat", parseFloat(this.selectedLat));
      formData.append("lon", parseFloat(this.selectedLon));
    }

    try {
      const result = await addStory(formData, token);

      if (!result.error) {
        showToast("Story berhasil ditambahkan!", "success");
        setTimeout(() => {
          location.hash = "/";
        }, 1000);
      } else {
        console.warn("API error response:", result.message);
        await this.saveStoryOffline(description, file);
      }
    } catch (error) {
      console.warn("Network error during addStory POST, fallback to IndexedDB:", error);
      await this.saveStoryOffline(description, file);
    }
  }
}
