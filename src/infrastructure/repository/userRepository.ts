import User from "../../domain/user";
import UserModel from "../database/userModel";
import UserRepo from "../../useCase/interface/userRepo";
import ServiceModel from "../database/serviceModal";
import CouponModel from "../database/couponModel";
import FranchiseModel from "../database/franchiseModel";
import BookingModel from "../database/bookingModel";
import WalletModel from "../database/walletModel";
import franchise from "../../domain/franchise";
import Booking from "../../domain/booking";
import Coupon from "../../domain/coupon";

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
  async getBookings(userId: string): Promise<Booking[] | null> {
    const bookings = await BookingModel.find({ userId: userId });

    return bookings;
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
      bookingDate: {
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
}

export default UserRepository;
