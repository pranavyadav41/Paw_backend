import ChatMessage from "../../domain/chat";


export default interface IChatMessageRepository {
    save(chatMessage: ChatMessage): Promise<ChatMessage>;
    findBySenderAndReceiver(sender: string, receiver: string): Promise<ChatMessage[]>;
    getUsers(franchiseId:string):Promise<string[]>;
    getUserName(userId:string):Promise<string | undefined>
  }