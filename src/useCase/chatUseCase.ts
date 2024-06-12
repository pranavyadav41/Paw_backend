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
  async getUsers(franchiseId:string) {
    const users = await this.chatRepo.getUsers(franchiseId)

    let usernames=[]

    if(users){
      for(let id of users){

        let name=await this.chatRepo.getUserName(id)

        usernames.push({id:id,name:name})

      }

      return {
        status:200,
        data:usernames
      }
    }else{
      return {
        status:400,
        message:"failed please try again"
      }
    }
  }
}

export default chatUseCase;
