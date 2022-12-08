import { createClient } from "redis";

const dotenv = require("dotenv");
dotenv.config();

export class Cache {
  private cache: ReturnType<typeof createClient>;
  private ttl: number = 60 * 60; // 1 hour

  constructor(ttl?: number) {
    this.ttl = ttl || this.ttl;
    this.cache = createClient({
      url: process.env.URL || "redis://localhost:6379",
    });
    this.cache.on("connect", () => {
      console.log("Redis client connected");
    });
    this.cache.on("error", (error) => {
      console.log("Redis client error: ", error);
    });
  }

  async connect() {
    await this.cache.connect();
  }

  async get<T>(key: string, fetcher: () => Promise<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      this.cache
        .get(key)
        .catch((err) => {
          return reject(err);
        })
        .then(async (data) => {
          if (data) {
            return resolve(JSON.parse(data as string));
          }
          const result = await fetcher();
          this.cache
            .set(key, JSON.stringify(result), { EX: this.ttl })
            .catch((err) => {
              reject(err);
            });
          return resolve(result);
        });
    });
  }
  
  del(key: string) {
    this.cache.del(key);
  }

  flush() {
    this.cache.flushAll();
  }

  deleteContains(key: string) {
    this.cache.keys(key + "*").then((keys) => {
      keys.forEach((key) => {
        this.cache.del(key);
      });
    });
  }
}
