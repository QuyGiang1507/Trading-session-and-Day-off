import { Kafka, Producer, RecordMetadata } from "kafkajs";
import { Logger } from '../loggers/winstonLogger';
import { EventEmitter } from 'events';

interface Event {
  topic: string;
  data: any;
}

export class PublisherKJS<T extends Event> extends EventEmitter {
  protected topic: T['topic'];
  protected groupId: string;
  protected kafkaClient: Kafka;
  protected kafkaPublisher: Producer;
  protected ackWait = 5 * 1000;
  protected logger: Logger = new Logger(process.env.ModuleName || 'kafkaPub');

  constructor(client: Kafka) {
    super();

    this.kafkaClient = client;
    this.kafkaPublisher = client.producer();

    const { DISCONNECT, CONNECT } = this.kafkaPublisher.events;
    this.kafkaPublisher.on(CONNECT, () => {
      this.emit('onConnected', this.topic);
    });
    this.kafkaPublisher.on(DISCONNECT, () => {
      this.emit('onDiconnected', this.topic);
    });

    process.on('SIGINT', () => this.kafkaPublisher.disconnect());
    process.on('SIGTERM', () => this.kafkaPublisher.disconnect());
    
  }

  get publisher() {
    if (!this.kafkaClient) {
        throw new Error('Cannot access kafka client before connecting');
    }

    if (!this.kafkaPublisher) {
      throw new Error('Cannot access kafka publisher before connecting');
    }

    return this.kafkaPublisher;
  }

  connect(topic: T['topic']): Promise<void> {
    this.topic = topic;

    return new Promise((resolve, reject) => {
        this.kafkaPublisher.connect()
          .then(value  => {
            this.logger.info(`Event publisher connected to topic [${this.topic}]`);
            resolve();
          })
          .catch(err => {
            this.logger.error(err);
            this.emit('onError', err);
            reject(err);  
          });
    });
  }

  disconnect(): Promise<void> {
    return new Promise((resolve, reject) => {
        this.kafkaPublisher.disconnect()
          .then(value  => {
            this.logger.info('Event published disconnected');
            this.emit('onDisconnected', this.topic);
            resolve();
          })
          .catch(err => {
            this.logger.error(err);
            this.emit('onError', err);
            reject(err);  
          });
    });
  }

  publish(data: T['data']): Promise<RecordMetadata[]> {
    //console.log("publish", this.topic, data);

    return new Promise((resolve, reject) => {
        this.kafkaPublisher.send({topic: this.topic, messages: [{value: JSON.stringify(data)}]})
          .then(value  => {
            //console.log('Event published to subject', this.topic, data);
            resolve(value);
          })
          .catch(err => {
            this.logger.error(err);
            this.emit('onError', err);
            reject(err);  
          });
    });
  }

  publishTopic(topic: T['topic'], data: T['data']): Promise<RecordMetadata[]> {
    return new Promise((resolve, reject) => {
        this.topic = topic;
        this.kafkaPublisher.send({topic: this.topic, messages: [{value: JSON.stringify(data)}]})
          .then(value  => {
            //console.log('Event published to subject', this.topic, data);
            resolve(value);
          })
          .catch(err => {
            this.logger.error(err);
            this.emit('onError', err);
            reject(err);  
          });
    });
  }
}
