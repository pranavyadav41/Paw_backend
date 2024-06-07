import franchise from "../../../domain/franchise";
import FranchiseModel from "../../database/franchiseModel";
import FranchiseRepo from "../../../useCase/interface/Franchise/franchiseRepo";
import Booking from "../../../domain/booking";
import BookingModel from "../../database/bookingModel";
import ServiceModel from "../../database/serviceModal";

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
}

export default franchiseRepository;
