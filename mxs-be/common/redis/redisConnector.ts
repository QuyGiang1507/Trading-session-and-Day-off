import { RedisCache } from "./redisCache";
import { RedisDB } from '../enums/RedisDB';
import { EventEmitter } from 'events';

class RedisConnector extends EventEmitter {
    configDB: RedisCache;
    authDB: RedisCache;
    cacheDB: RedisCache;


    constructor() {
        super();
    }

    isConnected() {
        return this.configDB && this.authDB && this.cacheDB;
    }

    connect(){
        this.configDB = new RedisCache(
            process.env.REDIS_URL,
            process.env.REDIS_PASS,
            RedisDB.ConfigDB
        );
        this.configDB.on('onReady', (db) => {
            this.emit('onReady', db); 
        });
        
        this.authDB = new RedisCache(
            process.env.REDIS_URL,
            process.env.REDIS_PASS,
            RedisDB.AuthDB
        );
        this.authDB.on('onReady', (db) => {
            this.emit('onReady', db); 
        });

        this.cacheDB = new RedisCache(
            process.env.REDIS_URL,
            process.env.REDIS_PASS,
            RedisDB.CacheDB
        );
        this.cacheDB.on('onReady', (db) => {
            this.emit('onReady', db); 
        });
    }
}

export const redisConnector = new RedisConnector();