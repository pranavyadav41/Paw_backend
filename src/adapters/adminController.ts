import { Request, Response, NextFunction } from "express";
import adminUseCase from "../useCase/adminUsecse";
import franchise from "../domain/franchise";
import sendMail from "../useCase/interface/nodemailerInterface";

class adminController {
  private AdminUseCase: adminUseCase;
  private SendMail: sendMail;

  constructor(AdminUsecase: adminUseCase, SendMail: sendMail) {
    this.AdminUseCase = AdminUsecase;
    this.SendMail = SendMail;
  }

  async getUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const searchTerm = req.query.search as string || '';

      const users = await this.AdminUseCase.getUsers(page, limit, searchTerm);

      if (users.status == 200) {
        return res.status(users.status).json(users);
      } else {
        return res.status(users.status).json(users.message);
      }
    } catch (error) {
      next(error);
    }
  }
  async blockUser(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await this.AdminUseCase.blockUser(req.body.userId);

      if (result.status == 200) {
        return res.status(result.status).json(result.data.message);
      } else {
        return res.status(result.status).json(result.data.message);
      }
    } catch (error) {
      next(error);
    }
  }
  async unBlockUser(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await this.AdminUseCase.unBlockUser(req.body.userId);

      if (result.status == 200) {
        return res.status(result.status).json(result.data.message);
      } else {
        return res.status(result.status).json(result.data.message);
      }
    } catch (error) {
      next(error);
    }
  }
  async getFranchiseRequests(req: Request, res: Response, next: NextFunction) {
    try {
      const requests = await this.AdminUseCase.getRequests();

      if (requests.status == 200) {
        return res.status(requests.status).json(requests.data);
      } else {
        return res.status(requests.status).json(requests.message);
      }
    } catch (error) {
      next(error);
    }
  }
  async approveFranchise(req: Request, res: Response, next: NextFunction) {
    try {
      const approve = await this.AdminUseCase.approveFranchise(req.body.reqId);

      if (approve?.status == 401) {
        return res
          .status(approve.status)
          .json({ message: approve.data.message });
      }

      if (approve?.status == 200) {
        const dataWithDetails = approve.data as {
          status: boolean;
          message: string;
          details: franchise;
        };
        this.SendMail.sendConfirmation(dataWithDetails.details.email);
        return res.status(approve.status).json(approve.data.message);
      }
    } catch (error) {
      next(error);
    }
  }
  async rejectFranchise(req: Request, res: Response, next: NextFunction) {
    try {
      const reject: any = await this.AdminUseCase.rejectFranchise(
        req.body.reqId
      );

      if (reject.status == 200) {
        this.SendMail.sendRejection(reject.data.email, req.body.reason);

        return res.status(reject.status).json({ message: reject.data.message });
      }
    } catch (error) {
      next(error);
    }
  }
  async getFranchisesData(req:Request,res:Response,next:NextFunction){
    try {
      const data = await this.AdminUseCase.getFranchisesData()

      if(data.status==200){
        return res.status(data.status).json(data.data)
      }else if(data.status==400){
        return res.status(data.status).json(data.message)
      }
    } catch (error) {
      
    }
  }
  async getFranchises(req: Request, res: Response, next: NextFunction) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const searchTerm = req.query.search as string || '';
  
      const franchises = await this.AdminUseCase.getFranchises(page, limit, searchTerm);
      
      if (franchises) {
        if (franchises.status == 200) {
          return res.status(franchises.status).json(franchises);
        }
        return res.status(franchises.status).json({ message: franchises.message });
      }
    } catch (error) {
      next(error);
    }
  }
  async blockFranchise(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await this.AdminUseCase.blockFranchise(
        req.body.franchiseId
      );
      if (result) {
        return res.status(result.status).json(result.data.message);
      }
    } catch (error) {
      next(error);
    }
  }
  async unBlockFranchise(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await this.AdminUseCase.unBlockFranchise(
        req.body.franchiseId
      );
      if (result) {
        return res.status(result.status).json(result.data.message);
      }
    } catch (error) {
      next(error);
    }
  }
  async addService(req: Request, res: Response, next: NextFunction) {
    try {
      const save = await this.AdminUseCase.addService(req.body.service);

      if (save) {
        return res.status(save.status).json({ message: save.data.message });
      }
    } catch (error) {
      next(error);
    }
  }
  async editService(req: Request, res: Response, next: NextFunction) {
    try {
      const edit = await this.AdminUseCase.editService(req.body.updatedService);

      if (edit) {
        return res.status(edit.status).json(edit.data.message);
      }
    } catch (error) {
      next(error);
    }
  }
  async deleteService(req: Request, res: Response, next: NextFunction) {
    try {
      const deleteService = await this.AdminUseCase.deleteService(
        req.body.serviceId
      );

      if (deleteService) {
        return res
          .status(deleteService.status)
          .json(deleteService.data.message);
      }
    } catch (error) {
      next(error);
    }
  }
  async getServices(req: Request, res: Response, next: NextFunction) {
    try {
      const services = await this.AdminUseCase.getServices();

      if (services.status == 200) {
        return res.status(services.status).json(services.data);
      }

      return res.status(services.status).json({ message: services.message });
    } catch (error) {
      next(error);
    }
  }
  async addCoupon(req: Request, res: Response, next: NextFunction) {
    try {
      const { coupon } = req.body;
      const save = await this.AdminUseCase.addCoupon(coupon);

      if (save) {
        return res.status(save.status).json({ message: save.message });
      }
    } catch (error) { }
  }
  async getCoupons(req: Request, res: Response, next: NextFunction) {
    try {
      const coupons = await this.AdminUseCase.getCoupons();

      if (coupons) {
        return res.status(coupons.status).json(coupons.data);
      }
    } catch (error) { }
  }
  async editCoupon(req: Request, res: Response, next: NextFunction) {
    try {
      const { Id, data } = req.body;
      const edit = await this.AdminUseCase.editCoupon(Id, data);

      if (edit) {
        return res.status(edit.status).json({ message: edit.message });
      }
    } catch (error) {
      next(error);
    }
  }
  async removeCoupon(req: Request, res: Response, next: NextFunction) {
    try {
      const { Id } = req.body;
      const deleted = await this.AdminUseCase.removeCoupon(Id);

      if (deleted) {
        return res.status(deleted.status).json({ message: deleted.message });
      }
    } catch (error) {
      next(error);
    }
  }
  async getWeeklyReport(req: Request, res: Response, next: NextFunction) {
    try {
      let report = await this.AdminUseCase.getWeeklyReport();

      if (report.status == 200) {
        return res.status(report.status).json(report.data);
      } else {
        return res.status(report.status).json({ message: report.message });
      }
    } catch (error) {
      next(error);
    }
  }
  async getMonthlyReport(req: Request, res: Response, next: NextFunction) {
    try {
      let report = await this.AdminUseCase.getMonthlyReport();

      if (report.status == 200) {
        return res.status(report.status).json(report.data);
      } else {
        return res.status(report.status).json({ message: report.message });
      }
    } catch (error) {
      next(error);
    }
  }
  async getYearlyReport(req: Request, res: Response, next: NextFunction) {
    try {
      let report = await this.AdminUseCase.getYearlyReport();

      if (report.status == 200) {
        return res.status(report.status).json(report.data);
      } else {
        return res.status(report.status).json({ message: report.message });
      }
    } catch (error) {
      next(error);
    }
  }
  async getStats(req: Request, res: Response, next: NextFunction) {
    try {
      let data = await this.AdminUseCase.getStats();

      if (data.status == 200) {
        return res.status(data.status).json(data.data);
      } else if (data.status == 400) {
        return res.status(data.status).json({ message: data.message });
      }
    } catch (error) {
      next(error);
    }
  }
  async franchiseWeeklyReport(req: Request, res: Response, next: NextFunction) {
    try {
      const { franchiseId } = req.body;
      let report = await this.AdminUseCase.franchiseWeeklyReport(franchiseId);

      if (report.status == 200) {
        return res.status(report.status).json(report.data);
      } else {
        return res.status(report.status).json({ message: report.message });
      }
    } catch (error) {
      next(error);
    }
  }
  async franchiseMonthlyReport(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { franchiseId } = req.body;
      let report = await this.AdminUseCase.franchiseMonthlyReport(franchiseId);

      if (report.status == 200) {
        return res.status(report.status).json(report.data);
      } else {
        return res.status(report.status).json({ message: report.message });
      }
    } catch (error) {
      next(error);
    }
  }
  async franchiseYearlyReport(req: Request, res: Response, next: NextFunction) {
    try {
      const { franchiseId } = req.body;
      let report = await this.AdminUseCase.franchiseYearlyReport(franchiseId);

      if (report.status == 200) {
        return res.status(report.status).json(report.data);
      } else {
        return res.status(report.status).json({ message: report.message });
      }
    } catch (error) {
      next(error);
    }
  }
  async franchiseStats(req: Request, res: Response, next: NextFunction) {
    try {
      const { franchiseId } = req.body;
      let stats = await this.AdminUseCase.franchiseStats(franchiseId);

      if (stats.status == 200) {
        return res.status(stats.status).json(stats.data);
      } else if (stats.status == 400) {
        return res.status(stats.status).json({ message: stats.message });
      }
    } catch (error) {
      next(error);
    }
  }
}

export default adminController;
