import { Schema, model, Types, Model, Document } from "mongoose";
import { mongoConnector } from "../mongo/mongoConnector";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";
import { TradingSessionEnum } from "@mxs/share";

export interface ITradingSessionAttr {
  id: string;
  startTime: string;
  endTime: string;
  commodity: string;
  item: string;
  tradingPeriods: {
      preOpen: {
        startTime: string;
        endTime: string;
      },
      open: {
        startTime: string;
        endTime: string;
      },
      pause: {
        startTime: string;
        endTime: string;
      },
      close: {
        startTime: string;
        endTime: string;
      },
      maintenancePeriod: {
        startTime: string;
        endTime: string;
      },
  };
  isGeneralSession: boolean;
  isApproved: TradingSessionEnum.TradingSessionStatus;
  tempFor: string;
  createdBy?: string;
  createdAt?: string;
  updatedAt?: string;
  lastModifiedBy?: string;
  approvalDate?: string;
}

export interface ITradingSessionDoc extends Document {
  startTime: string;
  endTime: string;
  commodity: string;
  item: string;
  tradingPeriods: [
    preOpen: {
      startTime: string;
      endTime: string;
    },
    open: {
      startTime: string;
      endTime: string;
    },
    pause: {
      startTime: string;
      endTime: string;
    },
    close: {
      startTime: string;
      endTime: string;
    },
    maintenancePeriod: {
      startTime: string;
      endTime: string;
    },
  ];
  isGeneralSession: boolean;
  isApproved: TradingSessionEnum.TradingSessionStatus;
  tempFor: string;
  createdBy?: string;
  createdAt?: string;
  updatedAt?: string;
  lastModifiedBy?: string;
  approvalDate?: string;
}

const auditSchema = new Schema<ITradingSessionDoc>({
  startTime: {
    type: String,
    required: true,
  },
  endTime: {
    type: String,
    required: true,
  },
  commodity: {
    type: String,
    required: false,
    ref: "Commodity",
  },
  item: {
    type: String,
    required: false,
    ref: "Item"
  },
  tradingPeriods: {
    preOpen: {
      startTime: {
        type: String,
        required: false,
      },
      endTime: {
        type: String,
        required: false,
      }
    },
    open: {
      startTime: {
        type: String,
        required: false,
      },
      endTime: {
        type: String,
        required: false,
      }
    },
    pause: {
      startTime: {
        type: String,
        required: false,
      },
      endTime: {
        type: String,
        required: false,
      }
    },
    close: {
      startTime: {
        type: String,
        required: false,
      },
      endTime: {
        type: String,
        required: false,
      }
    },
    maintenancePeriod: {
      startTime: {
        type: String,
        required: false,
      },
      endTime: {
        type: String,
        required: false,
      }
    },
  },
  isGeneralSession: {
    type: Boolean,
    required: true,
  },
  isApproved: {
    type: String,
    required: true,
  },
  tempFor: {
    type: String,
    required: false,
  },
  createdBy: {
    type: String,
    required: false,
  },
  createdAt: {
    type: String,
    required: false,
  },
  updatedAt: {
    type: String,
    required: false,
  },
  lastModifiedBy: {
    type: String,
    required: false,
  },
  approvalDate: {
    type: String,
    required: false,
  },
});

auditSchema.set("toJSON", {
  transform: (doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
  }
});

auditSchema.set("versionKey", "version");
auditSchema.plugin(updateIfCurrentPlugin);

// Define the static method for building the model from attributes
auditSchema.statics.build = (attrs: ITradingSessionDoc) => {
  return new TradingSessionModel({
    _id: attrs.id,
    startTime: attrs.startTime,
    endTime: attrs.endTime,
    commodity: attrs.commodity,
    item: attrs.item,
    tradingPeriods: {
        preOpen: {
          startTime: attrs.tradingPeriods["preOpen"].startTime,
          endTime: attrs.tradingPeriods["preOpen"].endTime,
        },
        open: {
          startTime: attrs.tradingPeriods["open"].startTime,
          endTime: attrs.tradingPeriods["open"].endTime,
        },
        pause: {
          startTime: attrs.tradingPeriods["pause"].startTime,
          endTime: attrs.tradingPeriods["pause"].endTime,
        },
        close: {
          startTime: attrs.tradingPeriods["close"].startTime,
          endTime: attrs.tradingPeriods["close"].endTime,
        },
        maintenancePeriod: {
          startTime: attrs.tradingPeriods["maintenancePeriod"].startTime,
          endTime: attrs.tradingPeriods["maintenancePeriod"].endTime,
        },
    },
    isGeneralSession: attrs.isGeneralSession,
    isApproved: attrs.isApproved,
    tempFor: attrs.tempFor,
    createdBy: attrs.createdBy,
    createdAt: attrs.createdAt,
    updatedAt: attrs.updatedAt,
    lastModifiedBy: attrs.lastModifiedBy,
    approvalDate: attrs.approvalDate,
  })
};

interface ITradingSessionModel extends Model<ITradingSessionDoc> {
  build(attrs: ITradingSessionAttr): ITradingSessionDoc;
}
const TradingSessionModel = mongoConnector.auditDB.model<ITradingSessionDoc, ITradingSessionModel>("mxs_tradingSession", auditSchema);

export default TradingSessionModel;
