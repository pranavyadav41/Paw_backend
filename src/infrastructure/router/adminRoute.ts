import express from 'express'
import AdminController from '../../adapters/adminController'
import AdminUseCase from '../../useCase/adminUsecse'
import AdminRepository from '../repository/adminRepository'
import FranchiseRepository from '../repository/Franchise/franchiseRepository'
import CouponRepository from '../repository/couponRepository'
import SendMail from '../services/sendEmail'
import errorHandle from '../middleware/errorHandle'
import { adminAuth } from '../middleware/adminAuth'
 
//repository
const adminRepository = new AdminRepository()
const franchiseRepository=new FranchiseRepository()
const couponRepository = new CouponRepository()

//services
const sendMail=new SendMail()

//useCase
const adminUsecse=new AdminUseCase(adminRepository,franchiseRepository,couponRepository)

//adminController
const adminController=new AdminController(adminUsecse,sendMail)

const route=express.Router()

route.get('/users',adminAuth,(req,res,next)=>adminController.getUsers(req,res,next))
route.post('/blockUser',adminAuth,(req,res,next)=>adminController.blockUser(req,res,next))
route.post('/unBlockUser',adminAuth,(req,res,next)=>adminController.unBlockUser(req,res,next))
route.get('/getRequests',adminAuth,(req,res,next)=>adminController.getFranchiseRequests(req,res,next))
route.post('/approveRequest',adminAuth,(req,res,next)=>adminController.approveFranchise(req,res,next))
route.post('/rejectRequest',adminAuth,(req,res,next)=>adminController.rejectFranchise(req,res,next))
route.get('/getFranchisesData',adminAuth,(req,res,next)=>adminController.getFranchisesData(req,res,next))
route.get('/getFranchises',adminAuth,(req,res,next)=>adminController.getFranchises(req,res,next))
route.post('/blockFranchise',adminAuth,(req,res,next)=>adminController.blockFranchise(req,res,next))
route.post('/unBlockFranchise',adminAuth,(req,res,next)=>adminController.unBlockFranchise(req,res,next))
route.post('/addService',adminAuth,(req,res,next)=>adminController.addService(req,res,next))
route.post('/editService',adminAuth,(req,res,next)=>adminController.editService(req,res,next))
route.post('/deleteService',adminAuth,(req,res,next)=>adminController.deleteService(req,res,next))
route.get('/getServices',(req,res,next)=>adminController.getServices(req,res,next))
route.post('/addCoupon',adminAuth,(req,res,next)=>adminController.addCoupon(req,res,next))
route.get('/getCoupons',adminAuth,(req,res,next)=>adminController.getCoupons(req,res,next))
route.post('/editCoupon',adminAuth,(req,res,next)=>adminController.editCoupon(req,res,next))
route.post('/deleteCoupon',adminAuth,(req,res,next)=>adminController.removeCoupon(req,res,next))
route.get('/weeklyReport',adminAuth,(req,res,next)=>adminController.getWeeklyReport(req,res,next))
route.get('/monthlyReport',adminAuth,(req,res,next)=>adminController.getMonthlyReport(req,res,next))
route.get('/yearlyReport',adminAuth,(req,res,next)=>adminController.getYearlyReport(req,res,next))
route.post('/franchiseweeklyReport',adminAuth,(req,res,next)=>adminController.franchiseWeeklyReport(req,res,next))
route.post('/franchisemonthlyReport',adminAuth,(req,res,next)=>adminController.franchiseMonthlyReport(req,res,next))
route.post('/franchiseyearlyReport',adminAuth,(req,res,next)=>adminController.franchiseYearlyReport(req,res,next))
route.get('/getStats',adminAuth,(req,res,next)=>adminController.getStats(req,res,next))
route.post('/franchiseStats',adminAuth,(req,res,next)=>adminController.franchiseStats(req,res,next))

route.use(errorHandle)
  
export default route