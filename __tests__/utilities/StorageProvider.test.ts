import { StorageProvider } from "@/data/storage/StorageProvider";

export const fakeStorageProvider: StorageProvider = {
    get: jest.fn().mockResolvedValue(null),
    getAll: jest.fn(),
    getAllKeys: jest.fn(),
    save: jest.fn(),
    delete: jest.fn(),
};