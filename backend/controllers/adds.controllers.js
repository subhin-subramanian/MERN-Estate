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

      //   Filters from query
      const filters=[];
      if(req.query.userId) filters.push({userId:req.query.userId});
      if(req.query.type) filters.push({type:req.query.type});
      if(req.query.furnished) filters.push({furnished:req.query.furnished});
      if(req.query.parking) filters.push({parking:req.query.parking});
      if(req.query.bed) filters.push({bed:{ $gte: parseInt(req.query.bed) }});
      if(req.query.bath) filters.push({bath:{$gte: parseInt(req.query.bath)}});
      if(req.query.type === 'rent' && req.query.rent){
        filters.push({rent:{$lte: parseInt(req.query.rent)}});
      }
      if(req.query.type === 'sale' && req.query.sellingPrice){
        filters.push({sellingPrice:{$lte: parseInt(req.query.sellingPrice)}});
      }
      if (req.query.searchTerm) {
        filters.push({
          $or: [
            { description: { $regex: req.query.searchTerm, $options: 'i' } },
            { address: { $regex: req.query.searchTerm, $options: 'i' } }
          ]
        });
      }

      // Final query object
      const query = filters.length ? {$and:filters}:{};   
    
      const ads = await addsPosted.find(query).sort({updatedAt:sortDirection}).skip(startIndex).limit(limit);
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

// Function to delete an ad
export const deleteAd = async(req,res)=>{
    if(!req.user.isAdmin){
        return  res.status(401).json("You're not authorized to delete this ad");
    }
    try {
        await addsPosted.findByIdAndDelete(req.params.adId);
        res.status(200).json('Ad deleted');   
    } catch (error) {
        res.status(500).json({success:false,message:error.errmsg || 'server error'});      
    }
}

// Function to edit an ad
export const editAd = async(req,res)=>{
    if(!req.user.isAdmin){
        return  res.status(401).json("You're not authorized to edit this ad");
    }
    try {
        await addsPosted.findByIdAndUpdate(req.params.adId,{$set:req.body},{new:true})
        res.status(200).json('Ad edited');  
    } catch (error) {
        res.status(500).json({success:false,message:error.errmsg || 'server error'});
    }
}
