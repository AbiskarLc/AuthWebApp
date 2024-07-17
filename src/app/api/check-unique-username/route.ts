import connectDbs from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { NextResponse } from "next/server";
import { z } from "zod";
import { usernameValidation } from "@/Schemas/signUpSchema";


const UsernameQuerySchema = z.object({
    username: usernameValidation
})


export const GET = async (request: Request) =>{

    if(request.method !== "GET"  ){
        return NextResponse.json({success:false,message:"Method not allowed"},{status:405})
    }
    await connectDbs()
    try {

        const {searchParams} = new URL(request.url);

        // console.log(searchParams)
        const queryParam = {
            username : searchParams.get('username')
        }
        
        const result = UsernameQuerySchema.safeParse(queryParam)
         
        if(!result.success){

            
            const usernameErrors = result.error.format().username?._errors || [];

            return NextResponse.json({success:false,message: usernameErrors.length > 0? usernameErrors.join(", "): "Invalid query parameter"})
        }else{

            const userExist = await UserModel.findOne({username: queryParam.username, isVerified: true});

            if(userExist){
                return NextResponse.json({success:true,message:"Username is not unique. Choose new combination"},{status:400})
            }
            return NextResponse.json({success:true,message:"Username is unique."},{status:201})
        }

    } catch (error) {
        
        console.error("Error checking username",error)
        return NextResponse.json({success:false,message:"Error checking username"},{status:500})
    }

}