import BookingRepo from "./interface/bookingRepo";
import findAvailableTimeSlots from "../infrastructure/services/slotGenerator";
import Coupon from "../domain/coupon";

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
  ) {
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

      const dur = duration.hours * 60 + duration.minutes;

      let bookings = await this.bookingRepository.findBookedSlots(
        franchise._id,
        date
      );
      const bookedSlots: any[] = [];

      if (bookings.length > 0) {
        bookings.forEach((booking: any) => {
          // Convert Date objects to HH:mm strings
          const startTime = booking.startTime;
          const endTime = booking.endTime;
          bookedSlots.push({ startTime, endTime });
        });
      }

      const slots = findAvailableTimeSlots(
        bookedSlots,
        dur,
        franchise.openingTime,
        franchise.closingTime,
        30
      );

      return {
        status: 200,
        data: {
          slots: slots,
          franchise: franchise._id,
        },
      };
    } else {
      return {
        status: 400,
        message: "No franchise found within range or with the given service",
      };
    }
  }

  async confirmBooking(
    franchiseId: string,
    bookingDate: Date,
    startTime: string,
    endTime: string,
    userId: string,
    address: any,
    serviceId: string,
    name: string,
    phone: string,
    size: string,
    totalAmount: string,
    isWallet: boolean
  ): Promise<any> {
    const booked = await this.bookingRepository.confirmBooking(
      franchiseId,
      bookingDate,
      startTime,
      endTime,
      userId,
      address,
      serviceId,
      name,
      phone,
      size,
      totalAmount
    );
    if (booked) {
      if (isWallet == true) {
        let total = parseInt(totalAmount);
        let withdraw = await this.bookingRepository.walletWithdraw(
          userId,
          total
        );
      }
      return {
        status: 200,
        data: booked,
      };
    } else {
      return {
        status: 400,
        message: "Failed please try again !",
      };
    }
  }
}

export default BookingUseCase;
