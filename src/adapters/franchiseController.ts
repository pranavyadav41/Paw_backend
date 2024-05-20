import { Request, Response, NextFunction } from "express";
import FranchiseReqUsecase from "../useCase/Franchise/franchiseReqUsecase";
import FranchiseUseCase from "../useCase/Franchise/franchiseUsecase";

class FranchiseController {
  private franchiseReqUsecase: FranchiseReqUsecase;
  private franchiseUsecase: FranchiseUseCase;
  constructor(
    franchiseReqUsecase: FranchiseReqUsecase,
    franchiseUsecase: FranchiseUseCase
  ) {
    this.franchiseReqUsecase = franchiseReqUsecase;
    this.franchiseUsecase = franchiseUsecase;
  }

  async verifyRequest(req: Request, res: Response, next: NextFunction) {
    try {
      const verify = await this.franchiseReqUsecase.verify(req.body.email);

      if (verify.data.status == true) {
        const save = await this.franchiseReqUsecase.saveReq(req.body);
        if (save) {
          return res.status(save.status).json(save.data);
        }
      }

      return res.status(verify.status).json(verify.data);
    } catch (error) {
      next(error);
    }
  }
  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;

      const login = await this.franchiseUsecase.login(email, password);

      if (login) {
        return res.status(login.status).json(login.data);
      }
    } catch (error) {
      next(error);
    }
  }
}

export default FranchiseController;
