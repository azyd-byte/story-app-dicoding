import L from "leaflet";
import HomePresenter from "./home-presenter";
import template from "./home-view.html?raw";
import { FavoriteStoryIdb } from "../../data/idb-helper";
import { showToast } from "../../utils/toast";
import { setupLeafletMarkerIcons } from "../../utils/map-icon";

export default class HomePage {
  async render() {
    return template;
  }

  async afterRender() {
    const token = localStorage.getItem("token");

    if (!token) {
      location.hash = "/login";
      return;
    }

    this.presenter = new HomePresenter({ view: this });
    this.presenter.loadStories();
  }

  // MVP
  showLoading() {
    const container = document.querySelector("#story-list");
    if (container) {
      container.innerHTML = "<p>Memuat daftar story...</p>";
    }
  }

  showError(message) {
    const container = document.querySelector("#story-list");
    if (container) {
      container.innerHTML = `<p>${message}</p>`;
    }
  }

  async showStories(stories) {
    const container = document.querySelector("#story-list");
    if (!container) return;

    // Setup Leaflet marker icons
    setupLeafletMarkerIcons();

    // init map
    const map = L.map("map").setView([-2.5, 118], 5);

    const osm = L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap",
    });

    const satellite = L.tileLayer(
      "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
      {
        attribution: "Tiles © Esri",
      }
    );

    const topo = L.tileLayer(
      "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",
      { attribution: "© OpenTopoMap contributors" }
    );

    const cartoLight = L.tileLayer(
      "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
      { attribution: "&copy; CartoDB" }
    );

    osm.addTo(map);

    const baseMaps = {
      OpenStreetMap: osm,
      Satellite: satellite,
      Topographic: topo,
      "Carto Light": cartoLight,
    };

    L.control
      .layers(baseMaps, null, { collapsed: false, position: "bottomleft" })
      .addTo(map);

    // Get favorite IDs to set button state
    const favoriteStories = await FavoriteStoryIdb.getAllStories();
    const favMap = new Map(favoriteStories.map((s) => [s.id, true]));

    container.innerHTML = stories
      .map((story, index) => {
        if (story.lat && story.lon) {
          const marker = L.marker([story.lat, story.lon])
            .addTo(map)
            .bindPopup(`<b>${story.name}</b><br>${story.description}`);

          setTimeout(() => {
            const el = document.getElementById(`story-${index}`);
            if (el) {
              el.addEventListener("click", (e) => {
                if (e.target.closest(".btn-fav-toggle")) return;
                map.setView([story.lat, story.lon], 10);
                marker.openPopup();
              });

              el.addEventListener("keypress", (e) => {
                if (e.key === "Enter") {
                  if (e.target.closest(".btn-fav-toggle")) return;
                  map.setView([story.lat, story.lon], 10);
                  marker.openPopup();
                }
              });
            }
          }, 0);
        }

        const isFav = favMap.has(story.id);

        return `
        <li 
          class="story-item" 
          id="story-${index}" 
          tabindex="0"
          aria-label="Story oleh ${story.name}"
        >
          <img 
            src="${story.photoUrl}" 
            alt="Foto story: ${story.description}" 
            width="200"
            loading="lazy"
          />
          <h2>${story.name}</h2>
          <p>${story.description}</p>

          <div style="display: flex; justify-content: space-between; align-items: center; margin-top: auto; padding-top: 12px;">
            <small>${story.timeAgo || "Baru saja"}</small>
            <button 
              type="button" 
              class="btn-fav-toggle" 
              data-index="${index}"
              aria-label="${isFav ? "Hapus dari favorit" : "Simpan ke favorit"}"
              style="background: ${isFav ? "#ef4444" : "var(--primary)"}; font-size: 0.8rem; padding: 6px 12px;"
            >
              ${isFav ? "Hapus Favorit" : "+ Favorit"}
            </button>
          </div>
        </li>
      `;
      })
      .join("");

    // Attach click events for favorite buttons
    stories.forEach((story, index) => {
      const btn = container.querySelector(`[data-index="${index}"]`);
      if (btn) {
        btn.addEventListener("click", async (e) => {
          e.stopPropagation();
          const existing = await FavoriteStoryIdb.getStory(story.id);
          if (existing) {
            await FavoriteStoryIdb.deleteStory(story.id);
            btn.textContent = "+ Favorit";
            btn.style.background = "var(--primary)";
            btn.setAttribute("aria-label", "Simpan ke favorit");
            showToast("Story dihapus dari favorit!", "info");
          } else {
            await FavoriteStoryIdb.putStory(story);
            btn.textContent = "Hapus Favorit";
            btn.style.background = "#ef4444";
            btn.setAttribute("aria-label", "Hapus dari favorit");
            showToast("Story disimpan ke favorit IndexedDB!", "success");
          }
        });
      }
    });
  }
}
