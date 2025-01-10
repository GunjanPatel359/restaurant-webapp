"use client"
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation';
import ProfileHeader from '@/components/profile/ProfileHeader';
import FoodInfo from '@/components/restaurant/FoodInfo';
import { getUserInfo } from '@/actions/user';
import { getFoodItemById } from '@/actions/fooditem';

const FoodItemPage = () => {
    const params=useParams()
    const foodItemId=params.foodItemId
    const [user,setUser]=useState('')
    const [foodItem,setFoodItem]=useState('')

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
        const foodinfo = async()=>{
            try {
                const res=await getFoodItemById(foodItemId)
                if(res.success){
                    setFoodItem(res.foodItem)
                }
            } catch (error) {
                console.log(error)
            }
        }
        if(foodItemId){
            foodinfo()
        }
    },[foodItemId])

    if(!foodItemId){
        return <div>Food Item not found</div>
    }

    if(!foodItem){
        return <div>Food Item not found</div>
    }

    console.log(foodItem)

  return (
    <div>
      <div>
        <ProfileHeader user={user} />
        <FoodInfo fooditem={foodItem}/>
      </div>
    </div>
  )
}

export default FoodItemPage
