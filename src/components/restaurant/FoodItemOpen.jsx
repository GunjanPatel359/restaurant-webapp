/* eslint-disable react/prop-types */

import { SERVER_URL } from "@/lib/server"
import RatingShow from "../customui/RatingShow"
import Tooltip from '../customui/Tooltip'
import { useRouter } from "next/navigation"

const FoodItemOpen = ({ item }) => {
  const router = useRouter()
  return (
    <div className='p-2 bg-white border-b border-color2 cursor-pointer' onClick={() => router.push(`/food-item/${item._id}`)}>
      <div className='flex transition-all'>
        <div className="h-[90px] overflow-hidden shadow shadow-color4 rounded-md shadow-inner-custom">
          <img className="h-full object-cover transition-transform duration-500 ease-in-out transform hover:scale-110 rounded-md cursor-pointer" src={`${SERVER_URL}/uploads/${item.imageUrl}`} />
        </div>
        <div className='ml-2 w-full'>
          <div className='flex justify-between w-full'>
            <div className='text-xl text-color5 font-semibold flex'>
              {item.name}
              <div className="flex ml-1 my-auto">
                <Tooltip position="right" content={`${item.veg ? 'veg' : 'non-veg'}`} TooltipStyle={`whitespace-nowrap ${item.veg ? 'bg-green-600 text-green-50 border-white shadow-sm shadow-black' : 'bg-red-600 text-red-50 border-white shadow-sm shadow-black'}`}>
                  <span className={`border-2 w-6 h-6 flex justify-evenly p-[2.3px] ${item.veg ? 'border-green-500' : 'border-red-500'}`}>
                    <span className={`m-auto mx-auto rounded-full w-full h-full ${item.veg ? 'bg-green-500' : 'bg-red-500'} `} size={17}>
                    </span>
                  </span>
                </Tooltip>
              </div>
            </div>
          </div>

          <div className='flex justify-between w-full'>
            <div className='text-color5'>{item.smallDescription}</div>
            <div>
              <span>
                <div className='text-color5 font-semibold'>
                  {item.price}/-
                </div>
              </span>
            </div>
          </div>
          <div className='flex'>
            <RatingShow ratingCount={item.avgreview} maxRatingCount={5} size={18} />
            <span className="ml-1 text-color5 text-md"> {parseFloat(item.avgreview).toFixed(1)}/5</span>
            <span className="bg-color5 border-1 border-color4 p-1 px-3 rounded-full text-xs text-white ml-1">{item.totalReview.toString().length < 4
              ? `${'0'.repeat(4 - item.totalReview.toString().length)}${item.totalReview}`
              : item.totalReview}</span>
          </div>
        </div>
      </div>
      {/* <div className="m-1">
        {item.foodTypes.map((item,i)=>{
          return <span key={i} className="p-1 rounded border border-color5 text-sm text-white bg-color5 mr-2">
            {item}
          </span>
        })}
      </div> */}
    </div>
  )
}

export default FoodItemOpen
