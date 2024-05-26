import Encrypt from "../interface/encryptPassword";
import JWT from "../interface/jwt";
import FranchiseRepo from "../interface/Franchise/franchiseRepo";
import FranchiseModel from "../../infrastructure/database/franchiseModel";

class franchiseUseCase {
  franchiseRepo: FranchiseRepo;
  encryptPassword: Encrypt;
  jwtToken: JWT;

  constructor(
    franchiseRepo: FranchiseRepo,
    encryptPassword: Encrypt,
    jwtToken: JWT
  ) {
    this.franchiseRepo = franchiseRepo;
    this.encryptPassword = encryptPassword;
    this.jwtToken = jwtToken;
  }

  async login(email: string, password: string) {
    const franchise = await this.franchiseRepo.findByEmail(email);

    if (franchise) {
      let data = {
        _id: franchise._id,
        name: franchise.name,
        email: franchise.email,
        phone: franchise.phone,
        city: franchise.city,
        district: franchise.district,
        state: franchise.state,
        pincode: franchise.pincode,
      };

      if (franchise.isBlocked) {
        return {
          status: 400,
          data: {
            status: false,
            message: "You have been blocked by admin!",
            token: "",
          },
        };
      }

      const passwordMatch = await this.encryptPassword.compare(
        password,
        franchise.password
      );

      if (passwordMatch) {
        let token = this.jwtToken.generateToken(franchise._id, "franchise");

        return {
          status: 200,
          data: {
            status: true,
            message: franchise,
            token,
          },
        };
      } else {
        return {
          status: 400,
          data: {
            status: false,
            message: "Invalid email or password",
            token: "",
          },
        };
      }
    } else {
      return {
        status: 400,
        data: {
          status: false,
          message: "Invalid email or password",
          token: "",
        },
      };
    }
  }
  async forgotPassword(email: string) {
    let franchiseExist = await this.franchiseRepo.findByEmail(email);

    if (franchiseExist) {
      return {
        status: 200,
        data: {
          status: true,
          message: "Verification otp sent to your Email",
          userId: franchiseExist._id,
        },
      };
    } else {
      return {
        status: 400,
        data: {
          status: false,
          message: "Email not registered!",
        },
      };
    }
  }
  async resetPassword(password: string, userId: string) {
    const hashedPassword = await this.encryptPassword.encryptPassword(password);
    const changePassword = await this.franchiseRepo.changePassword(
      userId,
      hashedPassword
    );
    if (changePassword) {
      return {
        status: 200,
        message: "Password changed successfully",
      };
    } else {
      return {
        status: 400,
        message: "Failed please try again !",
      };
    }
  }
  async getProfile(Id: string) {
    const franchise = await this.franchiseRepo.findById(Id);

    if (franchise) {
      const data = {
        _id: franchise._id,
        name: franchise.name,
        email: franchise.email,
        phone: franchise.phone,
        city: franchise.city,
        district: franchise.district,
        state: franchise.state,
        pincode: franchise.pincode,
      };
      return {
        status: 200,
        data: data,
      };
    }
  }
  async updateProfile(
    Id: string,
    data: { name: string; phone: string; email: string }
  ) {
    const update = await this.franchiseRepo.updateProfile(Id, data);

    if (update) {
      return {
        status: 200,
        message: "Profile updated successfully",
      };
    } else {
      return {
        status: 400,
        message: "Failed to update,please try again!",
      };
    }
  }
  async updateAddress(
    Id: string,
    address: { city: string; district: string; state: string; pincode: string }
  ) {
    const update = await this.franchiseRepo.updateAddress(Id, address);

    if (update) {
      return {
        status: 200,
        message: "Address updated successfully",
      };
    } else {
      return {
        status: 400,
        message: "Failed to update,please try again!",
      };
    }
  }
  async updatePassword(Id: string, password: string) {
    const hashedPassword = await this.encryptPassword.encryptPassword(password);

    const changePassword = await this.franchiseRepo.changePassword(
      Id,
      hashedPassword
    );
    if (changePassword) {
      return {
        status: 200,
        message: "Password changed successfully",
      };
    } else {
      return {
        status: 400,
        message: "Failed please try again !",
      };
    }
  }
}

export default franchiseUseCase;
