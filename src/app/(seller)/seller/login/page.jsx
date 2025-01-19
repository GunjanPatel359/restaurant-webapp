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

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getSellerInfo, sellerLogin } from '@/actions/seller'
import { LoaderSelf } from '@/components/loader/loader'

const SellerLoginPage = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter()

  useEffect(()=>{
    async function fetchSeller(){
      try {
        setLoading(true)
        const res = await getSellerInfo()
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
    email: z.string().email({
      message: "* please provide valid email"
    }),
    password: z.string().min(5, {
      message: '* invalid password'
    })
  })

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  })
  const onSubmit = async (values) => {
    try {
      const res = await sellerLogin(values)
      console.log(res)
      if (res.success) {
        toast.success(res.message)
        router.push("/seller/profile")
      }
      if (!res.success) {
        toast.error(res.message)
      }
    } catch (error) {
      console.log(error)
      toast.error(error)
    }
  }

  return (
    <div className="theme-blue">
      {!loading ? (
        <div className='w-full flex m-auto justify-center h-[100vh]'>
          <div className='lg:w-[30%] sm:w-[60%] flex m-auto justify-center border border-color3 shadow shadow-color0 p-8'>
            <div className='w-[250px]'>
              <p className='text-center text-2xl from-neutral-700 font-bold mb-5 text-color5'>Seller Login In</p>
              <Form {...form} >
                <form onSubmit={(e) => {
                  e.preventDefault(); 
                  form.handleSubmit(onSubmit)(e); 
                }} className='space-y-2'>

                  <FormField
                    control={form.control}
                    name='email'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-color5 ">Email address</FormLabel>
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
                  <div className='pt-2'>
                    <Button type='submit' className="bg-color3 rounded hover:bg-color4 py-0 w-full text-white">Login In</Button>
                  </div>
                </form>
              </Form>
              <hr className='hidden h-6' />
              <div className='text-center mt-2'>
                <Link href="/seller/sign-up" className='underline text-color4 hover:text-color5 text-center'>{`Don't have an Account`}</Link>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <LoaderSelf/>
      )}
    </div>
  )
}

export default SellerLoginPage
