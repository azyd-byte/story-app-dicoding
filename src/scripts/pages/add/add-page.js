import AddPresenter from "./add-presenter";

const template = `
<section class="container" aria-labelledby="add-title">
  <div class="form-card" style="max-width: 640px;">
    <h1 id="add-title">Tambah Story Baru</h1>
    <p style="margin-bottom: 24px;">Bagikan cerita beserta foto dan lokasi Anda.</p>

    <form id="storyForm">
      <div>
        <label for="description">Deskripsi Cerita</label>
        <textarea id="description" placeholder="Tuliskan cerita menarik Anda di sini..." required></textarea>
      </div>

      <div>
        <label for="photo">Upload File Gambar</label>
        <input type="file" id="photo" accept="image/*" />
      </div>

      <div style="margin-block: 16px;">
        <label>Atau Ambil Foto dari Kamera</label>
        <button type="button" id="openCamera" aria-label="Buka kamera untuk mengambil foto" style="margin-top: 6px; width: 100%;">
          Buka Kamera
        </button>
      </div>

      <div class="camera-container" style="display: none;" id="cameraWrapper">
        <video id="video" width="360" autoplay style="display:none;" aria-label="Preview kamera"></video>
        <canvas id="canvas" style="display:none;" aria-label="Hasil foto"></canvas>
        <button type="button" id="capture" style="display:none; margin-top: 8px;">Ambil Foto</button>
      </div>

      <div style="margin-top: 24px;">
        <label id="mapLabel">Pilih Lokasi di Peta</label>
        <p id="mapHelp" style="font-size: 0.85rem; margin-bottom: 8px;">Klik pada titik peta di bawah untuk menentukan lokasi cerita Anda.</p>
        <div id="map" aria-describedby="mapHelp" style="height: 300px;"></div>

        <div class="location-chips">
          <span class="chip">Latitude: <strong id="lat">-</strong></span>
          <span class="chip">Longitude: <strong id="lon">-</strong></span>
        </div>
      </div>

      <button type="submit">Bagikan Story</button>
    </form>
  </div>
</section>
`;

export default class AddPage {
  async render() {
    return template;
  }

  async afterRender() {
    const token = localStorage.getItem("token");
    if (!token) {
      location.hash = "/login";
      return;
    }

    this.presenter = new AddPresenter({ view: this });
    this.presenter.initMap();

    const openCameraBtn = document.getElementById("openCamera");
    const captureBtn = document.getElementById("capture");
    const photoInput = document.getElementById("photo");
    const form = document.querySelector("#storyForm");

    if (photoInput) {
      photoInput.addEventListener("change", () => {
        if (this.presenter) {
          this.presenter.capturedFile = null;
          this.presenter.isCaptured = false;
        }
      });
    }

    openCameraBtn.addEventListener("click", () => {
      this.presenter.openCamera();
    });

    captureBtn.addEventListener("click", async () => {
      await this.presenter.capturePhoto();
    });

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const description = document.querySelector("#description").value;
      const uploadedFile = document.querySelector("#photo").files[0];

      await this.presenter.submitStory({ description, uploadedFile });
    });
  }

  showCameraPreview(stream) {
    const video = document.getElementById("video");
    const captureBtn = document.getElementById("capture");
    const wrapper = document.getElementById("cameraWrapper");

    if (wrapper) wrapper.style.display = "flex";
    if (video) {
      video.srcObject = stream;
      video.style.display = "block";
    }
    if (captureBtn) {
      captureBtn.style.display = "inline-flex";
    }
  }

  showCapturedImage() {
    const video = document.getElementById("video");
    const captureBtn = document.getElementById("capture");
    const canvas = document.getElementById("canvas");
    const wrapper = document.getElementById("cameraWrapper");

    if (wrapper) wrapper.style.display = "flex";
    if (video) video.style.display = "none";
    if (captureBtn) captureBtn.style.display = "none";
    if (canvas) canvas.style.display = "block";
  }

  updateLocationDisplay(lat, lng) {
    const latEl = document.getElementById("lat");
    const lonEl = document.getElementById("lon");
    if (latEl) latEl.innerText = lat.toFixed(5);
    if (lonEl) lonEl.innerText = lng.toFixed(5);
  }

  stopCamera() {
    if (this.presenter) {
      this.presenter.stopCamera();
    }
  }
}
