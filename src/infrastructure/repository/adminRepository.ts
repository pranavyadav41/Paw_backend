import UserModel from "../database/userModel";
import FranchiseReqModel from "../database/franchiseReqModel";
import FranchiseModel from "../database/franchiseModel";
import ServiceModel from "../database/serviceModal";
import BookingModel from "../database/bookingModel";
import adminRepo from "../../useCase/interface/adminRepo";
import franchise from "../../domain/franchise";
import approve from "../../domain/approval";
import Service from "../../domain/service";
import updatedService from "../../domain/updatedService";
import { ObjectId } from "mongodb";

class adminRepository implements adminRepo {
  async getUsers(page: number, limit: number, searchTerm: string): Promise<{ users: {}[], total: number }> {
    const skip = (page - 1) * limit;

    const query = searchTerm
      ? {
        isAdmin: false, $or: [
          { name: { $regex: searchTerm, $options: 'i' } },
          { email: { $regex: searchTerm, $options: 'i' } }
        ]
      }
      : { isAdmin: false };

    const users = await UserModel.find(query)
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await UserModel.countDocuments(query);

    return { users, total };
  }
  async findByEmail(email: string): Promise<franchise | null> {
    let result = await FranchiseModel.findOne({ email: email });

    return result;
  }
  async blockUser(userId: string): Promise<boolean> {
    let result = await UserModel.updateOne(
      { _id: userId },
      { $set: { isBlocked: true } }
    );
    return result.modifiedCount > 0;
  }
  async unBlockUser(userId: string): Promise<boolean> {
    let result = await UserModel.updateOne(
      { _id: userId },
      { $set: { isBlocked: false } }
    );
    return result.modifiedCount > 0;
  }
  async getFranchiseReqests(): Promise<{}[] | null> {
    let requests = await FranchiseReqModel.find();
    return requests;
  }
  async approveFranchise(reqId: string): Promise<approve | boolean> {
    let data = await FranchiseReqModel.findOne({ _id: reqId });

    if (data) {
      let exist = await FranchiseModel.findOne({ email: data.email });
      if (exist) {
        return false;
      }

      let approve = await FranchiseReqModel.deleteOne({ _id: reqId });

      const detail = {
        name: data.name,
        email: data.email,
        password: data.password,
        phone: data.phone,
        district: data.district,
        area: data.area,
        city: data.city,
        pincode: data.pincode,
        state: data.state,
        location: data.location,
      };
      return detail;
    }
    return false;
  }
  async rejectFranchise(
    reqId: string
  ): Promise<{ status: boolean; email: string }> {
    let data = await FranchiseReqModel.findOne({ _id: reqId });

    if (data) {
      let reject = await FranchiseReqModel.deleteOne({ _id: reqId });

      return {
        status: true,
        email: data.email,
      };
    }
    return {
      status: false,
      email: " ",
    };
  }
  async getFranchises(page: number, limit: number, searchTerm: string): Promise<{ franchises: {}[], total: number }> {
    const skip = (page - 1) * limit;
    const query = searchTerm
      ? { name: { $regex: searchTerm, $options: 'i' } }
      : {};
  
    const [franchises, total] = await Promise.all([
      FranchiseModel.find(query).skip(skip).limit(limit),
      FranchiseModel.countDocuments(query)
    ]);
  
    return { franchises, total };
  }
  async blockFranchise(franchiseId: string): Promise<boolean> {
    let block = await FranchiseModel.updateOne(
      { _id: franchiseId },
      { $set: { isBlocked: true } }
    );

    return block.modifiedCount > 0;
  }
  async unBlockFranchise(franchiseId: string): Promise<boolean> {
    let unBlock = await FranchiseModel.updateOne(
      { _id: franchiseId },
      { $set: { isBlocked: false } }
    );
    return unBlock.modifiedCount > 0;
  }
  async findService(category: string): Promise<Service | null> {
    let match: any = await ServiceModel.findOne({ category: category });

    if (!match) {
      return null;
    }

    const service: Service = {
      category: match.category,
      services: match.services,
      price: match.price,
    };
    return service;
  }
  async addService(service: Service): Promise<boolean> {
    let newService = new ServiceModel(service);
    let save = await newService.save();

    if (save) {
      return true;
    } else {
      return false;
    }
  }
  async editService(service: updatedService): Promise<boolean> {
    let editService = await ServiceModel.updateOne(
      { _id: service._id },
      {
        $set: {
          category: service.category,
          price: service.price,
          services: service.services,
        },
      }
    );
    return editService.modifiedCount > 0;
  }
  async deleteService(serviceId: string): Promise<boolean> {
    let deleteService = await ServiceModel.deleteOne({ _id: serviceId });

    if (deleteService) {
      return true;
    } else {
      return false;
    }
  }
  async getServices(): Promise<{}[] | null> {
    let services = await ServiceModel.find();

    return services;
  }
  async getWeeklyData(): Promise<any> {
    try {
      const getWeekStartDate = (date: Date) => {
        const dayOfWeek = date.getUTCDay();
        const diff = date.getUTCDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
        return new Date(
          Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), diff, 0, 0, 0, 0)
        );
      };

