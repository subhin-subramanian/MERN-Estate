import bcryptjs, { compareSync } from 'bcryptjs'
import User from '../models/user.model.js';
import jwt from 'jsonwebtoken'

// Function to handle the backend of signing up
export const signUp = async(req,res)=>{  
    const {username,email,phone,password} = req.body;
    if(!username || !email || !phone || !password || username === '' || password === '' || email === '' || phone === ''){
        return res.status(400).json('All fields are required');
    }
    const hashedPassword = bcryptjs.hashSync(password,10);
    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser){
        return res.status(401).json({
            success: false,
            message: "User already exists, try with different email"
        });
    }
    // If not, create new user
    const newUser = new User({username,email,phone,password:hashedPassword})
    try {
        await newUser.save();
        res.status(200).json('Signup successfull') 
    } catch (error) {
        res.status(500).json({success:false,message: error.errmsg || 'server error'});
    }
}

// Function to handle the backend of signing in
export const signIn = async(req,res)=>{
    const {username,password} = req.body;
    if(!username || !password || username === '' || password === ''){
        return res.status(400).json('All fields are required');
    }
    try {
        const validUser = await User.findOne({username});
        if(!validUser){
            return res.status(402).json("Wrong credentials");
        }
        const validPassword = bcryptjs.compareSync(password,validUser.password)
        if(!validPassword){
            return res.status(402).json("Wrong credentials");
        }
        // Token Creation 
        const token = jwt.sign({id:validUser._id,isAdmin:validUser.isAdmin},process.env.JWT_SECRET);
        const {password:pass,...rest} = validUser._doc;
        res.status(200).cookie('access_token',token,{httpOnly:true}).json({rest});  
    } catch (error) {
        res.status(500).json({success:false,message: error.errmsg || 'server error'});     
    }
}
