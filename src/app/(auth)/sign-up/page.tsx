"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useDebounceCallback } from "usehooks-ts";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { signUpSchema } from "@/Schemas/signUpSchema";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import { Button } from "@/components/ui/button";
import { SiTicktick } from "react-icons/si";
import { RxCrossCircled } from "react-icons/rx";
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
import { Switch } from "@/components/ui/switch";

const page = () => {
  const { toast } = useToast();
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [usernameMessage, setUsernameMessage] = useState("");
  const [isCheckingUsername, setCheckingUsername] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const debounced = useDebounceCallback(setUsername, 500);
 const [togglePassword,setTogglePassword] = useState(false);
  // zod implementation
  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    const checkUsernameUnique = async () => {
      if (username) {
        try {
          setCheckingUsername(true);
          setUsernameMessage("");
          const response = await axios.get(
            `/api/check-unique-username?username=${username}`,
            {
              headers: {
                "Content-Type": "application/json",
              },
              withCredentials: true,
            }
          );

          if (response.data) {
            setUsernameMessage(response?.data.message);
          }
        } catch (error) {
          // console.log(error?.response.data)
          const axiosError = error as AxiosError<ApiResponse>;
          console.log(axiosError);
          setUsernameMessage(
            axiosError.response?.data.message ?? "Error Checking username"
          );
          setCheckingUsername(false);
        } finally {
          setCheckingUsername(false);
        }
      }
    };

    checkUsernameUnique();
  }, [username]);

  const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
    console.log(data);
    setIsSubmitting(true);
    try {
      const response = await axios.post<ApiResponse>("/api/signup", data, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.data.success) {
        toast({
          title: "Success",
          description: response.data.message,
        });
        router.replace(`/verify/${username}`);
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error("error in signup of user", error);
      const axiosError = error as AxiosError<ApiResponse>;
      let errorMessage = axiosError.response?.data.message;
      toast({
        title: "Signup Failed",
        description: errorMessage,
        variant: "destructive",
      });
      setIsSubmitting(false);
    } finally {
        
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className=" w-full max-w-md p-8 space-y-8  bg-white rounded-lg shadow-lg">
        <div className="text-center">
          <h1 className=" text-2xl font-semibold traking-tight lg:text-4xl mb-6">
            Join Mystery Message
          </h1>
          <p className="mb-4">Sign up to start your anonymous adventure</p>
        </div>
        <Form {...form}>
          <form className=" space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Username"
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        debounced(e.target.value);
                      }}
                      autoComplete="username"
                    />
                  </FormControl>
                  {isCheckingUsername ? (
                    <Loader2 className=" animate-spin" />
                  ) : (
                    ""
                  )}
                  {usernameMessage && (
                    <p
                      className={`text-sm flex gap-1 items-center ${
                        usernameMessage === "Username is unique."
                          ? "text-green-700"
                          : "text-red-700"
                      }`}
                    >
                      <span>
                        {usernameMessage === "Username is unique." ? (
                          <SiTicktick className=" text-green-700" />
                        ) : (
                          <RxCrossCircled className="text-red-700" />
                        )}
                      </span>
                      <span>{usernameMessage}</span>
                    </p>
                  )}

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Email" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      type={togglePassword?"text":"password"}
                      placeholder="Password"
                      {...field}
                      autoComplete="current-password"
                      
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className=" animate-spin" /> Please wait
                </>
              ) : (
                "Signup"
              )}
            </Button>
          </form>
        </Form>
        <div className="">
          <p>
            Already a member?
            <Link
              href="/sign-in"
              className=" text-blue-600 hover:underline hover:text-blue-800"
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default page;
