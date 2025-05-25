import { Webhook } from "svix";
import User from '../models/user.js';
import Stripe from "stripe";
import 'dotenv/config'
import Purchase from "../models/purchase.model.js";
import Course from "../models/course.model.js";


// ! API controller Function  to manage User with Database 

export const clerkWebhooks = async (req, res) =>{
    try{
        const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET)

        await whook.verify(JSON.stringify(req.body), {
            "svix-id":req.headers["svix-id"],
            "svix-timestamp":req.headers['svix-timestamp'],
            'svix-signature':req.headers['svix-signature'],
        })

        const {data, type} = req.body;

        switch(type){
            case 'user.created':{
                const userData = {
                    _id: data.id,
                    email: data.email_addresses[0].email_address,
                    name: data.firstName + " " + data.lastName,
                    image: data.image_url,
                    imageUrl: data.image_url,
                }
                await User.create(userData)
                console.log("user created successfully")
                res.json({success:true, message:"user created successfully"})
                break;
            }
               
            case 'user.updated':{
                const userData = {
                    email: data.email_address[0].email_address,
                    name : data.firstName + " " + data.lastName,
                    image: data.image_url,
                    imageUrl : data.image_url,
                }
                await User.findByIdAndUpdate(data.id, userData)
                res.json({success:true,message:"user details updated successfully!"})
                break;
            }

            case 'user.deleted' : {
                await User.findByIdAndDelete(data.id)
                res.json({success:true,message:"user deleted successfully!"})
                console.log("user deleted")
                break;
            }

            default:
                break;

        }
    }catch(error){
        console.error("Webhook Error:", error)
        res.status(500).json({success:false, message:error.message})
    }
}


// ! srtipe webhook handler function
const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY)

export const stripeWebhooks = async(req, res)=>{
    const sig = request.headers['stripe-signature'];

    let event;

    try {
        event = Stripe.webhooks.constructEvent(request.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    }
    catch (err) {
        response.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':{
      const paymentIntent = event.data.object;
      const paymentIntentId =  paymentIntent.id;

      const session = await stripeInstance.checkout.sessions.list({payment_intent:paymentIntentId})

      const {purchaseId } = session.data[0].metadata;

      const purchaseData = await Purchase.findById(purchaseId);
      const userData = await User.findById(purchaseData.userId);
      const courseData = await Course.findById(purchaseData.courseId);

      courseData.enrolledStudents.push(userData);
      await courseData.save()

      userData.enrolledCourses.push(courseData._id);
      await userData.save();

      purchaseData.status = 'completed'
      await purchaseData.save();


      break;
    }
    case 'payment_intent.payment_failed':{
      
      const paymentIntent = event.data.object;
      const paymentIntentId =  paymentIntent.id;

      const session = await stripeInstance.checkout.sessions.list({payment_intent:paymentIntentId})

      const {purchaseId } = session.data[0].metadata;

      const purchaseData = await Purchase.findById(purchaseId)
      purchaseData.status = 'failed';

      await purchaseData.save()
      
      break;
    }
    // ... handle other event types
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  // Return a response to acknowledge receipt of the event
  response.json({received: true});
}
