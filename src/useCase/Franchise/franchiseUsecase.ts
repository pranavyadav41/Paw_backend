import Encrypt from "../interface/encryptPassword";
import JWT from "../interface/jwt";
import FranchiseRepo from "../interface/Franchise/franchiseRepo";

class franchiseUseCase {
  franchiseRepo: FranchiseRepo;
  encryptPassword: Encrypt;
  jwtToken: JWT;

  constructor(
    franchiseRepo: FranchiseRepo,
    encryptPassword: Encrypt,
    jwtToken: JWT
  ) {
    this.franchiseRepo = franchiseRepo;
    this.encryptPassword = encryptPassword;
    this.jwtToken = jwtToken;
  }

  async login(email: string, password: string) {
    const franchise = await this.franchiseRepo.findByEmail(email);

    if (franchise) {
      let data = {
        _id: franchise._id,
        name: franchise.name,
        email: franchise.email,
        phone: franchise.phone,
        city: franchise.city,
        district: franchise.district,
        state: franchise.state,
        pincode: franchise.pincode,
      };

      if (franchise.isBlocked) {
        return {
          status: 400,
          data: {
            status: false,
            message: "You have been blocked by admin!",
            token: "",
          },
        };
      }

      const passwordMatch = await this.encryptPassword.compare(
        password,
        franchise.password
      );

      if (passwordMatch) {
        let token = this.jwtToken.generateToken(franchise._id, "franchise");

        return {
          status: 200,
          data: {
            status: true,
            message: franchise,
            token,
          },
        };
      } else {
        return {
          status: 400,
          data: {
            status: false,
            message: "Invalid email or password",
            token: "",
          },
        };
      }
    } else {
      return {
        status: 400,
        data: {
          status: false,
          message: "Invalid email or password",
          token: "",
        },
      };
    }
  }
  async forgotPassword(email: string) {
    let franchiseExist = await this.franchiseRepo.findByEmail(email);

    if (franchiseExist) {
      return {
        status: 200,
        data: {
          status: true,
          message: "Verification otp sent to your Email",
          userId: franchiseExist._id,
        },
      };
    } else {
      return {
        status: 400,
        data: {
          status: false,
          message: "Email not registered!",
        },
      };
    }
  }
  async resetPassword(password: string, userId: string) {
    const hashedPassword = await this.encryptPassword.encryptPassword(password);
    const changePassword = await this.franchiseRepo.changePassword(
      userId,
      hashedPassword
    );
    if (changePassword) {
      return {
        status: 200,
        message: "Password changed successfully",
      };
    } else {
      return {
        status: 400,
        message: "Failed please try again !",
      };
    }
  }
  async getProfile(Id: string) {
    const franchise = await this.franchiseRepo.findById(Id);

    if (franchise) {
      const data = {
        _id: franchise._id,
        name: franchise.name,
        email: franchise.email,
        phone: franchise.phone,
        area: franchise.area,
        city: franchise.city,
        district: franchise.district,
        state: franchise.state,
        pincode: franchise.pincode,
        openingTime: franchise.openingTime,
        closingTime: franchise.closingTime,
        services: franchise.services,
      };
      return {
        status: 200,
        data: data,
      };
    }
  }
  async updateProfile(
    Id: string,
    data: { name: string; phone: string; email: string },
    address: {
      city: string;
      area: string;
      district: string;
      state: string;
      pincode: string;
      longitude: number;
      latitude: number;
    }
  ) {
    const update = await this.franchiseRepo.updateProfile(Id, data, address);

    if (update) {
      return {
        status: 200,
        message: "Profile updated successfully",
      };
    } else {
      return {
        status: 400,
        message: "Failed to update,please try again!",
      };
    }
  }
  async updatePassword(Id: string, password: string) {
    const hashedPassword = await this.encryptPassword.encryptPassword(password);

    const changePassword = await this.franchiseRepo.changePassword(
      Id,
      hashedPassword
    );
    if (changePassword) {
      return {
        status: 200,
        message: "Password changed successfully",
      };
    } else {
      return {
        status: 400,
        message: "Failed please try again !",
      };
    }
  }
  async addService(
    franchiseId: string,
    service: { serviceId: string; serviceName: string },
    time: { hours: number; minutes: number }
  ) {
    const exist = await this.franchiseRepo.isExist(
      franchiseId,
      service.serviceId
    );

    if (exist) {
      return {
        status: 401,
        message: "service already exist",
      };
    }
    const add = await this.franchiseRepo.addService(franchiseId, service, time);

    if (add) {
      return {
        status: 200,
        message: "Service added successfully",
      };
    } else {
      return {
        status: 400,
        message: "Failed please try again",
      };
    }
  }
  async deleteService(franchiseId: string, serviceId: string) {
    const deleted = await this.franchiseRepo.deleteService(
      franchiseId,
      serviceId
    );

    if (deleted) {
      return {
        status: 200,
        message: "Service deleted successfully",
      };
    } else {
      return {
        status: 400,
        message: "Failed please try again",
      };
    }
  }
  async setTime(franchiseId: string, openingTime: string, closingTime: string) {
    const time = await this.franchiseRepo.setTime(
      franchiseId,
      openingTime,
      closingTime
    );

    if (time) {
      return {
        status: 200,
        message: "Timing updated",
      };
    } else {
      return {
        status: 400,
        message: "Failed please try again",
      };
    }
  }
  async editTime(
    franchiseId: string,
    serviceId: string,
    hours: number,
    minutes: number
  ) {
    const edit = await this.franchiseRepo.editTime(
      franchiseId,
      serviceId,
      hours,
      minutes
    );

    if (edit) {
      return {
        status: 200,
        message: "Updated successfully",
      };
    } else {
      return {
        status: 400,
        message: "Failed to update",
      };
    }
  }
  async getBookings(franchiseId: string) {
    let bookings = await this.franchiseRepo.getBookings(franchiseId);

    if (bookings) {
      return {
        status: 200,
        data: bookings,
      };
    } else {
      return {
        status: 400,
        message: "Failed please try again!",
      };
    }
  }
  async getBooking(bookingId: string) {
    let booking = await this.franchiseRepo.getBooking(bookingId);

    if (booking) {
      return {
        status: 200,
        data: booking,
      };
    } else {
      return {
        status: 400,
        message: "Failed please try again!",
      };
    }
  }
  async changeStatus(bookingId: string, status: string) {
    let change = await this.franchiseRepo.changeStatus(bookingId, status);

    if (change) {
      return {
        status: 200,
        message: "updated successfully",
      };
    } else {
      return {
        status: 400,
        message: "failed,please try again",
      };
    }
  }
  async getService(Id: string) {
    const service = await this.franchiseRepo.getService(Id);

    return {
      status: 200,
      data: service,
    };
  }
  async getWeeklyReport(franchiseId: string) {
    let report = await this.franchiseRepo.getWeeklyData(franchiseId);

    if (report) {
      return {
        status: 200,
        data: report,
      }; 
    } else {
      return {
        status: 400,
        message: "failed please try again",
      }; 
    }
  }
  async getMonthlyReport(franchiseId: string) {
    let report = await this.franchiseRepo.getMonthlyData(franchiseId);

    if (report) {
      return {
        status: 200,
        data: report,
      };
    } else {
      return {
        status: 400,
        message: "failed please try again",
      };
    }
  }
  async getYearlyReport(franchiseId: string) {
    let report = await this.franchiseRepo.getYearlyData(franchiseId);

    if (report) { 
      return {
        status: 200,
        data: report,
      };
    } else {
      return {
        status: 400,
        message: "failed please try again",
      };
    }
  }
  async getStatics(franchiseId: string) {
    const currentDate = new Date();

    let totalcount = await this.franchiseRepo.getTotalBookings(franchiseId);

    if (totalcount) {
      let appointments = await this.franchiseRepo.getAppointments(
        franchiseId,
        currentDate
      );

      return {
        status: 200,
        data: {
          totalcount: totalcount,
          appointments: appointments,
        },
      };
    } else {
      return {
        status: 400,
        message: "Failed please try again",
      };
    }
  }
  async zegoToken(franchiseId: string) {

    const token = await this.franchiseRepo.zegoToken(franchiseId)

    if (token) {
      return {
        status: 200,
        data: token
      }
    } else {
      return {
        status: 400,
        message: "please try again"
      }
    }
  }
}

export default franchiseUseCase;
