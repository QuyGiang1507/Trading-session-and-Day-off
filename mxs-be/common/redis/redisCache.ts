import Redis, { RedisOptions } from "ioredis";
import { EventEmitter } from "events";
import { Logger } from "../loggers/winstonLogger";

export class RedisCache extends EventEmitter {
  private readonly cache: Redis;
  private database: number;
  private url: string;
  private password: string;
  private connected: boolean = false;

  private channel: string;

  protected logger: Logger = new Logger(process.env.ModuleName || "redisCache");

  constructor(url: string, password: string, database: number) {
    super();
    this.url = url;
    this.password = password;
    this.database = database;
    const options: RedisOptions = {
      password: password,
      db: database,
    };
    this.cache = new Redis(url, options);

    this.cache.on("connect", () => {
      this.logger.info(`Redis connection to db ${database} established.`);
      this.emit("onConnected", this.database);
    });

    this.cache.on("ready", () => {
      this.logger.info(`Redis is ready on db ${database}.`);
      this.emit("onReady", this.database);
      this.connected = true;
    });

    this.cache.on("error", (error) => {
      this.logger.error(`Redis error, service degraded: ${error}`);
      this.emit("onError", error);
    });

    this.cache.on("close", () => {
      this.logger.error(`Redis connection to db ${database} closed.`);
      this.emit("onClosed");
      this.connected = false;
    });

    process.on("SIGINT", () => this.cache.disconnect());
    process.on("SIGTERM", () => this.cache.disconnect());
  }

  public isConnected(): boolean {
    return this.connected;
  }

  public async scanKeys(
    page: number,
    pageSize: number,
    prefix: string
  ): Promise<string[]> {
    const cursor = page * pageSize;
    const allKeys: string[] = [];
    let cursorPos = "0";

    do {
      const [nextCursor, keys] = await this.cache.scan(
        cursorPos,
        "MATCH",
        prefix + "*",
        "COUNT",
        pageSize
      );
      allKeys.push(...keys);
      cursorPos = nextCursor;
    } while (cursorPos !== "0" && allKeys.length < cursor);

    return allKeys.slice((page - 1) * pageSize, page * pageSize);
  }

  public async scanAllKeys(prefix: string): Promise<string[]> {
    const allKeys: string[] = [];
    let cursorPos = "0";

    do {
      const [nextCursor, keys] = await this.cache.scan(
        cursorPos,
        "MATCH",
        prefix + "*"
      );
      allKeys.push(...keys);
      cursorPos = nextCursor;
    } while (cursorPos !== "0");

    return allKeys;
  }

  public async readAllValues(prefix: string): Promise<any[]> {
    const allKeys: string[] = [];
    let cursorPos = "0";

    do {
      const [nextCursor, keys] = await this.cache.scan(
        cursorPos,
        "MATCH",
        prefix + "*"
      );
      allKeys.push(...keys);
      cursorPos = nextCursor;
    } while (cursorPos !== "0");

    if (allKeys.length > 0) {
      const result = await this.cache.mget(...allKeys);
      return result;
      ///return result.map((value) => JSON.parse(value || '{}'));
    } else return [];
  }

  public async readAllItems(prefix: string): Promise<any[]> {
    const allKeys: string[] = [];
    let cursorPos = "0";

    do {
      const [nextCursor, keys] = await this.cache.scan(
        cursorPos,
        "MATCH",
        prefix + "*"
      );
      allKeys.push(...keys);
      cursorPos = nextCursor;
    } while (cursorPos !== "0");

    if (allKeys.length > 0) {
      const result = await this.cache.mget(...allKeys);

      return allKeys.map((element, index) => {
        return { key: element, value: result[index] };
      });
      ///return result.map((value) => JSON.parse(value || '{}'));
    } else return [];
  }

  public async readItems(
    pageSize: number,
    currentPage: number,
    prefix: string
  ): Promise<any[]> {
    let allKeys: string[] = [];
    let cursorPos = "0";

    do {
      const [nextCursor, keys] = await this.cache.scan(
        cursorPos,
        "MATCH",
        prefix + "*"
      );
      allKeys.push(...keys);
      cursorPos = nextCursor;
    } while (cursorPos !== "0");

    if (allKeys.length > 0) {
      if (pageSize > 0)
        allKeys = allKeys.slice(
          (currentPage - 1) * pageSize,
          currentPage * pageSize
        );
      const result = await this.cache.mget(...allKeys);

      return allKeys.map((element, index) => {
        return { key: element, value: result[index] };
      });
    } else return [];
  }

