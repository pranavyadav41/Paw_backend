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
}

export default franchiseRepository;
