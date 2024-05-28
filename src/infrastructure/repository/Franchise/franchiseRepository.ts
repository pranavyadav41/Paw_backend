import franchise from "../../../domain/franchise";
import FranchiseModel from "../../database/franchiseModel";
import FranchiseRepo from "../../../useCase/interface/Franchise/franchiseRepo";

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
    data: { name: string; phone: string; email: string }
  ): Promise<boolean> {
    const result = await FranchiseModel.updateOne(
      { _id: Id },
      { $set: { name: data.name, email: data.email, phone: data.phone } }
    );

    return result.modifiedCount > 0;
  }
  async updateAddress(
    Id: string,
    address: { city: string; state: string; district: string; pincode: string }
  ): Promise<boolean> {
    const result = await FranchiseModel.updateOne(
      { _id: Id },
      {
        $set: {
          city: address.city,
          state: address.state,
          district: address.state,
          pincode: address.pincode,
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
}

export default franchiseRepository;
