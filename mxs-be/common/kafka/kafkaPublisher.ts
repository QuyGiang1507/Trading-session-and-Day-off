import { Message, Producer } from "node-rdkafka";
import { Logger } from "../loggers/winstonLogger";
import { EventEmitter } from "events";
import { encode } from "@msgpack/msgpack";

interface Event {
  topic: string;
  data: any;
}

export class Publisher<T extends Event> extends EventEmitter {
  protected topic: T["topic"];
  protected groupId: string;
  protected kafkaClient = {};
  protected kafkaPublisher: Producer;
  protected ackWait = 5 * 1000;
  protected logger: Logger = new Logger(process.env.ModuleName || "kafkaPub");
  protected connected = false;

  constructor(client) {
    super();

    this.kafkaClient = client;
    this.kafkaClient["acks"] = 1;
    this.kafkaPublisher = new Producer(this.kafkaClient);

    this.kafkaPublisher.on("ready", () => {
      this.connected = true;
      this.emit("onConnected", this.topic);
    });
    this.kafkaPublisher.on("disconnected", () => {
      this.emit("onDiconnected", this.topic);
    });
    this.kafkaPublisher.on("delivery-report", (err, report) => {
      if (err) {
        console.error(`Delivery failed for message ${report.value}: ${err}`);
      } else {
        console.log(
          `Message ${report.value} delivered to topic ${report.topic}`
        );
      }
    });

    process.on("SIGINT", () => this.kafkaPublisher.disconnect());
    process.on("SIGTERM", () => this.kafkaPublisher.disconnect());
  }

  get publisher() {
    if (!this.kafkaClient) {
      throw new Error("Cannot access kafka client before connecting");
    }

    if (!this.kafkaPublisher) {
      throw new Error("Cannot access kafka publisher before connecting");
    }

    return this.kafkaPublisher;
  }

  connect(topic: T["topic"]) {
    this.topic = topic;

    this.kafkaPublisher.connect();
  }

  disconnect() {
    this.kafkaPublisher.disconnect();
  }

  async publish(data: T["data"], sendBinary = false) {
    //console.log("publish", this.topic, data);
    if (!this.connected)
      throw new Error("Cannot access kafka publisher before connecting");
    if (sendBinary) {
      this.kafkaPublisher.produce(
        this.topic,
        null,
        Buffer.from(encode(data, { useBigInt64: true })),
        null,
        Date.now()
      );
    } else {
      this.kafkaPublisher.produce(
        this.topic,
        null,
        Buffer.from(JSON.stringify(data)),
        null,
        Date.now()
      );
    }
  }

  publishTopic(topic: T["topic"], data: T["data"]) {
    if (!this.connected)
      throw new Error("Cannot access kafka publisher before connecting");

    this.topic = topic;

    this.kafkaPublisher.produce(
      this.topic,
      null,
      Buffer.from(JSON.stringify(data)),
      null,
      Date.now()
    );
  }
}
