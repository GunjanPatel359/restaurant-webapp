"use client"
import { useEffect, useState } from 'react'

import { toast } from 'react-toastify'
import ProfileHeader from '@/components/profile/ProfileHeader'
import SlideMenu from '@/components/slidemenu/SlideMenu'
import ProfileInfo from '@/components/profile/ProfileInfo'
import UserSettings from '@/components/profile/UserSettings.jsx'
import { User } from 'lucide-react'
import { FaRegAddressBook } from 'react-icons/fa'
import ProfileAddresses from '@/components/profile/ProfileAddresses'
import CurrentlyAssignedHotel from "@/components/profile/CurrentlyAssignedHotel"
import { LuSettings2 } from 'react-icons/lu'
import { IoMdRestaurant } from "react-icons/io";
import { useRouter } from 'next/navigation'
import { getUserInfo } from '@/actions/user'

const ProfilePage = () => {
    const router=useRouter()
  
  const [user,setUser]=useState(null)
  const [select, setSelected] = useState(0)
  const [loading,setLoading]=useState(true)

  useEffect(() => {
    const fetchUserinfo = async () => {
      try {
        const res = await getUserInfo()
        if(!res.user){
          router.push('/login')
        }
        setUser(res.user)
      } catch (err) {
        toast.error(err)
      }finally{
        setLoading(false)
      }
    }
    fetchUserinfo()
  }, [])

  const menuItemList=[
    { icon:<User size={25}/>,text:"Profile", alert:false},
    { icon:<FaRegAddressBook size={25} />,text:"Addresses",alert:false },
    { icon:<IoMdRestaurant size={25} />,text:"currently Assigned",alert:false },
    { icon:<LuSettings2 size={22} />,text:"preferences",alert:false }    
  ]

  return (
    <div>
    {!loading ? (
      <div>
      <ProfileHeader user={user} />
      
      <div className='flex w-full transition-all duration-1000'>
      
        <SlideMenu select={select} setSelected={setSelected} menuItemList={menuItemList}/>

        <div className='w-full'>
          {select === 0 && <ProfileInfo user={user} setUser={setUser} />} 
          {select === 1 && <ProfileAddresses user={user}/>}
          {select === 2 && <CurrentlyAssignedHotel />}
          {select === 3 && <UserSettings />} 
        </div>
      </div>
    </div>
    ):(<div>hi</div>) }
    </div>
  )
}

export default ProfilePage
