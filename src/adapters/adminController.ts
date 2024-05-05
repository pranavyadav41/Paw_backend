import { Request, Response, response } from "express";
import adminUseCase from "../useCase/adminUsecse";

class adminController {
  private AdminUseCase: adminUseCase;

  constructor(AdminUsecase: adminUseCase) {
    this.AdminUseCase = AdminUsecase;
  }

  async getUsers(req: Request, res: Response) {
    try {
      const users = await this.AdminUseCase.getUsers();

      if (users.status == 200) {
        res.status(users.status).json(users);
      } else {
        res.status(users.status).json(users.message);
      }
    } catch (error) {
      const err: Error = error as Error;
      res.status(400).json({
        message: err.message,
      });
    }
  }
  async blockUser(req:Request,res:Response) {
    try {
        const result=await this.AdminUseCase.blockUser(req.body.userId);

        if(result.status==200){
            res.status(result.status).json(result.data.message)
        }else{
            res.status(result.status).json(result.data.message)
        }
        
    } catch (error) {
        const err: Error = error as Error;
      res.status(400).json({
        message: err.message,
      });
        
    }
  }
  async unBlockUser(req:Request,res:Response){
    try {
        const result=await this.AdminUseCase.unBlockUser(req.body.userId);

        if(result.status==200){
            res.status(result.status).json(result.data.message)
        }else{
            res.status(result.status).json(result.data.message)
        }
        
    } catch (error) {
        const err: Error = error as Error;
      res.status(400).json({
        message: err.message,
      });
        
    }
  }
}

export default adminController;
