import IChatMessageRepository from "./interface/chatRepo";
import ChatMessage from "../domain/chat";

class chatUseCase {
  private chatRepo: IChatMessageRepository;

  constructor(chatRepo: IChatMessageRepository) {
    this.chatRepo = chatRepo;
  }

  async   save(chatMessage: ChatMessage): Promise<any> {
    try {
      return await this.chatRepo.save(chatMessage);
    } catch (error) {

      console.log(error)
      
    }
  }

  async getMessages(sender: string, receiver: string): Promise<ChatMessage[]> {
    return await this.chatRepo.findBySenderAndReceiver(sender, receiver);
  }
}

export default chatUseCase;
