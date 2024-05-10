import UserModel from "../database/userModel";
import FranchiseReqModel from "../database/franchiseReqModel";
import FranchiseModel from "../database/franchiseModel";
import { ObjectId } from "mongodb";
import * as mongoose from "mongoose";
import adminRepo from "../../useCase/interface/adminRepo";
import franchise from "../../domain/franchise";
import approve from "../../domain/approval";

class adminRepository implements adminRepo {
  async getUsers(): Promise<{}[] | null> {
    let users = await UserModel.find({ isAdmin: false });
    return users;
  }
  async findByEmail(email: string): Promise<franchise | null> {
    let result = await FranchiseModel.findOne({ email: email });

    return result;
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
  async approveFranchise(reqId: string): Promise<approve | boolean> {
    let data = await FranchiseReqModel.findOne({ _id: reqId });

    if (data) {
      let exist = await FranchiseModel.findOne({ email: data.email });
      if (exist) {
        return false;
      }

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
    }
    return false;
  }
  async rejectFranchise(reqId: string): Promise<{status:boolean;email:string}> {
    let data = await FranchiseReqModel.findOne({ _id: reqId });

    if(data){

    let reject = await FranchiseReqModel.deleteOne({ _id: reqId });

    return {
      status:true,
      email:data.email
    }
  }
  return {
    status:false,
    email:" "
  }
}
  async getFranchises(): Promise<{}[] | null> {
    let franchises = await FranchiseModel.find();

    return franchises;
  }
  async blockFranchise(franchiseId: string): Promise<boolean> {
    let block = await FranchiseModel.updateOne(
      { _id: franchiseId },
      { $set: { isBlocked: true } }
    );

    return block.modifiedCount > 0;
  }
  async unBlockFranchise(franchiseId: string): Promise<boolean> {
    let unBlock = await FranchiseModel.updateOne(
      { _id: franchiseId },
      { $set: { isBlocked: false } }
    );
    return unBlock.modifiedCount > 0;
  }
}
export default adminRepository;
