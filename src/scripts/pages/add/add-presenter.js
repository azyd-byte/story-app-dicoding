import L from "leaflet";
import { addStory } from "../../data/api";
import { OfflineStoryIdb } from "../../data/idb-helper";
import { showToast } from "../../utils/toast";
import { setupLeafletMarkerIcons } from "../../utils/map-icon";
import Swal from "sweetalert2";

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
      
      Swal.fire({
        icon: "success",
        title: "Disimpan Offline",
        text: "Koneksi offline detected. Story disimpan ke local storage (IndexedDB) dan akan di-sync otomatis saat online!",
        confirmButtonColor: "var(--primary)",
      }).then(() => {
        location.hash = "/";
      });
    } catch (err) {
      console.error("Gagal menyimpan story ke IndexedDB:", err);
      Swal.fire({
        icon: "error",
        title: "Gagal Menyimpan Offline",
        text: "Error: " + (err.message || err),
        confirmButtonColor: "#ef4444",
      });
    }
  }

  async submitStory({ description, uploadedFile }) {
    const token = localStorage.getItem("token");
    if (!token) {
      Swal.fire({
        icon: "error",
        title: "Sesi Berakhir",
        text: "Sesi login Anda berakhir. Silakan login kembali.",
        confirmButtonColor: "#ef4444",
      }).then(() => {
        location.hash = "/login";
      });
      return;
    }

    const file = uploadedFile || this.capturedFile;

    if (!file) {
      Swal.fire({
        icon: "info",
        title: "Foto Wajib",
        text: "Unggah foto atau ambil foto dari kamera terlebih dahulu!",
        confirmButtonColor: "var(--primary)",
      });
      return;
    }

    if (!description || !description.trim()) {
      Swal.fire({
        icon: "info",
        title: "Deskripsi Wajib",
        text: "Deskripsi cerita tidak boleh kosong!",
        confirmButtonColor: "var(--primary)",
      });
      return;
    }

    if (!navigator.onLine) {
      await this.saveStoryOffline(description, file);
      return;
    }

    Swal.fire({
      title: "Membagikan Story",
      text: "Mohon tunggu, sedang mengunggah cerita Anda...",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

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
        Swal.fire({
          icon: "success",
          title: "Story Berhasil Dibagikan!",
          text: "Cerita Anda berhasil dipublikasikan.",
          timer: 1500,
          showConfirmButton: false,
        });

        setTimeout(() => {
          location.hash = "/";
        }, 1500);
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
