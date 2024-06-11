// src/repositories/ChatMessageRepository.ts
import  IChatMessageRepository  from '../../useCase/interface/chatRepo';
import ChatMessageModel from '../database/chatModel';
import ChatMessage  from '../../domain/chat';

export default class ChatMessageRepository implements IChatMessageRepository {
  async save(chatMessage: ChatMessage): Promise<ChatMessage> {
    const chatMessageDoc = new ChatMessageModel(chatMessage);
    await chatMessageDoc.save();
    return chatMessageDoc.toObject() as ChatMessage;
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
}
