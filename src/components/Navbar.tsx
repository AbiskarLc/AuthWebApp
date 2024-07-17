"use client"

import { signOut, useSession } from "next-auth/react"
import Link from "next/link"
import {User} from "next-auth"
import { Button } from "./ui/button"
const Navbar = () => {

    const {data: session} = useSession();
    const user: User = session?.user as User;

  return (
   <nav className=" w-full p-4 md:p-6 shadow-md md:h-20">
    <div className=" flex flex-col mx-auto md:flex-row container justify-between items-center">
      <a href="#" className=" text-xl no-underline font-semibold md:mb-0">
         Mystery Message
      </a>
      {
          session?(
            <>
            <span className=" mr-4">
            Welcome, {user?.email || user?.username}
            </span>
            <Button className=" w-full md:w-auto" onClick={()=> signOut()}>Sign Out</Button>
            </>
          ):(
            <Link href={"/sign-in"}>
              <Button className=" w-full md:w-auto"  >
              Login
              </Button>
              </Link>
          )
        }
    </div>
    <div>

    </div>
   </nav>
  )
}

export default Navbar