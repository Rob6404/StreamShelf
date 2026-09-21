import { MyListTitle } from "@/types/MyListTitle";
import { AsyncStorageProvider } from "../storage/AsyncStorageProvider";
import { StorageProvider } from "../storage/StorageProvider";

class MyListRepository {
    private keyPrefix = "myList";

    constructor(private storageProvider: StorageProvider = new AsyncStorageProvider()) {}

    async get(id: number): Promise<(MyListTitle | null)> {
        return await this.storageProvider.get(this.keyPrefix + id);
    }

    async getMyList(): Promise<MyListTitle[]> {
        const keys = await this.storageProvider.getAllKeys(this.keyPrefix);
        const myList: MyListTitle[] = await this.storageProvider.getAll(keys);
        return myList;
    }

    async addTitle(myListTitle: MyListTitle) {
        await this.storageProvider.save(this.keyPrefix + myListTitle.id, myListTitle);
    }

    async deleteTitle(id: number) {
        await this.storageProvider.delete(this.keyPrefix + id)
    }
}

export const myListRepository = new MyListRepository();