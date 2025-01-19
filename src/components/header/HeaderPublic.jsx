/* eslint-disable react/prop-types */
import { IoFastFoodOutline } from 'react-icons/io5'
import { Command, CommandInput } from '../ui/command'
import { Button } from '../ui/button'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { User } from 'lucide-react'
import { SERVER_URL } from '@/lib/server'

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { IoMdExit } from 'react-icons/io'

const HeaderPublic = ({ user }) => {
  const router = useRouter()
  const handleLogout = async () => {
    try {
      const res = await userLogout()
      if (res.success) {
        toast.success('Logged out successfully')
        router.push('/')
      }
    } catch (error) {
      toast.error("somthing went wrong")
    }
  }
  return (
    <div className='w-full shadow-md border-b border-color0'>
      <div className='bg-gradient-to-tr from-color4 to-color5 w-full'>
        <div className='md:w-[80%] sm:w-[90%] m-auto flex px-2 text-white h-[80px] justify-between'>
          <span className='flex text-4xl gap-x-4 cursor-pointer my-auto' onClick={() => router.push('/')}>
            <IoFastFoodOutline size={40} color='white' />
            <span>Taste</span>
          </span>
          {/* <span className='text-center items-center my-auto'>
          <Command className='bg-white text-color5 rounded w-[300px]'>
            <CommandInput placeholder='Enter the shop or dish name' />
          </Command>
        </span> */}
          {
            user ? (<>
              <div className="flex">
                {user?.avatar ? (
                  <span className='border-2 border-color4 rounded-full min-h-fit p-[2px] my-auto cursor-pointer bg-white' onClick={() => router.push('/profile')}>
                    <img className='rounded-full w-[43px] h-[43px]' src={`${SERVER_URL}/uploads/${user.avatar}`} />
                  </span>) : (
                  <span className='border-2 border-white rounded-full my-auto p-1 cursor-pointer' onClick={() => router.push('/profile')}>
                    <User size={30} color="white" className='text-color5' />
                  </span>
                )}
                <div className="flex">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="ml-2 rounded-full p-1 text-red-500 border border-red-500 bg-white cursor-pointer hover:text-red-400 hover:border-red-400 hover:shadow-md shadow transition-all my-auto" onClick={handleLogout}>
                        <IoMdExit size={28} />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-red-500">Logout</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                </div>
              </div>
            </>) : (
              <>
                <span className='text-center items-center justify-center flex'>
                  <Link href='/login'>
                    <Button className="text-lg hover:text-color1 bg-transparent hover:bg-transparent">
                      SignIn
                    </Button>
                  </Link>/
                  <Link href='/sign-up'>
                    <Button className="text-lg hover:text-color1 bg-transparent hover:bg-transparent">
                      Signup
                    </Button>
                  </Link>
                </span>
              </>
            )
          }
        </div>
      </div>
    </div>
  )
}

export default HeaderPublic
