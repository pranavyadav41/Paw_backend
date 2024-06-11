import { Request, Response, NextFunction } from "express";
import ChatUseCase from "../useCase/chatUseCase";

export default  class chatController {
  private chatUseCase: ChatUseCase;

  constructor(chatUseCase: ChatUseCase) {
    this.chatUseCase = chatUseCase;
  }
  async createChatMessage(req: Request, res: Response,next:NextFunction): Promise<void> {
    const { sender, receiver, message } = req.body;
    try {
      const chatMessage = await this.chatUseCase.save({ sender, receiver, message, timestamp: new Date() });
      res.status(201).send(chatMessage);
    } catch (error) {
      next(error)
    }
  }

  async getChatMessages(req: Request, res: Response,next:NextFunction): Promise<void> {
    const { sender, receiver } = req.params;
    try {
      const messages = await this.chatUseCase.getMessages(sender, receiver);
      res.status(200).send(messages);
    } catch (error) {
      next(error)
    }
  }
}
