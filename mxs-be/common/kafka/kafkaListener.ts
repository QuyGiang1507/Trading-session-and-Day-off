import { Message, KafkaConsumer } from "node-rdkafka";

import { Logger } from "../loggers/winstonLogger";
import { EventEmitter } from "events";
import { decode } from "@msgpack/msgpack";

interface Event {
  topic: string;
  data: any;
}

export abstract class Listener<T extends Event> extends EventEmitter {
  abstract topic: T["topic"];
  abstract groupId: string;
  abstract onMessage(data: T["data"], msg: Message, partition: number): void;

  protected kafkaClient = {};
  protected topicConfig = {};
  protected kafkaConsumer: KafkaConsumer;

  protected manualAck: boolean = false;

  protected heartbeatInterval = 1 * 1000;
  protected maxWaitTimeInMs = 5 * 1000;

  protected logger: Logger = new Logger(process.env.ModuleName || "kafkaSub");

  constructor(client) {
    super();
    this.kafkaClient = client;
    this.kafkaClient["fetch.wait.max.ms"] = 0;
    this.kafkaClient["fetch.error.backoff.ms"] = 50;
    this.kafkaClient["fetch.min.bytes"] = 1024;
    this.kafkaClient["socket.keepalive.enable"] = true;

    this.topicConfig = {
      "auto.commit.interval.ms": this.heartbeatInterval,
    };
  }

  get consumer() {
    if (!this.kafkaClient) {
      this.logger.error("Cannot access kafka client before connecting");
      throw new Error("Cannot access kafka client before connecting");
    }

    if (!this.kafkaConsumer) {
      this.logger.error("Cannot access kafka client before connecting");
      throw new Error("Cannot access kafka consumer before connecting");
    }

    return this.kafkaConsumer;
  }

  async commit(partition: number, message: Message) {
    if (!this.manualAck) return;

    this.kafkaConsumer.commit(message);
  }

  async listen(manualAck: boolean) {
    this.manualAck = manualAck;

    this.topicConfig["enable.auto.commit"] = !this.manualAck;
    this.topicConfig["auto.offset.reset"] = "latest";

    this.kafkaClient["group.id"] = this.groupId + "_" + this.topic;
    this.kafkaConsumer = new KafkaConsumer(this.kafkaClient, this.topicConfig);

    this.kafkaConsumer.on("disconnected", () => {
      this.logger.info(`Consumer [${this.topic}] connection closed!`);
      this.emit("onDisconnected");
    });
    this.kafkaConsumer.on("subscribed", () => {
      this.logger.info(`Consumer [${this.topic}] subscribed!`);
      this.emit("onSubscribed");
    });
    this.kafkaConsumer.on("rebalance", () => {
      this.logger.info(`Consumer [${this.topic}] rebalancing!`);
      this.emit("onRebalance");
    });
    this.kafkaConsumer.on("ready", () => {
      this.logger.info(`Consumer [${this.topic}] is ready`);
      this.kafkaConsumer.subscribe([this.topic]);
      this.kafkaConsumer.consume();
    });
    this.kafkaConsumer.on("data", (message) => {
      //console.log(`Received message: ${message.value.toString()}`);

      const parsedData = this.parseMessage(message);
      this.emit("onMessage", parsedData, message);
      this.onMessage(parsedData, message, message.partition);
    });

    process.on("SIGINT", () => this.kafkaConsumer.disconnect());
    process.on("SIGTERM", () => this.kafkaConsumer.disconnect());

    this.kafkaConsumer.connect();
    //this.kafkaConsumer.subscribe([this.topic]);
  }

  parseMessage(msg: Message) {
    const data = msg.value;

    //console.log(data.toString());

    return JSON.parse(data.toString("utf8")) as T["data"];
  }
}

export abstract class ConsumerManager<T extends Event> extends EventEmitter {
  public consumers: any = {};
  readonly brokers: string;
  abstract onMessage(data: T["data"], msg: Message, partition: number): void;

  constructor(brokers: string[]) {
    super();
    this.brokers = brokers.toString();
  }

  newConsumer(groupId: string, topic: string) {
    if (this.consumers[topic] === undefined) {
      this.consumers[topic] = new KafkaConsumer(
        {
          "group.id": groupId,
          "metadata.broker.list": this.brokers,
        },
        {}
      );

      this.consumers[topic].connect();
      this.consumers[topic].on("ready", () => {
        console.log(`consumer ready... ${groupId} ${topic}`);
        this.consumers[topic].subscribe([topic]);
        this.consumers[topic].consume();
      });
      this.consumers[topic].on("data", (data) => {
        const parsedData = this.parseMessage(data);
        // do something
        this.emit("onMessage", parsedData, data);
        this.onMessage(parsedData, data, data.partition);
      });
      process.on("SIGINT", () => this.consumers[topic].disconnect());
      process.on("SIGTERM", () => this.consumers[topic].disconnect());
    }
  }

  parseMessage(msg: Message) {
    const data = msg.value;
    return decode(data) as T["data"];
  }
}
