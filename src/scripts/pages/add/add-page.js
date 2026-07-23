import template from "./add-view.html?raw";
import AddPresenter from "./add-presenter";

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
