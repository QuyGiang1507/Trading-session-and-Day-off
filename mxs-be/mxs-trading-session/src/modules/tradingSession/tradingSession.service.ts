import TradingSessionModel from "../../models/tradingSessionModel";
import { kafkaConnector } from "../../events/kafkaConnector";
import { TradingSessionEnum } from "@mxs/share";
import { Error } from "mongoose";

export async function createTradingSession(payload: any) {
    try {
        const { startTime, endTime, commodity, item, tradingPeriods } = payload;
        
        if (item) {
            if (!tradingPeriods["preOpen"].startTime || !tradingPeriods["maintenancePeriod"].endTime) {
                throw new Error("Please enter the Trading periods");
            }

            const [generalSession, commoditySession, itemSession] = await Promise.all([
                TradingSessionModel.findOne({ isGeneralSession: true, tempFor: null, isApproved: TradingSessionEnum.TradingSessionStatus.APPROVED }),
                TradingSessionModel.findOne({ commodity, tempFor: null, isApproved: TradingSessionEnum.TradingSessionStatus.APPROVED }),
                TradingSessionModel.findOne({ commodity, item, tempFor:null, isApproved: TradingSessionEnum.TradingSessionStatus.APPROVED })
            ]);

            if (itemSession) {
                throw new Error("Item trading session existed, please edit the exist one!");
            }
            
            if (!commoditySession) {
                throw new Error("Please create a commodity trading session first!");
            }

            if (tradingPeriods["preOpen"].startTime < generalSession.startTime || tradingPeriods["maintenancePeriod"].endTime > generalSession.endTime || tradingPeriods["preOpen"].startTime < commoditySession.tradingPeriods["preOpen"].startTime || tradingPeriods["maintenancePeriod"].endTime > commoditySession.tradingPeriods["maintenancePeriod"].endTime) {
                throw new Error("Session start and end times must be within the general session and commodity times!");
            }

            const tradingSession = TradingSessionModel.build({
                id: null,
                startTime: tradingPeriods["preOpen"].startTime,
                endTime: tradingPeriods["maintenancePeriod"].endTime,
                commodity,
                item,
                tradingPeriods,
                isGeneralSession: false,
                isApproved: TradingSessionEnum.TradingSessionStatus.PENDING,
                tempFor: null,
                createdAt: new Date(Date.now()).toISOString(),
            });

            await tradingSession.save();

            await kafkaConnector.createTradingSessionPublisher.publish(tradingSession);
        
            return tradingSession;
        } else if (!item && commodity) {
            if (!tradingPeriods["preOpen"].startTime || !tradingPeriods["maintenancePeriod"].endTime) {
                throw new Error("Please enter the Trading periods");
            }

            const [generalSession, commoditySession] = await Promise.all([
                TradingSessionModel.findOne({ isGeneralSession: true, tempFor: null, isApproved: TradingSessionEnum.TradingSessionStatus.APPROVED }),
                TradingSessionModel.findOne({ commodity, tempFor:null, isApproved: TradingSessionEnum.TradingSessionStatus.APPROVED }),
            ]);

            if (commoditySession) {
                throw new Error("Commodity trading session existed, please edit the exist one!");
            }

            if (tradingPeriods["preOpen"].startTime < generalSession.startTime || tradingPeriods["maintenancePeriod"].endTime > generalSession.endTime) {
                throw new Error("Session start and end times must be within the general session time!");
            }

            const tradingSession = TradingSessionModel.build({
                id: null,
                startTime: tradingPeriods["preOpen"].startTime,
                endTime: tradingPeriods["maintenancePeriod"].endTime,
                commodity,
                item,
                tradingPeriods,
                isGeneralSession: false,
                isApproved: TradingSessionEnum.TradingSessionStatus.PENDING,
                tempFor: null,
                createdAt: new Date(Date.now()).toISOString(),
            });

            await tradingSession.save();

            await kafkaConnector.createTradingSessionPublisher.publish(tradingSession);

            return tradingSession;
        } else {
            const generalSession = await TradingSessionModel.findOne({ isGeneralSession: true, tempFor: null, isApproved: TradingSessionEnum.TradingSessionStatus.APPROVED })

            if (generalSession) {
                throw new Error("General trading session existed, please edit the exist one!");
            }

            const tradingSession = TradingSessionModel.build({
                id: null,
                startTime,
                endTime,
                commodity,
                item,
                tradingPeriods,
                isGeneralSession: true,
                isApproved: TradingSessionEnum.TradingSessionStatus.PENDING,
                tempFor: null,
                createdAt: new Date(Date.now()).toISOString(),
            });
    
            await tradingSession.save();
    
            await kafkaConnector.createTradingSessionPublisher.publish(tradingSession);
        
            return tradingSession;
        }
    } catch(error) {
        throw error;
    }
};

