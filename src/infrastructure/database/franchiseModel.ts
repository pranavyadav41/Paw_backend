import mongoose, {Model,Schema,Document} from "mongoose";
import Frachise from "../../domain/franchise";

const franchisSchema:Schema = new Schema<Frachise   | Document>(
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

const FranchiseModel:Model<Frachise&Document> =mongoose.model<Frachise  & Document>(
    "Franchise",
    franchisSchema
)

export default FranchiseModel


