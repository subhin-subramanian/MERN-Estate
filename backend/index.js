import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRouter from './routes/user.routes.js';
import { fileURLToPath } from 'url';
import path, { dirname } from 'path';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import uploadRouter from './routes/upload.route.js';
import addsRouter from './routes/adds.route.js';

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// For rendering
const __rendirname = path.resolve();

dotenv.config();
app.use(express.json());
app.use(cookieParser());
app.use(cors());
// Serving uploaded images statically
app.use('/uploads',express.static(path.join(__dirname,'uploads')));

// Database connection
mongoose.connect(process.env.MONGO).then(()=>{
    console.log("Database connected")}
).catch((error)=>{console.log(error)});

// Port setting
app.listen(3000,()=>{
    console.log('Server running on port 3000');
});

// Api endpoints
app.use('/api/user',userRouter);
app.use('/api/upload',uploadRouter);
app.use('/api/adds',addsRouter);

// For rendering
app.use(express.static(path.join(__rendirname,'/frontend/dist')));
app.get('/*name',(req,res)=>{
    res.sendFile(path.join(__rendirname,'frontend','dist','index.html'));
});
