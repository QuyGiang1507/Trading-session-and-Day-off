import mongoose from "mongoose";
import { logger } from "../loggers/winstonLogger";
import { EventEmitter } from "events";

class MongoConnector extends EventEmitter {
  auditDB: mongoose.Connection;

  constructor() {
    super();
    this.auditDB = mongoose.createConnection(process.env.MONGO_URI_LOG, {
      autoIndex: true,
      autoCreate: true,
    });
    this.auditDB.on("error", (error) => {
      this.emit("onError", error, "auditDB");
    });
    this.auditDB.on("connected", () => {
      logger.info(`Service connected to mongodb [auditDB].`);
      this.emit("onConnected", "ConfigDB");
    });
    this.auditDB.on("disconnected", () => {
      this.emit("onDisconnected", "auditDB");
    });
  }
}

export const mongoConnector = new MongoConnector();
