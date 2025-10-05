jest.mock("redis-memory-server", () => {
    return { RedisMemoryServer: jest.fn().mockImplementation(() => ({ getHost: jest.fn(), getPort: jest.fn() })) };
});

import Cache from "../src/Cache";

describe("Cache", () => {
    let cache: Cache;

    beforeAll(async () => {
        jest.useFakeTimers();
        cache = await Cache.create();
    });

    afterAll(() => {
        jest.useRealTimers();
    });

    it("should set and get a value", async () => {
        const key = "test-key";
        const value = { foo: "bar" };

        await cache.set(key, value);
        const result = await cache.get<typeof value>(key);

        expect(result).toEqual(value);
    });

    it("should return null for non-existing key", async () => {
        const result = await cache.get("non-existent-key");
        expect(result).toBeNull();
    });

    it("should expire value after TTL", async () => {
        process.env.CACHE_MINS = "1";
        await cache.set("baz", { test: true });
        expect(await cache.get("baz")).toEqual({ test: true });

        jest.advanceTimersByTime(20 * 60 * 1000);

        expect(await cache.get("baz")).toBeNull();
    });
});
