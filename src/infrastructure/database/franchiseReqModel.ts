import mongoose, { Model, Schema, Document } from "mongoose";
import frachiseReq from "../../domain/franchiseReq";

const franchiseReqSchema: Schema = new Schema<any | Document>({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  area: {
    type: String,
    required: false,
  },
  district: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  pincode: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  location: {
    type: {
      type: String,
      default: "Point",
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  },
});

const FranchiseReqModel: Model<any & Document> = mongoose.model<any& Document>(
  "FranchiseRequests",
  franchiseReqSchema
);

export default FranchiseReqModel;
