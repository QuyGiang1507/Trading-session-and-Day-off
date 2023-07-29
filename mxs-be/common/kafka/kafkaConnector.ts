import { Logger } from '../loggers/winstonLogger';
import { EventEmitter } from 'events';

export abstract class KafkaConnector extends EventEmitter {
    protected _client;
    protected logger: Logger = new Logger(process.env.ModuleName || 'kafkaConn');

    abstract onConnected(): void;

    constructor() {
        super();
    }

    get client() {
        if (!this._client) {
            this.logger.error('Cannot access kafka client before connecting');
            throw new Error('Cannot access kafka client before connecting');
        }

        return this._client;
    }

    connectKafka(clientId: string, brokers: string[]) {
        this._client = {
            'client.id': clientId,
            'bootstrap.servers': brokers.join(','),
            'auto.offset.reset': 'latest'
        };

        return this._client;
    }
}
