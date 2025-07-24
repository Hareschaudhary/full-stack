import mongoose from "mongoose"
import dotenv from "dotenv"
dotenv.config()

export const DataBaseConnact =()=>{
    mongoose.connect(process.env.MONGO_DB).then(()=>{
    console.log('server conact')
}).catch((err)=>{
    console.log(err)
})
}