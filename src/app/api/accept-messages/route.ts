import connectDbs from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { getServerSession } from "next-auth";
import { User } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/options";



export const POST = async (request: Request) =>{

    await connectDbs();
    try {

        const session = await getServerSession(authOptions);

        const user = session?.user;

        
        if(!session || !session.user){

            return NextResponse.json({success:false,message:"User is not authenticated"},{status:401})
        }
        
        const userId = user?._id;
        const username = user?.username

        const {acceptMessages} = await request.json();

        const updatedUser = await UserModel.findByIdAndUpdate(userId,{ isAcceptingMessage: acceptMessages},{new:true});

        if(!updatedUser){
            return NextResponse.json({success:false,message:"Failed to make the changes"},{status:401})
        }

        return NextResponse.json({message:"User is accepting messages",success:true, updatedUser},{status:200})
        
    } catch (error) {
        console.error(error)
        return NextResponse.json({success:false,message:"Error enabling messages"},{status:500})
    }
}

export const GET = async (request: Request) =>{

          await connectDbs();
    try {

        const session = await getServerSession(authOptions);
        const user = session?.user;

      
        if(!session || !session.user){

            return NextResponse.json({success:false,message:"User is not authenticated"},{status:401})
        }

        const userId = user?._id;

        const userData = await UserModel.findById(userId);

        if(!userData){
            return NextResponse.json({success:false,message:"Failed to get the results"},{status:401})
        }

        const messageAcceptance = userData?.isAcceptingMessage;

        return NextResponse.json({success:true,message:"User acceptance status", isAcceptingMessage: messageAcceptance},{status:200})
        
    } catch (error) {
        
        console.error(error)
        return NextResponse.json({success:false,message:"Error enabling messages"},{status:500})
    }
}