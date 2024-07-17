"use client";

import { useToast } from "@/components/ui/use-toast";
import { usernameValidation } from "@/Schemas/signUpSchema";
import { verifySchema } from "@/Schemas/verifySchema";
import { ApiResponse } from "@/types/ApiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";

const page = () => {
  const [isveryfing, setIsVeryfing] = useState(false);
  const router = useRouter();
  const params = useParams<{ username: string }>();
  const { toast } = useToast();
  const form = useForm<z.infer<typeof verifySchema>>({
    resolver: zodResolver(verifySchema),
  });

  const onSubmit = async (data: any) => {
    console.log(data);
    setIsVeryfing(true);
    try {
      const response = await axios.post<ApiResponse>("/api/verifyCode",{
        username: params.username,
        code: data.code
      },{
        headers:{
          "Content-Type":"application/json"
        },
        withCredentials:true
      });

      if(response.data){
        console.log(response.data)
      
        toast({
          title:"Success",
          description: response.data.message
        })
         router.replace("/sign-in");
      }
    } catch (error) {

      const axiosError = error as AxiosError<ApiResponse>
      let errorMessage = axiosError.response?.data.message;
      toast({
        title: "Verification Failed",
        description: errorMessage,
        variant: "destructive",
      });
    }finally{
      setIsVeryfing(false)
    }
  };

  return (
    <div className=" flex justify-center items-center min-h-screen bg-gray-100">
      <div className=" flex flex-col  shadow-lg rounded-md md:max-w-md p-8 bg-gray-200 w-full">
        <h1 className=" md:text-3xl font-semibold ">Verify Your Account</h1>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} method="post" className="  space-y-6">
         <FormField
          control={form.control}
          name="code"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Verification Code</FormLabel>
              <FormControl>
                <Input type="number" placeholder="Enter 6 digits code" {...field}  />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
         <Button type="submit" disabled={isveryfing}>
          {
            isveryfing ?<>
            <p className=" flex gap-1 items-center">
              <Loader2 className=" animate-spin"/>
              <span>Verifying...</span>
            </p>
            </> :"Verify Code"
          }
        
          </Button>
          </form>
          
        </Form>
      </div>
    </div>
  );
};

export default page;
