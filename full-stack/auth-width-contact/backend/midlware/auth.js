import jwt from "jsonwebtoken"


const auth =(req,res,next)=>{
    try {
        const bearerHeader = req.headers['authorization']
        if(typeof bearerHeader != 'undefined'){
         const token = bearerHeader.split(' ')[1]
        const user = jwt.verify(token,process.env.JWT_SECRET)
        console.log(user)
        req.token = user
        next()
        }else{
            res.status(401).json({message:"Token Not Found"})
        }
    } catch (error) {
            res.status(403).json({message:"Invalid Or expire token"}) 
    }
}

export default auth