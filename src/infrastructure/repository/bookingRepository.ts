import bookingRepo from "../../useCase/interface/bookingRepo";
import FranchiseModel from "../database/franchiseModel";
import BookingModel from "../database/bookingModel";
import CouponModel from "../database/couponModel";
import Coupon from "../../domain/coupon";
import Booking from "../../domain/booking";
import mongoose from "mongoose";
import franchise from "../../domain/franchise";
import UserModel from "../database/userModel";
import User from "../../domain/user";

class bookingRepository implements bookingRepo {
  async findNearestFranchise(
    latitude: number,
    longitude: number,
    serviceId: string
  ): Promise<any> {
    const nearestFranchise = await FranchiseModel.findOne({
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [longitude, latitude],
          },
          $maxDistance: 10000, // 10 km in meters
        },
      },
      "services.serviceId": serviceId,
    });
    return nearestFranchise;
  }

  async findServiceDuration(
    franchiseId: string,
    serviceId: string
  ): Promise<{ hours: number; minutes: number }> {
    const result = await FranchiseModel.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(franchiseId) } },
      { $unwind: "$services" },
      {
        $match: {
          "services.serviceId": new mongoose.Types.ObjectId(serviceId),
        },
      },
      {
        $project: {
          _id: 0,
          hours: "$services.timeToComplete.hours",
          minutes: "$services.timeToComplete.minutes",
        },
      },
    ]);

    return {
      hours: result[0].hours,
      minutes: result[0].minutes,
    };
  }

  async findBookedSlots(franchiseId: string, date: Date): Promise<any> {
    const startDate = new Date(date);
    startDate.setHours(0, 0, 0, 0); // Start of the day
    const endDate = new Date(date);
    endDate.setHours(23, 59, 59, 999); // End of the day

    const bookings: any[] = await BookingModel.aggregate([
      {
        $match: {
          franchiseId: franchiseId,
          bookingDate: { $gte: startDate, $lt: endDate },
          bookingStatus: "Pending",
        },
      },
      {
        $project: {
          _id: 0,
          startTime: 1,
          endTime: 1,
        },
      },
    ]);

    return bookings;
  }

  async confirmBooking(
    franchiseId: string,
    bookingDate: Date,
    startTime: string,
    endTime: string,
    userId: string,
    address: any,
    serviceId: string,
    name: string,
    phone: string,
    size: string,
    totalAmount: string
  ): Promise<string> {
    const newBooking = new BookingModel({
      franchiseId,
      scheduledDate:bookingDate,
      startTime,
      endTime,
      userId,
      address,
      serviceId,
      name,
      phone,
      sizeOfPet: size,
      totalAmount,
    });

    const savedBooking = await newBooking.save();
    return savedBooking._id;
  }
  
}

export default bookingRepository;
