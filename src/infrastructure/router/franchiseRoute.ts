import express from "express";
import FranchiseReqRepository from "../repository/Franchise/franchiseReqRepository";
import FranchiseRepo from "../repository/Franchise/franchiseRepository";
import FranchiseReqUsecase from "../../useCase/Franchise/franchiseReqUsecase";
import FranchiseUseCase from "../../useCase/Franchise/franchiseUsecase";
import FranchiseReq from "../../adapters/franchiseController";
import EncryptPassword from "../services/bcryptPassword";
import JWT from "../services/generateToken"
import GenerateOtp from '../services/generateOtp';
import sendOtp from '../services/sendEmail';
import { franchiseAuth } from "../middleware/franchiseAuth";
import errorHandle from "../middleware/errorHandle";

//services
const encrypt = new EncryptPassword();
const jwt  =new JWT();
const generateOtp=new GenerateOtp() 
const generateEmail=new sendOtp()

//repository
const franchiseReqRepository = new FranchiseReqRepository();
const franchiseRepo = new FranchiseRepo()

//useCase
const franchiseReqUsecase = new FranchiseReqUsecase(franchiseReqRepository,encrypt);
const franchiseUsecase = new FranchiseUseCase(franchiseRepo,encrypt,jwt)

//Controller
const franchiseController = new FranchiseReq(franchiseReqUsecase,franchiseUsecase,generateOtp,generateEmail);

const route = express.Router(); 

route.post("/register", (req, res,next) =>franchiseController.verifyRequest(req, res,next));
route.post("/login",(req,res,next)=>franchiseController.login(req,res,next));
route.post("/verify",(req,res,next)=>franchiseController.verifyOtp(req,res,next));
route.post("/verifyEmail",(req,res,next)=>franchiseController.forgotPassword(req,res,next));
route.post("/resetPassword",(req,res,next)=>franchiseController.resetPassword(req,res,next));
route.post("/resendOtp",(req,res,next)=>franchiseController.resendOtp(req,res,next));
route.post("/getProfile",franchiseAuth,(req,res,next)=>franchiseController.getProfile(req,res,next));
route.post("/updateProfile",franchiseAuth,(req,res,next)=>franchiseController.updateProfile(req,res,next));
route.post("/updatePassword",franchiseAuth,(req,res,next)=>franchiseController.updatePassword(req,res,next));
route.post("/addService",franchiseAuth,(req,res,next)=>franchiseController.addService(req,res,next));
route.post("/deleteService",franchiseAuth,(req,res,next)=>franchiseController.deleteService(req,res,next));
route.post("/setTime",franchiseAuth,(req,res,next)=>franchiseController.setTime(req,res,next));
route.post("/editTime",franchiseAuth,(req,res,next)=>franchiseController.editTime(req,res,next))
route.post('/getbookings/:franchiseId',franchiseAuth,(req,res,next)=>franchiseController.getBookings(req,res,next))
route.get('/getBooking/:id',franchiseAuth,(req,res,next)=>franchiseController.getBooking(req,res,next))
route.post('/changeStatus',franchiseAuth,(req,res,next)=>franchiseController.changeStatus(req,res,next))
route.post('/getService',franchiseAuth,(req,res,next)=>franchiseController.getService(req,res,next))
route.post('/weeklyReport',franchiseAuth,(req,res,next)=>franchiseController.getWeeklyReport(req,res,next))
route.post('/monthlyReport',franchiseAuth,(req,res,next)=>franchiseController.getMonthlyReport(req,res,next))
route.post('/yearlyReport',franchiseAuth,(req,res,next)=>franchiseController.getYearlyReport(req,res,next))
route.post('/getStats',franchiseAuth,(req,res,next)=>franchiseController.getStats(req,res,next))
route.post('/zegoToken',franchiseAuth,(req,res,next)=>franchiseController.zegoToken(req,res,next))

route.use(errorHandle)

export default route; 
 