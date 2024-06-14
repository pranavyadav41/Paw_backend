import IChatMessageRepository from "./interface/chatRepo";
import ChatMessage from "../domain/chat";
import S3Uploader from "../infrastructure/services/s3Bucket";

class chatUseCase {
  private chatRepo: IChatMessageRepository;
  private s3Bucket: S3Uploader;

  constructor(chatRepo: IChatMessageRepository, s3Bucket: S3Uploader) {
    this.chatRepo = chatRepo;
    this.s3Bucket = s3Bucket;
  }

  async save(chatMessage: ChatMessage): Promise<any> {
    if (chatMessage.fileData) {
      let upload = await this.s3Bucket.uploadFile(chatMessage.fileData,chatMessage.fileName);

      if (upload) {
        let message = {
          sender: chatMessage.sender,
          receiver: chatMessage.receiver,
          contentType: chatMessage.fileType,
          content: upload,
          timestamp: chatMessage.timestamp,
        };

        let save = await this.chatRepo.save(message);
      }
    } else {
      let message = {
        sender: chatMessage.sender,
        receiver: chatMessage.receiver,
        contentType: "text",
        content: chatMessage.message,
        timestamp: chatMessage.timestamp,
      };
      let save = await this.chatRepo.save(message);
    }
  }

  async getMessages(sender: string, receiver: string) {
    let messages =  await this.chatRepo.findBySenderAndReceiver(sender, receiver);

    const processedMessages = await Promise.all(messages.map(async (message:any) => {
      if (message.contentType === 'file' || message.contentType=== "photo") {
        try {
          const fileUrl = await this.s3Bucket.retrieveFile(message.content);
          return { ...message, content: fileUrl };
        } catch (error) {
          console.error(`Error retrieving file URL for message ${message._id}:`, error);
          return message;
        }
      }
      return message;
    }));

    return processedMessages;
  }
  async getUsers(franchiseId: string) {
    const users = await this.chatRepo.getUsers(franchiseId);

    let usernames = [];

    if (users) {
      for (let id of users) {
        let name = await this.chatRepo.getUserName(id);

        usernames.push({ id: id, name: name });
      }

      return {
        status: 200,
        data: usernames,
      };
    } else {
      return {
        status: 400,
        message: "failed please try again",
      };
    }
  }
}

export default chatUseCase;
