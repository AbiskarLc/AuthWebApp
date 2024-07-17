"use client"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
  import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
  } from "@/components/ui/alert-dialog"
  import { Button } from "@/components/ui/button"
import { Message } from "@/model/User"
import { useToast } from "./ui/use-toast"
import axios from "axios"
import { ApiResponse } from "@/types/ApiResponse"
import { X } from "lucide-react"

type MessageCardProps = {
    message: Message;
    onMessageDelete: (messageId: string) => void;
}

const MessageCard = ({message, onMessageDelete}: MessageCardProps ) => {

    const {toast} = useToast();
    const handleDeleteConfirm = async () =>{


      const response = await axios.delete<ApiResponse>(`/api/delete-message/${message._id}`,{
          withCredentials: true
      });

    }
  return (
<Card className=" cursor-pointer " >
  <CardHeader>
    <AlertDialog>
      <div className=" flex justify-between items-center">
      <CardTitle>User Message</CardTitle>
      <AlertDialogTrigger asChild>
        <Button variant={"destructive"}><X/></Button>
      </AlertDialogTrigger>
      </div>
   
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDeleteConfirm} className=" bg-red-500">Delete</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
    <CardDescription>This is message from anonymous user</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Hello guys, its me Abiskar Lamichhane</p>
  </CardContent>
  <CardFooter>
    <p>Thank you!</p>
  </CardFooter>
</Card>

  )
}

export default MessageCard