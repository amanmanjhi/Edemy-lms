import express from 'express'
import cors from 'cors'
import 'dotenv/config' 
import connectDB from './config/mongodb.js'
import {clerkWebhooks} from './controllers/webHooks.js'
import User from './models/user.js'
import educatorRouter from './routes/educatorRoutes.js'
import { clerkMiddleware } from '@clerk/express'
import connectCloudinary from './controllers/cloudinary.js'


// const { connectDB }  = require('./config/mongodb.js')


// ! initialize express 
let app = express();


// ! connect DB

await connectDB();

await connectCloudinary();

//! middlewares
app.use(cors())

app.use(clerkMiddleware())




// !  routes

app.get('/',(req,res)=>{
    res.send("This is home page");
})

app.get('/home',(req,res)=>{
    res.send("This is home page");

})

app.post('/clerk', express.json(), clerkWebhooks)

app.use('/api/educator', express.json(), educatorRouter)


// ! port number
const PORT = process.env.PORT || 7000 

app.listen(PORT, (err) => {
    if(err){
        console.log("there is an error running server")
    }
    console.log("server is running on port 7000");
} )