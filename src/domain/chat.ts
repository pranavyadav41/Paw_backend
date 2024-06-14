export default interface ChatMessage {
    sender: string;
    receiver: string;
    message: string;
    timestamp: Date;
    fileType?: string ;
    fileName?: string;
    fileData?: Buffer;
  } 


export interface chat {
  sender:string;
  receiver:string;
  contentType:any
  content:string
  timestamp:Date;

}