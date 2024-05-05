import express from 'express'
import AdminController from '../../adapters/adminController'
import AdminUseCase from '../../useCase/adminUsecse'
import AdminRepository from '../repository/adminRepository'

//repository
const adminRepository = new AdminRepository()

//useCase
const adminUsecse=new AdminUseCase(adminRepository)

//adminController
const adminController=new AdminController(adminUsecse)

const route=express.Router()

route.get('/users',(req,res)=>adminController.getUsers(req,res))
route.post('/blockUser',(req,res)=>adminController.blockUser(req,res))
route.post('/unBlockUser',(req,res)=>adminController.unBlockUser(req,res))
export default route