export async function createGeneralTradingSession(payload: any) {
    try {
        const { startTime, endTime } = payload;

        const existGeneralTradingSession = await TradingSessionModel.findOne({ isGeneralSession: true, tempFor: null, isApproved: TradingSessionEnum.TradingSessionStatus.APPROVED });
        
        if (existGeneralTradingSession) throw new Error("General trading session existed, please edit the exist one!");
            
        const tradingSession = TradingSessionModel.build({
            id: null,
            startTime,
            endTime,
            commodity: "",
            item: "",
            tradingPeriods: {
                preOpen: {
                    startTime: "",
                    endTime: "",
                },
                open: {
                    startTime: "",
                    endTime: "",
                },
                pause: {
                    startTime: "",
                    endTime: "",
                },
                close: {
                    startTime: "",
                    endTime: "",
                },
                maintenancePeriod: {
                    startTime: "",
                    endTime: "",
                },
            },
            isGeneralSession: true,
            isApproved: TradingSessionEnum.TradingSessionStatus.PENDING,
            tempFor: null,
            createdAt: new Date(Date.now()).toISOString(),
        });

        await tradingSession.save();

        await kafkaConnector.createTradingSessionPublisher.publish(tradingSession);
    
        return tradingSession;
    } catch(error) {
        return error;
    }
};

export async function getTradingSession(payload: any) {
    try {
        const { tradingSessionId } = payload;

        const foundSession = await TradingSessionModel.findById(tradingSessionId);

        return foundSession;
    } catch (error) {
        return error;
    }
};

export async function getTradingSessions(payload: any) {
    try {
        const { 
            commodity,
            item,
            isApproved,
            isGeneralSession,
            tempFor,
            sortModel,
        } = payload;
        
        const commodityFilter = commodity ? { commodity } : {};
        
        const itemFilter = item ? { item } : {};

        const tempForFilter = tempFor === "null" ? { tempFor: null } : {}

        let isApprovedFilter: { isApproved: TradingSessionEnum.TradingSessionStatus};

        if (isApproved === "rejected") {
            isApprovedFilter = { isApproved: TradingSessionEnum.TradingSessionStatus.REJECTED}
        } else if (isApproved === "pending") {
            isApprovedFilter = { isApproved: TradingSessionEnum.TradingSessionStatus.PENDING}
        } else if (isApproved === "approved") {
            isApprovedFilter = { isApproved: TradingSessionEnum.TradingSessionStatus.APPROVED}
        };

        let isGeneralSessionFilter;

        if (isGeneralSession === "false") {
            isGeneralSessionFilter = { isGeneralSession: false }
        } else if (isGeneralSession === "true") {
            isGeneralSessionFilter = { isGeneralSession: true}
        } else {
            isGeneralSessionFilter = { undefined }
        };
        
        const filter = {
            ...commodityFilter,
            ...itemFilter,
            ...tempForFilter,
            ...isApprovedFilter,
            ...isGeneralSessionFilter,
        };

        let sortParams = {}
        if(sortModel) {
            sortParams[sortModel[0].colId] = sortModel[0].sort === 'desc' ? -1 : 1;
        } else {
            sortParams["createdAt"] = -1;
        }
        
        const [listTradingSession, totalTradingSession] = await Promise.all([
            TradingSessionModel.find(filter).sort(sortParams),
            TradingSessionModel.find(filter).countDocuments(),
        ]);

        const enhanceTradingPeriodData = listTradingSession.map(item => {
            const cloneItem = JSON.parse(JSON.stringify(item));

            const enhancedItem = {
                ...cloneItem,
                tradingPeriods: {
                    preOpen: `${cloneItem.tradingPeriods.preOpen.startTime} - ${cloneItem.tradingPeriods.preOpen.endTime}`,
                    open: `${cloneItem.tradingPeriods.open.startTime} - ${cloneItem.tradingPeriods.open.endTime}`,
                    pause: `${cloneItem.tradingPeriods.pause.startTime} - ${cloneItem.tradingPeriods.pause.endTime}`,
                    close: `${cloneItem.tradingPeriods.close.startTime} - ${cloneItem.tradingPeriods.close.endTime}`,
                    maintenancePeriod: `${cloneItem.tradingPeriods.maintenancePeriod.startTime} - ${cloneItem.tradingPeriods.maintenancePeriod.endTime}`,
                }
            }

            return enhancedItem;
        })

        const data = {
            data: enhanceTradingPeriodData,
            rowCount: totalTradingSession,
        }

        return data;
    } catch (error) {
        return error;
    }
};

