import DayOffModel from "../../models/dayOffModel";
import { kafkaConnector } from "../../events/kafkaConnector";
import { DayOffEnum } from "@mxs/share";

export async function createUnfixedDayOff(payload: any) {
    try {
        const { days, description } = payload;

        if (new Date(days[0]) < new Date(Date.now())) {
            throw new Error("Can not create day off in the past");
        }
        if (new Date(days[1]) < new Date(Date.now()) && days[1]) {
            throw new Error("Can not create day off in the past");
        }

        const existDayOff = await DayOffModel.findOne({
            days: days
        });

        if (existDayOff) {
            throw new Error("Day off existed. Please modify the exist one");
        }

        const unfixedDayOff = DayOffModel.build({
            id: null,
            days,
            status: DayOffEnum.DayOffStatus.PENDING,
            description,
            tempFor: null,
            createdAt: new Date(Date.now()).toISOString(),
        });

        await unfixedDayOff.save();

        await kafkaConnector.createUnfixedDayOffPublisher.publish(unfixedDayOff);
    
        return unfixedDayOff;
    } catch(error) {
        throw error;
    }
};

export async function createFixedDayOff(payload: any) {
    try {
        const { days } = payload;
        
        const existDayOff = await DayOffModel.findOne({
            days: days,
            status: DayOffEnum.DayOffStatus.APPROVED,
        });
        
        if (existDayOff) {
            throw new Error("Day off existed. Please modify the exist one");
        }

        const fixedDayOff = DayOffModel.build({
            id: null,
            days,
            status: DayOffEnum.DayOffStatus.PENDING,
            description: "Fixed day off",
            tempFor: null,
            createdAt: new Date(Date.now()).toISOString(),
        });

        await fixedDayOff.save();

        await kafkaConnector.createFixedDayOffPublisher.publish(fixedDayOff);
    
        return fixedDayOff;
    } catch(error) {
        throw error;
    }
};

export async function getDayOff(payload: any) {
    try {
        const { dayOffId } = payload;

        const foundDayOff = await DayOffModel.findById(dayOffId);

        return foundDayOff;
    } catch (error) {
        return error;
    }
}

export async function getListDayOffs(payload: any) {
    try {
        const { 
            keyword,
            status, 
            days, 
            tempFor,
        } = payload;
        
        const keywordFilter = keyword ? { description: { $regex: new RegExp(`${keyword}`, 'i') }
        } : {};

        const dayFilter = days ? { days } : {};

        const statusFilter = status ? { status } : {};

        const tempForFilter = tempFor === "null" ? { tempFor: null } : {};
        
        const filter = {
            ...keywordFilter,
            ...dayFilter,
            ...statusFilter,
            ...tempForFilter,
        };

        const rowData = await DayOffModel.find(filter).sort({ createdAt: -1 })
        
        const handledData = rowData.map(item => {
            if (item.description === "Fixed day off") {
                const listGetDay = {
                    sunday: 0,
                    monday: 1,
                    tuesday: 2,
                    wednesday: 3,
                    thursday: 4,
                    friday: 5,
                    saturday: 6,
                }
                const year = new Date(Date.now()).getFullYear();
                const nextYear = new Date(Date.now()).getFullYear() + 1;
                const dayOffs = [];
                const date = new Date(year, 0, 1);
                
                while (date.getFullYear() === year) {
                    if (date.getDay() === listGetDay[item.days[0]]) { 
                        dayOffs.push(new Date(date));
                    }
                    date.setDate(date.getDate() + 1); 
                };

                while (date.getFullYear() === nextYear) {
                    if (date.getDay() === listGetDay[item.days[0]]) { 
                        dayOffs.push(new Date(date));
                    }
                    date.setDate(date.getDate() + 1); 
                };

                const enhancedDayOffs = dayOffs.map(day => {
                    const enhancedItem = {
                        title: "",
                        description: item.description,
                        start: day,
                        end: day,
                        id: item.id,
                    };

                    return enhancedItem;
                });

                return enhancedDayOffs;
            } else if (item.description !== "Fixed day off") {
                const dayOffs = [];

                let currentDate = new Date(item.days[0]);

                if(item.days[1]) {
                    while (currentDate <= new Date(item.days[1])) {
                        dayOffs.push(currentDate.toISOString());
                        currentDate.setDate(currentDate.getDate() + 1);
                    }
                } else {
                    dayOffs.push(currentDate.toISOString());
                }

                const enhancedDayOffs = dayOffs.map(day => {
                    const enhancedItem = {
                        title: item.description,
                        description: item.description,
                        start: day,
                        end: day,
                        id: item.id,
                    }

                    return enhancedItem;
                });
                
                return enhancedDayOffs;
            } else {
                throw new Error("Some thing went wrong");
            }
        });
        
        const data = {
            rowData,
            data: handledData.flat(),
            total: handledData.flat().length,
        };

        return data;
    } catch (error) {
        throw error;
    }
};

