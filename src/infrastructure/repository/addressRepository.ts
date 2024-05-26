import mongoose from "mongoose";
import AddressModel from "../database/addressModel";
import Address from "../../domain/address";
import AddressRepo from "../../useCase/interface/addressRepo";

interface address {
  name: string;
  city: string;
  district: string;
  state: string;
  pincode: string;
}

class AddressRepository implements AddressRepo {
  async save(address: Address, userId: string): Promise<boolean> {
    const result = await AddressModel.findOneAndUpdate(
      { userId },
      { $push: { addresses: address } },
      { new: true, upsert: true }
    );

    return !!result;
  }
  async getAddress(Id: string): Promise<address[]> {
    const userAddress = await AddressModel.findOne({ userId: Id }).exec();
    if (userAddress) {
      return userAddress.addresses;
    } else {
      return [];
    }
  }
}

export default AddressRepository;
