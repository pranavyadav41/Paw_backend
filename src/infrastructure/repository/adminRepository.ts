import UserModel from "../database/userModel";
import FranchiseReqModel from "../database/franchiseReqModel";
import FranchiseModel from "../database/franchiseModel";
import { ObjectId } from "mongodb";
import * as mongoose from "mongoose";
import adminRepo from "../../useCase/interface/adminRepo";
import franchise from "../../domain/franchise";

class adminRepository implements adminRepo {
  async getUsers(): Promise<{}[] | null> {
    let users = await UserModel.find({ isAdmin: false });
    return users;
  }
  async blockUser(userId: string): Promise<boolean> {
    let result = await UserModel.updateOne(
      { _id: userId },
      { $set: { isBlocked: true } }
    );
    return result.modifiedCount > 0;
  }
  async unBlockUser(userId: string): Promise<boolean> {
    let result = await UserModel.updateOne(
      { _id: userId },
      { $set: { isBlocked: false } }
    );
    return result.modifiedCount > 0;
  }
  async getFranchiseReqests(): Promise<{}[] | null> {
    let requests = await FranchiseReqModel.find();
    return requests;
  }
  async approveFranchise(reqId: string): Promise<franchise | null> {
    let data = await FranchiseReqModel.findOne({ _id: reqId });

    if (data) {
      let approve = await FranchiseReqModel.deleteOne({ _id: reqId });

      const detail = {
        name: data.name,
        email: data.email,
        password: data.password,
        phone: data.phone,
        district: data.district,
        city: data.city,
        pincode: data.pincode,
        state: data.state,
      };
      return detail;
    } else {
      return null;
    }
  }
  async rejectFranchise(reqId: string): Promise<boolean> {
    let reject = await FranchiseReqModel.deleteOne({ _id: reqId });

    if (reject) {
      return true;
    } else {
      return false;
    }
  }
  async getFranchises(): Promise<{}[] | null> {
    let franchises = await FranchiseModel.find();

    return franchises;
  }
}
export default adminRepository;
