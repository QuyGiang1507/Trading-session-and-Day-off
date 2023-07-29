import { KafkaConnector } from "@mxs/common";
import { Publisher, Listener } from "@mxs/common";
import { DayOffEnum, DayOffEvent } from "@mxs/share";
import { cfgReloadListener, dayOffListener, dayOffPublisher } from "./";
   
class LogKafkaConnector extends KafkaConnector {
    readonly groupId: string = "event-day-off";

    createFixedDayOffPublisher: dayOffPublisher.createFixedDayOffPublisher;

    updateFixedDayOffPublisher: dayOffPublisher.updateFixedDayOffPublisher;

    createUnfixedDayOffPublisher: dayOffPublisher.createUnfixedDayOffPublisher;

    updateUnfixedDayOffPublisher: dayOffPublisher.updateUnfixedDayOffPublisher;

    reloadListener: cfgReloadListener;

    dayOffListener: dayOffListener;

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
        this.createFixedDayOffPublisher = new dayOffPublisher.createFixedDayOffPublisher(this.client);
        await this.createFixedDayOffPublisher.connect(DayOffEnum.FixedDayOffChannels.Create);
        
        this.updateFixedDayOffPublisher = new dayOffPublisher.updateFixedDayOffPublisher(this.client);
        await this.updateFixedDayOffPublisher.connect(DayOffEnum.FixedDayOffChannels.Update);
        
        this.createUnfixedDayOffPublisher = new dayOffPublisher.createUnfixedDayOffPublisher(this.client);
        await this.createUnfixedDayOffPublisher.connect(DayOffEnum.UnfixedDayOffChannels.Create);

        this.updateUnfixedDayOffPublisher = new dayOffPublisher.updateUnfixedDayOffPublisher(this.client);
        await this.updateUnfixedDayOffPublisher.connect(DayOffEnum.UnfixedDayOffChannels.Update);
    }

    async initListener()
    {
        this.reloadListener = new cfgReloadListener(this.client);
        await this.reloadListener.listen(false);

        this.dayOffListener = new dayOffListener(this.client);
        await this.dayOffListener.listen(false);
    }

}

export const kafkaConnector = new LogKafkaConnector();