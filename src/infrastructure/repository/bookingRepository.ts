import bookingRepo from "../../useCase/interface/bookingRepo";
import FranchiseModel from "../database/franchiseModel";
import BookingModel from "../database/bookingModel";
import mongoose from "mongoose";

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

    if (!nearestFranchise) {
      console.log("No franchise found within range or with the given service");
      return null;
    }

    console.log("Nearest franchise found:", nearestFranchise);
    return nearestFranchise;
  }
  async findServiceDuration(
    franchiseId: string,
    serviceId: string
  ): Promise<{ hours: number; minutes: number }> {
    console.log(franchiseId);

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
    console.log(result, "result");

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
  async confirmBooking(franchiseId: string, bookingDate: Date, startTime: string, endTime: string, userId: string, address: any, serviceId: string): Promise<any> {

    console.log("its here")

    const newBooking = new BookingModel({
      franchiseId,
      bookingDate,
      startTime,
      endTime,
      userId,
      address,
      serviceId,
    });

    // Save the booking to the database
    const savedBooking = await newBooking.save();

    console.log(savedBooking,"hello")

    // Return the saved booking
    return savedBooking;


    
  }
}

export default bookingRepository;
