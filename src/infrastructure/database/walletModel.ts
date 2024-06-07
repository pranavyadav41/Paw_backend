import mongoose, { Model, Schema, Document } from "mongoose";
import Wallet from "../../domain/wallet";

const walletSchema: Schema<Wallet & Document> = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  balance: {
    type: Number,
    default: 0,
  },
  history: [
    {
      date: {
        type: Date,
        default: Date.now,
      },
      amount: Number,
    },
  ],
});

const WalletModel: Model<Wallet & Document> = mongoose.model<Wallet & Document>(
  "Wallet",
  walletSchema
);

export default WalletModel;
