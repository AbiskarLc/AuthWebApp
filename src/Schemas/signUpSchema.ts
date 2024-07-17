import { z } from "zod";


export const usernameValidation = z
.string()
.min(3,"Username must be at least 3 characters")
.max(20,"Username must not be more than 20 characters")
.regex(/^[a-zA-Z0-9_]+$/,"Username must not contain special character")

export const signUpSchema = z.object({
    username: usernameValidation,
    email: z.string().email({message:"Invalid email address"}),
    password: z.string().min(5,{message:"Password must be at least 5 character"}).regex(/[a-zA-Z0-9]*(?:[\W]+)+[a-zA-Z0-9]*/,{message:"Password must have at least one special character"}),
    
})

 