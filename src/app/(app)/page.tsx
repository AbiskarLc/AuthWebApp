"use client"
import MessageCard from "@/components/MessageCard";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import AutoPlay  from "embla-carousel-autoplay"
import { Separator } from "@/components/ui/separator";
import data from "@/messages.json";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton"

const page = () => {

  const [loading,setIsLoading] = useState(true);


  useEffect(()=>{

    if(loading){
      setTimeout(()=>{
        setIsLoading(false)
      },2000)
    }
  },[])

  return (
    <div className=" flex-col w-full container flex justify-center items-center p-4 md:max-w-6xl gap-2">
      {
        loading?  <div className="flex flex-col space-y-3  ">
        <Skeleton className="h-[125px] w-[250px] rounded-xl bg-gray-400" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-[250px] bg-gray-400" />
          <Skeleton className="h-4 w-[200px] bg-gray-400" />
        </div>
      </div>:
        <>
  <div className=" flex flex-col gap-3">
        <h1 className=" text-2xl text-center md:text-3xl font-semibold">
          Welcome to Abiskar Anonymous Conversation App
        </h1>
        <p className=" text-gray-800  text-center md:text-start text-sm">
          Dive into the world of messaging with AI functionality
        </p>
      </div>

      <div className=" flex justify-center p-4 md:max-w-3xl ">
        <Carousel className=" embala w-[300px] md:w-auto p-2 transition-all ease-in-out" plugins={[AutoPlay({delay:3000 })]}>
          <CarouselContent>
            {data.map((item, index) => {
              return (
                <CarouselItem key={item.id}  >
          
                  <Card className=" border-2 border-sky-600 bg-gray-200 cursor-pointer" >
                    <CardHeader>
                      <CardTitle>{item.username}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p>{item.message}</p>
                    </CardContent>
                    <CardFooter>
                      <p>{item.received}</p>
                    </CardFooter>
                  </Card>
                </CarouselItem>
              );
            })}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
        </>
 
      }
    
    </div>
  );
};

export default page;
