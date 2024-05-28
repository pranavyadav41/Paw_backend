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
  async deleteAddress(Id: string, addressId: string): Promise<boolean> {
    const result = await AddressModel.updateOne(
      { userId: Id },
      { $pull: { addresses: { _id: addressId } } }
    );
    return result.modifiedCount > 0;
  }
  async editAddress(
    userId: string,
    addressId: string,
    address: {
      name: string;
      houseName: string;
      street: string;
      city: string;
      district: string;
      state: string;
      pincode: string;
    }
  ): Promise<boolean> {

    console.log(address,"address")
    const result = await AddressModel.updateOne(
      { userId: userId, "addresses._id": addressId },
      {
        $set: {
          "addresses.$.name": address.name,
          "addresses.$.houseName": address.houseName,
          "addresses.$.street": address.street,
          "addresses.$.city": address.city,
          "addresses.$.district": address.district,
          "addresses.$.state": address.state,
          "addresses.$.pincode": address.pincode,
        },
      }
    );
    return result.modifiedCount > 0;
  }
  
  
}

export default AddressRepository;
