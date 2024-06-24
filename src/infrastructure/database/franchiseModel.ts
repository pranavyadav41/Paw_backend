import mongoose, { Model, Schema, Document } from "mongoose";
import Franchise from "../../domain/franchise"; // Assuming Franchise interface or type is defined here

const franchiseSchema: Schema<any & Document> = new Schema({
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
      enum: ["Point"],
      required: true ,
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  },
  isBlocked: {
    type: Boolean,
    default: false,
  },
  openingTime: {
    type: String,
    default: "09:00",
    required: true,
  },
  closingTime: {
    type: String,
    default: "17:00",
    required: true,
  },
  services: {
    type: [
      {
        serviceName: {
          type: String,
          required: true,
        },
        serviceId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Service", // Assuming the Service model is defined elsewhere
          required: true,
        },
        timeToComplete: {
          hours: {
            type: Number,
            required: true,
          },
          minutes: {
            type: Number,
            required: true,
          },
        },
      },
    ],
    default: [],
  },
});

const FranchiseModel: Model<Franchise & Document> = mongoose.model<Franchise & Document>(
  "Franchise",
  franchiseSchema
);

franchiseSchema.index({ location: '2dsphere' });

export default FranchiseModel;
