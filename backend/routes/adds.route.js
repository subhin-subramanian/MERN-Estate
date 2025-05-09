import express from 'express'
import { verifyToken } from '../utils/verifyToken.js';
import { addPost, addRequest, deleteAd, editAd, getAd, getAds } from '../controllers/adds.controllers.js';

const addsRouter = express.Router();

addsRouter.post('/add-request',addRequest);
addsRouter.post('/post-add',verifyToken,addPost);
addsRouter.get('/getads',getAds);
addsRouter.get('/getad/:adId',getAd);
addsRouter.delete('/delete/:adId',verifyToken,deleteAd);
addsRouter.put('/edit/:adId',verifyToken,editAd);
export default addsRouter;
