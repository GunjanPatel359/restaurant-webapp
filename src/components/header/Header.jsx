/* eslint-disable react/prop-types */
import { IoFastFoodOutline } from 'react-icons/io5'
import { Command, CommandInput } from '../ui/command'
import { useRouter } from "next/navigation";
import Link from 'next/link'
import { User } from 'lucide-react'
import { getUserInfo } from '@/actions/user';
import { useEffect, useState } from 'react';

const Header = ({page}) => {
  const [user, setUser] = useState(null);
  useEffect(() => {
    const fetchUser = async () => {
      const userData = await getUserInfo();
      if (userData.success) {
        setUser(userData.user);
      }
    };
    fetchUser();
  }, []);
  console.log(user)
  const router=useRouter()
  return (
    <div className='w-full'>
      <div className='bg-gradient-to-tr from-color4 to-color5 w-full'>
        <div className='w-[80%] m-auto flex px-2 text-white h-[80px] justify-between'>
        <span className='flex text-4xl gap-x-4 cursor-pointer my-auto'>
          <IoFastFoodOutline size={40} color='white' />
          <span>Taste</span>
        </span>
        <span className='text-center items-center my-auto'>
          <Command className='bg-white text-color5 rounded w-[300px]'>
            <CommandInput placeholder='Enter the shop or dish name' />
          </Command>
        </span>
        {user?(<>
          {user?.avatar ? (
                    <span className='border-2 border-color4 rounded-full min-h-fit p-[1px] my-auto cursor-pointer' onClick={()=>router.push('/profile')}>
                      <img className='rounded-full w-[50px] h-[50px]' src={`uploads/${user.avatar}`} />
                    </span>) : (
                    <span className='border-2 border-white rounded-full my-auto p-1 cursor-pointer' onClick={()=>router.push('/profile')}>
                      <User size={30} color="white" className='text-color5' />
                    </span>
                  )}
          </>):(
            <>
            <span className='text-center items-center my-auto'>
          <Link href='/login'>
            <span className="text-lg text-white bg-transparent hover:text-color0 px-4 font-semibold">
              SignIn
            </span>
          </Link>/
          <Link href='/sign-up'>
            <span className="text-lg text-white bg-transparent hover:text-color0 px-4 font-semibold">
              Signup
            </span>
          </Link>
        </span>
            </>
          )
        }
        </div>
      </div>

      <div className='w-full py-2'>
        <div className='w-[80%] m-auto'>

      <span className=''>
        <ul className='flex gap-x-1 items-center text-center text-lg'>
          <Link href='/home'>
            <span className={`hover:text-color5 text-md rounded-[5px] transition duration-300 p-3 bg-transparent font-semibold ${page==='home'?"text-color5":""}`}>
              Home
            </span>
          </Link>
          <Link href='/restaurants'>
            <span className='hover:text-color5 text-md rounded-[5px] transition duration-300 p-3 bg-transparent font-semibold'>
              Restaurants
            </span>
          </Link>
          <Link href='food-items'>
            <span className='hover:text-color5 text-md rounded-[5px] transition duration-300 p-3 bg-transparent font-semibold'>
              Dishes
            </span>
          </Link>
          <Link href=''>
            <span className='hover:text-color5 text-md rounded-[5px] transition duration-300 p-3 bg-transparent font-semibold'>
              Contact Us
            </span>
          </Link>
        </ul>
      </span>
        </div>
      </div>
    </div>
  )
}

export default Header
