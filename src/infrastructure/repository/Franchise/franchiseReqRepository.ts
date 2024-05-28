import franchiseReq from "../../../domain/franchiseReq";
import FranchiseReqModel from "../../database/franchiseReqModel";
import FranchiseReqRepo from "../../../useCase/interface/Franchise/franchiseReqRepo";

class franchiseReqRepository implements FranchiseReqRepo {
  async save(franchise: franchiseReq): Promise<franchiseReq> {
    const { longitude, latitude, ...rest } = franchise;
    
    const location = {
      type: "Point",
      coordinates: [longitude, latitude],
    };
  
    const franchiseData = {
      ...rest,
      location,
    };
  
    const newFranchiseReq = new FranchiseReqModel(franchiseData);
    const savedFranchiseReq = await newFranchiseReq.save();
    
    return savedFranchiseReq;
  }
  
  async findByEmail(email: string): Promise<franchiseReq | null> {
    const franchiseData = await FranchiseReqModel.findOne({ email: email });

    return franchiseData;
  }
}

export default franchiseReqRepository;
