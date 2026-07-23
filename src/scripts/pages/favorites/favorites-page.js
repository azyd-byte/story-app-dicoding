import FavoritesPresenter from "./favorites-presenter";

const template = `
<section class="container" aria-labelledby="favorites-title">
  <div class="section-header" style="display: flex; flex-direction: column; gap: 12px;">
    <h1 id="favorites-title">Story Favorit (IndexedDB)</h1>
    <p>Daftar cerita yang Anda simpan secara lokal. Dapat diakses sepenuhnya saat offline.</p>
  </div>

  <div style="margin-bottom: 24px; display: flex; gap: 12px; flex-wrap: wrap;">
    <label for="searchFavorite" class="sr-only">Cari cerita favorit</label>
    <input 
      type="text" 
      id="searchFavorite" 
      placeholder="Cari cerita favorit berdasarkan deskripsi atau nama..." 
      aria-label="Cari cerita favorit"
      style="max-width: 400px;"
    />
  </div>

  <ul id="favorite-story-list" class="story-list-grid" aria-live="polite" style="display: grid; gap: 24px; list-style: none;">
    <p>Memuat cerita favorit...</p>
  </ul>
</section>
`;

export default class FavoritesPage {
  async render() {
    return template;
  }

  async afterRender() {
    this.presenter = new FavoritesPresenter({ view: this });
    await this.presenter.loadFavoriteStories();

    const searchInput = document.getElementById("searchFavorite");
    if (searchInput) {
      searchInput.addEventListener("input", (e) => {
        this.presenter.searchStories(e.target.value);
      });
    }
  }

  showEmptyState() {
    const listContainer = document.getElementById("favorite-story-list");
    if (listContainer) {
      listContainer.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: var(--text-muted); padding: 40px 0;">Belum ada story yang disimpan ke favorit.</p>`;
    }
  }

  showEmptySearchResult(keyword) {
    const listContainer = document.getElementById("favorite-story-list");
    if (listContainer) {
      listContainer.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: var(--text-muted); padding: 40px 0;">Tidak ditemukan story favorit untuk pencarian "${keyword}".</p>`;
    }
  }

  showError(message) {
    const listContainer = document.getElementById("favorite-story-list");
    if (listContainer) {
      listContainer.innerHTML = `<p style="grid-column: 1/-1; color: var(--text-muted);">${message}</p>`;
    }
  }

  showStories(stories) {
    const listContainer = document.getElementById("favorite-story-list");
    if (!listContainer) return;

    listContainer.innerHTML = stories
      .map(
        (story) => `
        <li class="story-item" tabindex="0" aria-label="Story favorit oleh ${story.name}">
          <img src="${story.photoUrl}" alt="Foto story: ${story.description}" loading="lazy" />
          <h2>${story.name}</h2>
          <p>${story.description}</p>
          <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 12px;">
            <small>${story.timeAgo || "Tersimpan Lokal"}</small>
            <button 
              type="button" 
              class="btn-delete-fav" 
              data-id="${story.id}"
              aria-label="Hapus story ${story.name} dari favorit"
              style="background: #ef4444; padding: 6px 12px; font-size: 0.8rem;"
            >
              Hapus Favorit
            </button>
          </div>
        </li>
      `
      )
      .join("");

    listContainer.querySelectorAll(".btn-delete-fav").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const id = btn.getAttribute("data-id");
        this.presenter.removeFavorite(id);
      });
    });
  }
}
