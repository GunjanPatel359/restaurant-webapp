/* eslint-disable react/prop-types */
import { useState } from "react"
import { IoIosArrowDown } from "react-icons/io";
import FoodItemOpen from "./FoodItemOpen";

const CategoryOpen = ({ item }) => {
    const [open, setOpen] = useState(true)
    return (
        <div className="mb-1">
            <div className="flex bg-color1 text-color5 p-2 pl-4 w-full justify-between z-10">
                <div className="flex flex-col">
                    <div className="font-semibold text-2xl">
                        {item.categoryName}
                    </div>
                    <div>
                        {item.description}
                    </div>
                </div>
                <div className="flex">
                    <div className="m-auto mr-3">
                        <div className="border-1 bg-color0 p-1 cursor-pointer" onClick={()=>setOpen(!open)}>
                            <IoIosArrowDown className={`${open?"":"-rotate-90"} transition-all duration-500`} size={20} />
                        </div>
                    </div>
                </div>
            </div>
            <div className={`ease-linear duration-500 transition-all ${open?"max-h-screen overflow-clip":"max-h-0 overflow-hidden"}`}>
                {item?.foodItemIds && (
                    <div>
                    {item.foodItemIds.length > 0 && (
                        <div>
                        {
                            item.foodItemIds.map((item,i)=>{
                                console.log(item)
                                return (
                                    <FoodItemOpen item={item} key={i} />
                                )
                            },[])
                        }
                        </div>
                    )}
                    </div>
                )}
            </div>
        </div>
    )
}

export default CategoryOpen
