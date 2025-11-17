import bcryptjs, { compareSync } from 'bcryptjs'
import User from '../models/user.model.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import cloudinary from '../utils/cloudinary.js';
import { OAuth2Client } from 'google-auth-library';

dotenv.config();

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// --------------------- SIGNUP ---------------------
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

// --------------------- GOOGLE SIGNUP ---------------------
export const googleSignUp = async(req,res)=>{  
    const {token, signupData} = req.body;
    const {phone, password} = signupData;
    
    if(!phone || !password || password === '' || phone === ''){
        return res.status(400).json({ success: false, message: "Even if you're using google account to signup, password is required. Please enter a password" });
    }

    const hashedPassword = bcryptjs.hashSync(password,10);

    let username,email,profilePic;

    //verify google token
    try {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID
        });

        const payload = ticket.getPayload();

        if (!payload) throw new Error("Invalid Google payload");
        
        username = payload.name || "Google user";
        email = payload.email || "";
        profilePic = payload.picture ? `${payload.picture}?sz=200` : "";

    } catch (err) {
        console.error("Google token verification failed:", err);
        return res.status(401).json({ success: false, message: "Invalid Google token" });
    }

    if(!email) return res.status(400).json({success:false, message: "Invalid Google account" });

    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser){
        return res.status(401).json({success: false,message: "User already exists, try with different email"});
    }

    //Uploading image to cloudinary
    let uploadedImageUrl = profilePic; //Fallback if upload fails
    if(profilePic && profilePic.includes("googleusercontent.com")){
        try {
            const response = await fetch(profilePic);
            if (!response.ok) throw new Error("Failed to fetch google profile picture");
            
            const arrayBuffer = await response.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);
    
            const uploadResult = await new Promise((resolve,reject)=>{
                const stream = cloudinary.uploader.upload_stream({folder:"1CentPrprty_google_profiles"},
                    (error,result) => {
                        if(error) reject(error);
                        else resolve(result);
                    });
                    stream.end(buffer);
            });
            uploadedImageUrl = uploadResult.secure_url; 
        } catch (error) {
            console.error("Cloudinary upload failed, using Google profile pic as fallback:",error);
        }
    }

    // If not, create new user
    const newUser = new User({username, email, profilePic: profilePic || '', phone, password:hashedPassword})
    try {
        await newUser.save();
        res.status(200).json({success:true,message:'Signup successfull'}); 
    } catch (error) {
        res.status(500).json({success:false,message: error.errmsg || 'server error'});
    }
}

// --------------------- SIGNIN ---------------------
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

// --------------------- GOOGLE SIGNIN ---------------------
export const googleSignIn = async (req,res) => {
    const { token,password } = req.body;
    if(!password || password === ''){
        return res.status(400).json({ success: false, message: "Even if you're using google account to signup, password is required. Please enter a password" });
    }

    let username;

    try {
         //Verify google token
        const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID
        });
        const payload = ticket.getPayload();
        username = payload?.name || "Google Username";
                
    } catch (err) {
    console.error("Google token verification failed:", err);
    return res.status(401).json({ success: false, message: "Invalid Google token" });
    }

    try {
        // Checking with email, if user exists proceeds further otherwise returns
        const validUser = await User.findOne({username});
        if (!validUser){
            return res.status(403).json({success:false, message:'Wrong credentials'});
        }

        // Password checking
        const validPassword = bcryptjs.compareSync(password,validUser.password);
        if(!validPassword){
            return res.status(403).json({success:false, message:'Wrong credentials'});
        }

        // token creation
        const accessToken = jwt.sign({id:validUser._id,isAdmin:validUser.isAdmin},process.env.JWT_SECRET);
        const {password:pass,...rest} = validUser._doc;
        return res.status(200).cookie('access_token',accessToken,{httpOnly:true}).json({success:true,rest});

    } catch (error) {
        return res.status(500).json({success:false,message: error.errmsg || 'server error'});
    }
}

// Function for the backend of user update
export const update = async(req,res)=>{
    if(req.user.id !== req.params.userId){
        return res.status(401).json("You're not allowed to update this user");
    }
    req.body.password = bcryptjs.hashSync(req.body.password,10);
    try {
        const updatedUser = await User.findByIdAndUpdate(req.params.userId,{
            $set:{
                username:req.body.username,
                email:req.body.email,
                phone:req.body.phone,
                password:req.body.password,
                profilePic:req.body.profilePic
            }
        },{new:true});
        const {password,...rest} = updatedUser._doc;
        res.status(200).json(rest);
    } catch (error) {
        res.status(500).json({success:false,message:error.errmsg || 'server error'});
    }
}

// Function to handle signing out from an account
export const signOut = async(req,res)=>{
    try {
        res.clearCookie('access_token').status(200).json("You're signed out successfully")  
    } catch (error) {
        res.status(500).json({success:false,message:error.errmsg || 'server error'});
    }
}

// Function to delete an account
export const deleteUser = async(req,res)=>{
    if(!req.user.isAdmin && (req.user.id != req.params.userId)){
        return  res.status(401).json("You're not authorized to delete this user");
    }
    try {
        await User.findByIdAndDelete(req.params.userId);
        res.status(200).json('Account deleted');   
    } catch (error) {
        res.status(500).json({success:false,message:error.errmsg || 'server error'});      
    }
}