export async function getApprovalSession(payload: any) {
    try {
        const { tradingSessionId } = payload;

        const pendingSession = await TradingSessionModel.findById(tradingSessionId);

        if(pendingSession.tempFor) {
            const oldSession = await TradingSessionModel.findById(pendingSession.tempFor);

            const rowData = [
                {
                    property: "Commodity",
                    oldValue: oldSession.commodity,
                    pendingValue: pendingSession.commodity,
                },
                {
                    property: "Item",
                    oldValue: oldSession.item,
                    pendingValue: pendingSession.item,
                },
                {
                    property: "Start Time",
                    oldValue: oldSession.startTime,
                    pendingValue: pendingSession.startTime,
                },
                {
                    property: "End Time",
                    oldValue: oldSession.endTime,
                    pendingValue: pendingSession.endTime,
                },
                {
                    property: "Pre-Open Period",
                    oldValue: `${oldSession.tradingPeriods["preOpen"].startTime} - ${oldSession.tradingPeriods["preOpen"].endTime}`,
                    pendingValue: `${pendingSession.tradingPeriods["preOpen"].startTime} - ${pendingSession.tradingPeriods["preOpen"].endTime}`,
                },
                {
                    property: "Open Period",
                    oldValue: `${oldSession.tradingPeriods["open"].startTime} - ${oldSession.tradingPeriods["open"].endTime}`,
                    pendingValue: `${pendingSession.tradingPeriods["open"].startTime} - ${pendingSession.tradingPeriods["open"].endTime}`,
                },
                {
                    property: "Pause Period",
                    oldValue: `${oldSession.tradingPeriods["pause"].startTime} - ${oldSession.tradingPeriods["pause"].endTime}`,
                    pendingValue: `${pendingSession.tradingPeriods["pause"].startTime} - ${pendingSession.tradingPeriods["pause"].endTime}`,
                },
                {
                    property: "Close Period",
                    oldValue: `${oldSession.tradingPeriods["close"].startTime} - ${oldSession.tradingPeriods["close"].endTime}`,
                    pendingValue: `${pendingSession.tradingPeriods["close"].startTime} - ${pendingSession.tradingPeriods["close"].endTime}`,
                },
                {
                    property: "Maintenance Period",
                    oldValue: `${oldSession.tradingPeriods["maintenancePeriod"].startTime} - ${oldSession.tradingPeriods["maintenancePeriod"].endTime}`,
                    pendingValue: `${pendingSession.tradingPeriods["maintenancePeriod"].startTime} - ${pendingSession.tradingPeriods["maintenancePeriod"].endTime}`,
                },
            ];

            const data = {
                rowData,
                rowCount: 8,
                status: pendingSession.isApproved,
                createdAt: oldSession.createdAt,
                updatedAt: pendingSession.updatedAt,
                approvedAt: pendingSession.approvalDate,
            };

            return data;
        } else {
            const rowData = [
                {
                    property: "Commodity",
                    oldValue: ` - `,
                    pendingValue: pendingSession.commodity,
                },
                {
                    property: "Item",
                    oldValue: ` - `,
                    pendingValue: pendingSession.item,
                },
                {
                    property: "Start Time",
                    oldValue: ` - `,
                    pendingValue: pendingSession.startTime,
                },
                {
                    property: "End Time",
                    oldValue: ` - `,
                    pendingValue: pendingSession.endTime,
                },
                {
                    property: "Pre-Open Period",
                    oldValue: ` - `,
                    pendingValue: `${pendingSession.tradingPeriods["preOpen"].startTime} - ${pendingSession.tradingPeriods["preOpen"].endTime}`,
                },
                {
                    property: "Open Period",
                    oldValue: ` - `,
                    pendingValue: `${pendingSession.tradingPeriods["open"].startTime} - ${pendingSession.tradingPeriods["open"].endTime}`,
                },
                {
                    property: "Pause Period",
                    oldValue: ` - `,
                    pendingValue: `${pendingSession.tradingPeriods["pause"].startTime} - ${pendingSession.tradingPeriods["pause"].endTime}`,
                },
                {
                    property: "Close Period",
                    oldValue: ` - `,
                    pendingValue: `${pendingSession.tradingPeriods["close"].startTime} - ${pendingSession.tradingPeriods["close"].endTime}`,
                },
                {
                    property: "Maintenance Period",
                    oldValue: ` - `,
                    pendingValue: `${pendingSession.tradingPeriods["maintenancePeriod"].startTime} - ${pendingSession.tradingPeriods["maintenancePeriod"].endTime}`,
                },
            ];

            const data = {
                rowData,
                rowCount: 8,
                status: pendingSession.isApproved,
                createdAt: pendingSession.createdAt,
                updatedAt: pendingSession.updatedAt,
                approvedAt: pendingSession.approvalDate,
            };

            return data;
        }
    } catch (error) {
        return error;
    }
}

