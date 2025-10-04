import { RedisMemoryServer } from "redis-memory-server";
import Redis from "ioredis";

const CACHE_MINS = process.env.CACHE_MINS ? Number(process.env.CACHE_MINS) : 15;
const TIME_TO_LIVE = CACHE_MINS * 60;

class Cache {
    private constructor(private server: RedisMemoryServer, private redis: Redis) {}

    public static async create() {
        const server = new RedisMemoryServer();
        const host = await server.getHost();
        const port = await server.getPort();

        const redis = new Redis({host, port});

        return new Cache(server, redis);
    }

    public async get<T>(key: string): Promise<T | null> {
        const value = await this.redis.get(key);
        return value ? (JSON.parse(value) as T) : null;
    }

    public async set(key: string, value: any) {
        this.redis.set(key, JSON.stringify(value), "EX", TIME_TO_LIVE);
    }
}

export default Cache;