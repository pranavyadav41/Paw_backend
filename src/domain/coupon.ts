import { Document, ObjectId } from 'mongoose';

 interface Coupon{
    code:string,
    discount:string,
    validFrom:string,
    validTo:string,
    minCartValue:string
}

export default Coupon


export interface CouponDocument extends Coupon, Document {
    _id: ObjectId;
  }