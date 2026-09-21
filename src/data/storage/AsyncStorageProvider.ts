import AsyncStorage from "@react-native-async-storage/async-storage";
import { StorageProvider } from "./StorageProvider";

export class AsyncStorageProvider implements StorageProvider {
    
    async getAllKeys(keyPrefix: string): Promise<string[]> {
        const keys = await AsyncStorage.getAllKeys();

        return keys.filter(key => {
            return key.startsWith(keyPrefix);
        })
    }

    async save<T>(key: string, value: T): Promise<void> {
        await AsyncStorage.setItem(key, JSON.stringify(value));
    }

    async get<T>(key: string): Promise<T | null> {
        const data = await AsyncStorage.getItem(key);

        if (data) {
            const value: T = JSON.parse(data);
            return value;
        }
        return null;
    }

    async getAll<T>(keys: string[]): Promise<T[]> {
        const data = await AsyncStorage.multiGet(keys);
        return data.flatMap(([, value]) => (value === null ? [] : (JSON.parse(value) as T)));
    }

    async delete(key: string) {
        await AsyncStorage.removeItem(key);
    }
}