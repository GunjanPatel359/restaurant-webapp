"use client"
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const router=useRouter()
  useEffect(()=>{
    const initiatePage=()=>{
      router.push("/home")
    }
    initiatePage()
  },[router])
  return (
    <>
    <div className="w-full h-screen flex">
      <div className="justify-center items-center mx-auto my-auto">
        <Button>
          <Link href="/home">Go to Home</Link>
        </Button>
      </div>
    </div>
    </>
  );
}
