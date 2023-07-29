import { Kafka, Consumer, KafkaMessage, ConsumerEvents } from "kafkajs";
import { Logger } from '../loggers/winstonLogger';
import { EventEmitter } from 'events';

interface Event {
  topic: string;
  data: any;
}

export abstract class ListenerKJS<T extends Event> extends EventEmitter {
  abstract topic: T['topic'];
  abstract groupId: string;
  abstract onMessage(data: T['data'], msg: KafkaMessage, partition: number): void;

  protected kafkaClient: Kafka;
  protected kafkaConsumer: Consumer;

  protected manualAck: boolean = false;
  
  protected heartbeatInterval = 3 * 1000;
  protected maxWaitTimeInMs = 5 * 1000;

  protected logger: Logger = new Logger(process.env.ModuleName || 'kafkaSub');

  constructor(client: Kafka) {
    super();
    this.kafkaClient = client;
  }

  get consumer() {
    if (!this.kafkaClient) {
      this.logger.error('Cannot access kafka client before connecting');
      throw new Error('Cannot access kafka client before connecting');
    }

    if (!this.kafkaConsumer) {
      this.logger.error('Cannot access kafka client before connecting');
      throw new Error('Cannot access kafka consumer before connecting');
    }

    return this.kafkaConsumer;
  }

  async commit(partition: number, message: KafkaMessage) {
    if (!this.manualAck)
      return;

    await this.kafkaConsumer.commitOffsets([{
        topic: this.topic,
        partition: partition,
        offset: message.offset,
      }]);
  }

  async listen(manualAck: boolean) {
    this.manualAck = manualAck;

    this.kafkaConsumer = this.kafkaClient.consumer({ groupId: this.groupId + "_" + this.topic, 
      heartbeatInterval: this.heartbeatInterval,
      maxWaitTimeInMs: this.maxWaitTimeInMs });

    const { DISCONNECT, GROUP_JOIN, REBALANCING } = this.kafkaConsumer.events;
    this.kafkaConsumer.on(DISCONNECT, () => {
      this.logger.info(`Consumer [${this.topic}] connection closed!`);
      this.emit('onDisconnected');
      //process.exit();
    });
    this.kafkaConsumer.on(GROUP_JOIN, (group) => {
      this.logger.info(`Consumer [${this.topic}] joined group [${group.payload.groupId}]`);
      this.emit('onJoinGroup', this.groupId);
    });
    this.kafkaConsumer.on(REBALANCING, (balance) => {
      this.logger.info(`Consumer [${this.topic}] rebalancing group [${balance.payload.groupId}]`);
      this.emit('onRebalancing', this.groupId);
    });

    process.on('SIGINT', () => this.kafkaConsumer.disconnect());
    process.on('SIGTERM', () => this.kafkaConsumer.disconnect());
    
    await this.kafkaConsumer.connect();
    await this.kafkaConsumer.subscribe({ topic: this.topic, fromBeginning: false });

    await this.kafkaConsumer.run({
      autoCommit: !manualAck,
      eachMessage: async ({ topic, partition, message, heartbeat }) => {
        //console.log(typeof message);    
        //console.log("Listener", topic, partition, message); // prints "<Buffer a1 a2 a3>"

        const parsedData = this.parseMessage(message);
        this.emit('onMessage', parsedData, message);
        this.onMessage(parsedData, message, partition);

        heartbeat();

        // console.log({
        //   value: message.value.toString(),
        // })
      },
    });

  }

  parseJson<T>(msg: KafkaMessage, typeAssertion: T): T {
    const jsonString = msg.value.toString();

    console.log(jsonString, typeof typeAssertion)

    if (typeof typeAssertion === 'string') {
      return jsonString as any as T;
    } else {
      return JSON.parse(jsonString) as T;
    }
  }

  parseMessage(msg: KafkaMessage) {    
    const data = msg.value;

    //console.log(data.toString());

    return JSON.parse(data.toString('utf8')) as T['data'];
  }
}
