import express from 'express'
import { deleteUser, googleSignIn, googleSignUp, signIn, signOut, signUp, update } from '../controllers/user.controllers.js';
import { verifyToken } from '../utils/verifyToken.js';

const userRouter = express.Router();

userRouter.post('/sign-up',signUp);
userRouter.post('/google/sign-up',googleSignUp);
userRouter.post('/sign-in',signIn);
userRouter.post('/google/sign-in',googleSignIn);
userRouter.put('/update/:userId',verifyToken,update);
userRouter.post('/sign-out',signOut);
userRouter.delete('/delete/:userId',verifyToken,deleteUser);

export default userRouter;