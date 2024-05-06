import express from 'express'
import UserRepository from '../repository/userRepository';
import UserUseCase from '../../useCase/userUsecase';
import UserController from '../../adapters/userController';
import GenerateOtp from '../services/generateOtp';
import sendOtp from '../services/sendEmail';
import EncryptPassword from '../services/bcryptPassword';
import JWTToken from '../services/generateToken';


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


route.post('/sign_up',(req,res)=>userController.signUp(req,res))
route.post('/verify',(req,res)=>userController.verifyOtp(req,res))
route.post('/login',(req,res)=>userController.login(req,res))
route.post('/verifyEmail',(req,res)=>userController.forgotPassword(req,res))
route.post('/resetPassword',(req,res)=>userController.resetPassword(req,res))





















export default route




