import jwt from 'jsonwebtoken';

export const verifyToken = (req,res,next)=>{
    const token = req.cookies.access_token;
    if(!token){
        return (res.status(404).json('Wrong Credentials'));
    }
    jwt.verify(token,process.env.JWT_SECRET,(err,user)=>{
        if(err){
            return (res.status(405).json('Unauthorized'));
        }
        req.user=user;
        next();
    });
}