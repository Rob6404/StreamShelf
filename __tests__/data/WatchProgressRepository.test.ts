import { WatchProgressRepository } from "@/data/player/WatchProgressRepository";
import { StorageProvider } from "@/data/storage/StorageProvider";

/** In-memory StorageProvider, injected through the constructor. */
class FakeStorageProvider implements StorageProvider {
    store = new Map<string, unknown>();
    async get<T>(key: string) { return (this.store.get(key) as T) ?? null; }
    async getAll<T>(keys: string[]) { return keys.map(k => this.store.get(k) as T); }
    async getAllKeys(prefix: string) { return [...this.store.keys()].filter(k => k.startsWith(prefix)); }
    async save<T>(key: string, value: T) { this.store.set(key, value); }
    async delete(key: string) { this.store.delete(key); }
}

test("saves, reads and removes progress per video", async () => {
    const repository = new WatchProgressRepository(new FakeStorageProvider());

    expect(await repository.getProgress(1)).toBe(0);

    await repository.saveProgress(1, 42);
    expect(await repository.getProgress(1)).toBe(42);

    await repository.removeProgress(1);
    expect(await repository.getProgress(1)).toBe(0);
});

test("lists progress with the most recently watched first", async () => {
    const repository = new WatchProgressRepository(new FakeStorageProvider());
    const now = jest.spyOn(Date, "now");

    now.mockReturnValue(1000);
    await repository.saveProgress(1, 10);
    now.mockReturnValue(2000);
    await repository.saveProgress(2, 20);

    const items = await repository.getAllProgress();
    expect(items.map(i => i.videoId)).toEqual([2, 1]);
    now.mockRestore();
});
