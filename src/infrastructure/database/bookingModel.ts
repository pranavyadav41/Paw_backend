import mongoose, { Model, Schema, Document } from "mongoose";
import Booking from "../../domain/booking";

const bookingSchema: Schema<Booking & Document> = new Schema({
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
});

// Create the Booking model
const BookingModel: Model<Booking & Document> = mongoose.model<
  Booking & Document
>("Booking", bookingSchema);

// Export the Booking model
export default BookingModel;
