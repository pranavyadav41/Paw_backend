import express from 'express';
import dotenv from "dotenv"
import cookieParser from "cookie-parser"
import session from 'express-session'
import { Server as SocketIOServer } from 'socket.io';
import cors from 'cors'
dotenv.config();
import http from 'http';

//Routes root
import userRoute from '../router/userRoute'
import adminRoute from '../router/adminRoute'
import franchiseRoute from '../router/franchiseRoute'
import messagesRoute from '../router/messageRoute'



const app = express();

export const httpServer = http.createServer(app)
const io = new SocketIOServer(httpServer, {
  cors: {
    origin: 'http://localhost:3002',
    methods: ['GET', 'POST'],
    credentials: true,
    optionsSuccessStatus: 204
  },
});

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

app.use(cookieParser())

app.use(session({
  secret: 'qwertyuiop',
  resave: false,
  saveUninitialized: false
}))

//For allow request from frontend
app.use(cors({
  origin: 'http://localhost:3002',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization']
}));


app.use("/api/user", userRoute)
app.use("/api/admin", adminRoute)
app.use("/api/franchise", franchiseRoute)
app.use("/api/messages", messagesRoute)

io.on('connection', (socket) => {
  console.log(`Socket ${socket.id} connected`);

  socket.on('leave', ({ room }) => {
    socket.leave(room);
    console.log(`Socket ${socket.id} left room ${room}`);
  });

  socket.on('join', ({ room }) => {
    socket.join(room);
    console.log(`Socket ${socket.id} joined room ${room}`);
  });

  socket.on('sendMessage', ({ room, message }) => {
    const { sender, receiver, message: messageText, timestamp, fileType, fileName, fileData } = message;
    const newMessage = {
      sender,
      receiver,
      content: fileData || messageText,
      contentType: fileType ? fileType : 'text',
      timestamp,
      fileType,
      fileName,
    };
    io.to(room).emit('newMessage', newMessage);
  });
  socket.on('typing', ({ room, user }) => {
    socket.to(room).emit('typing', { user });
  });

  socket.on('stopTyping', ({ room, user }) => {
    socket.to(room).emit('stopTyping', { user });
  });
  
  socket.on('disconnect', () => {
    console.log(`Socket ${socket.id} disconnected`);
  });

  socket.on('connect_error', (error) => {
    console.error('Connection error:', error);
  });
});

