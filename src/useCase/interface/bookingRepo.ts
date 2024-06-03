
interface bookingRepo{
    findNearestFranchise(latitude:number,longitude:number,serviceId:string):Promise<any>
    findServiceDuration(franchiseId:string,serviceId:string):Promise<{hours:number,minutes:number}>
    findBookedSlots(franchiseId:string,date:Date):Promise<any>
    confirmBooking(franchiseId:string,bookingDate:Date,startTime:string,endTime:string,userId:string,address:any,serviceId:string):Promise<any>

}

export default bookingRepo

