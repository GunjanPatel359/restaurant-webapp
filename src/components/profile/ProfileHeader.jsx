/* eslint-disable react/prop-types */
import { User } from 'lucide-react'
import { IoFastFoodOutline } from 'react-icons/io5'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { SERVER_URL } from '@/lib/server'
import { userLogout } from '@/lib/authMiddleware';

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { IoMdExit } from 'react-icons/io'

const ProfileHeader = ({user}) => {
  const router=useRouter()

  const handleLogout=async()=>{
    try{
      const res=await userLogout()
      if(res.success){
        toast.success('Logged out successfully')
        router.push('/')
      }
    }catch(error){
      toast.error("somthing went wrong")
    }
  }
  return (
    <div>
      <div className='w-full shadow-md shadow-color1'>
        <div className='bg-gradient-to-tr from-color5 to-color4  w-full'>
          <div className='w-[80%] m-auto flex py-5 px-2 text-white h-[80px] justify-between'>
            <span className='flex text-4xl gap-x-4 cursor-pointer'>
              <IoFastFoodOutline size={40} color='white' />
              <span onClick={()=>router.push('/')}>Taste</span>
            </span>
            <span className='text-center items-center flex'>
              <Link href="/profile">
                {
                  user && user?.avatar ? (
                    <div className='border-2 border-white rounded-full' onClick={()=>router.push('/profile')}>
                      <img className='rounded-full w-[43px] h-[43px]' src={`${SERVER_URL}/uploads/${user.avatar}`} />
                    </div>) : (
                    <div className='border-2 border-white rounded-full p-1'>
                      <User size={30} color="white" className='text-color5' />
                    </div>
                  )
                }
              </Link>
              <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="ml-2 rounded-full p-1 text-red-500 border border-red-500 bg-white cursor-pointer hover:text-red-400 hover:border-red-400 hover:shadow-md shadow transition-all" onClick={handleLogout}>
                        <IoMdExit size={28} />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-red-500">Logout</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfileHeader
