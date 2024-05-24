import mongoose, {Model,Schema,Document} from "mongoose";
import Address from "../../domain/address";

const addressSchema: Schema = new Schema<Address>({
   city:{
    type:String,
    required:true
   },
   district:{
    type:String,
    required:true
   },
   state:{
    type:String,
    required:true
   },
   pincode:{
    type:String,
    required:true
   },
   userId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'User'
   }
});

const AddressModel:Model<Address|Document>=mongoose.model<Address&Document>(
    "Address",
    addressSchema
)

export default AddressModel