import mongoose from "mongoose";

interface address {
  city: string;
  district: string;
  state: string;
  pincode: string;
  userId: mongoose.Schema.Types.ObjectId;
}

export default address;
