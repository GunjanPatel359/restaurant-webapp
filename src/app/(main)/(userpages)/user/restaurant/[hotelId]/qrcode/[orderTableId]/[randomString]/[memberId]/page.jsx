"use client"
import ProfileHeader from "@/components/profile/ProfileHeader";
import { useEffect, useMemo, useState } from "react"
import { useRouter,useParams } from "next/navigation";
import { toast } from "react-toastify";
import { getUserInfo } from "@/actions/user";
import { acquireTable } from "@/actions/ordertable";
import { getHotelById } from "@/actions/hotel";
// import RestaurantInfo from "../components/restaurant/RestaurantInfo";

const UserOccupingTablePage = () => {
    const params=useParams()
    const router=useRouter()
    const {hotelId,orderTableId,randomString,memberId}=params
    const [user,setUser]=useState('')
    const [hotel,setHotel]=useState('')

    const initiatePage=async()=>{
        try {
            const response=await acquireTable(hotelId,orderTableId,randomString,memberId)
            console.log(response)
            if(response.success){
                toast.success(response.message)
                router.push(`/user/${hotelId}/${orderTableId}/user-table`)
            }
        } catch (error) {
            console.log(error)
            toast.error(error)
        }
    }
    useEffect(()=>{
        const hotelInfo=async()=>{
            try {
                const res=await getHotelById(hotelId)
                if(res.success){
                    setHotel(res.hotel)
                }
            } catch (error) {
                toast.error(error)
            }
        }
        if(hotelId && orderTableId && randomString){
            console.log(hotelId,orderTableId,randomString)
            const myObject = { hotelId: hotelId, orderTableId: orderTableId,randomString:randomString,memberId:memberId };
             const objectString = JSON.stringify(myObject);
            sessionStorage.setItem("orderTable",objectString);
        }
        if(hotelId){
            hotelInfo()
        }
    },[hotelId, memberId, orderTableId, randomString, user])

    if(!hotelId && !orderTableId && !randomString){
        <div>Invalid QR Code</div>
    }

    useEffect(()=>{
        const userinfo = async()=>{
            try{
                const res = await getUserInfo()
                if(res.success){
                    setUser(res.user)
                }
            }catch(e){
                toast.error("please login to continue")
            }    
        }
        userinfo()
    },[])

  return (
    <div>
      <ProfileHeader user={user} />
      {/* <RestaurantInfo hotel={hotel} /> */}
      {!user?(
        <>
        <div className="flex flex-col w-full m-auto text-rose-500 mt-10 gap-2">
            <div className="m-auto">
            Please login to continue
            </div>
            <div className="m-auto">
                <button className="m-auto bg-rose-500 text-white p-2 rounded hover:opacity-90" onClick={()=>router.push('/login')}>Click here to Login</button>
            </div>
            <div className="m-auto">
                {`If you don't have one`}
                </div>
            <div className="m-auto">
                <button className="m-auto bg-rose-500 text-white p-2 rounded" onClick={()=>router.push('/sign-up')}>Click here to Signup</button>
            </div>
        </div>
        </>
      ):(<>
      <div className="">
            <div className="flex mt-10">
                <button className="bg-color4 p-2 text-white rounded-full px-4 m-auto" onClick={initiatePage}>Click here to confirm your seat</button>
            </div>
        </div>
      </>)}
    </div>
  )
}

export default UserOccupingTablePage
