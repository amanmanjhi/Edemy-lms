import express from 'express'
import cors from 'cors'
import 'dotenv/config' 
import connectDB from './config/mongodb.js'
import {clerkWebhooks, stripeWebhooks} from './controllers/webHooks.js'
import User from './models/user.js'
import educatorRouter from './routes/educatorRoutes.js'
import { clerkMiddleware } from '@clerk/express'
import connectCloudinary from './config/cloudinary.js'
import courseRouter from './routes/course.routes.js'
import userRouter from './routes/user.routes.js'
import { json } from 'stream/consumers'

// ! initialize express 
let app = express();

// ! connect DB

await connectDB();

await connectCloudinary();

//! middlewares
app.use(cors())

app.use(clerkMiddleware())
// console.log("CLOUDINARY CONNECTED")

// !  routes

app.get('/',(req,res)=>{
    res.send("API is working");
})

app.post('/clerk', express.json(), clerkWebhooks)

app.use('/api/educator', express.json(), educatorRouter); // 8:50

app.use('/api/course', express.json(), courseRouter) // 9:04
app.use('/api/user', express.json(), userRouter) // 9:15
app.post('/stripe', express.json({type:'application/json'}),stripeWebhooks)



// ! port number
const PORT = process.env.PORT || 7000 

app.listen(PORT, (err) => {
    if(err){
        console.log("there is an error running server")
    }
    console.log("server is running on port 7000");
} )