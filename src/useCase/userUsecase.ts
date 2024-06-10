import User from "../domain/user";
import UserRepository from "../infrastructure/repository/userRepository";
import EncryptPassword from "../infrastructure/services/bcryptPassword";
import JWTToken from "../infrastructure/services/generateToken";
import { IFile } from "../infrastructure/services/s3Bucket";
import S3Uploader from "../infrastructure/services/s3Bucket";

class UserUseCase {
  private UserRepository: UserRepository;
  private EncryptPassword: EncryptPassword;
  private JwtToken: JWTToken;
  private s3bucket: S3Uploader;

  constructor(
    UserRepository: UserRepository,
    encryptPassword: EncryptPassword,
    jwtToken: JWTToken,
    s3bucket: S3Uploader
  ) {
    this.UserRepository = UserRepository;
    this.EncryptPassword = encryptPassword;
    this.JwtToken = jwtToken;
    this.s3bucket = s3bucket;
  }
  async signup(email: string) {
    const userExist = await this.UserRepository.findByEmail(email);

    if (userExist) {
      return {
        status: 400,
        data: {
          status: false,
          message: "User already exists",
        },
      };
    }
    return {
      status: 200,
      data: {
        status: true,
        message: "Verification otp sent to your email",
      },
    };
  }
  async verifyOtpUser(user: User) {
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
      return {
        status: 200,
        data: {
          status: true,
          message: "Verification otp sent to your Email",
          userId: userExist._id,
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
    const hashedPassword = await this.EncryptPassword.encryptPassword(password);
    const changePassword = await this.UserRepository.changePassword(
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
  async getService(Id: string) {
    const service = await this.UserRepository.getService(Id);

    return {
      status: 200,
      data: service,
    };
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
  async getBookings(userId: string) {
    let bookings = await this.UserRepository.getBookings(userId);

    if (bookings) {
      return {
        status: 200,
        data: bookings,
      };
    } else {
      return {
        status: 400,
        message: "Failed please try again!",
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
    name:string,
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

    if(feedbacks){
      for (let i = 0; i < feedbacks.length; i++) {
        const feedback = feedbacks[i];
        const imageNames = feedback.images;
    
  
        const signedUrls = await this.s3bucket.getSignedImageUrls(imageNames);
    
        feedback.images = signedUrls;
      }
    }

    return {
      status:200,
      data:feedbacks
    }
  }
}

export default UserUseCase;
