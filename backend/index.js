import express, { urlencoded } from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRouter from './routes/user.routes.js';
import path from 'path';
import { fileURLToPath } from "url";
import cookieParser from 'cookie-parser';
import uploadRouter from './routes/upload.route.js';
import addsRouter from './routes/adds.route.js';
import cors from 'cors';

const app = express();

// For rendering
// const __rendirname = path.resolve();

// Needed to get __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') }); //Loading environment variables

//Middlewares
app.use(express.json({limit:"10mb"}));
app.use(cookieParser());
app.use(cors());
app.use(express.urlencoded({extended:true}));


// Api endpoints
app.use('/api/user',userRouter);
app.use('/api/upload',uploadRouter);
app.use('/api/adds',addsRouter);

// For rendering
// app.use(express.static(path.join(__rendirname,'/frontend/dist')));
// app.get('/*name',(req,res)=>{
//     res.sendFile(path.join(__rendirname,'frontend','dist','index.html'));
// });

// Database connection
mongoose.connect(process.env.MONGO).then(()=>{
    console.log("Database connected")}
).catch((error)=>{console.log(error)});

// Port setting
app.listen(3000,()=>{
    console.log('Server running on port 3000');
});