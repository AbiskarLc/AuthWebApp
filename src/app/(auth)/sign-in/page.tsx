"use client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { signInSchema } from "@/Schemas/signInSchema";
import { ApiResponse } from "@/types/ApiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { redirect, useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
const page = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
         
    setIsSubmitting(true)
    console.log(data)
try {
  const response =  await signIn('credentials',{
    redirect:false,
    identifier: data.identifier,
    password: data.password
  })

  if(response?.error){
    toast({
      title:"Login failed",
      description: "Incorrect username or password",
      variant: "destructive"
    })
  }

  if(response?.url){

   router.replace("/dashboard");
  }

 console.log(response);
} catch (error) {
  console.log(error)
}finally{
  setIsSubmitting(false)
}
  

       
  };

  return (
    <div className=" flex justify-center items-center min-h-screen bg-gray-100">
      <div className=" flex flex-col gap-3 p-8 rounded-lg shadow-md bg-gray-200 w-full md:max-w-md">
        <h1 className=" text-2xl font-semibold ">Sign In</h1>
        <Form {...form}>
          <form className=" space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              name="identifier"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email/Username</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your email or username" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="password"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your password" {...field} />
                  </FormControl>
                  <FormMessage/>
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isSubmitting}>
              {/* {
                isSubmitting? <p className=" flex items-center gap-1">
                  <Loader2 className=" animate-spin"/>
                  <span>Loading...</span>
                </p>: "Sign In"
              } */} Signin
              
              </Button>
          </form>
        </Form>
        <div className=" flex items-center gap-1">
          <p className=" text-sm">Don't Have an account?</p>
          <Link href={"/sign-up"} className=" text-blue-500 hover:underline text-sm">
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
};

export default page;
