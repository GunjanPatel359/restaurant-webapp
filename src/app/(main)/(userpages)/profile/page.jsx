"use client"
import { useEffect, useState } from 'react'

import dynamic from 'next/dynamic';
import { toast } from 'react-toastify'
import { useRouter } from 'next/navigation'
import { User } from 'lucide-react'
import { LuSettings2 } from 'react-icons/lu'
import { IoMdRestaurant } from "react-icons/io";
import { FaRegAddressBook } from 'react-icons/fa'
import SlideMenu from '@/components/slidemenu/SlideMenu'
import ProfileHeader from '@/components/profile/ProfileHeader'
import { getUserInfo } from '@/actions/user'
import { LoaderSelf } from '@/components/loader/loader';

const ProfileInfo = dynamic(() => import('@/components/profile/ProfileInfo'), {
  loading: () => <LoaderSelf/>, // Optional loading state
});
const ProfileAddresses = dynamic(() => import('@/components/profile/ProfileAddresses'), {
  loading: () => <LoaderSelf/>,
});
const CurrentlyAssignedHotel = dynamic(() => import('@/components/profile/CurrentlyAssignedHotel'), {
  loading: () => <LoaderSelf/>,
});
const UserSettings = dynamic(() => import('@/components/profile/UserSettings.jsx'), {
  loading: () => <LoaderSelf/>,
});


const ProfilePage = () => {
  const router = useRouter()

  const [user, setUser] = useState(null)
  const [select, setSelected] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUserinfo = async () => {
      try {
        const res = await getUserInfo()
        if (!res.user) {
          router.push('/login')
        }
        setUser(res.user)
      } catch (err) {
        toast.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchUserinfo()
  }, [])

  const menuItemList = [
    { icon: <User size={25} />, text: "Profile", alert: false },
    { icon: <FaRegAddressBook size={25} />, text: "Addresses", alert: false },
    { icon: <IoMdRestaurant size={25} />, text: "currently Assigned", alert: false },
    { icon: <LuSettings2 size={22} />, text: "preferences", alert: false }
  ]

  return (
    <div>
      {!loading ? (
        <div>
          <ProfileHeader user={user} />

          <div className='flex w-full transition-all duration-1000'>

            <SlideMenu select={select} setSelected={setSelected} menuItemList={menuItemList} />

            <div className='w-full h-full'>
              {select === 0 && <ProfileInfo user={user} setUser={setUser} />}
              {select === 1 && <ProfileAddresses user={user} />}
              {select === 2 && <CurrentlyAssignedHotel />}
              {select === 3 && <UserSettings />}
            </div>
          </div>
        </div>
      ) : (
        <LoaderSelf/>
      )}
    </div>
  )
}

export default ProfilePage
