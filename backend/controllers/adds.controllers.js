import addRequests from "../models/addRequest.model.js"
import addsPosted from "../models/addsPosted.model.js";

// Function for storing the add requests from users to database
export const addRequest = async(req,res)=>{
    const newAddRequest = new addRequests(req.body);
    try {
      const savedAdd = await newAddRequest.save();
      res.status(200).json(savedAdd);
    } catch (error) {
        res.status(500).json({success:false,message: error.errmsg || 'server error'});
    }
}

// Function for posting a new add
export const addPost = async(req,res)=>{
    if(!req.user.isAdmin){
        return res.status(408).json("You're not authorized to post an add");
    }
    const newAddPost = new addsPosted(req.body);
    try {
      const postedAdd = await newAddPost.save();
      res.status(200).json(postedAdd);
    } catch (error) {
        res.status(500).json({success:false,message: error.errmsg || 'server error'});
    }
}