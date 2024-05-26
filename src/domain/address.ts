import mongoose from "mongoose";

interface Address {
  name: string;
  city: string;
  district: string;
  state: string;
  pincode: string;
}

interface UserAddress {
  userId: mongoose.Types.ObjectId;
  addresses: Address[];
}

export default UserAddress;
