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
route.post("/getProfile",(req,res,next)=>franchiseController.getProfile(req,res,next));
route.post("/updateProfile",(req,res,next)=>franchiseController.updateProfile(req,res,next));
route.post("/updateAddress",(req,res,next)=>franchiseController.updateAddress(req,res,next));
route.post("/updatePassword",(req,res,next)=>franchiseController.updatePassword(req,res,next));
route.post("/addService",(req,res,next)=>franchiseController.addService(req,res,next));
route.post("/deleteService",(req,res,next)=>franchiseController.deleteService(req,res,next));
route.post("/setTime",(req,res,next)=>franchiseController.setTime(req,res,next));
route.post("/editTime",(req,res,next)=>franchiseController.editTime(req,res,next))
route.use(errorHandle)

export default route; 
 