import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import dotenv from "dotenv";
dotenv.config();

const auth = async (req,res,next)=>{
    try{
        const bearerHeader = req.headers['authorization'];

    if(typeof bearerHeader !== 'undefined'){
      const bearer = bearerHeader.split(' ');
      const token = bearer[1];
      const user = jwt.verify(token,process.env.JWT_SECRET);
    
      req.token = user;
      next();
    }else{
        res.status(401).json({message:"No token provided"});
    }
    }catch(err){
        res.status(403).json({message:'invalid expired token'});
    }
}
export default auth;