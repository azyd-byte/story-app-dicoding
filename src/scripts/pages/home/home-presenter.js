import { getStories } from "../../data/api";

function timeAgo(dateString) {
  const now = new Date();
  const past = new Date(dateString);

  const diff = Math.floor((now - past) / 1000);

  if (diff < 60) return `${diff} detik lalu`;

  const minutes = Math.floor(diff / 60);
  if (minutes < 60) return `${minutes} menit lalu`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} jam lalu`;

  const days = Math.floor(hours / 24);
  return `${days} hari lalu`;
}

export default class HomePresenter {
  constructor({ view }) {
    this.view = view;
  }

  async loadStories() {
    this.view.showLoading();

    try {
      const token = localStorage.getItem("token");

      const result = await getStories(token);

      if (result.error) {
        this.view.showError(result.message);
        return;
      }

      const stories = result.listStory.map((story) => ({
        ...story,
        timeAgo: timeAgo(story.createdAt),
      }));

      this.view.showStories(stories);
    } catch (error) {
      console.error(error);
      this.view.showError("Terjadi kesalahan");
    }
  }
}
