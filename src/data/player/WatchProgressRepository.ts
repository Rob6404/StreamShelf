import { AsyncStorageProvider } from "../storage/AsyncStorageProvider";
import { StorageProvider } from "../storage/StorageProvider";

export interface WatchProgressItem {
    videoId: number;
    currentTime: number;
    lastUpdated: number;
}

/**
 * Persists where the viewer stopped watching each video, so playback can resume.
 * Goes through StorageProvider like MyListRepository, so the storage library
 * stays swappable and tests can inject a fake.
 */
export class WatchProgressRepository {
    private keyPrefix = "watch_progress:";

    constructor(private storageProvider: StorageProvider = new AsyncStorageProvider()) {}

    async saveProgress(videoId: number, currentTime: number): Promise<void> {
        try {
            const item: WatchProgressItem = { videoId, currentTime, lastUpdated: Date.now() };
            await this.storageProvider.save(this.keyPrefix + videoId, item);
        } catch (error) {
            console.error(`WatchProgressRepository: failed to save progress for ${videoId}`, error);
        }
    }

    /** Returns the saved position in seconds, or 0 when there is none. */
    async getProgress(videoId: number): Promise<number> {
        try {
            const item = await this.storageProvider.get<WatchProgressItem>(this.keyPrefix + videoId);
            return item?.currentTime ?? 0;
        } catch (error) {
            console.error(`WatchProgressRepository: failed to get progress for ${videoId}`, error);
            return 0;
        }
    }

    async removeProgress(videoId: number): Promise<void> {
        try {
            await this.storageProvider.delete(this.keyPrefix + videoId);
        } catch (error) {
            console.error(`WatchProgressRepository: failed to remove progress for ${videoId}`, error);
        }
    }

    /** All saved progress, most recently watched first. */
    async getAllProgress(): Promise<WatchProgressItem[]> {
        try {
            const keys = await this.storageProvider.getAllKeys(this.keyPrefix);
            const items = await this.storageProvider.getAll<WatchProgressItem>(keys);
            return items.sort((a, b) => b.lastUpdated - a.lastUpdated);
        } catch (error) {
            console.error("WatchProgressRepository: failed to fetch progress history", error);
            return [];
        }
    }
}

export const watchProgressRepository = new WatchProgressRepository();
