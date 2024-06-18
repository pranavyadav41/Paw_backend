import User from '../../domain/user'
import Coupon from '../../domain/coupon';
import Booking from '../../domain/booking';
import franchise from '../../domain/franchise';
import Wallet from '../../domain/wallet';
import feedback from '../../domain/feedback';


interface UserRepo {

    save(user:User):Promise<User>;
    findByEmail(email:string): Promise<User | null>;
    findById(_id:string): Promise<User | null>
    getService(Id:string):Promise<any>
    editProfile(Id:string,data:{name:string,email:string,phone:string}):Promise<boolean>
    changePassword(Id:string,password:string):Promise<boolean>
    getService(Id:string):Promise<any>
    editProfile(Id:string,data:{name:string,email:string,phone:string}):Promise<boolean>
    findAllCoupons():Promise<Coupon[]>;
    applyCoupon(code:string):Promise<{coupon:any,found:boolean}>;
    getBookings(userId:string):Promise<Booking[] | null>;
    getBooking(bookingId:string):Promise<Booking |  null>;
    getFranchise(Id:string):Promise<franchise | null>;
    checkDate(bookId:string,date:Date):Promise<boolean>
    confirmCancel(bookId:string):Promise<boolean>;
    creditWallet(userId:string,amount:number):Promise<boolean>
    getWallet(userId:string):Promise<Wallet | null>
    submitFeedback(rating:number,feedback:string,images:String[],service:string,userId:string,name:string):Promise<boolean>
    getFeedbacks(serviceId:string):Promise<feedback[] | null>
    checkFeedback(userId:string,serviceId:string):Promise<boolean>
    zegoToken(userId:string):Promise<any>
}

export default UserRepo;      