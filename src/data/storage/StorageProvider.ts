export interface StorageProvider {
    get<T>(key: string): Promise<T | null>;
    getAll<T>(keys: string[]): Promise<T[]>;
    getAllKeys(keyPrefix: string): Promise<string[]>;
    save<T>(key: string, value: T): Promise<void>;
    delete(key: string): Promise<void>;
}