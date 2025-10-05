const store = new Map<string, { value: string; expire?: number }>();

export default class Redis {
    constructor() {}

    async get(key: string): Promise<string | null> {
        const entry = store.get(key);
        if (!entry) return null;

        if (entry.expire && Date.now() > entry.expire) {
            store.delete(key);
            return null;
        }

        return entry.value;
    }

    async set(key: string, value: string, mode?: string, ttl?: number): Promise<"OK"> {
        const expire = mode === "EX" && ttl ? Date.now() + ttl * 1000 : undefined;
        store.set(key, { value, expire });
        return "OK";
    }

    async quit(): Promise<void> {
        store.clear();
    }
}