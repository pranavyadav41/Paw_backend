import express from 'express'
import AdminController from '../../adapters/adminController'
import AdminUseCase from '../../useCase/adminUsecse'
import AdminRepository from '../repository/adminRepository'
import FranchiseRepository from '../repository/Franchise/franchiseRepository'
import SendMail from '../services/sendEmail'
import errorHandle from '../middleware/errorHandle'
import { adminAuth } from '../middleware/adminAuth'

//repository
const adminRepository = new AdminRepository()
const franchiseRepository=new FranchiseRepository()

//services
const sendMail=new SendMail()

//useCase
const adminUsecse=new AdminUseCase(adminRepository,franchiseRepository)

//adminController
const adminController=new AdminController(adminUsecse,sendMail)

const route=express.Router()

route.get('/users',(req,res,next)=>adminController.getUsers(req,res,next))
route.post('/blockUser',adminAuth,(req,res,next)=>adminController.blockUser(req,res,next))
route.post('/unBlockUser',(req,res,next)=>adminController.unBlockUser(req,res,next))
route.get('/getRequests',(req,res,next)=>adminController.getFranchiseRequests(req,res,next))
route.post('/approveRequest',(req,res,next)=>adminController.approveFranchise(req,res,next))
route.post('/rejectRequest',(req,res,next)=>adminController.rejectFranchise(req,res,next))
route.get('/getFranchises',(req,res,next)=>adminController.getFranchises(req,res,next))
route.post('/blockFranchise',(req,res,next)=>adminController.blockFranchise(req,res,next))
route.post('/unBlockFranchise',(req,res,next)=>adminController.unBlockFranchise(req,res,next))
route.post('/addService',(req,res,next)=>adminController.addService(req,res,next))
route.post('/editService',(req,res,next)=>adminController.editService(req,res,next))
route.post('/deleteService',(req,res,next)=>adminController.deleteService(req,res,next))

route.use(errorHandle)

export default route