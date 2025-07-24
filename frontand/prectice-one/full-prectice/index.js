import express from "express"
const app = express()
import mongoose from "mongoose"
import Users from "./routes/users.routes.js"
import cors from "cors"

    mongoose.connect('mongodb://127.0.0.1:27017/Users').then(()=>{
    console.log('server conact')
}).catch((err)=>{
    console.log(err)
})


app.use(express.urlencoded({extended:false}))
app.use(express.json())
app.set("view engine", "ejs")
app.use(express.static('public'))

app.use(cors())

app.use('/api/users/',Users)

app.get('/',(req,res)=>{
    res.render('index')
})

app.listen(3000,()=>{
    console.log('server listing 3000')
})