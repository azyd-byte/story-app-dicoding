import { FavoriteStoryIdb } from "../../data/idb-helper";
import { showToast } from "../../utils/toast";

export default class FavoritesPresenter {
  stories = [];

  constructor({ view }) {
    this.view = view;
  }

  async loadFavoriteStories() {
    try {
      this.stories = await FavoriteStoryIdb.getAllStories();
      if (!this.stories || this.stories.length === 0) {
        this.view.showEmptyState();
        return;
      }
      this.view.showStories(this.stories);
    } catch (error) {
      console.error(error);
      this.view.showError("Gagal memuat story favorit.");
    }
  }

  searchStories(keyword) {
    if (!keyword || !keyword.trim()) {
      this.view.showStories(this.stories);
      return;
    }

    const filtered = this.stories.filter((story) => {
      const nameMatch = story.name?.toLowerCase().includes(keyword.toLowerCase());
      const descMatch = story.description?.toLowerCase().includes(keyword.toLowerCase());
      return nameMatch || descMatch;
    });

    if (filtered.length === 0) {
      this.view.showEmptySearchResult(keyword);
    } else {
      this.view.showStories(filtered);
    }
  }

  async removeFavorite(id) {
    try {
      await FavoriteStoryIdb.deleteStory(id);
      this.stories = this.stories.filter((s) => s.id !== id);

      if (this.stories.length === 0) {
        this.view.showEmptyState();
      } else {
        this.view.showStories(this.stories);
      }
      showToast("Story berhasil dihapus dari favorit!", "info");
    } catch (error) {
      console.error(error);
      showToast("Gagal menghapus story favorit.", "error");
    }
  }
}
