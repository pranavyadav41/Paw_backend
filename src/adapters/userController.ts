import { Request,Response } from "express";
import UserUseCase from "../useCase/userUsecase"
import asyncHandler from "express-async-handler"
import GenerateOtp from "../infrastructure/services/generateOtp";
import sendOtp from "../infrastructure/services/sendEmail";


class userController{
    private userUseCase:UserUseCase
    private generateOtp:GenerateOtp
    private generateEmail:sendOtp

    constructor(userUseCase:UserUseCase,generateOtp:GenerateOtp,generateEmail:sendOtp){
        this.userUseCase=userUseCase
        this.generateOtp=generateOtp
        this.generateEmail=generateEmail
    }

    async signUp(req:Request,res:Response){
        try {

           console.log("iam here")
           console.log(req.body)

           const verifyUser = await this.userUseCase.signup(req.body.email)

           if(verifyUser.data.status==true){
            req.app.locals.userData = req.body
            const otp=this.generateOtp.createOtp()
            req.app.locals.otp=otp
            this.generateEmail.sendMail(req.body.name,req.body.email,otp)
            console.log(otp)

            setTimeout(()=>{
                req.app.locals.otp=this.generateOtp.createOtp()
            },2*60000)

            res.status(verifyUser.status).json(verifyUser.data)
           }else{
            res.status(verifyUser.status).json(verifyUser.data)
           }
            
        } catch (error) {
            const err: Error = error as Error;
            res.status(400).json({
              message: err.message,
              stack: process.env.NODE_ENV === "production" ? null : err.stack,
            });
            console.log("iam stack", err.stack, "---", "iam message", err.message);
          }
            
        }
    }

export default userController