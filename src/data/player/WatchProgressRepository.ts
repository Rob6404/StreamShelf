import AsyncStorage from "@react-native-async-storage/async-storage";

export interface WatchProgressItem {
    videoId: number;
    currentTime: number;
    lastUpdated: number;
}

const PREFIX = 'watch_progress:';

export const WatchProgressRepository = {

    async saveProgress(videoId: number, currentTime: number): Promise<void> {
        try {
        const key = `${PREFIX}${videoId}`;
        const item: WatchProgressItem = {
            videoId,
            currentTime,
            lastUpdated: Date.now()
        };
        await AsyncStorage.setItem(key, JSON.stringify(item));
        } catch (error) {
        console.error(`Repository: Failed to save progress for ${videoId}`, error);
        }
    },

  async getProgress(videoId: string): Promise<number> {
    try {
      const key = `${PREFIX}${videoId}`;
      const data = await AsyncStorage.getItem(key);
      if (data) {
        const item: WatchProgressItem = JSON.parse(data);
        return item.currentTime;
      }
      return 0;
    } catch (error) {
      console.error(`Repository: Failed to get progress for ${videoId}`, error);
      return 0;
    }
  },

  async removeProgress(videoId: string): Promise<void> {
    try {
      const key = `${PREFIX}${videoId}`;
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error(`Repository: Failed to remove progress for ${videoId}`, error);
    }
  },

  async getAllProgress(): Promise<WatchProgressItem[]> {
    try {
      const allKeys = await AsyncStorage.getAllKeys();
      const progressKeys = allKeys.filter((key) => key.startsWith(PREFIX));
      
      if (progressKeys.length === 0) return [];

      const pairs = await AsyncStorage.multiGet(progressKeys);
      const items: WatchProgressItem[] = [];

      for (const [_, value] of pairs) {
        if (value) {
          items.push(JSON.parse(value));
        }
      }

      // Sort by recently watched first
      return items.sort((a, b) => b.lastUpdated - a.lastUpdated);
    } catch (error) {
      console.error('Repository: Failed to fetch all progress history', error);
      return [];
    }
  },
};