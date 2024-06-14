import ChatMessage from "../../domain/chat";
import { chat } from "../../domain/chat";


export default interface IChatMessageRepository {
    save(chatMessage: chat): Promise<chat>;
    findBySenderAndReceiver(sender: string, receiver: string): Promise<ChatMessage[]>;
    getUsers(franchiseId:string):Promise<string[]>;
    getUserName(userId:string):Promise<string | undefined>
  }