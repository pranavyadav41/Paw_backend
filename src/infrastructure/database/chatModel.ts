import mongoose, { Document, Schema } from "mongoose";
import ChatMessage from "../../domain/chat";

interface IChatMessageModel extends ChatMessage, Document {}
 
const ChatMessageSchema: Schema = new Schema({
  sender: { type: String, required: true },
  receiver: { type: String, required: true },
  contentType: { type: String, enum: ["text","file","photo"], default: "text" },
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

const ChatMessageModel = mongoose.model<IChatMessageModel>(
  "ChatMessage",
  ChatMessageSchema
);

export default ChatMessageModel;
