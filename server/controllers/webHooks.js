import { Webhook } from "svix";
import User from '../models/user.js';


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
        console.error("❌ Webhook Error:", error)
        res.status(500).json({success:false, message:error.message})
    }
}

