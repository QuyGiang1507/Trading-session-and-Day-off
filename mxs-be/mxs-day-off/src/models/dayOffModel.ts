import { Schema, model, Types, Model, Document } from "mongoose";
import { mongoConnector } from "../mongo/mongoConnector";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";
import { DayOffEnum } from "@mxs/share";

export interface IDayOffAttr {
  id: string;
  days: string[];
  status: DayOffEnum.DayOffStatus;
  description: string;
  tempFor: string;
  createdBy?: string;
  createdAt?: string;
  updatedAt?: string;
  lastModifiedBy?: string;
  approvalDate?: string;
}

export interface IDayOffDoc extends Document {
  days: string[];
  status: DayOffEnum.DayOffStatus;
  description: string;
  tempFor: string;
  createdBy?: string;
  createdAt?: string;
  updatedAt?: string;
  lastModifiedBy?: string;
  approvalDate?: string;
}

const auditSchema = new Schema<IDayOffDoc>({
  days: {
    type: [String],
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: false,
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
auditSchema.statics.build = (attrs: IDayOffDoc) => {
  return new DayOffModel({
    _id: attrs.id,
    days: attrs.days,
    status: attrs.status,
    description: attrs.description,
    tempFor: attrs.tempFor,
    createdBy: attrs.createdBy,
    createdAt: attrs.createdAt,
    updatedAt: attrs.updatedAt,
    lastModifiedBy: attrs.lastModifiedBy,
    approvalDate: attrs.approvalDate,
  })
};

interface IDayOffModel extends Model<IDayOffDoc> {
  build(attrs: IDayOffAttr): IDayOffDoc;
}
const DayOffModel = mongoConnector.auditDB.model<IDayOffDoc, IDayOffModel>("mxs_dayOff", auditSchema);

export default DayOffModel;