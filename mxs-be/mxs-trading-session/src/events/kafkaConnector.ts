import { KafkaConnector } from "@mxs/common";
import { Publisher, Listener } from "@mxs/common";
import { TradingSessionEnum, TradingSessionEvent } from "@mxs/share";
import { cfgReloadListener, tradingSessionListener, tradingSessionPublisher } from "./";
   
class LogKafkaConnector extends KafkaConnector {
    readonly groupId: string = "event-trading-session";

    createTradingSessionPublisher: tradingSessionPublisher.createTradingSessionPublisher;

    updateTradingSessionPublisher: tradingSessionPublisher.updateTradingSessionPublisher;

    reloadListener: cfgReloadListener;

    tradingSessionListener: tradingSessionListener;

    constructor() {
        super();
    }

    onConnected(): void {
        console.log("Connected");    
    }

    async connect(clientId: string, brokers: string[])
    {
        this.connectKafka(clientId, brokers);
        
        if (this.client)
        {
            await this.initPublishers();
            await this.initListener();
        }

        this.onConnected();
    }

    async initPublishers()
    {
        this.createTradingSessionPublisher = new tradingSessionPublisher.createTradingSessionPublisher(this.client);
        await this.createTradingSessionPublisher.connect(TradingSessionEnum.TradingSessionChannels.Create);
        
        this.updateTradingSessionPublisher = new tradingSessionPublisher.updateTradingSessionPublisher(this.client);
        await this.updateTradingSessionPublisher.connect(TradingSessionEnum.TradingSessionChannels.Update);
    }

    async initListener()
    {
        this.reloadListener = new cfgReloadListener(this.client);
        await this.reloadListener.listen(false);

        this.tradingSessionListener = new tradingSessionListener(this.client);
        await this.tradingSessionListener.listen(false);
    }

}

export const kafkaConnector = new LogKafkaConnector();