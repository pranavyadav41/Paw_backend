import franchise from "../../../domain/franchise";
import FranchiseModel from "../../database/franchiseModel";
import FranchiseRepo from "../../../useCase/interface/Franchise/franchiseRepo";
import Booking from "../../../domain/booking";
import BookingModel from "../../database/bookingModel";
import ServiceModel from "../../database/serviceModal";
import { ObjectId } from 'mongodb';
import jwt from 'jsonwebtoken'

class franchiseRepository implements FranchiseRepo {
  async save(franchise: franchise): Promise<franchise> {
    const newFranchise = new FranchiseModel(franchise);
    const savedFranchise = await newFranchise.save();
    return savedFranchise;
  }
  async findByEmail(email: string): Promise<franchise | null> {
    const franchiseData = await FranchiseModel.findOne({ email: email });

    return franchiseData;
  }
  async findById(Id: string): Promise<franchise | null> {
    const franchiseData = await FranchiseModel.findById(Id);
    return franchiseData;
  }
  async changePassword(Id: string, password: string): Promise<boolean> {
    const result = await FranchiseModel.updateOne(
      { _id: Id },
      { $set: { password: password } }
    );

    return result.modifiedCount > 0;
  }
  async updateProfile(
    Id: string,
    data: { name: string; phone: string; email: string },
    address: {
      city: string;
      area: string;
      district: string;
      state: string;
      pincode: string;
      longitude: number;
      latitude: number;
    }
  ): Promise<boolean> {
    const result = await FranchiseModel.updateOne(
      { _id: Id },
      {
        $set: {
          name: data.name,
          email: data.email,
          phone: data.phone,
          area: address.area,
          district: address.district,
          city: address.city,
          pincode: address.pincode,
          state: address.state,
          location: {
            type: "Point",
            coordinates: [address.longitude, address.latitude],
          },
        },
      }
    );
    return result.modifiedCount > 0;
  }
  async isExist(franchiseId: string, serviceId: string): Promise<boolean> {
    const franchise = await FranchiseModel.findOne({
      _id: franchiseId,
      services: { $elemMatch: { serviceId } },
    });

    return franchise !== null;
  }
  async addService(
    franchiseId: string,
    service: { serviceId: string; serviceName: string },
    time: { hours: number; minutes: number }
  ): Promise<boolean> {
    const serviceId = service.serviceId;
    const serviceName = service.serviceName;
    const hours = time.hours;
    const minutes = time.minutes;

    const update = await FranchiseModel.updateOne(
      { _id: franchiseId },
      {
        $addToSet: {
          services: {
            serviceId,
            serviceName,
            timeToComplete: {
              hours: hours,
              minutes: minutes,
            },
          },
        },
      }
    );

    return update.modifiedCount > 0;
  }
  async deleteService(
    franchiseId: string,
    serviceId: string
  ): Promise<boolean> {
    const update = await FranchiseModel.updateOne(
      { _id: franchiseId },
      { $pull: { services: { serviceId } } }
    );
    return update.modifiedCount > 0;
  }
  async setTime(
    franchiseId: string,
    openingTime: string,
    closingTime: string
  ): Promise<boolean> {
    const update = await FranchiseModel.updateOne(
      { _id: franchiseId },
      {
        $set: {
          openingTime,
          closingTime,
        },
      }
    );

    return update.modifiedCount > 0;
  }
  async editTime(
    franchiseId: string,
    serviceId: string,
    hours: number,
    minutes: number
  ): Promise<boolean> {
    const update = await FranchiseModel.updateOne(
      {
        _id: franchiseId,
        "services.serviceId": serviceId,
      },
      {
        $set: {
          "services.$.timeToComplete.hours": hours,
          "services.$.timeToComplete.minutes": minutes,
        },
      }
    );

    return update.modifiedCount > 0;
  }
  async getBookings(franchiseId: string): Promise<Booking[] | null> {
    const bookings = await BookingModel.find({ franchiseId: franchiseId });

    return bookings;
  }
  async getBooking(bookingId: string): Promise<Booking | null> {
    const booking = await BookingModel.findOne({ _id: bookingId });
    return booking;
  }
  async changeStatus(bookingId: string, status: string): Promise<boolean> {
    const change = await BookingModel.updateOne(
      { _id: bookingId },
      { $set: { bookingStatus: status } }
    );

    return change.modifiedCount > 0;
  }
  async getService(Id: string): Promise<any> {
    const service = await ServiceModel.findOne({ _id: Id });

    return service;
  }
  async getWeeklyData(franchiseId: string): Promise<any> {
    const getWeekStartDate = (date: Date) => {
      const dayOfWeek = date.getUTCDay();
      const diff = date.getUTCDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
      return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), diff, 0, 0, 0, 0));
    };

    const currentDate = new Date();
    const startOfYear = new Date(Date.UTC(currentDate.getUTCFullYear(), 0, 1));
    const endOfYear = new Date(Date.UTC(currentDate.getUTCFullYear(), 11, 31, 23, 59, 59, 999));

    const weeklyData = [];
    let currentWeek = startOfYear;

    while (currentWeek <= endOfYear) {
      const startOfWeek = getWeekStartDate(currentWeek);
      const endOfWeek = new Date(startOfWeek.getTime() + 6 * 24 * 60 * 60 * 1000);

      const matchStage = {
        franchiseId: new ObjectId(franchiseId),
        bookingDate: {
          $gte: startOfWeek,
          $lte: endOfWeek,
        },
      };

      const data = await BookingModel.aggregate([
        {
          $match: matchStage,
        },
        {
          $group: {
            _id: {
              year: { $year: "$bookingDate" },
              week: { $isoWeek: "$bookingDate" },
            },
            totalBookings: { $sum: 1 },
            totalEarnings: { $sum: { $toDouble: "$totalAmount" } },
          },
        },
        {
          $project: {
            _id: 0,
            name: {
              $concat: [
                { $toString: "$_id.year" },
                "-W",
                { $toString: "$_id.week" },
              ],
            },
            totalBookings: 1,
            totalEarnings: 1,
          },
        },
      ]);

      weeklyData.push(...data);

      currentWeek.setDate(currentWeek.getDate() + 7);
    }

    console.log("Weekly data before returning:", weeklyData);
    return weeklyData;
  }

