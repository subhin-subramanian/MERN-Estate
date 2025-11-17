import express from 'express';
import cloudinary from '../utils/cloudinary.js';

const router = express.Router();

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
