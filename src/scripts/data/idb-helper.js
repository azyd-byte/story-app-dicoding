import { openDB } from "idb";

const DATABASE_NAME = "story-app-db";
const DATABASE_VERSION = 1;
const STORE_FAVORITES = "favorites";
const STORE_OFFLINE = "offline-stories";

const dbPromise = openDB(DATABASE_NAME, DATABASE_VERSION, {
  upgrade(db) {
    if (!db.objectStoreNames.contains(STORE_FAVORITES)) {
      db.createObjectStore(STORE_FAVORITES, { keyPath: "id" });
    }
    if (!db.objectStoreNames.contains(STORE_OFFLINE)) {
      db.createObjectStore(STORE_OFFLINE, {
        keyPath: "id",
        autoIncrement: true,
      });
    }
  },
});

export const FavoriteStoryIdb = {
  async getStory(id) {
    return (await dbPromise).get(STORE_FAVORITES, id);
  },

  async getAllStories() {
    return (await dbPromise).getAll(STORE_FAVORITES);
  },

  async putStory(story) {
    if (!story.id) return;
    return (await dbPromise).put(STORE_FAVORITES, story);
  },

  async deleteStory(id) {
    return (await dbPromise).delete(STORE_FAVORITES, id);
  },
};

export const OfflineStoryIdb = {
  async putOfflineStory(storyDraft) {
    return (await dbPromise).add(STORE_OFFLINE, {
      ...storyDraft,
      createdAt: new Date().toISOString(),
    });
  },

  async getAllOfflineStories() {
    return (await dbPromise).getAll(STORE_OFFLINE);
  },

  async deleteOfflineStory(id) {
    return (await dbPromise).delete(STORE_OFFLINE, id);
  },

  async clearOfflineStories() {
    return (await dbPromise).clear(STORE_OFFLINE);
  },
};
