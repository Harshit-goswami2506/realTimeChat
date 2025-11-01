//isAuth middleware to protect routes

import jwt from 'jsonwebtoken';
const isAuth=async(req,res,next)=>{
    try {
        let token=req.cookies.token;
        if (!token) {
            return res.status(401).json({message:"Unauthorized"});
        }
        let verifyToken= await jwt.verify(token,process.env.JWT_SECRET);
        req.userId=verifyToken.userId;
        next();
    } catch (error) {
        return res.status(401).json({message:`Unauthorized ${error}`});
    }
}
export default isAuth;  
