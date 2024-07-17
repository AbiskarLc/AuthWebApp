import { resend } from "@/lib/resend";
import VerificationEmail from "../../emails/VerificationEmail";
import { ApiResponse } from "@/types/ApiResponse";


export const  sendVerficationEmail=async (
    email:string,
    username: string,
    verifyCode: string

): Promise<ApiResponse> =>{
         
    try {
        await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: email,
            subject: 'AbiskarWebAuthApp verification Email',
            react: VerificationEmail({username,otp: verifyCode})
          });
        return {success:true, message:"Verification Email sent successfully"}
    } catch (emailError) {
        
        console.error("Error sending verification email", emailError)
        return { success:false , message: "failed to send verification email"}
    }
}


