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

// Function to get all the ads from database as per the search or for renderings
export const getAds = async(req,res)=>{
    try {
      const startIndex = parseInt(req.query.startIndex) || 0;
      const limit = parseInt(req.query.limit) || 9;
      const sortDirection = req.query.order === 'asc'?1:-1;
      const ads = await addsPosted.find({
        ...(req.query.userId && {userId:req.query.userId}),
        ...(req.query.type && {type:req.query.type}),
        ...(req.query.bed && {bed:req.query.bed}),
        ...(req.query.searchTerm && {
            $or:[
                {title:{$regex:req.query.searchTerm,$options:'i'}},
                {content:{$regex:req.query.searchTerm,$options:'i'}}
            ]
        })
      }).sort({updatedAt:sortDirection}).skip(startIndex).limit(limit);

      const totalAds = await addsPosted.countDocuments();
      res.status(200).json({ads,totalAds});
    } catch (error) {
        res.status(500).json({success:false,message: error.errmsg || 'server error'});   
    }
}

// Function to get an ad for the ad page
export const getAd = async(req,res)=>{
    try {
        const ad = await addsPosted.findById(req.params.adId);
        res.status(200).json(ad);
    } catch (error) {
        res.status(500).json({success:false,message: error.errmsg || 'server error'});   
    }
}
