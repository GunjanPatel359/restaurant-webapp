"use client"
import ProfileHeader from "@/components/profile/ProfileHeader"
import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { toast } from "react-toastify"
import RestaurantInfo from "@/components/restaurant/RestaurantInfo"
import RestaurantFoodInfo from "@/components/restaurant/RestaurantFoodInfo"
import { getUserInfo } from "@/actions/user"
import { getHotelById } from "@/actions/hotel"

const RestaurantPage = () => {
    const params=useParams()
    const hotelId=params.hotelId

    const [hotel,setHotel]=useState('')
    const [user,setUser]=useState('')

    useEffect(()=>{
        const userinfo = async()=>{
            const res = await getUserInfo()
              if(res.success){
                  setUser(res.user)
              }
        }
        userinfo()
    },[])

    useEffect(()=>{
        const intiatePage=async()=>{
            try {
                const response=await getHotelById(hotelId)
                if(response.success){
                    setHotel(response.hotel)
                }
            } catch (error) {
                toast.error(error)
            }
        }
        if(hotelId){
            intiatePage()
        }
    },[hotelId])

    if(!hotelId){
        return <div>Hotel not found</div>
    }

    if(!hotel){
        return <div>Hotel not found</div>
    }

  return (
    <div>
        <div>
        <ProfileHeader user={user} />
        <RestaurantInfo hotel={hotel} />
        <RestaurantFoodInfo />
        </div>
    </div>
  )
}

export default RestaurantPage
