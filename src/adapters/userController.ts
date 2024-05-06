import { Request, Response, response } from "express";
import UserUseCase from "../useCase/userUsecase";
import GenerateOtp from "../infrastructure/services/generateOtp";
import sendOtp from "../infrastructure/services/sendEmail";

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

  async signUp(req: Request, res: Response) {
    try {
      const verifyUser = await this.userUseCase.signup(req.body.email);

      if (verifyUser.data.status == true && req.body.isGoogle) {
        const user = await this.userUseCase.verifyOtpUser(req.body);
        res.status(user.status).json(user);
      }

      if (verifyUser.data.status == true) {
        (req.session as any).userData = req.body;
        const otp = this.generateOtp.createOtp();
        (req.session as any).otp = otp;
        console.log(otp);
        this.generateEmail.sendMail(req.body.email, otp);

        res.status(verifyUser.status).json(verifyUser.data);
      } else {
        res.status(verifyUser.status).json(verifyUser.data);
      }
    } catch (error) {
      const err: Error = error as Error;
      res.status(400).json({
        message: err.message,
      });
    }
  }
  async verifyOtp(req: Request, res: Response) {
    try {
      if (req.body.userId !== "" && req.body.otp == (req.session as any).otp) {
        (req.session as any).otp = null;
        res.json({ message: "Verified successfully", userId: req.body.userId });
      } else if (req.body.otp == (req.session as any).otp) {
        const user = await this.userUseCase.verifyOtpUser(
          (req.session as any).userData
        );
        (req.session as any).userData = null;
        (req.session as any).otp = null;
        res.status(user.status).json(user);
      } else {
        res.status(400).json({ status: false, message: "Invalid otp" });
      }
    } catch (error) {
      const err: Error = error as Error;
      res.status(400).json({
        message: err.message,
      });
    }
  }
  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      const user = await this.userUseCase.login(email, password);

      res.status(user.status).json(user.data);
    } catch (error) {
      const err: Error = error as Error;
      res.status(400).json({
        message: err.message,
      });
    }
  }
  async forgotPassword(req: Request, res: Response) {
    try {
      const { email } = req.body;

      const user = await this.userUseCase.forgotPassword(email);

      if (user.status == 200) {
        const otp = this.generateOtp.createOtp();
        (req.session as any).otp = otp;
        this.generateEmail.sendMail(email, otp);

        res.status(user.status).json(user.data);
      } else {
        res.status(user.status).json(user.data);
      }
    } catch (error) {
      const err: Error = error as Error;
      res.status(400).json({
        message: err.message,
      });
    }
  }
  async resetPassword(req: Request, res: Response) {
    try {
      const { password, userId } = req.body;

      const changePassword = await this.userUseCase.resetPassword(
        password,
        userId
      );

      res.status(changePassword.status).json(changePassword.message);
    } catch (error) {
      const err: Error = error as Error;
      res.status(400).json({
        message: err.message,
      });
    }
  }
}

export default userController;
