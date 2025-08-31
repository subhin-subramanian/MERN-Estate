import express from 'express';
import dotenv from 'dotenv';
import {v2 as cloudinary} from 'cloudinary';

dotenv.config(); // Loading environment variables

const router = express.Router();

cloudinary.config({
    cloud_name : process.env.CLOUDINARY_CLOUD_NAME,
    api_key : process.env.CLOUDINARY_API_KEY,
    api_secret : process.env.CLOUDINARY_API_SECRET
});

router.post('/',async(req,res)=>{
    try {
        const {image} = req.body;
        if(!image) return res.status(400).json({message:'Image not provided'});
        const result = await cloudinary.uploader.upload(image,{folder:'1Cent_Property'});
        res.status(200).json({imageUrl:result.secure_url});  
    } catch (error) {
        return res.status(500).json({
            message:'Image upload failed due to internal server error', 
            error: error.message});  
    }
});

export default router;
