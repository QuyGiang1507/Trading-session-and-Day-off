import { logger } from "./loggers/winstonLogger";

import { redisConnector } from "@mxs/common";
import { EventEmitter } from "events";

class ConfigLoader extends EventEmitter {
  configs = {
    SaveToDB: true,
  };

  constructor() {
    super();
  }

  async reloadItem(key: string) {
    var T = this.configs[key] ? this.configs.hasOwnProperty(key) : "";
    this.configs[key] =
      (await redisConnector.configDB.get<typeof T>(key)) || this.configs[key];

    this.emit("onReloaded");
  }

  async getItem(key: string) {
    return await redisConnector.configDB.get(key);
  }

  async reload() {
    for (const key in this.configs) {
      var T = this.configs[key] ? this.configs.hasOwnProperty(key) : "";
      const value = await redisConnector.configDB.get<typeof T>(key);
      if ((await redisConnector.configDB.get<typeof T>(key)) != null)
        this.configs[key] = await redisConnector.configDB.get<typeof T>(key);
    }

    logger.info("Config reloaded!");
    this.emit("onReloaded");
  }

  validConfig() {}
}

export const configLoader = new ConfigLoader();