  public async scanKeysStream(
    pageSize: number,
    currentPage: number,
    prefix: string
  ): Promise<string[]> {
    const scanOptions = {
      match: prefix + "*",
      count: pageSize,
    };
    const allKeys: string[] = [];
    let finished = false;

    const scanStream = this.cache.scanStream(scanOptions);

    do {
      scanStream.on("data", (resultKeys) => {
        for (let i = 0; i < resultKeys.length; i++) {
          console.log(resultKeys[i]);
        }
      });

      scanStream.on("end", () => {
        console.log("all keys have been visited");
        finished = true;
      });
    } while (!finished);

    // Only return the keys on the current page
    const startIndex = pageSize * (currentPage - 1);
    const endIndex = startIndex + pageSize;

    if (pageSize > 0)
      return allKeys.slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize
      );
    else return allKeys;
  }

  async mget<T>(keys: string[]): Promise<T[]> {
    if (!this.connected) {
      return null;
    }

    const result = await this.cache.mget(...keys);
    return result.map((value) => JSON.parse(value || "{}"));
  }

  get<T>(key: string): Promise<T> {
    if (!this.connected) {
      return null;
    }

    return new Promise((resolve, reject) => {
      this.cache
        .get(key)
        .then((value) => {
          resolve(JSON.parse(value || "{}"));
        })
        .catch((error) => {
          this.logger.error(
            `Error get Redis DB ${this.database} with key ${key}. Error: ${error?.stack}`
          );
          reject(error);
        });
    });
  }

  set(key: string, value: string): Promise<void> {
    if (!this.connected) {
      return;
    }
    
    return new Promise((resolve, reject) => {
      this.cache
        .set(key, value)
        .then((value) => {
          resolve();
        })
        .catch((error) => {
          this.logger.error(
            `Error set Redis DB ${
              this.database
            } with key ${key} and value ${JSON.stringify(value)}. Error: ${
              error?.stack
            }`
          );
          reject(error);
        });
    });
  }

  del(key: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.cache
        .del(key)
        .then((value) => {
          resolve();
        })
        .catch((error) => {
          this.logger.error(
            `Error del Redis ${this.database} DB with key ${key}. Error: ${error?.stack}`
          );
          reject(error);
        });
    });
  }

  flush(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.cache
        .flushdb()
        .then((value) => {
          resolve();
        })
        .catch((error) => {
          this.logger.error(error);
          reject(error);
        });
    });
  }

  onMessage<T>(data: T, msg: Buffer | string): void {
    console.log("onMessage", data, msg);
    this.emit("onMessage", data, msg);
  }

  publish(channel: string, data: any): Promise<void> {
    console.log("publish", data, channel);

    return new Promise((resolve, reject) => {
      this.cache
        .publish(channel, JSON.stringify(data))
        .then((value) => {
          console.log("published", value);
          resolve();
        })
        .catch((error) => {
          this.logger.error(error);
          reject(error);
        });
    });
  }

  listen<T>(channel: string): Promise<void> {
    this.channel = channel;

    this.cache.on("ready", () => {
      console.log("Redis client is ready.");
    });

    this.cache.on("subscribe", (channel: string, count: number) => {
      console.log(
        `Subscribed to channel ${channel}. Total subscriptions: ${count}`
      );
    });

    this.cache.on("message", (channel: string, message: string) => {
      console.log("message", channel, message);

      const parsedData = this.parseMessage<T>(message);
      this.onMessage(parsedData, message);
    });

    return new Promise((resolve, reject) => {
      this.cache
        .subscribe(this.channel, (err, count) => {
          if (err) {
            // Just like other commands, subscribe() can fail for some reasons,
            // ex network issues.
            console.error("Failed to subscribe: %s", err.message);
          } else {
            // `count` represents the number of channels this client are currently subscribed to.
            console.log(
              `Subscribed successfully! This client is currently subscribed to ${count} channels.`
            );
          }
        })
        .then((value) => resolve())
        .catch((error) => reject(error));
    });
  }

  parseMessage<T>(msg: string | Buffer) {
    console.log(msg.toString("utf8"));
    if (typeof msg === "string") return JSON.parse(msg);
    else return JSON.parse(msg.toString("utf8")) as T;
  }
}
