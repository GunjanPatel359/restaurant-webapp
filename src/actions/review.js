"use server"

import jwt from "jsonwebtoken"
import User from "@/models/user";
import { cookies } from "next/headers";
import Review from "@/models/review";

export const hotelPublicReview=async(hotelId)=>{
    try {
        if(!hotelId){
            throw new Error('Hotel ID is required')
        }
        const cookieStore =await cookies();
        const token = cookieStore.get('token')?.value;

        if(token){
            const decoded=jwt.verify(token,process.env.JWT_SECRET_KEY)
            const user=await User.findById(decoded.id)
            if(user){
                const review=await Review.find({
                    reviewItemId:hotelId,
                    reviewType:"HOTEL",
                    userId: { $ne: user._id }
                }).populate("userId").limit(3)
                return {success:true,reviews:JSON.parse(JSON.stringify(review))}
            }
        }
        const reviews=await Review.find({
            reviewItemId:hotelId,
            reviewType:"HOTEL"
        }).populate("userId").limit(3)
        return {success:true,reviews:JSON.parse(JSON.stringify(reviews))}
    } catch (error) {
        console.log(error)
        return {success:false,mesage:error.message}
    }
}

export const foodPublicReview=async(foodItemId)=>{
    try {
        if(!foodItemId){
            throw new Error('food id is required')
        }
        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;
        if(token){
            const decoded=jwt.verify(token,process.env.JWT_SECRET_KEY)
            const user=await User.findById(decoded.id)
            if(user){
                const review=await Review.find({
                    reviewItemId:foodItemId,
                    reviewType:"FOOD",
                    userId: { $ne: user._id }
                }).populate("userId").limit(3)
                return {success:true,reviews:JSON.parse(JSON.stringify(review))}
            }
        }
        const reviews=await Review.find({
            reviewItemId:foodItemId,
            reviewType:"FOOD"
        }).populate("userId").limit(3)
        return {success:true,reviews:JSON.parse(JSON.stringify(reviews))}
    } catch (error) {
        console.log(error)
        return {success:false,message:error.message}
    }
}