export async function getDayOffs(payload: any) {
    try {
        const { 
            keyword,
            status,
            days,
            tempFor,
            sortModel,
        } = payload;
        
        const keywordFilter = keyword ? { description: { $regex: new RegExp(`${keyword}`, 'i') }
        } : {};

        const dayFilter = days ? { days } : {};

        const statusFilter = status ? { status } : {};

        const tempForFilter = tempFor === "null" ? { tempFor: null } : {};
        
        const filter = {
            ...keywordFilter,
            ...dayFilter,
            ...statusFilter,
            ...tempForFilter,
        };

        let sortParams = {}
        if(sortModel) {
            sortParams[sortModel[0].colId] = sortModel[0].sort === 'desc' ? -1 : 1;
        } else {
            sortParams["createdAt"] = -1;
        }
        
        const [rowData, rowCount] = await Promise.all([
            DayOffModel.find(filter).sort(sortParams),
            DayOffModel.find(filter).countDocuments(),
        ]);
        
        const data = {
            rowData,
            rowCount,
        };

        return data;
    } catch (error) {
        return error;
    }
};

export async function getApprovalDayOff(payload: any) {
    try {
        const { dayOffApprovalId } = payload;

        const pendingDayOff = await DayOffModel.findById(dayOffApprovalId);

        if (pendingDayOff.tempFor) {
            const oldDayOff = await DayOffModel.findById(pendingDayOff.tempFor);

            const rowData = [
                {
                    property: "Description",
                    oldValue: oldDayOff.description,
                    pendingValue: pendingDayOff.description,
                },
                {
                    property: "Day off",
                    oldValue: oldDayOff.days.length > 1 && oldDayOff.days[1] !== null ? `From ${new Date(oldDayOff.days[0]).toLocaleString("en-GB").slice(0, 10)} to ${new Date(oldDayOff.days[1]).toLocaleString("en-GB").slice(0, 10)}` : oldDayOff.days.length > 0 && oldDayOff.days[1] === null ? `${new Date(oldDayOff.days[0]).toLocaleString("en-GB").slice(0, 10)}` : oldDayOff.days[0],
                    pendingValue: pendingDayOff.days.length > 1 && pendingDayOff.days[1] !== null ? `From ${new Date(pendingDayOff.days[0]).toLocaleString("en-GB").slice(0, 10)} to ${new Date(pendingDayOff.days[1]).toLocaleString("en-GB").slice(0, 10)}` : pendingDayOff.days.length > 0 && pendingDayOff.days[1] === null ? `${new Date(pendingDayOff.days[0]).toLocaleString("en-GB").slice(0, 10)}` : pendingDayOff.days[0],
                },
            ];

            const data = {
                rowData,
                rowCount: 2,
                status: pendingDayOff.status,
                createdAt: oldDayOff.createdAt,
                updatedAt: pendingDayOff.updatedAt,
                approvedAt: pendingDayOff.approvalDate,
            };

            return data;
        } else {
            const rowData = [
                {
                    property: "Description",
                    oldValue: ` - `,
                    pendingValue: pendingDayOff.description,
                },
                {
                    property: "Day off",
                    oldValue: ` - `,
                    pendingValue: pendingDayOff.days.length > 1 && pendingDayOff.days[1] !== null ? `From ${new Date(pendingDayOff.days[0]).toLocaleString("en-GB").slice(0, 10)} to ${new Date(pendingDayOff.days[1]).toLocaleString("en-GB").slice(0, 10)}` : pendingDayOff.days.length > 0 && pendingDayOff.days[1] === null ? `${new Date(pendingDayOff.days[0]).toLocaleString("en-GB").slice(0, 10)}` : pendingDayOff.days[0],
                },
            ];

            const data = {
                rowData,
                rowCount: 2,
                status: pendingDayOff.status,
                createdAt: pendingDayOff.createdAt,
                updatedAt: pendingDayOff.updatedAt,
                approvedAt: pendingDayOff.approvalDate,
            };

            return data;
        }

    } catch (error) {
        return error;
    }
}

export async function getUnfixedDayOff(payload: any) {
    try {
        const { keyword, status, days, tempFor } = payload;

        const keywordFilter = keyword ? { description: { $regex: new RegExp(`${keyword}`, 'i') }
        } : {};

        const dayFilter = days ? { days } : {};

        const statusFilter = status ? { status } : {};

        const tempForFilter = tempFor ? { tempFor } : {};
        
        const filter = {
            ...keywordFilter,
            ...dayFilter,
            ...statusFilter,
            ...tempForFilter,
            description: { $ne: "Fixed day off" },
        };

        const [listDayOff, totalDayOff] = await Promise.all([
            DayOffModel.find(filter).sort({createdAt: -1}),
            DayOffModel.find(filter).countDocuments(),
        ]);

        const data = {
            data: listDayOff,
            total: totalDayOff,
        };

        return data;
    } catch (error) {
        return error;
    }
};

