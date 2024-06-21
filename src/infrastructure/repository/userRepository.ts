import User from "../../domain/user";
import UserModel from "../database/userModel";
import UserRepo from "../../useCase/interface/userRepo";
import ServiceModel from "../database/serviceModal";
import CouponModel from "../database/couponModel";
import FranchiseModel from "../database/franchiseModel";
import BookingModel from "../database/bookingModel";
import WalletModel from "../database/walletModel";
import FeedbackModel from "../database/feedbackModel";
import franchise from "../../domain/franchise";
import Booking from "../../domain/booking";
import Coupon from "../../domain/coupon";
import Wallet from "../../domain/wallet";
import feedback from "../../domain/feedback";
import jwt from 'jsonwebtoken'

class UserRepository implements UserRepo {
  //saving user details to database
  async save(user: User): Promise<User> {
    const newUser = new UserModel(user);
    const savedUser = await newUser.save();
    return savedUser;
  }
  async findByEmail(email: string): Promise<User | null> {
    const userData = await UserModel.findOne({ email: email });

    return userData;
  }
  async findById(_id: string): Promise<User | null> {
    const userData = await UserModel.findById(_id);

    return userData;
  }
  async changePassword(userId: string, password: string): Promise<boolean> {
    const result = await UserModel.updateOne(
      {
        _id: userId,
      },
      { $set: { password: password } }
    );

    return result.modifiedCount > 0;
  }
  async getService(Id: string): Promise<any> {
    const service = await ServiceModel.findOne({ _id: Id });

    return service;
  }
  async editProfile(
    Id: string,
    data: { name: string; email: string; phone: string }
  ): Promise<boolean> {
    const update = await UserModel.updateOne(
      { _id: Id },
      { $set: { name: data.name, email: data.email, phone: data.phone } }
    );

    return update.modifiedCount > 0;
  }
  async findAllCoupons(): Promise<Coupon[]> {
    const coupons = await CouponModel.find();

    return coupons;
  }
  async applyCoupon(code: string): Promise<{ coupon: any; found: boolean }> {
    const coupon = await CouponModel.findOne({ code: code });

    if (coupon) {
      return { coupon: coupon, found: true };
    }

    return { coupon: "", found: false };
  }
  async getBookings(userId: string, page: number, limit: number): Promise<{ bookings: Booking[], total: number } | null> {
    const startIndex = (page - 1) * limit;

    const [bookings, total] = await Promise.all([
      BookingModel.find({ userId })
        .sort({ scheduledDate: -1, bookingStatus: 1 })
        .skip(startIndex)
        .limit(limit),
      BookingModel.countDocuments({ userId })
    ]); 

    return { bookings, total };
  }
  async getBooking(bookingId: string): Promise<Booking | null> {
    const booking = await BookingModel.findOne({ _id: bookingId });
    return booking;
  }
  async getFranchise(Id: string): Promise<franchise | null> {
    const franchise = await FranchiseModel.findOne({ _id: Id });
    return franchise;
  }
  async getUser(Id: string): Promise<User | null> {
    const user = await UserModel.findOne({ _id: Id });
    return user;
  }
  async checkDate(bookId: string, date: Date): Promise<boolean> {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const booking = await BookingModel.findOne({
      _id: bookId,
      scheduledDate: {
        $gte: startOfDay,
        $lt: endOfDay,
      },
    });

    return !!booking;
  }
  async confirmCancel(bookId: string): Promise<boolean> {
    let cancel = await BookingModel.updateOne(
      { _id: bookId },
      { $set: { bookingStatus: "Cancelled" } }
    );

    return cancel.modifiedCount > 0;
  }
  async creditWallet(userId: string, amount: number): Promise<boolean> {
    let wallet = await WalletModel.findOne({ userId });

    if (!wallet) {
      wallet = new WalletModel({
        userId,
        balance: amount,
        history: [{ date: new Date(), amount }],
      });
    } else {
      wallet.balance += amount;
      wallet.history.push({ date: new Date(), amount });
    }

    await wallet.save();

    return true;
  }
  async getWallet(userId: string): Promise<Wallet | null> {
    const wallet = await WalletModel.findOne({ userId: userId });

    return wallet;
  }
  async submitFeedback(
    rating: number,
    feedback: string,
    images: String[],
    serviceId: string,
    userId: string,
    name: string
  ): Promise<boolean> {
    const newFeedback = new FeedbackModel({
      rating,
      feedback,
      images,
      serviceId,
      userId,
      name,
    });
    const save = await newFeedback.save();

    return save ? true : false;
  }
  async getFeedbacks(serviceId: string): Promise<feedback[] | null> {
    const feedbacks = await FeedbackModel.find({ serviceId: serviceId });

    return feedbacks;
  }
  async checkFeedback(userId: string, serviceId: string): Promise<boolean> {
    const result = await FeedbackModel.findOne({ userId, serviceId });

    console.log(result, "result");

    return result ? true : false;
  }
  async totalFranchises(): Promise<number> {
    let count = await FranchiseModel.countDocuments()
    return count

  }
  async totalGroomed(): Promise<number> {
    let count = await BookingModel.countDocuments()
    return count

  }
  async totalUsers(): Promise<number> {
    let count = await UserModel.countDocuments()
    return count

  }

}

export default UserRepository;
