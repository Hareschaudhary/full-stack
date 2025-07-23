import mongoose from "mongoose";


const UsersSchema = new mongoose.Schema({
    first_name:{
        type:String,
        require:true
    },
    last_name:{
        type:String,
        require:true
    },
    email:{
        type:String,
        require:true
    },
    phone:{
        type:String,
        require:true
    },
    gender:{
        type:String,
        enum:['Male','Femal',"Other"],
        require:true
    },
    profile_pic:{
         type:String
    }
})

const Users = mongoose.model("Users",UsersSchema)

export default Users