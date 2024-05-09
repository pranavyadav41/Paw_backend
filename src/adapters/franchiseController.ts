import { Request, Response, NextFunction } from "express";
import FranchiseReqUsecase from "../useCase/Franchise/franchiseReqUsecase";

class FranchiseReq {
  private franchiseReqUsecase: FranchiseReqUsecase;
  constructor(franchiseReqUsecase: FranchiseReqUsecase) {
    this.franchiseReqUsecase = franchiseReqUsecase;
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
      next(error)
    }
  }
}

export default FranchiseReq;
