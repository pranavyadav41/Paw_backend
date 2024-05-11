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
            type: Number,
            required: true
        },
        medium: {
            type: Number,
            required: true
        },
        large: {
            type: Number,
            required: true
        }
    }
});

const ServiceModel:Model<Service|Document>=mongoose.model<Service&Document>(
    "Service",
    serviceSchema
)

export default ServiceModel