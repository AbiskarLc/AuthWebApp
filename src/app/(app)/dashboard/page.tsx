"use client";
import MessageCard from "@/components/MessageCard";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";
import { Message } from "@/model/User";
import { acceptMessageSchema } from "@/Schemas/acceptMessageSchema";
import { ApiResponse } from "@/types/ApiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { Loader2, RefreshCcw } from "lucide-react";
import { getSession, useSession } from "next-auth/react";
import React, { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";

const page = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const [isSwitchLoading, setIsSwitchLoading] = useState(false);

  
  const handleDeleteMessage = (messageId: string) => {
    setMessages(messages.filter((message) => message._id !== messageId));
  };
  const { data: session } = useSession();

  const form = useForm({
    resolver: zodResolver(acceptMessageSchema),
  });

  const { register, watch, setValue } = form;

  const acceptMessages = watch("acceptMessages");

  const fetchAcceptingMessages = useCallback(async () => {
    setIsSwitchLoading(true);
    try {
      const response = await axios.get<ApiResponse>("/api/accept-messages");

      if (response.data) {
        const status= response.data.isAcceptingMessage;
        setValue("acceptMessages", response.data.isAcceptingMessage);
        toast({
          title: status?"Success":"Not Accepting",
          variant: status?"default":"destructive",
          description:
            response.data.message || "Failed to fetch message setting",
        });
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      console.log(axiosError);
      toast({
        title: "Failed",
        variant: "destructive",
        description: axiosError.message,
      });
    } finally {
      setIsSwitchLoading(false);
    }
  }, [setValue]);

  const fetchMessages = useCallback(async (refresh: boolean = false)=>{
           setIsLoading(true)
           setIsSwitchLoading(false);

           try {
            
            const response = await axios.get<ApiResponse>("/api/get-messages");

            if(response.data){

              console.log(response.data)
              setMessages(response.data.messages || [])
              toast({
                title: "Refreshed",
                variant: "default",
                description: response.data.message || "Showing Latest Messages"
              })
            }
           } catch (error) {
            
            const axiosError = error as AxiosError<ApiResponse>
            console.log(axiosError)
            toast({
              title: "failed",
              variant: "destructive",
              description: axiosError.message || "Failed to get the messages"
            })
           }finally{
            setIsLoading(false)
            setIsSwitchLoading(false)
           }
  },[setIsLoading, setMessages])


  const handleSwitchChange = async () =>{

    try {

      const response = await axios.post<ApiResponse>("/api/accept-messages",{acceptMessages: !acceptMessages},{
        headers:{
          "Content-Type": "application/json"
        },
        withCredentials: true
      })

      if(response.data){

        setValue("acceptMessages", !acceptMessages)
        console.log(response.data);
        toast({
          title: "Success",
          variant: "default",
          description: response.data.message
        })
      }
      
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>
      console.log(axiosError)
      toast({
        title: "failed",
        variant: "destructive",
        description: axiosError.message || "Failed to change accepting status"
      })
    }
  }

  useEffect(()=>{

    if(!session || !session?.user){
            return
    }
    fetchMessages();
    fetchAcceptingMessages();
  }, [session, setValue])
  
  if(!session || !session?.user){
    return (
      <>
      <div>
          <h1>Please Login</h1>
      </div>
      </>
    )
  }
  const {username} = session?.user

  const baseUrl = `${window.location.origin}`
  const profileUrl = `${baseUrl}/u/${username}`

  const copyToClipBoard = () =>{

    navigator.clipboard.writeText(profileUrl);
    toast({
      title: "Url Copied",
      description: "Profile Url has been copied to clipBoard"
    })
  }
  return <div className=" min-h-screen w-full max-w-6xl md:container  mt-5">
    <h1 className=" text-2xl md:text-3xl font-bold">User Dashboard</h1>

    <div className="mb-4">
       <h1 className=" text-lg font-semibold mb-2">Copy your unique url link</h1>

      <div className=" flex items-center ">
        <input type="text" name="profileUrl" value={profileUrl} className=" w-full pr-2" />
        <Button onClick={copyToClipBoard}>Copy</Button>
      </div>
    </div>
    
    <div className="mb-4">
      <Switch {...register('acceptMessages')}
       checked={acceptMessages}
       onCheckedChange={handleSwitchChange}
       disabled={isSwitchLoading}/>
       <span className=" text-sm ml-2">Accept Messages: {acceptMessages? "On" : "off"}</span>
    </div>
    <Separator/>
    <Button
    variant={"outline"}
    onClick={(e)=>{
      e.preventDefault();
      fetchMessages(true)
    }}
    >
      {
        isLoading ? <Loader2 className=" h-4 w-4 animate-spin"/>: 
        <RefreshCcw className=" h-4 w-4"/>
      }

    </Button>

     <div className=" grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">

      {

          messages.length > 0 ?
          messages.map((message,index)=>{
             return <>
                <MessageCard key={index} message={message} onMessageDelete={ handleDeleteMessage}/>
             </>
          }): <p>Messages are disabled</p>
      }

     </div>
    </div>;
};

export default page;
