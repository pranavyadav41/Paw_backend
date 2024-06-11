import express from 'express'
import ChatUseCase from '../../useCase/chatUseCase';
import ChatMessageRepository from '../repository/chatRepository';
import ChatController from '../../adapters/chatController';
import errorHandle from '../middleware/errorHandle';


//repository
const chatRepo = new ChatMessageRepository()

//Usecase
const chatUseCase = new ChatUseCase(chatRepo)

//Controller
const chatController = new ChatController(chatUseCase)

const route=express.Router()

route.post('/chat', (req, res,next) => chatController.createChatMessage(req, res,next));
route.get('/chat/:sender/:receiver', (req, res,next) => chatController.getChatMessages(req, res,next));


route.use(errorHandle)
 

export default route