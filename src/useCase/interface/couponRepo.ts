import Coupon from '../../domain/coupon'

interface couponRepo{
    save(coupon:Coupon):Promise<Coupon>
    removeCoupon(Id:string):Promise<boolean> 
    editCoupon(Id:string,coupon:Coupon):Promise<boolean>
    getCoupons():Promise<Coupon[]>
}

export default couponRepo