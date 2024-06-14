import express from 'express'
import ChatUseCase from '../../useCase/chatUseCase';
import ChatMessageRepository from '../repository/chatRepository';
import ChatController from '../../adapters/chatController';
import S3Uploader from '../services/s3Bucket';
import errorHandle from '../middleware/errorHandle';
import { upload } from '../middleware/multer';


//services
const s3Bucket = new S3Uploader()

//repository
const chatRepo = new ChatMessageRepository()

//Usecase
const chatUseCase = new ChatUseCase(chatRepo,s3Bucket)

//Controller
const chatController = new ChatController(chatUseCase)

const route=express.Router()

route.post('/chat',upload.single('file'),(req, res,next) => chatController.createChatMessage(req, res,next));
route.get('/chat/:sender/:receiver', (req, res,next) => chatController.getChatMessages(req, res,next));
route.post('/getUsers',(req,res,next) =>chatController.getUsers(req,res,next))


route.use(errorHandle)
 

export default route