export async function getGeneralTradingSession() {
    try {
        const data = await TradingSessionModel.findOne({ isGeneralSession: true, isApproved: "approved", tempFor: null });

        return { data };
    } catch (error) {
        return error;
    }
};

export async function updateTradingSession(payload: any) {
    try {
        const { tradingSessionId, updateData } = payload;
        
        if(updateData.item) {
            const [generalSession, commoditySession] = await Promise.all([
                TradingSessionModel.findOne({ isGeneralSession: true, tempFor: null, isApproved: TradingSessionEnum.TradingSessionStatus.APPROVED }),
                TradingSessionModel.findOne({ commodity: updateData.commodity, tempFor: null, isApproved: TradingSessionEnum.TradingSessionStatus.APPROVED }),
            ]);
            
            if (updateData.tradingPeriods["preOpen"].startTime < generalSession.startTime || updateData.tradingPeriods["maintenancePeriod"].endTime > generalSession.endTime || updateData.tradingPeriods["preOpen"].startTime < commoditySession.tradingPeriods["preOpen"].startTime || updateData.tradingPeriods["maintenancePeriod"].endTime > commoditySession.tradingPeriods["maintenancePeriod"].endTime) {
                throw new Error("Session start and end times must be within the general session and commodity times!");
            }
            
            const updatedTradingSession = TradingSessionModel.build({
                id: null,
                startTime: updateData.tradingPeriods["preOpen"].startTime,
                endTime: updateData.tradingPeriods["maintenancePeriod"].endTime,
                commodity: updateData.commodity,
                item: updateData.item,
                tradingPeriods: updateData.tradingPeriods,
                isGeneralSession: updateData.isGeneralSession,
                isApproved: TradingSessionEnum.TradingSessionStatus.PENDING,
                tempFor: tradingSessionId,
                createdAt: new Date(Date.now()).toISOString(),
                updatedAt: new Date(Date.now()).toISOString(),
            });
    
            await updatedTradingSession.save();
                
            await kafkaConnector.updateTradingSessionPublisher.publish(updatedTradingSession);
                
            return updatedTradingSession;
            } else if (!updateData.item && updateData.commodity) {
                const generalSession = await TradingSessionModel.findOne({ isGeneralSession: true, tempFor: null });

            if (updateData.tradingPeriods["preOpen"].startTime < generalSession.startTime || updateData.tradingPeriods["maintenancePeriod"].endTime > generalSession.endTime) {
                throw new Error("Session start and end times must be within the general session time!");
            }

            const updatedTradingSession = TradingSessionModel.build({
                id: null,
                startTime: updateData.tradingPeriods["preOpen"].startTime,
                endTime: updateData.tradingPeriods["maintenancePeriod"].endTime,
                commodity: updateData.commodity,
                item: updateData.item,
                tradingPeriods: updateData.tradingPeriods,
                isGeneralSession: updateData.isGeneralSession,
                isApproved: TradingSessionEnum.TradingSessionStatus.PENDING,
                tempFor: tradingSessionId,
                createdAt: new Date(Date.now()).toISOString(),
                updatedAt: new Date(Date.now()).toISOString(),
            });

            await updatedTradingSession.save();

            await kafkaConnector.updateTradingSessionPublisher.publish(updatedTradingSession);
    
            return updatedTradingSession;
        }

        const updatedTradingSession = await TradingSessionModel.build({
            id: null,
            startTime: updateData.startTime,
            endTime: updateData.endTime,
            commodity: "",
            item: "",
            tradingPeriods: {
                preOpen: {
                    startTime: "",
                    endTime: "",
                },
                open: {
                    startTime: "",
                    endTime: "",
                },
                pause: {
                    startTime: "",
                    endTime: "",
                },
                close: {
                    startTime: "",
                    endTime: "",
                },
                maintenancePeriod: {
                    startTime: "",
                    endTime: "",
                },
            },
            isGeneralSession: true,
            isApproved: TradingSessionEnum.TradingSessionStatus.PENDING,
            tempFor: tradingSessionId,
            createdAt: new Date(Date.now()).toISOString(),
            updatedAt: new Date(Date.now()).toISOString(),
        });

        await updatedTradingSession.save();

        await kafkaConnector.updateTradingSessionPublisher.publish(updatedTradingSession);

        return updatedTradingSession;
    } catch (error) {
        throw error;
    }
};

