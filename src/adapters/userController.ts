import { Request, Response, NextFunction } from "express";
import UserUseCase from "../useCase/userUsecase";
import GenerateOtp from "../infrastructure/services/generateOtp";
import sendOtp from "../infrastructure/services/sendEmail";
import SessionData from "../domain/sessionData";

class userController {
  private userUseCase: UserUseCase;
  private generateOtp: GenerateOtp;
  private generateEmail: sendOtp;

  constructor(
    userUseCase: UserUseCase,
    generateOtp: GenerateOtp,
    generateEmail: sendOtp
  ) {
    this.userUseCase = userUseCase;
    this.generateOtp = generateOtp;
    this.generateEmail = generateEmail;
  }

  async signUp(req: Request, res: Response, next: NextFunction) {
    try {
      const verifyUser = await this.userUseCase.signup(req.body.email);

      if (verifyUser.data.status == true && req.body.isGoogle) {
        const user = await this.userUseCase.verifyOtpUser(req.body);
        return res.status(user.status).json(user);
      }

      if (verifyUser.data.status == true) { 
        (req.session as SessionData).userData = req.body;
        const otp = this.generateOtp.createOtp();
        (req.session as SessionData).otp = otp;
        //for otp expire check
        (req.session as SessionData).otpGeneratedAt = new Date().getTime();
        console.log(otp);
        this.generateEmail.sendMail(req.body.email, otp);
        return res.status(verifyUser.status).json(verifyUser.data);
      } else {
        return res.status(verifyUser.status).json(verifyUser.data);
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
      } else if (req.body.otp === (req.session as SessionData).otp) {
        // OTP is valid, but no user ID provided
        const user = await this.userUseCase.verifyOtpUser(
          (req.session as any).userData
        );
        (req.session as any).userData = null;
        (req.session as SessionData).otp = null;
        (req.session as SessionData).otpGeneratedAt = null;
        return res.status(user.status).json(user);
      } else {
        // Invalid OTP
        return res.status(400).json({ status: false, message: "Invalid OTP" });
      }
    } catch (error) {
      next(error);
    }
  }
  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;

      const user = await this.userUseCase.login(email, password);

      return res.status(user.status).json(user.data);
    } catch (error) {
      next(error);
    }
  }
  async forgotPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const { email } = req.body;

      const user = await this.userUseCase.forgotPassword(email);

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
  async resetPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const { password, userId } = req.body;

      const changePassword = await this.userUseCase.resetPassword(
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
      const email = (req.session as SessionData).userData
        ? (req.session as any).userData.email
        : (req.session as any).email;
      //for otp expire check
      (req.session as SessionData).otpGeneratedAt = new Date().getTime();
      (req.session as SessionData).otp = newOtp;
      this.generateEmail.sendMail(email, newOtp);
      return res.json({ message: "Otp has been sent to your email" });
    } catch (error) {
      next(error);
    }
  }
  async getService(req: Request, res: Response, next: NextFunction) {
    try {
      let service = await this.userUseCase.getService(req.params.id);

      return res.status(service.status).json(service.data);
    } catch (error) {
      next(error);
    }
  }
  async updateProfile(req: Request, res: Response, next: NextFunction) {
    try {
      let { Id, data } = req.body;

      let profile = await this.userUseCase.editProfile(Id, data);

      if (profile.status == 200) {
        return res.status(profile.status).json(profile.data);
      }

      return res.status(profile.status).json(profile.message);
    } catch (error) {
      next(error);
    }
  }
  async getProfile(req: Request, res: Response, next: NextFunction) {
    try {
      let { Id } = req.body;

      let profile = await this.userUseCase.getProfile(Id);

      return res.status(profile.status).json(profile.data);
    } catch (error) {
      next(error);
    }
  }

  async updatePassword(req: Request, res: Response, next: NextFunction) {
    try {
      let { Id, password } = req.body;

      let update = await this.userUseCase.updatePassword(Id, password);

      if (update) {
        return res.status(update.status).json(update.message);
      }
    } catch (error) {
      next(error);
    }
  }
}

export default userController;
