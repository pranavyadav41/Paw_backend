import { Request, Response, NextFunction } from "express";
import BookingUseCase from "../useCase/bookingUseCase";

class BookingController {
  private bookingUseCase: BookingUseCase;

  constructor(bookingUseCase: BookingUseCase) {
    this.bookingUseCase = bookingUseCase;
  }

  async findNearestFranchise(req: Request, res: Response, next: NextFunction) {
    try {
      const { latitude, longitude, serviceId, date } = req.body;

      const nearest = await this.bookingUseCase.findNearestFranchise(
        latitude,
        longitude,
        serviceId,
        date
      );

      if (nearest) {  
        console.log(nearest)
        return res.status(nearest.status).json(nearest.data);
      }
    } catch (error) {
      next(error);
    }
  }
  async confirmBooking(req: Request, res: Response, next: NextFunction) {
    try {
      const {
        franchiseId,
        bookingDate,
        startTime,
        endTime,
        userId,
        address,
        serviceId,
      } = req.body;

      console.log("controller")

      const booked = await this.bookingUseCase.confirmBooking(
        franchiseId,
        bookingDate,
        startTime,
        endTime,
        userId,
        address,
        serviceId
      );
    } catch (error) {
      next(error);
    }
  }
}

export default BookingController;
