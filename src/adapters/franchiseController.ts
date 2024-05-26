import { Request, Response, NextFunction } from "express";
import FranchiseReqUsecase from "../useCase/Franchise/franchiseReqUsecase";
import FranchiseUseCase from "../useCase/Franchise/franchiseUsecase";
import GenerateOtp from "../infrastructure/services/generateOtp";
import sendOtp from "../infrastructure/services/sendEmail";
import SessionData from "../domain/sessionData";

class FranchiseController {
  private franchiseReqUsecase: FranchiseReqUsecase;
  private franchiseUsecase: FranchiseUseCase;
  private generateOtp: GenerateOtp;
  private generateEmail: sendOtp;
  constructor(
    franchiseReqUsecase: FranchiseReqUsecase,
    franchiseUsecase: FranchiseUseCase,
    generateOtp: GenerateOtp,
    generateEmail: sendOtp
  ) {
    this.franchiseReqUsecase = franchiseReqUsecase;
    this.franchiseUsecase = franchiseUsecase;
    this.generateOtp = generateOtp;
    this.generateEmail = generateEmail;
  }

  async verifyRequest(req: Request, res: Response, next: NextFunction) {
    try {
      const verify = await this.franchiseReqUsecase.verify(req.body.email);

      if (verify.data.status == true) {
        const save = await this.franchiseReqUsecase.saveReq(req.body);
        if (save) {
          return res.status(save.status).json(save.data);
        }
      }

      return res.status(verify.status).json(verify.data);
    } catch (error) {
      next(error);
    }
  }
  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;

      const login = await this.franchiseUsecase.login(email, password);
      return res.status(login.status).json(login.data);
    } catch (error) {
      next(error);
    }
  }
  async forgotPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const { email } = req.body;

      const user = await this.franchiseUsecase.forgotPassword(email);

      if (user.status == 200) {
        const otp = this.generateOtp.createOtp();
        (req.session as SessionData).otp = otp;
        (req.session as SessionData).email = req.body.email;
        //for otp expire check
        (req.session as SessionData).otpGeneratedAt = new Date().getTime();
        this.generateEmail.sendMail(email, otp);

        return res.status(user.status).json(user.data);
      } else {
        return res.status(user.status).json(user.data);
      }
    } catch (error) {
      next(error);
    }
  }
  async verifyOtp(req: Request, res: Response, next: NextFunction) {
    try {
      const now = new Date().getTime();
      const otpGeneratedAt = (req.session as any).otpGeneratedAt;
      const otpExpiration = 1.5 * 60 * 1000;

      if (now - otpGeneratedAt > otpExpiration) {
        // OTP has expired
        return res
          .status(400)
          .json({ status: false, message: "OTP has expired" });
      }

      if (req.body.userId !== "" && req.body.otp === (req.session as any).otp) {
        // OTP is valid for user ID
        (req.session as SessionData).otp = null;
        (req.session as SessionData).otpGeneratedAt = null;
        return res.json({
          message: "Verified successfully",
          userId: req.body.userId,
        });
      } else {
        // Invalid OTP
        return res.status(400).json({ status: false, message: "Invalid OTP" });
      }
    } catch (error) {
      next(error);
    }
  }
  async resetPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const { password, userId } = req.body;

      const changePassword = await this.franchiseUsecase.resetPassword(
        password,
        userId
      );

      return res.status(changePassword.status).json(changePassword.message);
    } catch (error) {
      next(error);
    }
  }
  async resendOtp(req: Request, res: Response, next: NextFunction) {
    try {
      let newOtp: number = this.generateOtp.createOtp();
      const email = (req.session as any).email;
      //for otp expire check
      (req.session as SessionData).otpGeneratedAt = new Date().getTime();
      (req.session as SessionData).otp = newOtp;
      this.generateEmail.sendMail(email, newOtp);
      return res.json({ message: "Otp has been sent to your email" });
    } catch (error) {
      next(error);
    }
  }
  async getProfile(req: Request, res: Response, next: NextFunction) {
    try {
      let { Id } = req.body;
      let profile = await this.franchiseUsecase.getProfile(Id);

      if (profile) {
        res.status(profile.status).json(profile.data);
      }
    } catch (error) {
      next(error);
    }
  }
  async updateProfile(req: Request, res: Response, next: NextFunction) {
    try {
      let { Id, data } = req.body;

      let update = await this.franchiseUsecase.updateProfile(Id, data);

      if (update) {
        res.status(update.status).json(update.message);
      }
    } catch (error) {
      next(error);
    }
  }
  async updateAddress(req: Request, res: Response, next: NextFunction) {
    try {
      let { Id, address } = req.body;

      const update = await this.franchiseUsecase.updateAddress(Id, address);

      if (update) {
        res.status(update.status).json(update.message);
      }
    } catch (error) {
      next(error);
    }
  }
  async updatePassword(req: Request, res: Response, next: NextFunction) {
    try {
      const { Id, password } = req.body;

      const changePassword = await this.franchiseUsecase.updatePassword(
        Id,
        password
      );

      return res.status(changePassword.status).json(changePassword.message);
    } catch (error) {
      next(error);
    }
  }
}

export default FranchiseController;
