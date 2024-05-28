import mongoose, { Model, Schema, Document } from "mongoose";
import UserAddress from "../../domain/address";

const addressSchema: Schema = new Schema({
  name: { type: String, required: true },
  houseName:{type:String,required:true},
  street:{type:String,required:true},
  city: { type: String, required: true },
  district: { type: String, required: true },
  state: { type: String, required: true },
  pincode: { type: String, required: true },
});

const userAddressSchema: Schema = new Schema<UserAddress>({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  addresses: {
    type: [addressSchema],
    required: true,
  },
});

const UserAddressModel: Model<UserAddress & Document> = mongoose.model<UserAddress & Document>(
  "UserAddress",
  userAddressSchema
);

export default UserAddressModel;
