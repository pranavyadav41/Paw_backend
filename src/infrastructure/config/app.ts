import express from 'express';
import dotenv from "dotenv"
import cookieParser from "cookie-parser"
import session from 'express-session'
import cors from 'cors'
dotenv.config();
import http from 'http';

//Routes root
import userRoute from '../router/userRoute'
import adminRoute from '../router/adminRoute'
import franchiseRoute from '../router/franchiseRoute'
import errorHandle from '../middleware/errorHandle';



const app=express();

export const httpServer=http.createServer(app) 

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
  }));


app.use("/api/user",userRoute)
app.use("/api/admin",adminRoute)
app.use("/api/franchise",franchiseRoute)
