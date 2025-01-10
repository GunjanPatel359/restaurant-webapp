"use client"
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'

import z from 'zod'
import { toast } from 'react-toastify'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createSeller, getSellerInfo } from '@/actions/seller'

const SellerSignupPage = () => {
  const [loading,setLoading]=useState(false);
  const router=useRouter()

  useEffect(()=>{
    async function fetchSeller(){
      try {
        setLoading(true)
        const res = await getSellerInfo()
        console.log(res)
        if(res.success){
          router.push('/seller/profile')
        }
      } catch (error) {
        console.log(error)
      }finally{
        setLoading(false)
      }
    }
    fetchSeller()
  },[])

  const formSchema = z.object({
    name: z.string().min(1, {
      message: '* Username must be at least 1 characters.'
    }),
    email: z.string().email({
      message:"* please provide valid email"
    }),
    password: z.string().min(5, {
      message: '* Password must be at least 5 characters.'
    }),
    confirmPassword: z.string().min(5)
  })

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: ''
    }
  })
  const onSubmit = async(values) => {
    try {
      if(values.password !== values.confirmPassword){
        return toast.error("password and confirmpassword do not match")
      }
      const res=await createSeller(values)
      if(res.success){
        toast.success(res.message)
      }
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className='theme-blue'>
    {!loading?(
    <div className='w-full flex m-auto justify-center h-[100vh]'>
      <div className='lg:w-[30%] sm:w-[60%] flex m-auto justify-center border border-color3 shadow shadow-color0 p-8'>
        <div className='w-[250px]'>
        <p className='text-center text-2xl font-bold text-color5 mb-5'>Sign Up</p>
        <Form {...form} >
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-2'>
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-color5">Seller name</FormLabel>
                  <FormControl>
                    <Input placeholder='Enter your name' 
                    className="rounded border border-color2 hover:border-color5"
                     {...field} />
                  </FormControl>
                  <FormMessage className="text-red-600" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='email'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-color5">Email address</FormLabel>
                  <FormControl>
                    <Input placeholder='Enter your email' 
                    className="rounded border border-color2 hover:border-color5"
                    {...field} />
                  </FormControl>
                  <FormMessage className="text-red-600" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='password'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-color5">Password</FormLabel>
                  <FormControl>
                    <Input
                      type='password'
                      required
                      placeholder='Enter your password'
                      className="rounded border border-color2 hover:border-color5"
                      {...field}
                      />
                  </FormControl>
                  <FormMessage className="text-red-600" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='confirmPassword'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-color5">Confirm Password</FormLabel>
                  <FormControl>
                    <Input
                      type='password'
                      required
                      placeholder='confirm password'
                      className="rounded border border-color2 hover:border-color5"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-red-600" />
                </FormItem>
              )}
            />
            <div className='pt-2'>
            <Button type='submit' className="bg-color3 rounded hover:bg-color4 py-0 w-full text-white">Submit</Button>
              </div>
          </form>
        </Form>
        <div className='text-center mt-2'>
        <Link href="/seller/login" className='underline text-color4 hover:text-color5'>{`Already have an Account`}</Link>
          </div>
        </div>
      </div>
    </div>
    ):("")}
    </div>
  )
}

export default SellerSignupPage
