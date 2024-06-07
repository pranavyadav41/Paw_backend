import mongoose, { Model, Schema, Document } from "mongoose";
import Booking from "../../domain/booking";

const bookingSchema: Schema<Booking & Document> = new Schema({
  name: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  franchiseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Franchise",
    required: true,
  },
  bookingDate: { type: Date, required: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  address: {
    type: Schema.Types.Mixed,
    required: true,
  },
  serviceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Service",
    required: true,
  },
  sizeOfPet: {
    type: String,
    required: true,
  },
  bookingStatus: {
    type: String,
    default: "Pending",
  },
  totalAmount: {
    type: String,
    required: true,
  },
});

const BookingModel: Model<Booking & Document> = mongoose.model<
  Booking & Document
>("Booking", bookingSchema);

export default BookingModel;
