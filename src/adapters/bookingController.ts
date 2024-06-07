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

      if (nearest.status == 400) {
        return res.status(nearest.status).json({ message: nearest.message });
      } else if (nearest.status == 200) {
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
        name,
        phone,
        size,
        totalAmount,
      } = req.body;

      const booked = await this.bookingUseCase.confirmBooking(
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

      if (booked.status == 400) {
        return res.status(booked.status).json({ message: booked.message });
      } else if (booked.status == 200) {
        return res.status(booked.status).json(booked.data);
      }
    } catch (error) {
      next(error);
    }
  }
}

export default BookingController;
 