import { CatalogDataSource } from "@/data/catalog/CatalogDataSource";

beforeEach(() => jest.useFakeTimers());
afterEach(() => {
    jest.useRealTimers();
    jest.restoreAllMocks();
});

test("rejects when the simulated failure hits", async () => {
    jest.spyOn(Math, "random").mockReturnValue(0.99); // floor(0.99 * 4) + 1 = 4, a failure
    const result = new CatalogDataSource().get();
    jest.advanceTimersByTime(250);
    await expect(result).rejects.toThrow("Unable to load catalog");
});

test("resolves three rails, then serves the cache without another delay", async () => {
    jest.spyOn(Math, "random").mockReturnValue(0); // always succeeds
    const source = new CatalogDataSource();

    const first = source.get();
    jest.advanceTimersByTime(250);
    await expect(first).resolves.toHaveLength(3);

    // No timers advanced: a cached response must resolve on its own.
    await expect(source.get()).resolves.toHaveLength(3);
});
