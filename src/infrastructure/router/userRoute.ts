import express from 'express'
import UserRepository from '../repository/userRepository';
import UserUseCase from '../../useCase/userUsecase';
import UserController from '../../adapters/userController';
import GenerateOtp from '../services/generateOtp';
import sendOtp from '../services/sendEmail';
import EncryptPassword from '../services/bcryptPassword';
import JWTToken from '../services/generateToken';
import errorHandle from '../middleware/errorHandle';


//services
 
const generateOtp=new GenerateOtp() 
const generateEmail=new sendOtp()
const encryptPassword=new EncryptPassword()
const jwtToken=new JWTToken()

//repositories
const userRepository=new UserRepository() 

//useCases
const userCase = new UserUseCase(userRepository,encryptPassword,jwtToken)
//controllers
const userController=new UserController(userCase,generateOtp,generateEmail)

const route = express.Router();


route.post('/sign_up',(req,res,next)=>userController.signUp(req,res,next))
route.post('/verify',(req,res,next)=>userController.verifyOtp(req,res,next))
route.post('/login',(req,res,next)=>userController.login(req,res,next))
route.post('/verifyEmail',(req,res,next)=>userController.forgotPassword(req,res,next))
route.post('/resetPassword',(req,res,next)=>userController.resetPassword(req,res,next))
route.post('/resendOtp',(req,res,next)=>userController.resendOtp(req,res,next))

route.use(errorHandle)





















export default route




