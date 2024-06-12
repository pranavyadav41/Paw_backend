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



  const app=express();

  export const httpServer=http.createServer(app) 
  const io = new SocketIOServer(httpServer, {
    cors: {
      origin: 'http://localhost:3002',
      methods: ['GET', 'POST'],
      credentials: true,
    },
  });

  app.use(express.json())
  app.use(express.urlencoded({extended:true}))

  app.use(cookieParser())

  app.use(session({
    secret:'qwertyuiop',
    resave:false,
    saveUninitialized:false
  }))

  //For allow request from frontend
  app.use(cors({
      origin: 'http://localhost:3002',
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
      credentials: true,
      allowedHeaders:['Content-Type','Authorization']
    }));


  app.use("/api/user",userRoute)
  app.use("/api/admin",adminRoute)
  app.use("/api/franchise",franchiseRoute)
  app.use("/api/messages",messagesRoute)

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
      const { sender, receiver, message: messageText, timestamp } = message;
      console.log('Message received:', messageText, room, "room");
    
      // Create a new message object with only the necessary data
      const newMessage = {
        sender,
        receiver,
        message: messageText,
        timestamp
      };
    
      // Broadcast the new message object to the room
      io.to(room).emit('newMessage', newMessage);
    });
    socket.on('disconnect', () => {
      console.log(`Socket ${socket.id} disconnected`);
    });

    socket.on('connect_error', (error) => {
      console.error('Connection error:', error);
    });
  });

