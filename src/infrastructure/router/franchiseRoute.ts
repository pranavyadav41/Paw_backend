import express from "express";
import FranchiseReqRepository from "../repository/Franchise/franchiseReqRepository";
import FranchiseRepo from "../repository/Franchise/franchiseRepository";
import FranchiseReqUsecase from "../../useCase/Franchise/franchiseReqUsecase";
import FranchiseUseCase from "../../useCase/Franchise/franchiseUsecase";
import FranchiseReq from "../../adapters/franchiseController";
import EncryptPassword from "../services/bcryptPassword";
import JWT from "../services/generateToken"
import errorHandle from "../middleware/errorHandle";

//services
const encrypt = new EncryptPassword();
const jwt  =new JWT();

//repository
const franchiseReqRepository = new FranchiseReqRepository();
const franchiseRepo = new FranchiseRepo()

//useCase
const franchiseReqUsecase = new FranchiseReqUsecase(franchiseReqRepository,encrypt);
const franchiseUsecase = new FranchiseUseCase(franchiseRepo,encrypt,jwt)

//Controller
const franchiseController = new FranchiseReq(franchiseReqUsecase,franchiseUsecase);

const route = express.Router();

route.post("/register", (req, res,next) =>franchiseController.verifyRequest(req, res,next));
route.post("/login",(req,res,next)=>franchiseController.login(req,res,next))
route.post("/verifyEmail",(req,res,next)=>franchiseController)
route.post("/resetPassword",(req,res,next)=>franchiseController)
route.post("/resendOtp",(req,res,next)=>franchiseController)
route.use(errorHandle)

export default route;
