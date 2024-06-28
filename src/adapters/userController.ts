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
        return res.status(200).json({
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

      console.log(user, "user")

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
  async getAllCoupons(req: Request, res: Response, next: NextFunction) {
    try {
      let coupons = await this.userUseCase.getAllCoupons();

      if (coupons.status == 400) {
        return res.status(coupons.status).json({ message: coupons.message });
      } else if (coupons.status == 200) {
        return res.status(coupons.status).json(coupons.data);
      }
    } catch (error) {
      next(error);
    }
  }
  async applyCoupon(req: Request, res: Response, next: NextFunction) {
    try {
      const { total, couponCode } = req.body;
      let apply = await this.userUseCase.applyCoupon(total, couponCode);

      if (apply.status == 400) {
        return res.status(apply.status).json({ message: apply.message });
      } else if (apply.status == 200) {
        return res.status(apply.status).json(apply.data);
      }
    } catch (error) {
      next(error);
    }
  }
  async getBookings(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId } = req.params;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 4;

      const result = await this.userUseCase.getBookings(userId, page, limit);

      if (result.status === 200) {
        return res.status(result.status).json(result.data);
      } else {
        return res.status(result.status).json({ message: result.message });
      }
    } catch (error) {
      next(error);
    }
  }
  async getBooking(req: Request, res: Response, next: NextFunction) {
    try {
      let booking = await this.userUseCase.getBooking(req.params.id);

      if (booking.status == 200) {
        return res.status(booking.status).json(booking.data);
      } else if (booking.status == 400) {
        return res.status(booking.status).json({ message: booking.message });
      }
    } catch (error) {
      next(error);
    }
  }
  async getFranchise(req: Request, res: Response, next: NextFunction) {
    try {
      const { Id } = req.body;
      let franchise = await this.userUseCase.getFranchise(Id);

      if (franchise.status == 200) {
        return res.status(franchise.status).json(franchise.data);
      } else if (franchise.status == 400) {
        return res
          .status(franchise.status)
          .json({ message: franchise.message });
      }
    } catch (error) {
      next(error);
    }
  }
  async checkDate(req: Request, res: Response, next: NextFunction) {
    try {
      const { bookId, date } = req.body;

      let check = await this.userUseCase.checkDate(bookId, date);

      return res.status(check.status).json(check.data);
    } catch (error) { }
  }
  async confirmCancel(req: Request, res: Response, next: NextFunction) {
    try {
      const { bookId, userId, amount, isDate } = req.body;
      let cancel = await this.userUseCase.confirmCancel(
        bookId,
        userId,
        amount,
        isDate
      );

      return res.status(cancel.status).json({ message: cancel.message });
    } catch (error) { }
  }
  async getWallet(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId } = req.body;

      let wallet = await this.userUseCase.getWallet(userId);

      return res.status(wallet.status).json(wallet.data);
    } catch (error) { }
  }
  async submitFeedback(req: Request, res: Response, next: NextFunction) {
    try {
      const { serviceRating, review, serviceId, userId, name } = req.body;
      const images = req.files as Express.Multer.File[];

      const feedback = await this.userUseCase.submitFeedback(
        serviceRating,
        review,
        serviceId,
        userId,
        name,
        images
      );

      if (feedback) {
        return res.status(feedback.status).json({ message: feedback.message });
      }
    } catch (error) {
      next(error);
    }
  }
  async getFeedbacks(req: Request, res: Response, next: NextFunction) {
    try {
      const { serviceId } = req.body;

      let feedbacks = await this.userUseCase.getFeedbacks(serviceId);

      if (feedbacks) {
        return res.status(feedbacks.status).json(feedbacks.data);
      } else {
        return res.status(400).json({ message: "failed please try again" });
      }
    } catch (error) {
      next(error);
    }
  }
  async checkFeedback(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId, serviceId } = req.body;

      let check = await this.userUseCase.checkFeedback(userId, serviceId);

      if (check) {
        return res.status(check.status).json(check.data);
      }
    } catch (error) {
      next(error);
    }
  }
  async homePageData(req: Request, res: Response, next: NextFunction) {

    try {
      let data = await this.userUseCase.homePageData();

      if (data) {
        return res.status(data.status).json(data.data)
      }

    } catch (error) {
      next(error);

    }
  }
  async logout(req: Request, res: Response, next: NextFunction) {
    try {
      req.session.destroy(err => {
        if (err) {
          return res.status(400).json({ message: 'Failed to log out' });
        }
        res.status(200).json({ message: 'Logged out successfully' });
      });
    } catch (error) {
      next(error)

    }
  }
}

export default userController;
