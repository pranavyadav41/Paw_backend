import express from 'express';
import dotenv from "dotenv"
dotenv.config();
import http from 'http';



const app=express();

const httpServer=http.createServer(app) 

export {httpServer}
