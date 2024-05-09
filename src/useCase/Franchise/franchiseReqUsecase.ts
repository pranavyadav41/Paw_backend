import franchiseReq from "../../domain/franchiseReq";
import FranchiseReqRepo from "../interface/Franchise/franchiseReqRepo";
import Encrypt from "../interface/encryptPassword";

class FranchiseReqUsecase {
  private franchiseReqRepository: FranchiseReqRepo;
  private encryptPassword: Encrypt;

  constructor(
    franchiseReqRepository: FranchiseReqRepo,
    encryptPassword: Encrypt
  ) {
    this.franchiseReqRepository = franchiseReqRepository;
    this.encryptPassword = encryptPassword;
  }

  async verify(email: string) {
    const reqExist = await this.franchiseReqRepository.findByEmail(email);
    if (reqExist) {
      return {
        status: 400,
        data: {
          status: false,
          message:
            "Your franchise request with this email address has already been received and is currently under review. Please be patient while our team processes your application. You will receive a confirmation email once your request has been approved or if any further action is required from your end.",
        },
      };
    }
    return {
      status: 200,
      data: {
        status: true,
      },
    };
  }
  async saveReq(reqData: franchiseReq) {
    const hashedPassword = await this.encryptPassword.encryptPassword(
      reqData.password
    );
    const newReq = { ...reqData, password: hashedPassword };
    const reqSave = await this.franchiseReqRepository.save(newReq);

    if (reqSave) {
      return {
        status: 200,
        data: {
          message:
            "Thank you for your interest in our franchise program. Your request has been received and will be reviewed by our team. Once your application is processed and approved by our administrators, you will receive a confirmation email with further instructions. Please allow 5-7 business days for the review process. We appreciate your patience and look forward to potentially welcoming you as a new franchisee.",
        },
      };
    }
  }
}

export default FranchiseReqUsecase;
