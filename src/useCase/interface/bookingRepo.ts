import Coupon from "../../domain/coupon";
import Booking from "../../domain/booking";
import franchise from "../../domain/franchise";
import User from "../../domain/user";

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
  walletWithdraw(userId:string,amount:number):Promise<boolean>
  
}

export default bookingRepo; 
  