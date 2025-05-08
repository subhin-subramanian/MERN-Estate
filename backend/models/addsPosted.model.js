import mongoose from "mongoose";

const addsPostedSchema = new mongoose.Schema({
    address:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    type:{
        type:String,
        required:true
    },
    rent:{
        type:Number,
    },
    sellingPrice:{
        type:Number,
    },
    furnished:{
        type:Boolean,
        default:false
    },
    parking:{
        type:Boolean,
        default:false
    },
    bed:{
        type:Number,
        required:true
    },
    bath:{
        type:Number,
        required:true
    },
    coverImg:{
        type:String,
        required:true
    },
    phone:{
        type:Number,
        required:true
    }
},{timestamps:true});

const addsPosted= mongoose.model('PostedAdd',addsPostedSchema);

export default addsPosted;