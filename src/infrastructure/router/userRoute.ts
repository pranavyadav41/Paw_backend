import express from 'express'
import UserRepository from '../repository/userRepository';
import UserUseCase from '../../useCase/userUsecase';
import UserController from '../../adapters/userController';
import GenerateOtp from '../services/generateOtp';
import sendOtp from '../services/sendEmail';
import EncryptPassword from '../services/bcryptPassword';
import JWTToken from '../services/generateToken';
import { userAuth } from '../middleware/userAuth';
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
route.get('/service/:id',(req,res,next)=>userController.getService(req,res,next))
route.post('/editProfile',userAuth,(req,res,next)=>userController.updateProfile(req,res,next))
route.post('/getProfile',userAuth,(req,res,next)=>userController.getProfile(req,res,next))
route.post('/changePassword',userAuth,(req,res,next)=>userController.updatePassword(req,res,next))



//Booking

import BookingRepository from '../repository/bookingRepository';
import BookingUseCase from '../../useCase/bookingUseCase';
import BookingController from '../../adapters/bookingController';

const bookingRepo=new BookingRepository()
const bookingUseCase = new BookingUseCase(bookingRepo)
const bookingController = new BookingController(bookingUseCase)

route.post('/bookingService',(req,res,next)=>bookingController.findNearestFranchise(req,res,next))
route.post('/confirmBooking',(req,res,next)=>bookingController.confirmBooking(req,res,next))

route.use(errorHandle)

 



















export default route




