import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    username:{
        type:String,
        require:true,
        unique:true,
    },
    email:{
        type:String,
        require:true,
        unique:true,
    },
    password:{
        type:String,
        require:true,
        unique:true,
    },
    createat:{
        type:String,
        default:Date.now    
    }
})

const Users = mongoose.model("users",UserSchema)

export default Users