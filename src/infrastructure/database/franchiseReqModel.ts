import mongoose, {Model,Schema,Document} from "mongoose";
import frachiseReq from "../../domain/franchiseReq";

const franchiseReqSchema:Schema = new Schema<frachiseReq   | Document>(
    {
        name:{
            type:String,
            required:true
        },
        email:{
            type:String,
            required:true,
            unique:true
        },
        password:{
            type:String,
            required:true
        },
        phone:{
            type:String,
            required:true
        },
            district:{
                type:String,
                required:true
            },
            city:{
                type:String,
                required:true
            },
            pincode:{
                type:String,
                required:true
            },
            state:{
                type:String,
                required:true
            }
        }
)

const FranchiseReqModel:Model<frachiseReq&Document> =mongoose.model<frachiseReq  & Document>(
    "FranchiseRequests",
    franchiseReqSchema
)

export default FranchiseReqModel

