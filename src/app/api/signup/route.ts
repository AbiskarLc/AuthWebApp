import connectDbs from "@/lib/dbConnect";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs"
import { sendVerficationEmail } from "@/helpers/sendVerificationEmail";
import UserModel from "@/model/User";

export const POST = async (request: Request) => {
  await connectDbs();
  try {

  const {username,email,password} = await request.json();

  console.log(username,email,password);
     const existUser = await UserModel.findOne({
        username,
        isVerified: true
     })

     if(existUser){
        return NextResponse.json({
           success:false,
           message: "Username already exists"
        }, {status: 400})
     }

     const emailExist = await UserModel.findOne({
        email
     });
     const verifyCode = Math.floor(100000 + Math.random() * 900000).toString()

     if(emailExist){

        if(emailExist.isVerified){
            return NextResponse.json({
                success:false,
                message:"User with this username already exists"
            },{
                status:400
            })
        }else{

            const hashPassword = await bcrypt.hash(password,10)

            emailExist.password = hashPassword;
            emailExist.verifyCode = verifyCode;
            emailExist.verifyCodeExpiry = new Date(Date.now() + 3600000)

            await emailExist.save()
        }
       
     }else{
         const hashPassword = await bcrypt.hash(password,10)
         const expiryDate = new Date();
         expiryDate.setHours(expiryDate.getHours() + 1)

         const createdUser = new UserModel({
            username,
            email,
            password: hashPassword,
            verifyCode: verifyCode,
            verifyCodeExpiry: expiryDate,
            isVerified: false,
            isAcceptingMessage: true,
            messages: []
         })

        await createdUser.save();
     }


     const emailResponse = await sendVerficationEmail(email,username,verifyCode)

     if(!emailResponse.success){

        return NextResponse.json({
            success:false,
            message: emailResponse.message
        },{
            status:500
        })

     }
     return NextResponse.json({
        success:true,
        message: "User registered successfully. Please verify your email"
    },{
        status:200
    })
     
  } catch (error) {
    console.error("Error regestering user", error);
    return NextResponse.json(
      {
        success: false,
        message: "Error Registering user",
      },
      {
        status: 500,
      }
    );
  }
};
