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
import bodyParser from 'body-parser';
import mongoose from 'mongoose';

// ! initialize express 
let app = express();

// ! connect DB

await connectDB();

await connectCloudinary();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch((err) => {
  console.error('MongoDB connection error:', err);
  process.exit(1);
});

//! middlewares
app.options('*', cors({
  origin: [
    'http://localhost:5173',
    'https://edemy-frontend-sable.vercel.app', // updated deployed frontend
    'https://edemy-backend-peach.vercel.app'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://edemy-frontend-sable.vercel.app',
    'https://edemy-backend-peach.vercel.app'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}))

app.use(clerkMiddleware())
// console.log("CLOUDINARY CONNECTED")

// !  routes

app.get('/',(req,res)=>{
    res.send("API is working");
})

// app.post('/clerk', express.json(), clerkWebhooks)
app.post('/clerk', bodyParser.raw({ type: '*/*' }), clerkWebhooks)

app.use('/api/educator', express.json(), educatorRouter); // 8:50

app.use('/api/course', express.json(), courseRouter) // 9:04
app.use('/api/user', express.json(), userRouter) // 9:15
app.post('/stripe', bodyParser.raw({type:'application/json'}),stripeWebhooks)



// ! port number
const PORT = process.env.PORT || 7000 

app.listen(PORT, (err) => {
    if(err){
        console.log("there is an error running server")
    }
    console.log(`Server running on port ${PORT}`);
} )