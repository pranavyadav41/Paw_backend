import mongoose, {Model,Schema,Document} from "mongoose";
import Service from "../../domain/service";

const serviceSchema: Schema = new Schema<Service>({
    category: {
        type: String, 
        required: true
    },
    services: [
        {
            type: String,
            required: true 
        }
    ],
    price: {
        small: { 
            type: String, 
            required: true
        },
        medium: {
            type: String,
            required: true
        },
        large: {
            type: String,
            required: true
        },
        xLarge:{
            type:String,
            required:true
        }
    }
});

const ServiceModel:Model<Service|Document>=mongoose.model<Service&Document>(
    "Service",
    serviceSchema
)

export default ServiceModel