      const currentDate = new Date();
      const startOfYear = new Date(
        Date.UTC(currentDate.getUTCFullYear(), 0, 1)
      );
      const endOfYear = new Date(
        Date.UTC(currentDate.getUTCFullYear(), 11, 31, 23, 59, 59, 999)
      );

      const weeklyData = [];
      let currentWeek = startOfYear;

      while (currentWeek <= endOfYear) {
        const startOfWeek = getWeekStartDate(currentWeek);
        const endOfWeek = new Date(
          startOfWeek.getTime() + 6 * 24 * 60 * 60 * 1000
        );

        const matchStage = {
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

      return weeklyData;
    } catch (error) {
      console.error("Error fetching weekly data:", error);
      throw error;
    }
  }

  async getMonthlyData(): Promise<any> {
    try {
      const currentDate = new Date();
      const startOfYear = new Date(
        Date.UTC(currentDate.getUTCFullYear(), 0, 1)
      );
      const endOfYear = new Date(
        Date.UTC(currentDate.getUTCFullYear(), 11, 31, 23, 59, 59, 999)
      );

      const monthlyData = await BookingModel.aggregate([
        {
          $match: {
            bookingDate: {
              $gte: startOfYear,
              $lte: endOfYear,
            },
          },
        },
        {
          $group: {
            _id: {
              month: { $month: "$bookingDate" },
              year: { $year: "$bookingDate" },
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
                "-",
                { $toString: "$_id.month" },
              ],
            },
            totalBookings: 1,
            totalEarnings: 1,
          },
        },
      ]);

      return monthlyData;
    } catch (error) {
      console.error("Error fetching monthly data:", error);
      throw error;
    }
  }

  async getYearlyData(): Promise<any> {
    try {
      const currentYear = new Date().getUTCFullYear();
      const startYear = 2022;
      const endYear = currentYear;

      const yearlyData = await BookingModel.aggregate([
        {
          $match: {
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

      return yearlyData;
    } catch (error) {
      console.error("Error fetching yearly data:", error);
      throw error;
    }
  }
  async getTotalBookings(): Promise<number> {
    let count = await BookingModel.find().countDocuments();

    return count;
  }
  async getFranchisesCount(): Promise<number> {
    let count = await FranchiseModel.find().countDocuments();

    return count;
  }
  async franchiseWeeklyData(franchiseId: string): Promise<any> {
    const getWeekStartDate = (date: Date) => {
      const dayOfWeek = date.getUTCDay();
      const diff = date.getUTCDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
      return new Date(
        Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), diff, 0, 0, 0, 0)
      );
    };

    const currentDate = new Date();
    const startOfYear = new Date(Date.UTC(currentDate.getUTCFullYear(), 0, 1));
    const endOfYear = new Date(
      Date.UTC(currentDate.getUTCFullYear(), 11, 31, 23, 59, 59, 999)
    );

    const weeklyData = [];
    let currentWeek = startOfYear;

    while (currentWeek <= endOfYear) {
      const startOfWeek = getWeekStartDate(currentWeek);
      const endOfWeek = new Date(
        startOfWeek.getTime() + 6 * 24 * 60 * 60 * 1000
      );

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

  async franchiseMonthlyData(franchiseId: string): Promise<any> {
    const currentDate = new Date();
    const startOfYear = new Date(Date.UTC(currentDate.getUTCFullYear(), 0, 1));
    const endOfYear = new Date(
      Date.UTC(currentDate.getUTCFullYear(), 11, 31, 23, 59, 59, 999)
    );

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
          _id: {
            month: { $month: "$bookingDate" },
            year: { $year: "$bookingDate" },
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

  async franchiseYearlyData(franchiseId: string): Promise<any> {
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
  async franchiseTotalBooking(franchiseId: string): Promise<number> {
    const count = await BookingModel.countDocuments({
      franchiseId: franchiseId,
      bookingStatus: 'Completed',
    });
    return count;

  }
  async franchiseTotalEarning(franchiseId: string): Promise<number> {
    const bookings = await BookingModel.aggregate([
      { $match: { franchiseId: new ObjectId(franchiseId), bookingStatus: 'Completed' } },
      { $group: { _id: null, totalEarnings: { $sum: { $toDouble: "$totalAmount" } } } }
    ]);

    if (bookings.length > 0) {
      return bookings[0].totalEarnings;
    } else {
      return 0;
    }

  }
}
export default adminRepository;
