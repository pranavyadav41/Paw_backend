import franchise from "../../../domain/franchise";
import FranchiseModel from "../../database/franchiseModel";
import FranchiseRepo from "../../../useCase/interface/Franchise/franchiseRepo";

class franchiseRepository implements FranchiseRepo{
    async save(franchise: franchise): Promise<franchise> { 
        const newFranchise = new FranchiseModel(franchise);
        const savedFranchise = await newFranchise.save(); 
        return savedFranchise;
      }
      async findByEmail(email: string): Promise<franchise | null> {
        const franchiseData = await FranchiseModel.findOne({ email: email });
    
        return franchiseData;
      }
}

export default franchiseRepository