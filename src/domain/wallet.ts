import mongoose, { Schema, Document } from "mongoose";
// Define the Booking interface
interface Wallet {
  userId: mongoose.Schema.Types.ObjectId;
  balance: number;
  history: { date: Date; amount: number }[];
}

export default Wallet;
