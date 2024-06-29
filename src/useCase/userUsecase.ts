import User from "../domain/user";
import UserRepository from "../infrastructure/repository/userRepository";
import EncryptPassword from "../infrastructure/services/bcryptPassword";
import GenerateOtp from "../infrastructure/services/generateOtp";
import JWTToken from "../infrastructure/services/generateToken";
import { IFile } from "../infrastructure/services/s3Bucket";
import S3Uploader from "../infrastructure/services/s3Bucket";
import sendOtp from "../infrastructure/services/sendEmail";

class UserUseCase {
  private UserRepository: UserRepository;
  private EncryptPassword: EncryptPassword;
  private JwtToken: JWTToken;
  private s3bucket: S3Uploader;
  private generateOtp: GenerateOtp;
  private generateEmail: sendOtp;

  constructor(
    UserRepository: UserRepository,
    encryptPassword: EncryptPassword,
    jwtToken: JWTToken,
    s3bucket: S3Uploader,
    generateOtp: GenerateOtp,
    generateEmail: sendOtp
  ) {
    this.UserRepository = UserRepository;
    this.EncryptPassword = encryptPassword;
    this.JwtToken = jwtToken;
    this.s3bucket = s3bucket;
    this.generateOtp = generateOtp;
    this.generateEmail = generateEmail;
  }
  async checkExist(email: string) {
    const userExist = await this.UserRepository.findByEmail(email);

    if (userExist) {
      return {
        status: 400,
        data: {
          status: false,
          message: "User already exists",
        },
      };
    } else {
      return {
        status: 200,
        data: {
          status: true,
          message: "User does not exist",
        },
      };
    }
  }

  async signup(email: string, name: string, phone: string, password: string) {
    const otp = this.generateOtp.createOtp();
    const hashedPassword = await this.EncryptPassword.encryptPassword(password);
    await this.UserRepository.saveOtp(email, otp, name, phone, hashedPassword);
    this.generateEmail.sendMail(email, otp);

    return {
      status: 200,
      data: {
        status: true,
        message: "Verification otp sent to your email",
      },
    };
  }
  async verifyOtp(email: string, otp: number) {
    const otpRecord = await this.UserRepository.findOtpByEmail(email);

    let data: { name: string; email: string; phone: string; password: string } =
      {
        name: otpRecord?.name,
        email: otpRecord?.email,
        phone: otpRecord?.phone,
        password: otpRecord?.password,
      };

    if (!otpRecord) {
      return { status: 400, message: "Invalid or expired OTP" };
    }

    const now = new Date().getTime();
    const otpGeneratedAt = new Date(otpRecord.otpGeneratedAt).getTime();
    const otpExpiration = 2 * 60 * 1000;

    if (now - otpGeneratedAt > otpExpiration) {
      await this.UserRepository.deleteOtpByEmail(email);
      return { status: 400, message: "OTP has expired" };
    }

    if (otpRecord.otp !== otp) {
      return { status: 400, message: "Invalid OTP" };
    }

    await this.UserRepository.deleteOtpByEmail(email);

    return { status: 200, message: "OTP verified successfully", data: data };
  }

