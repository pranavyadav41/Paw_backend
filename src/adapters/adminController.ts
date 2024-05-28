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
      const users = await this.AdminUseCase.getUsers();

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
  async getFranchises(req: Request, res: Response, next: NextFunction) {
    try {
      const franchises = await this.AdminUseCase.getFranchises();
      if (franchises) {
        if (franchises.status == 200) {
          return res.status(franchises.status).json(franchises.data);
        }
        return res.status(franchises.status).json(franchises.message);
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
}

export default adminController;
