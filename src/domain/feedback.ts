import { Schema } from "mongoose";

interface feedback {
  userId: Schema.Types.ObjectId;
  name: string;
  serviceId: Schema.Types.ObjectId;
  rating: number;
  feedback: string;
  images: string[];
}

export default feedback;
