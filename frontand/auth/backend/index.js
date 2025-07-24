import express from "express"
const app = express()
import StudentRoutes from "./routes/student.routes.js"
import { DataBaseConnact } from "./config/database.js"
import auth from './midlware/auth.js'
import userRoutes from './routes/users.routes.js'
import  { MulterError } from "multer"
import path from "path"
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import cors from "cors"

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const PORT =process.env.PORT

// server connact
DataBaseConnact()

// midleware
app.use(express.urlencoded({extended:true}))
app.use(express.json())
app.use('/uploads',express.static(path.join(__dirname,'uploads')))


app.use(cors())

app.use('/api/users',userRoutes)

app.use(auth)

app.use('/api/student',StudentRoutes)

app.use((error,req,res,next)=>{
    if(error instanceof MulterError){
        return res.status(400).send(`image err: ${error.message} : ${error.code}`)
    }else if(error){
       return res.status(500).send(`sumthing went wrong: ${error.message} `)  
    }
    next()
})
app.listen(PORT,()=>{
    console.log(`app listing port number ${PORT}`)
})