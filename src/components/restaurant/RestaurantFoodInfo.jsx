import { useEffect, useState } from "react"
import { useParams } from "next/navigation";
import { toast } from "react-toastify";
import CategoryOpen from "./CategoryOpen";
import { getAllFoodItems } from "@/actions/fooditem";

const RestaurantFoodInfo = () => {
    const params=useParams()
    const hotelId=params.hotelId
    const [foodInfo, setFoodInfo] = useState([]);

    useEffect(()=>{
        const initialCom=async()=>{
            try {
                const response=await getAllFoodItems(hotelId)
                if(response.success){
                    setFoodInfo(response.food)
                }
            } catch (error) {
                toast.error(error.message)
            }
        }
        initialCom()
    },[hotelId])

    return (
        <div>
            <div className="mt-2 w-full">
                {/* <div className="">hello</div> */}
                <div className="m-2 lg:w-[70%] mx-auto">
                    {foodInfo && (
                        foodInfo.map((item,index)=>{
                            return (
                            <CategoryOpen item={item} key={index}/>)
                        })
                    )}
                </div>
            </div>
        </div>
    )
}

export default RestaurantFoodInfo
