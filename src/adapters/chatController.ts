import { Request, Response, NextFunction } from "express";
import ChatUseCase from "../useCase/chatUseCase";

export default class chatController {
  private chatUseCase: ChatUseCase;

  constructor(chatUseCase: ChatUseCase) {
    this.chatUseCase = chatUseCase;
  }
  async createChatMessage(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const { sender, receiver, message, fileType } = req.body;
    const file = req.file;
  
    try {
      let fileName, fileData;
  
      if (file) {
        fileName = file.originalname;
        fileData = file.buffer;
      }
  
      const chatMessage = await this.chatUseCase.save({
        sender,
        receiver,
        message,
        timestamp: new Date(),
        fileType,
        fileName,
        fileData
      });
  
      res.status(201).send(chatMessage);
    } catch (error) {
      next(error);
    }
  }

  async getChatMessages(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const { sender, receiver } = req.params;
    try {
      const messages = await this.chatUseCase.getMessages(sender, receiver);
      res.status(200).send(messages);
    } catch (error) {
      next(error);
    }
  }
  async getUsers(req: Request, res: Response, next: NextFunction) {
    const { franchiseId } = req.body;

    try {
      const users = await this.chatUseCase.getUsers(franchiseId);

      if (users.status == 200) {
        return res.status(users.status).json(users.data);
      } else if (users.status == 400) {
        return res.status(users.status).json({ message: users.message });
      }
    } catch (error) {
      next(error);
    }
  }
}
