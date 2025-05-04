import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const uploadRouter = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const storage = multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,path.join(__dirname,'../uploads'));
    },
    filename:(req,file,cb)=>{
        const ext = path.extname(file.originalname);
        const uniqueName = `${Date.now()}-${Math.round(Math.random()*1e9)}${ext}`;
        cb(null,uniqueName);
    }
});

const upload = multer({storage});

uploadRouter.post('/',upload.single('image'),(req,res)=>{
    if(!req.file){
        return res.status(400).json({error:'No file uploaded'});
    }
    const imageUrl = `http://localhost:3000/uploads/${req.file.filename}`;
    res.status(200).json({imageUrl});
});

export default uploadRouter;


