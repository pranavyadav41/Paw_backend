// src/repositories/ChatMessageRepository.ts
import  IChatMessageRepository  from '../../useCase/interface/chatRepo';
import ChatMessageModel from '../database/chatModel';
import UserModel from '../database/userModel';
import ChatMessage  from '../../domain/chat';
import { chat } from '../../domain/chat';

export default class ChatMessageRepository implements IChatMessageRepository {
  async save(chatMessage: chat): Promise<chat> {
    const chatMessageDoc = new ChatMessageModel(chatMessage);
    await chatMessageDoc.save();
    return chatMessageDoc.toObject() as chat;
  }

  async findBySenderAndReceiver(sender: string, receiver: string): Promise<ChatMessage[]> {
    const messages = await ChatMessageModel.find({
      $or: [
        { sender, receiver },
        { sender: receiver, receiver: sender }
      ]
    }).sort('timestamp');
    return messages.map(msg => msg.toObject() as ChatMessage);
  }
  async getUsers(franchiseId: string): Promise<string[]> {
      const users = await ChatMessageModel.distinct("sender", {
        receiver: franchiseId,
      });
      return users; 
   
  }
  async  getUserName(userId: string): Promise<string | undefined> {
    const user = await UserModel.findById(userId, 'name').exec();

    return user?.name
    
  }
  
}
