import connectDbs from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { getServerSession } from "next-auth";
import { User } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/options";
import { request } from "http";
import mongoose from "mongoose";
// Use of  aggregation pipeline

export const GET = async (request: Request) => {
  await connectDbs();

  const session = await getServerSession(authOptions);

  const user: User = session?.user as User;

  if (!session || !user) {
    return NextResponse.json(
      { success: false, message: "User not authenticated" },
      { status: 401 }
    );
  }

  const userId = new mongoose.Types.ObjectId(user._id);
  try {
    const usermsg = await UserModel.aggregate([
      {
        $match: { id: userId },
      },
      {
        $unwind: "$messages",
      },
      {
        $sort: { "messages.createdAt": -1 },
      },
      {
        $group: {
          _id: "$_id",
          messages: {
            $push: "$messages",
          },
        },
      },
    ]);

    if(!usermsg || usermsg.length===0){
        return NextResponse.json({
            success:false,
            message:"User not found"
        })
    }

    return NextResponse.json({
        success: true,
        messages: usermsg[0].messages
    },{
        status:200
    })

  } catch (error) {
    console.error("Failed to update user status", error);
        return NextResponse.json(
          { success: false, message: "Failed to accept the messages" },
          { status: 500 }
        );
  }
};

// export const POST = async (request: Request) => {
//   await connectDbs();

//   const session = await getServerSession(authOptions);

//   const user: User = session?.user as User;

//   if (!session || !user) {
//     return NextResponse.json(
//       { success: false, message: "User not authenticated" },
//       { status: 401 }
//     );
//   }

//   const userId = user._id;

//   const { acceptMessages } = await request.json();

//   try {
//     const updateduser = await UserModel.findByIdAndUpdate(
//       userId,
//       { isAcceptingMessage: acceptMessages },
//       { new: true }
//     );

//     if (!updateduser) {
//       return NextResponse.json(
//         { success: false, message: "failed to update user status" },
//         { status: 401 }
//       );
//     }

//     return NextResponse.json(
//       {
//         success: true,
//         message: "Message acceptance status updated successfully",
//         updateduser,
//       },
//       { status: 200 }
//     );
//   } catch (error) {
//     console.error("Failed to update user status", error);
//     return NextResponse.json(
//       { success: false, message: "Failed to accept the messages" },
//       { status: 500 }
//     );
//   }
// };

// export const GET = async (request: Request) => {
//   await connectDbs();
//   const session = await getServerSession(authOptions);

//   const user: User = session?.user as User;

//   if (!session || !session.user) {
//     return NextResponse.json(
//       { success: false, message: "User not authenticated" },
//       { status: 401 }
//     );
//   }

//   const userId = user._id;

//   try {
//     const userData = await UserModel.findById(userId);

//     if (!userData) {
//       return NextResponse.json(
//         { success: false, message: "failed to get user status" },
//         { status: 401 }
//       );
//     }

//     return NextResponse.json(
//       {
//         success: true,
//         message: "User status generated successfully",
//         isAcceptMessages: userData.isAcceptingMessage,
//       },
//       { status: 200 }
//     );
//   } catch (error) {
//     console.error("Failed to update user status", error);
//     return NextResponse.json(
//       { success: false, message: "Failed to get the data" },
//       { status: 500 }
//     );
//   }
// };
