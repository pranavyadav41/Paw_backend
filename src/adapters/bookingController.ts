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
  async getAllCoupons(req: Request, res: Response, next: NextFunction) {
    try {
      let coupons = await this.bookingUseCase.getAllCoupons();

      if (coupons.status == 400) {
        return res.status(coupons.status).json({ message: coupons.message });
      } else if (coupons.status == 200) {
        return res.status(coupons.status).json(coupons.data);
      }
    } catch (error) {
      next(error);
    }
  }
  async applyCoupon(req: Request, res: Response, next: NextFunction) {
    try {
      const { total, couponCode } = req.body;
      let apply = await this.bookingUseCase.applyCoupon(total, couponCode);

      if (apply.status == 400) {
        return res.status(apply.status).json({ message: apply.message });
      } else if (apply.status == 200) {
        return res.status(apply.status).json(apply.data);
      }
    } catch (error) {
      next(error);
    }
  }
  async getBookings(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId } = req.body;

      const bookings = await this.bookingUseCase.getBookings(userId);

      if (bookings.status == 200) {
        return res.status(bookings.status).json(bookings.data);
      } else if (bookings.status == 400) {
        return res.status(bookings.status).json({ message: bookings.message });
      }
    } catch (error) {}
  }
}

export default BookingController;
