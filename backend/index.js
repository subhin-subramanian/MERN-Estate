import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRouter from './routes/user.routes.js';

const app = express();
dotenv.config();
app.use(express.json());

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
