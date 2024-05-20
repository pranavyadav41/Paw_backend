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
}

export default franchiseUseCase;
