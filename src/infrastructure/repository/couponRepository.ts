import Coupon from "../../domain/coupon";
import CouponModel from "../database/couponModel";
import CouponRepo from "../../useCase/interface/couponRepo";

class CouponRepository implements CouponRepo {
  async save(coupon: Coupon): Promise<Coupon> {
    const newCoupon = new CouponModel(coupon);
    const save = await newCoupon.save();
    return save;
  }
  async removeCoupon(id: string): Promise<boolean> {
    const result = await CouponModel.deleteOne({_id:id})
    return result?true:false
  }

  async editCoupon(id: string, updatedCoupon: Coupon): Promise<boolean> {
    const result = await CouponModel.findByIdAndUpdate(id, updatedCoupon, {
      new: true, 
    });
    return result !== null;
  }
  async getCoupons(): Promise<Coupon[]> {
    const coupons = await CouponModel.find();
    return coupons;
  }
}

export default CouponRepository;