export async function getFixedDayOff(payload: any) {
    try {
        const { keyword, status, days, tempFor } = payload;

        const keywordFilter = keyword ? { description: { $regex: new RegExp(`${keyword}`, 'i') }
        } : {};

        const dayFilter = days ? { days } : {};
        
        const statusFilter = status ? { status } : {};

        const tempForFilter = tempFor ? { tempFor } : {};
        
        const filter = {
            ...keywordFilter,
            ...dayFilter,
            ...statusFilter,
            ...tempForFilter,
            description: "Fixed day off",
        };

        const [listDayOff, totalDayOff] = await Promise.all([
            DayOffModel.find(filter).sort({createdAt: -1}),
            DayOffModel.find(filter).countDocuments(),
        ]);

        const data = {
            data: listDayOff,
            total: totalDayOff,
        };

        return data;
    } catch (error) {
        return error;
    }
};

export async function updateFixedDayOff(payload: any) {
    try {
        const { DayOffId, updateData } = payload;
        
        const existDayOff = await DayOffModel.findOne({
            days: updateData.days,
            status: DayOffEnum.DayOffStatus.APPROVED,
        });

        if(existDayOff) {
            throw new Error("Day off existed. Please modify the exist one");
        }

        const updatedData = await DayOffModel.build({
            id: null,
            days: updateData.days,
            status: DayOffEnum.DayOffStatus.PENDING,
            description: "Fixed day off",
            tempFor: DayOffId,
            createdAt: new Date(Date.now()).toISOString(),
            updatedAt: new Date(Date.now()).toISOString(),
        });

        await updatedData.save();

        await kafkaConnector.updateFixedDayOffPublisher.publish(updatedData);

        return updatedData;
    } catch (error) {
        throw error;
    }
};

export async function updateUnfixedDayOff(payload: any) {
    try {
        const { DayOffId, updateData } = payload;

        if (new Date(updateData.days[0]) < new Date(Date.now()) || new Date(updateData.days[1]) < new Date(Date.now()) && updateData.days[1]) {
            throw new Error("Can not modify day off in the past");
        }
        
        if (new Date(updateData.days[0]) < new Date(Date.now())) {
            throw new Error("Can not modify day off in the past");
        }

        const existedData = await DayOffModel.findById(DayOffId);
        
        if (new Date(existedData.days[0]) < new Date(Date.now()) || new Date(existedData.days[1]) < new Date(Date.now()) && existedData.days[1]) {
            throw new Error("Can not modify day off in the past");
        }
        
        const updatedData = await DayOffModel.build({
            id: null,
            days: updateData.days,
            status: DayOffEnum.DayOffStatus.PENDING,
            description: updateData.description,
            tempFor: DayOffId,
            createdAt: new Date(Date.now()).toISOString(),
            updatedAt: new Date(Date.now()).toISOString(),
        });
        
        await updatedData.save();

        await kafkaConnector.updateFixedDayOffPublisher.publish(updatedData);

        return updatedData;
    } catch (error) {
        return error;
    }
};

export async function approveDayOff(payload: any) {
    try {
        const { dayOffId, approvalStatus } = payload;

        if (approvalStatus === "approved") {
            const aprrovedDayOff = await DayOffModel.findByIdAndUpdate(
                { _id: dayOffId },
                { 
                    status: DayOffEnum.DayOffStatus.APPROVED,
                    approvalDate: new Date(Date.now()).toISOString(),
                },
                { new: true }
            )
            
            if (aprrovedDayOff.tempFor === null) {
                return aprrovedDayOff;
            }

            const aprrovedOriginalDayOff = await DayOffModel.findByIdAndUpdate(
                { _id: aprrovedDayOff.tempFor },
                {
                    days: aprrovedDayOff.days,
                    status: DayOffEnum.DayOffStatus.APPROVED,
                    description: aprrovedDayOff.description,
                    updatedAt: new Date(aprrovedDayOff.updatedAt).toISOString(),
                    approvalDate: new Date(Date.now()).toISOString(),
                },
                { new: true }
            )

            return aprrovedOriginalDayOff;
        } else if (approvalStatus === "rejected") {
            const aprrovedDayOff = await DayOffModel.findByIdAndUpdate(
                { _id: dayOffId },
                {
                    status: DayOffEnum.DayOffStatus.REJECTED,
                    approvalDate: new Date(Date.now()).toISOString(),
                },
                { new: true }
            )

            return aprrovedDayOff;
        }
    } catch (error) {
        return error;
    }
};

export async function deleteDayOff(payload: any) {
    try {
        const { dayOffId } = payload;

        const deletedData = DayOffModel.findOneAndDelete({ _id: dayOffId });

        return deletedData;
    } catch (error) {
        return error;
    }
};