async getMonthlyData(franchiseId: string): Promise<any> {
    const currentDate = new Date();
    const startOfYear = new Date(Date.UTC(currentDate.getUTCFullYear(), 0, 1));
    const endOfYear = new Date(Date.UTC(currentDate.getUTCFullYear(), 11, 31, 23, 59, 59, 999));

    const monthlyData = await BookingModel.aggregate([
      {
        $match: {
          franchiseId: new ObjectId(franchiseId),
          bookingDate: {
            $gte: startOfYear,
            $lte: endOfYear,
          },
        },
      },
      {
        $group: {
          _id: { month: { $month: "$bookingDate" }, year: { $year: "$bookingDate" } },
          totalBookings: { $sum: 1 },
          totalEarnings: { $sum: { $toDouble: "$totalAmount" } },
        },
      },
      {
        $project: {
          _id: 0,
          name: {
            $concat: [
              { $toString: "$_id.year" },
              "-",
              { $toString: "$_id.month" },
            ],
          },
          totalBookings: 1,
          totalEarnings: 1,
        },
      },
    ]);

    console.log("Monthly data before returning:", monthlyData);
    return monthlyData;
  }

async getYearlyData(franchiseId: string): Promise<any> {
    const currentYear = new Date().getUTCFullYear();
    const startYear = 2022;
    const endYear = currentYear;

    const yearlyData = await BookingModel.aggregate([
      {
        $match: {
          franchiseId: new ObjectId(franchiseId),
          bookingDate: {
            $gte: new Date(Date.UTC(startYear, 0, 1)),
            $lte: new Date(Date.UTC(endYear, 11, 31, 23, 59, 59, 999)),
          },
        },
      },
      {
        $group: {
          _id: { $year: "$bookingDate" },
          totalBookings: { $sum: 1 },
          totalEarnings: { $sum: { $toDouble: "$totalAmount" } },
        },
      },
      {
        $project: {
          _id: 0,
          name: {
            $toString: "$_id",
          },
          totalBookings: 1,
          totalEarnings: 1,
        },
      },
    ]);

    console.log("Yearly data before returning:", yearlyData);
    return yearlyData;
  }
  async getTotalBookings(franchiseId: string): Promise<number> {
      const totalBookings = await BookingModel.countDocuments({
        franchiseId: new ObjectId(franchiseId),
      });
      console.log(totalBookings,"total")
      return totalBookings;
 
  }
  
  async getAppointments(franchiseId: string, date: Date): Promise<number> {
    console.log(date,"date")
      const startOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0, 0);
      const endOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59, 999);
  
      const appointments = await BookingModel.countDocuments({
        franchiseId: new ObjectId(franchiseId),
        scheduledDate: {
          $gte: startOfDay,
          $lte: endOfDay,
        },
      });
      return appointments; 
  
  }
  async zegoToken(franchiseId: string): Promise<any> {

    const payload = {
      app_id: 624915009,
      user_id: franchiseId,
      exp: Math.floor(Date.now() / 1000) + (60 * 60),
    };
  
    const token = jwt.sign(payload, "be56a921abafed74dac47dd748a88213");

    return token
    
  }
  
  
}

export default franchiseRepository;
