import { MyListTitle } from "@/types/MyListTitle";
import { AsyncStorageProvider } from "../storage/AsyncStorageProvider";

export class MyListRepository {
    private storageProvider = new AsyncStorageProvider();
    private keyPrefix = "myList";

    async get(id: number): Promise<(MyListTitle | null)> {
        return await this.storageProvider.get(this.keyPrefix + id);
    }

    async getMyList(): Promise<MyListTitle[]> {
        debugger;
        const keys = await this.storageProvider.getAllKeys(this.keyPrefix);
        console.log(keys);
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