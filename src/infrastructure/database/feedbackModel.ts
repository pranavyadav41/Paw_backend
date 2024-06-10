import mongoose, { Model, Schema, Document } from "mongoose";
import feedback from "../../domain/feedback";

const feedbackSchema: Schema = new Schema<feedback | Document>({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  serviceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Service",
    required: true,
  },
  rating: {
    type: Number,
    required: true,
  },
  feedback: {
    type: String,
    required: true,
  },
  images: {
    type: [String],
    default: [],
  },
});

const FeedbackModel: Model<feedback & Document> = mongoose.model<
  feedback & Document
>("Feedback", feedbackSchema);

export default FeedbackModel;
