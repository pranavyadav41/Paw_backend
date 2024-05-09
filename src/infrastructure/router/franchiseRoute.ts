import express from "express";
import FranchiseReqRepository from "../repository/Franchise/franchiseReqRepository";
import FranchiseReqUsecase from "../../useCase/Franchise/franchiseReqUsecase";
import FranchiseReq from "../../adapters/franchiseController";
import EncryptPassword from "../services/bcryptPassword";
import errorHandle from "../middleware/errorHandle";

//services
const encrypt = new EncryptPassword();

//repository
const franchiseReqRepository = new FranchiseReqRepository();

//useCase
const franchiseReqUsecase = new FranchiseReqUsecase(
  franchiseReqRepository,
  encrypt
);

//Controller
const franchiseReqController = new FranchiseReq(franchiseReqUsecase);

const route = express.Router();

route.post("/register", (req, res,next) =>
  franchiseReqController.verifyRequest(req, res,next)
);

route.use(errorHandle)

export default route;
