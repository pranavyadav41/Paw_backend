import dotenv from "dotenv"
dotenv.config();
import express from 'express';

import cookieParser from "cookie-parser"
import session from 'express-session'
import RedisStore from 'connect-redis';
import { createClient } from 'redis';
import { Server as SocketIOServer } from 'socket.io';
import cors from 'cors'
import http from 'http';

const redisClient = createClient({ legacyMode: true });
redisClient.connect().catch(console.error);

//Routes root
import userRoute from '../router/userRoute'
import adminRoute from '../router/adminRoute'
import franchiseRoute from '../router/franchiseRoute'
import messagesRoute from '../router/messageRoute'



const app = express();

export const httpServer = http.createServer(app)
const io = new SocketIOServer(httpServer, {
  cors: {
    origin: process.env.CORS,
    methods: ['GET', 'POST'],
    credentials: true,
    optionsSuccessStatus: 204
  },
});

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

app.use(cookieParser())

app.use(
  session({
    store: new RedisStore({ client: redisClient }),
    secret: 'qwertyuiop',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: true }
  })
);

app.use(cors({
  origin: process.env.CORS,
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

  socket.on('initiateCall', ({ room, from, roomId }) => {
    socket.to(room).emit('incomingCall', { from, roomId })

  })

  socket.on('disconnect', () => {
    console.log(`Socket ${socket.id} disconnected`);
  });

  socket.on('connect_error', (error) => {
    console.error('Connection error:', error);
  });
});

