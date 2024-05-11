import UserModel from "../database/userModel";
import FranchiseReqModel from "../database/franchiseReqModel";
import FranchiseModel from "../database/franchiseModel";
import ServiceModel from "../database/serviceModal";
import adminRepo from "../../useCase/interface/adminRepo";
import franchise from "../../domain/franchise";
import approve from "../../domain/approval";
import Service from "../../domain/service";

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
  async rejectFranchise(
    reqId: string
  ): Promise<{ status: boolean; email: string }> {
    let data = await FranchiseReqModel.findOne({ _id: reqId });

    if (data) {
      let reject = await FranchiseReqModel.deleteOne({ _id: reqId });

      return {
        status: true,
        email: data.email,
      };
    }
    return {
      status: false,
      email: " ",
    };
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
  async findService(category: string): Promise<Service | null> {
    let match:any = await ServiceModel.findOne({ category: category });

    if(!match){
      return null
    }

    const service:Service={
      category:match.category,
      services:match.services,
      price:match.price

    }
    return service

  
  }
  async addService(service: Service): Promise<boolean> {
    let newService = new ServiceModel(service);
    let save = await newService.save();

    if (save) {
      return true;
    } else {
      return false;
    }
  }
  async editService(service: Service): Promise<boolean> {
    let editService = await ServiceModel.updateOne(
      { _id: service },
      {
        $set: { service },
      }
    );
    return editService.modifiedCount > 0;
  }
  async deleteService(serviceId: string): Promise<boolean> {
    let deleteService = await ServiceModel.deleteOne({ _id: serviceId });

    if (deleteService) {
      return true;
    } else {
      return false;
    }
  }
  async getServices():Promise<{}[] | null>{
    let services = await ServiceModel.find();

    return services
  }
}
export default adminRepository;
