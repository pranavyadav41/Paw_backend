import mongoose, { Model, Schema, Document } from "mongoose";
import Coupon from "../../domain/coupon";

const couponSchema:Schema= new Schema<Coupon | Document>(
    {
        code: {
            type: String,
            required: true, 
            unique: true 
        }, 
        discount: {
            type:String, 
            required: true
        },
        validFrom: {
            type: String, 
            required: true
        },
        validTo: {
            type: String,
            required: true
        },
        minCartValue: {
            type: String,
            required: true
        }
    }
);

const CouponModel: Model<Coupon & Document> = mongoose.model<Coupon & Document>(
    "Coupon",
    couponSchema
);

export default CouponModel;
