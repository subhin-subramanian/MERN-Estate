import express from 'express'
import { verifyToken } from '../utils/verifyToken.js';
import { addPost, addRequest } from '../controllers/adds.controllers.js';

const addsRouter = express.Router();

addsRouter.post('/add-request',addRequest);
addsRouter.post('/post-add',verifyToken,addPost);

export default addsRouter;