export async function aprpoveTradingSession(payload: any) {
    try {
        const { tradingSessionId, approvalStatus } = payload;
        
        if (approvalStatus === "approved") {
            const aprrovedSession = await TradingSessionModel.findByIdAndUpdate(
                { _id: tradingSessionId },
                { 
                    isApproved: TradingSessionEnum.TradingSessionStatus.APPROVED,
                    approvalDate: new Date(Date.now()).toISOString(),
                },
                { new: true }
            )
            
            if (aprrovedSession.tempFor === null) {
                return aprrovedSession;
            }
            
            const aprrovedOriginalSession = await TradingSessionModel.findByIdAndUpdate(
                { _id: aprrovedSession.tempFor },
                {
                    startTime: aprrovedSession.startTime,
                    endTime: aprrovedSession.endTime,
                    commodity: aprrovedSession.commodity,
                    item: aprrovedSession.item,
                    tradingPeriods: aprrovedSession.tradingPeriods,
                    isGeneralSession: aprrovedSession.isGeneralSession,
                    isApproved: TradingSessionEnum.TradingSessionStatus.APPROVED,
                    approvalDate: new Date(Date.now()).toISOString(),
                }
            );

            return aprrovedOriginalSession;
        } else if (approvalStatus === "rejected") {
            const aprrovedSession = await TradingSessionModel.findByIdAndUpdate(
                { _id: tradingSessionId },
                {
                    isApproved: TradingSessionEnum.TradingSessionStatus.REJECTED,
                    approvalDate: new Date(Date.now()).toISOString(), 
                },
                { new: true }
            )

            return aprrovedSession;
        }
    } catch (error) {
        return error;
    }
};

export async function deleteTradingSession(payload: any) {
    try {
        const { tradingSessionId } = payload;

        const deletedData = TradingSessionModel.findByIdAndDelete({ _id: tradingSessionId });

        return deletedData;
    } catch (error) {
        return error;
    }
};