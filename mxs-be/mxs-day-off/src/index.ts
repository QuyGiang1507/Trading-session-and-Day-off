"use strict";

import { configLoader } from "./configLoader";
import * as dotenv from "dotenv";

const env = process.env.NODE_ENV || "development";
dotenv.config({ path: `.env.${env.trim()}` });

import { logger } from "./loggers/winstonLogger";
import { redisConnector } from "@mxs/common";
import { kafkaConnector } from "./events/kafkaConnector";
import { mongoConnector } from "./mongo/mongoConnector";
import { app } from "./app";

const start = async () => {
  logger.info(`Starting ${process.env.SERVICE_NAME} "${env.trim()}"...`);

  if (!process.env.JWT_KEY) {
    logger.errorAsync("JWT_KEY must be defined");
    throw new Error("JWT_KEY must be defined");
  }
  if (!process.env.KAFKA_CLIENT_ID) {
    logger.error("KAFKA_CLIENT_ID must be defined");
    throw new Error("KAFKA_CLIENT_ID must be defined");
  }
  if (!process.env.KAFKA_BROKERS) {
    logger.errorAsync("KAFKA_BROKERS must be defined");
    throw new Error("KAFKA_BROKERS must be defined");
  }

  try {
    redisConnector.on("onReady", async (db) => {
      logger.info(`Service connected to redis db (${db}).`);
      if (db === 0) {
        await configLoader.reload();
      }
    });
    redisConnector.connect();

    kafkaConnector.onConnected = () => {
      logger.info("Service connected to kafka!");
    };
    await kafkaConnector.connect(
      process.env.KAFKA_CLIENT_ID,
      process.env.KAFKA_BROKERS.split(";")
    );
  } catch (err) {
    logger.errorAsync(err as string);
  }

  app.listen(process.env.SERVICE_PORT || 3033, () => {
    logger.info(`Listening on port ${process.env.SERVICE_PORT}!!!!!!!!`);
  });

  logger.info("Service logger started!");
};

start();