  async verifyOtpUser(user: any) {
    if (user?.isGoogle) {
      const hashedPassword = await this.EncryptPassword.encryptPassword(
        user.password
      );

      const newUser = { ...user, password: hashedPassword };

      const userData = await this.UserRepository.save(newUser);

      let data = {
        _id: userData._id,
        name: userData.name,
        email: userData.email,
        phone: userData.phone,
        isBlocked: userData.isBlocked,
      };

      const token = this.JwtToken.generateToken(userData._id, "user");

      return {
        status: 200,
        data: data,
        token,
      };
    }

    const newUser = { ...user };

    const userData = await this.UserRepository.save(newUser);

    let data = {
      _id: userData._id,
      name: userData.name,
      email: userData.email,
      phone: userData.phone,
      isBlocked: userData.isBlocked,
    };

    const token = this.JwtToken.generateToken(userData._id, "user");

    return {
      status: 200,
      data: data,
      message: "OTP verified successfully",
      token,
    };
  }
  async login(email: string, password: string) {
    const user = await this.UserRepository.findByEmail(email);
    let token = "";

    if (user) {
      let data = {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        isBlocked: user.isBlocked,
      };

      if (user.isBlocked) {
        return {
          status: 400,
          data: {
            status: false,
            message: "You have been blocked by admin!",
            token: "",
          },
        };
      }

      const passwordMatch = await this.EncryptPassword.compare(
        password,
        user.password
      );

      if (passwordMatch && user.isAdmin) {
        token = this.JwtToken.generateToken(user._id, "admin");

        return {
          status: 200,
          data: {
            status: true,
            message: data,
            token,
            isAdmin: true,
          },
        };
      }

      if (passwordMatch) {
        token = this.JwtToken.generateToken(user._id, "user");

        return {
          status: 200,
          data: {
            status: true,
            message: data,
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
    let userExist = await this.UserRepository.findByEmail(email);

    if (userExist) {
      const otp = this.generateOtp.createOtp();
      await this.UserRepository.saveOtp(email, otp);
      this.generateEmail.sendMail(email, otp);

      return {
        status: 200,
        data: {
          status: true,
          message: "Verification otp sent to your Email",
          email: userExist.email,
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
  async resetPassword(password: string, email: string) {
    const hashedPassword = await this.EncryptPassword.encryptPassword(password);
    const changePassword = await this.UserRepository.changePassword(
      email,
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
  async getService(Id: string) {
    const service = await this.UserRepository.getService(Id);

    return {
      status: 200,
      data: service,
    };
  }
  async resentOtp(
    email: string,
    name: string,
    phone: string,
    password: string
  ) {
    const otp = this.generateOtp.createOtp();
    const hashedPassword = await this.EncryptPassword.encryptPassword(password);
    await this.UserRepository.saveOtp(email, otp, name, phone, hashedPassword);
    this.generateEmail.sendMail(email, otp);

    return { status: 200, message: "Otp has been sent to your email" };
  }
  async resendOtp(email: string) {
    const otp = this.generateOtp.createOtp();
    await this.UserRepository.saveOtp(email, otp);
    this.generateEmail.sendMail(email, otp);

    return { status: 200, message: "Otp has been sent to your email" };
  }
  async editProfile(
    Id: string,
    data: { name: string; email: string; phone: string }
  ) {
    const profile = await this.UserRepository.editProfile(Id, data);

    if (profile) {
      const data = await this.UserRepository.findById(Id);

      const profileData = {
        _id: data?._id,
        name: data?.name,
        email: data?.email,
        phone: data?.phone,
        isBlocked: data?.isBlocked,
      };

      return {
        status: 200,
        data: {
          message: "Profile updated successfully",
          user: profileData,
        },
      };
    } else {
      return {
        status: 400,
        message: "Failed to update the data Please try again",
      };
    }
  }
  async getProfile(Id: string) {
    const profile = await this.UserRepository.findById(Id);

    let data = {
      _id: profile?._id,
      name: profile?.name,
      email: profile?.email,
      phone: profile?.phone,
      isBlocked: profile?.isBlocked,
    };

    return {
      status: 200,
      data: data,
    };
  }

  async updatePassword(Id: string, password: string) {
    const hashedPassword = await this.EncryptPassword.encryptPassword(password);
    const changePassword = await this.UserRepository.changePassword(
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
  async getAllCoupons() {
    let coupons = await this.UserRepository.findAllCoupons();

    if (coupons) {
      return {
        status: 200,
        data: coupons,
      };
    } else {
      return {
        status: 400,
        message: "Failed to fetch!",
      };
    }
  }
  async applyCoupon(total: string, code: string) {
    let coupon = await this.UserRepository.applyCoupon(code);

    if (coupon.found) {
      let subtotal = parseInt(total);
      let discount = parseInt(coupon.coupon.discount);

      let finalAmount = subtotal - discount;

      let result = finalAmount.toString();

      return {
        status: 200,
        data: {
          total: result,
          coupon: coupon.coupon,
        },
      };
    } else {
      return {
        status: 400,
        message: "Invalid coupon code",
      };
    }
  }
  async getBookings(userId: string, page: number, limit: number) {
    const result = await this.UserRepository.getBookings(userId, page, limit);

    if (result) {
      const { bookings, total } = result;
      const totalPages = Math.ceil(total / limit);

      return {
        status: 200,
        data: {
          bookings,
          currentPage: page,
          totalPages,
          totalBookings: total,
        },
      };
    } else {
      return {
        status: 400,
        message: "Failed to fetch bookings. Please try again!",
      };
    }
  }
  async getBooking(bookingId: string) {
    let booking = await this.UserRepository.getBooking(bookingId);

    if (booking) {
      return {
        status: 200,
        data: booking,
      };
    } else {
      return {
        status: 400,
        message: "Failed please try again!",
      };
    }
  }
  async getFranchise(Id: string) {
    let franchise = await this.UserRepository.getFranchise(Id);

    if (franchise) {
      return {
        status: 200,
        data: franchise,
      };
    } else {
      return {
        status: 400,
        message: "Failed please try again!",
      };
    }
  }
  async checkDate(bookId: string, date: Date) {
    let check = await this.UserRepository.checkDate(bookId, date);

    if (check) {
      return {
        status: 200,
        data: true,
      };
    } else {
      return {
        status: 200,
        data: false,
      };
    }
  }
  async confirmCancel(
    bookId: string,
    userId: string,
    amount: string,
    isDate: boolean
  ) {
    let total = parseInt(amount);

    if (isDate == true) {
      total = total - total * 0.15;
    }

    let cancel = await this.UserRepository.confirmCancel(bookId);

    let credit = await this.UserRepository.creditWallet(userId, total);

    if (credit) {
      return {
        status: 200,
        message:
          "Your refund has been processed and will reflect in your wallet",
      };
    } else {
      return {
        status: 400,
        message: "Failed please try again!",
      };
    }
  }
  async getWallet(userId: string) {
    let wallet = await this.UserRepository.getWallet(userId);

    if (wallet) {
      return {
        status: 200,
        data: wallet,
      };
    } else {
      return {
        status: 200,
        data: { balance: 0, history: [] },
      };
    }
  }
  async submitFeedback(
    serviceRating: number,
    review: string,
    serviceId: string,
    userId: string,
    name: string,
    images: IFile[]
  ) {
    const upload = await this.s3bucket.uploadImagesToS3(images);

    if (upload) {
      let save = await this.UserRepository.submitFeedback(
        serviceRating,
        review,
        upload,
        serviceId,
        userId,
        name
      );

      if (save) {
        return {
          status: 200,
          message: "feedback submitted successfully",
        };
      } else {
        return {
          status: 400,
          message: "failed please try again",
        };
      }
    }
  }
  async getFeedbacks(serviceid: string) {
    const feedbacks = await this.UserRepository.getFeedbacks(serviceid);

    if (feedbacks) {
      for (let i = 0; i < feedbacks.length; i++) {
        const feedback = feedbacks[i];
        const imageNames = feedback.images;

        const signedUrls = await this.s3bucket.getSignedImageUrls(imageNames);

        feedback.images = signedUrls;
      }
    }

    return {
      status: 200,
      data: feedbacks,
    };
  }
  async checkFeedback(userId: string, serviceId: string) {
    const check = await this.UserRepository.checkFeedback(userId, serviceId);

    return {
      status: 200,
      data: check,
    };
  }
  async homePageData() {
    const totalUser = await this.UserRepository.totalUsers();
    if (totalUser) {
      const totalFranchises = await this.UserRepository.totalFranchises();
      if (totalFranchises) {
        const totalBookings = await this.UserRepository.totalGroomed();

        return {
          status: 200,
          data: {
            totalUsers: totalUser,
            totalBookings: totalBookings,
            totalFranchises: totalFranchises,
          },
        };
      }
    }
  }
}

export default UserUseCase;
