import connectDbs from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { messageSchema } from "@/Schemas/messageSchema";
import { Message } from "@/model/User";
import { NextResponse } from "next/server";


export const POST = async (request: Request) =>{

    await connectDbs();

    const {username, content} = await request.json();
    
    try {
        
        const user = await UserModel.findOne({username});

        if(!user){

            return NextResponse.json({success:false,message:"Failed to get the user"}, {status: 404})
        }

        if(!user.isAcceptingMessage){

            return NextResponse.json({success:false,message:"User is not accepting the messages" }, {status: 403})
        }

        const newMessage = {content, createdAt: new Date() }

        user.messages.push(newMessage as Message)

        await user.save();

        return NextResponse.json({Success:false, message:"Message sent successfully"},{status: 200})
    } catch (error) {
         console.error("Failed to send the message", error);
        return NextResponse.json(
          { success: false, message: "Unexpected error occurred" },
          { status: 500 }
        );
    }
}