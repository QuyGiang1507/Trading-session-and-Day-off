import {redisConnector} from '@mxs/common';
import { EventEmitter } from 'events';

export abstract class ConfigLoad extends EventEmitter {
    abstract configs;
    abstract validConfig(): void;
    
    constructor() {
        super();
    }

    async reloadItem(key: string)
    {
        var T = this.configs[key] ? this.configs.hasOwnProperty(key) : "";
        this.configs[key] = await redisConnector.configDB.get<typeof T>(key);

        this.emit("onReloaded")
    }

    async reload()
    {
        for (const key in this.configs) {
            var T = this.configs[key] ? this.configs.hasOwnProperty(key) : "";
            console.log(key, T, typeof T);
            this.configs[key] = await redisConnector.configDB.get<typeof T>(key);
        }

        this.emit("onReloaded")
    }
    
}