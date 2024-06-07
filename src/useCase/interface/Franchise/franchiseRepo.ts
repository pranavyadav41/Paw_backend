import Franchise from "../../../domain/franchise";
import Booking from "../../../domain/booking";
import Service from "../../../domain/service";

interface FranchiseRepo {
    save(franchise:any):Promise<Franchise>
    findByEmail(email:string): Promise<Franchise | null>;
    findById(Id:string):Promise<Franchise | null>
    changePassword(Id:string,password:string):Promise<boolean>
    updateProfile(Id:string,data:{name:string,phone:string,email:string},address:{city:string,area:string,district:string,state:string,pincode:string,longitude:number,latitude:number}):Promise<boolean>
    isExist(franchiseId:string,serviceId:string):Promise<boolean>
    addService(franchiseId:string,service:{serviceId:string,serviceName:string},time:{hours:number,minutes:number}):Promise<boolean>
    deleteService(franchiseId:string,serviceId:string):Promise<boolean>
    setTime(franchiseId:string,openingTime:string,closingTime:string):Promise<boolean>
    editTime(franchiseId:string,serviceId:string,hours:number,minutes:number):Promise<boolean>
    getBookings(franchiseId:string):Promise<Booking[] | null>;
    getBooking(bookingId:string):Promise<Booking |  null>;
    changeStatus(bookingId:string,status:string):Promise<boolean>
    getService(Id:string):Promise<any>
}

export default FranchiseRepo;   