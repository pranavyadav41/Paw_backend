import BookingRepo from "./interface/bookingRepo";
import findAvailableTimeSlots from "../infrastructure/services/slotGenerator";

class BookingUseCase {
  private bookingRepository: BookingRepo;
  constructor(bookingRepository: BookingRepo) {
    this.bookingRepository = bookingRepository;
  }

  async findNearestFranchise(
    latitude: number,
    longitude: number,
    serviceId: string,
    date: Date
  )  {
    try {
      let franchise = await this.bookingRepository.findNearestFranchise(
        latitude,
        longitude,
        serviceId
      );
  
      if (franchise) {
        let duration = await this.bookingRepository.findServiceDuration(
          franchise._id,
          serviceId
        );
  
        let bookings = await this.bookingRepository.findBookedSlots(
          franchise._id,
          date
        );
  
        console.log(bookings, "booked");
        const bookedSlots: any[] = [];
  
        if (bookings.length > 0) {
          bookings.forEach((booking: any) => {
            // Convert Date objects to HH:mm strings
            const startTime = booking.startTime;
            const endTime = booking.endTime;
            bookedSlots.push({ startTime, endTime });
          });
  
          console.log(bookedSlots, "booked slots");
        }
  
        const slots = findAvailableTimeSlots(
          bookedSlots,
          90,
          franchise.openingTime,
          franchise.closingTime,
          30
        );
  
        console.log(slots, "available slots");
  
        return {
          status: 200,
          data: {
            slots: slots,
            franchise: franchise._id,
          },
        };
      }
    } catch (error) {
      console.error("Error finding nearest franchise:", error);
      throw error;
    }
  }
  async confirmBooking(franchiseId: string, bookingDate: Date, startTime: string, endTime: string, userId: string, address: any, serviceId: string):Promise<any>{

    console.log("usecaase")
    
    const booking = await this.bookingRepository.confirmBooking(franchiseId,bookingDate,startTime,endTime,userId,address,serviceId)

    if(booking){
      console.log("booked")
    }
  }
}

export default BookingUseCase;
