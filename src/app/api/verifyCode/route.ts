import { usernameValidation } from "@/Schemas/signUpSchema";
import { verifySchema } from "@/Schemas/verifySchema";
import connectDbs from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { NextResponse } from "next/server";
import { z } from "zod";

const UserNameSchema = z.object({
  username: usernameValidation,
});



export const POST = async (request: Request) => {
  await connectDbs();
  try {
    const { username, code } = await request.json();

    const result = UserNameSchema.safeParse({ username });
    const result1 = verifySchema.safeParse({code})
    

    if (!result.success) {
      const errormessages = result.error.format().username?._errors || [];
      return NextResponse.json(
        {
          success: false,
          message:
            errormessages.length > 0
              ? errormessages.join(", ")
              : "Invalid username",
        },
        { status: 400 }
      );
    }

    if (!result1.success) {
      const errormessages = result1.error.format().code?._errors || [];
      return NextResponse.json(
        {
          success: false,
          message:
            errormessages.length > 0
              ? errormessages.join(", ")
              : "Invalid code",
        },
        { status: 400 }
      );
    }


    const user = await UserModel.findOne({ username });
  
    if (!user) {
      return NextResponse.json(
        { success: false, message: "User with this username not found" },
        { status: 404 }
      );
    }

    if (user.isVerified) {
      return NextResponse.json(
        { success: false, message: "User is already verified" },
        { status: 400 }
      );
    }
    const checkCode = code === user.verifyCode;
    const isCodeExpired = new Date(user.verifyCodeExpiry) > new Date();

    if (checkCode && isCodeExpired) {
      user.isVerified = true;
      await user.save();
      return NextResponse.json(
        { success: true, message: "User Verified Successfully" },
        { status: 200 }
      );
    } else if (!isCodeExpired) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Code has expired. Please sign up again to verify your account",
        },
        { status: 404 }
      );
    } else {
      return NextResponse.json(
        {
          success: false,
          message: "Incorrect code. Please enter the code correctly",
        },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error("Unable to verify User", error);
    return NextResponse.json(
      { success: false, message: "Unable to verify User" },
      { status: 500 }
    );
  }
};
