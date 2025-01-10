/* eslint-disable react/prop-types */
import { User } from 'lucide-react'
import { IoFastFoodOutline } from 'react-icons/io5'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { SERVER_URL } from '@/lib/server'

const ProfileHeader = ({user}) => {
  const router=useRouter()

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
                      <img className='rounded-full w-[50px]' src={`${SERVER_URL}/uploads/${user.avatar}`} />
                    </div>) : (
                    <div className='border-2 border-white rounded-full p-1'>
                      <User size={30} color="white" className='text-color5' />
                    </div>
                  )
                }
              </Link>
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfileHeader
