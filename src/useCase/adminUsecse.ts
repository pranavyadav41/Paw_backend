import adminRepo from "../infrastructure/repository/adminRepository";
import FranchiseRepo from "./interface/Franchise/franchiseRepo";
import CouponRepo from "../infrastructure/repository/couponRepository";
import Service from "../domain/service";
import updatedService from "../domain/updatedService";
import Coupon from "../domain/coupon";

class adminUseCase {
  private AdminRepo: adminRepo;
  private franchiseRepo: FranchiseRepo;
  private couponRepo: CouponRepo;

  constructor(
    AdminRepo: adminRepo,
    franchiseRepo: FranchiseRepo,
    couponRepo: CouponRepo
  ) {
    this.AdminRepo = AdminRepo;
    this.franchiseRepo = franchiseRepo;
    this.couponRepo = couponRepo;
  }

  async getUsers() {
    const data = await this.AdminRepo.getUsers();

    if (data) {
      return {
        status: 200,
        data: data,
      };
    } else {
      return {
        status: 400,
        message: "failed to fetch data!please try again",
      };
    }
  }
  async blockUser(userId: string) {
    const result = await this.AdminRepo.blockUser(userId);

    if (result) {
      return {
        status: 200,
        data: {
          status: true,
          message: "blocked user successfully",
        },
      };
    } else {
      return {
        status: 400,
        data: {
          status: false,
          message: "failed to block user! please try later",
        },
      };
    }
  }
  async unBlockUser(userId: string) {
    const result = await this.AdminRepo.unBlockUser(userId);

    if (result) {
      return {
        status: 200,
        data: {
          status: true,
          message: "Unblocked user successfully",
        },
      };
    } else {
      return {
        status: 400,
        data: {
          status: false,
          message: "failed to block user! please try later",
        },
      };
    }
  }
  async getRequests() {
    const requests = await this.AdminRepo.getFranchiseReqests();
    if (requests) {
      return {
        status: 200,
        data: requests,
      };
    } else {
      return {
        status: 400,
        message: "failed to fetch data!please try again",
      };
    }
  }
  async approveFranchise(reqId: string) {
    const reqData = await this.AdminRepo.approveFranchise(reqId);

    if (reqData == false) {
      return {
        status: 401,
        data: {
          status: false,
          message: "Account already exist",
        },
      };
    } else if (reqData) {
      let details = await this.franchiseRepo.save(reqData);

      if (details) {
        return {
          status: 200,
          data: {
            status: true,
            message: "Approved successfully",
            details,
          },
        };
      }
    } else {
      return {
        status: 400,
        data: {
          status: false,
          message: "failed Please try again!",
        },
      };
    }
  }
  async rejectFranchise(reqId: string) {
    const reqData = await this.AdminRepo.rejectFranchise(reqId);

    if (reqData.status == true) {
      return {
        status: 200,
        data: {
          status: true,
          message: "Rejected successfully",
          email: reqData.email,
        },
      };
    } else {
      return {
        status: 400,
        data: {
          staus: false,
          message: "failed Please try again!",
        },
      };
    }
  }
  async getFranchises() {
    const data = await this.AdminRepo.getFranchises();

    if (data) {
      return {
        status: 200,
        data: data,
      };
    } else {
      return {
        status: 400,
        message: "failed to fetch the data!please try again",
      };
    }
  }
  async blockFranchise(franchiseId: string) {
    const block = await this.AdminRepo.blockFranchise(franchiseId);

    if (block) {
      return {
        status: 200,
        data: {
          status: true,
          message: "Blocked franchise successfully",
        },
      };
    } else {
      return {
        status: 400,
        data: {
          status: true,
          message: "Failed to block franchise please try again",
        },
      };
    }
  }
  async unBlockFranchise(franchiseId: string) {
    const unBlock = await this.AdminRepo.unBlockFranchise(franchiseId);

    if (unBlock) {
      return {
        status: 200,
        data: {
          status: true,
          message: "Unblocked franchise successfully",
        },
      };
    } else {
      return {
        status: 400,
        data: {
          status: true,
          message: "Failed to unblock franchise please try again",
        },
      };
    }
  }
  async addService(service: Service) {
    const match = await this.AdminRepo.findService(service.category);

    if (match) {
      return {
        status: 400,
        data: {
          status: false,
          message: "Service already exist",
        },
      };
    }

    const save = await this.AdminRepo.addService(service);

    if (save) {
      return {
        status: 200,
        data: {
          status: true,
          message: "Service added successfully",
        },
      };
    } else {
      return {
        status: 400,
        data: {
          status: false,
          message: "Failed please try again",
        },
      };
    }
  }
  async editService(service: updatedService) {
    const save = await this.AdminRepo.editService(service);

    if (save) {
      return {
        status: 200,
        data: {
          status: true,
          message: "Data edited successfully",
        },
      };
    } else {
      return {
        status: 400,
        data: {
          status: true,
          message: "Failed to edit",
        },
      };
    }
  }
  async deleteService(serviceId: string) {
    const deleteService = await this.AdminRepo.deleteService(serviceId);

    if (deleteService) {
      return {
        status: 200,
        data: {
          status: true,
          message: "Service deleted successfully",
        },
      };
    } else {
      return {
        status: 400,
        data: {
          status: false,
          message: "Failed to delete",
        },
      };
    }
  }
  async getServices() {
    const services = await this.AdminRepo.getServices();

    if (services) {
      return {
        status: 200,
        data: services,
      };
    } else {
      return {
        status: 400,
        message: "Failed to get data",
      };
    }
  }
  async addCoupon(coupon: Coupon) {
    const save = await this.couponRepo.save(coupon);

    if (save) {
      return {
        status: 200,
        message: "Coupon added successfully",
      };
    } else {
      return {
        status: 400,
        message: "Failed!Please try again",
      };
    }
  }
  async getCoupons(){
    const coupons = await this.couponRepo.getCoupons()

    if(coupons){
      return {
        status:200,
        data:coupons
      }
    }else{
      return {
        status:400,
        data:{
          message:"failed to get data"
        }
      }
    }
  }
  async editCoupon(Id:string,coupon:Coupon){
    const edit = await this.couponRepo.editCoupon(Id,coupon)

    if(edit){
      return {
        status:200,
        message:"Coupon updated successfully"
      }
    }else{
      return {
        status:400,
        message:"Failed!Please try again"
      }
    }
  }
  async removeCoupon(Id:string){
    const deleted = await this.couponRepo.removeCoupon(Id)

    if(deleted){
      return {
        status:200,
        message:"Coupon deleted successfully"
      }
    }else{
      return {
        status:400,
        message:"Failed!Please try again"
      }
    }
  }
}
export default adminUseCase;
