import Coupon from "../../domain/coupon";
import Booking from "../../domain/booking";

interface bookingRepo {
  findNearestFranchise(
    latitude: number,
    longitude: number,
    serviceId: string
  ): Promise<any>;
  findServiceDuration(
    franchiseId: string,
    serviceId: string
  ): Promise<{ hours: number; minutes: number }>;
  findBookedSlots(franchiseId: string, date: Date): Promise<any>;
  confirmBooking(
    franchiseId: string,
    bookingDate: Date,
    startTime: string,
    endTime: string,
    userId: string,
    address: any,
    serviceId: string,
    name: string,
    phone: string,
    size:string,
    totalAmount:string
  ): Promise<any>;
  findAllCoupons():Promise<Coupon[]>;
  applyCoupon(code:string):Promise<{coupon:any,found:boolean}>;
  getBookings(userId:string):Promise<Booking[] | null>;
}

export default bookingRepo;
