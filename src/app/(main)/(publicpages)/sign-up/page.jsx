"use client"
import { useEffect, useState } from "react"

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { AiOutlineEye } from "react-icons/ai"
import { AiOutlineEyeInvisible } from "react-icons/ai"

import { toast } from "react-toastify";
import { createUser, getUserInfo } from "@/actions/user";
import { Input } from "@/components/ui/input";

const SignupPage = () => {
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState()
    const [confirmPassword, setConfirmPassword] = useState()
    const [phoneNumber, setPhoneNumber] = useState()
    const [visible, setVisible] = useState(false);
    const [loading, setLoading] = useState(true);

    const router=useRouter()

    useEffect(()=>{
            async function userAuth(){
                setLoading(true)
                const user=await getUserInfo()
                console.log(user)
                if(user.success){
                    router.push('/profile')
                }
                setLoading(false)
            }
            userAuth()
        },[])

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!name) {
            return toast.error("Please enter your name")
        }
        if (!email) {
            return toast.error("Please enter valid email")
        }
        if (!password) {
            return toast.error("Please enter a valid password")
        }
        if (password.length < 6) {
            return toast.error("password should be 6 character long")
        }
        if (password !== confirmPassword) {
            return toast.error("password and conform password does not match")
        }
        try {
            const res = await createUser({
                name,
                email,
                password,
                phoneNumber
            })
            if (res.success) {
                toast.success(res.message)
                setName("")
                setEmail("")
                setPassword("")
                setConfirmPassword("")
                setPhoneNumber("")
                return
            }
            toast.error(res.message)
        } catch (err) {
            console.log(err)
        }
    }

    return (
        <div>
            {!loading ? (
                <div className="min-w-screen min-h-screen items-center justify-center flex">
                    <div className="w-[470px] align-middle m-auto justify-center items-center flex flex-col gap-3 shadow shadow-color0 border border-color3 py-[30px]">
                        <h1 className="text-[30px] font-[600] text-color4">Sign up</h1>
                        <form className="flex flex-col gap-4 justify-center" onSubmit={handleSubmit}>
                            <Input value={name} type="text" placeholder="username" variant="outlined" className="w-[250px] px-5 py-6 " onChange={(e) => setName(e.target.value)} required />
                            <Input value={email} type="email" placeholder="email" variant="outlined" className="w-[250px] px-5 py-6" onChange={(e) => setEmail(e.target.value)} required />
                            <div className="relative">
                                <Input value={password} type={visible ? "text" : "password"} placeholder="password" variant="outlined" className="w-[250px] px-5 py-6" onChange={(e) => setPassword(e.target.value)} required />
                                {visible ? (
                                    <AiOutlineEye
                                        className="absolute right-2 top-[25%] cursor-pointer text-color5"
                                        size={27}
                                        onClick={() => setVisible(false)}
                                    />
                                ) : (
                                    <AiOutlineEyeInvisible
                                        className="absolute right-2 top-[25%] cursor-pointer text-color5"
                                        size={27}
                                        onClick={() => setVisible(true)}
                                    />
                                )}
                            </div>
                            <Input value={confirmPassword} placeholder="confirm password" variant="outlined" className="w-[250px] px-5 py-6" onChange={(e) => setConfirmPassword(e.target.value)} required />
                            <Input value={phoneNumber} type="number" placeholder="phonenumber" variant="outlined" onChange={(e) => setPhoneNumber(e.target.value)} className="w-[250px] px-5 py-6" />
                            <Button type="submit" className="text-md">sign up</Button>
                        </form>
                        <Link href="/login"><p className="text-[15px] mx-auto text-blue-700 underline">Already have an existing account!</p></Link>
                    </div>
                </div>) : ("")}
        </div>
    )
}

export default SignupPage
