"use client"
import { useEffect, useState } from "react"
import Header from "@/components/header/Header"
import RatingShow from "@/components/customui/RatingShow"

import { getUserInfo } from "@/actions/user"
import { getHomeFoodItems, getHomeHotels } from "@/actions/hotel"
import { SERVER_URL } from "@/lib/server"
import { useRouter } from "next/navigation"
import { LoaderSelf } from "@/components/loader/loader"

const HomePage = () => {

  const [loading, setLoading] = useState(true)
  const router=useRouter()
  const [hotel, setHotel] = useState([])
  const [foodItem, setFoodItem] = useState([])


  useEffect(() => {
    const userinfo = async () => {
      setLoading(true)
      try {
        const user = await getUserInfo()
        if (!user) {
          return
        }
      } catch (err) {
        console.log(err)
      } finally {
        setLoading(false)
      }
    }
    userinfo()
  }, [])

  useEffect(() => {
    const getDisplayHotel = async () => {
      try {
        const res = await getHomeHotels()
        console.log(res)
        if (res.success) {
          setHotel(res.hotels)
        }
      } catch (error) {
        console.log(error)
      }
    }
    getDisplayHotel()
  }, [])

  useEffect(() => {
    const getDisplayFoodItem = async () => {
      try {
        const res = await getHomeFoodItems()
        if (res.success) {
          setFoodItem(res.foodItems)
        }
      } catch (error) {
        console.log(error)
      }
    }
    getDisplayFoodItem()
  }, [])

  return (
    <div>
      {!loading? (
        <>
          <div>
            <Header page='home'/>
            <div className="w-full h-[500px] bg-[url('/food3.jpg')] bg-center bg-cover">
              <div className="bg-coloralpha w-full h-full flex items-center justify-center">
                <div className="">
                  hello
                </div>
              </div>
            </div>
            <div className="">
              <div className="mt-3 ">
                <div className="w-[85%] m-auto rounded">
                  <div className="w-full">
                    <div className="text-color5 text-3xl p-5 pb-1 font-semibold">
                      Restaurants
                    </div>
                    <div className="flex gap-3 overflow-y-scroll p-5">
                      {hotel.length>0 && hotel.map((item, index) => {
                        return (
                            <div className="bg-white min-w-[250px] w-[250px] h-[350px] border border-color1 rounded-2xl shadow-color0 overflow-hidden shadow-lg cursor-pointer" key={index} onClick={()=>router.push(`restaurant/${item._id}`)}>
                              <div className="relative w-full h-44 overflow-hidden shadow-md shadow-color0">
                                <img className="w-full h-full object-cover transition-transform duration-500 ease-in-out transform hover:scale-110 rounded-ss-lg rounded-se-lg cursor-pointer" src={`${SERVER_URL}/uploads/${item.imgUrl}`} alt="restaurant image" />
                              </div>
                              <div className="p-2 flex flex-col gap-1">
                                <div className="text-color5 font-semibold text-xl">{item.name}</div>
                                <div className="flex mb-2">
                                  <RatingShow ratingCount={item.avgreview} maxRatingCount={5} size={20} />
                                  <span className="bg-color5 border-1 border-color4 px-2 py-[1px] rounded-full text-sm text-white ml-1">{item.totalReview.toString().length < 4
                                    ? `${'0'.repeat(4 - item.totalReview.toString().length)}${item.totalReview}`
                                    : item.totalReview}</span>
                                </div>
                                <div className="flex gap-2">
                                  {item.cusineTypes.map((item,i) => {
                                    return (
                                        <div className="bg-color0 text-color4 px-2 py-[2px] rounded-xl" key={i}>
                                          {item}
                                        </div>
                                    )
                                  })}
                                </div>
                                <div className="text-color5 w-full text-justify"><span className="text-color5 font-semibold">location:</span> {`${item.addresses.address}, ${item.addresses.city}, ${item.addresses.state}, ${item.addresses.country}`
                                  .length > 35
                                  ? `${item.addresses.address}, ${item.addresses.city}, ${item.addresses.state}, ${item.addresses.country}`.substring(0, 35) + "..."
                                  : `${item.addresses.address}, ${item.addresses.city}, ${item.addresses.state}, ${item.addresses.country}`} </div>
                              </div>
                            </div>
                        )
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="">
              <div className="">
                <div className="w-[85%] m-auto rounded">
                  <div className="w-full">
                    <div className="text-color5 text-3xl pt-3 pl-5 pb-1 font-semibold">
                      Food Item
                    </div>
                    <div className="flex gap-3 overflow-y-scroll p-5">
                      {foodItem.length>=0 && foodItem.map((item, index) => {
                        return (
                            <div className="bg-white min-w-[250px] w-[250px] h-[400px] border border-color1 rounded-2xl shadow-color0 overflow-hidden shadow-lg cursor-pointer" key={index} onClick={()=>router.push(`food-item/${item._id}`)}>

                              {/* Image container with hover effect */}
                              <div className="relative w-full h-44 overflow-hidden shadow-md shadow-color0 group">
                                <img
                                  className="w-full h-full object-cover transition-transform duration-500 ease-in-out transform hover:scale-110 rounded-ss-lg rounded-se-lg cursor-pointer"
                                  src={`${SERVER_URL}/uploads/${item.imageUrl}`}
                                  alt={item.name}
                                />
                                {/* Overlay content that slides up from the bottom on hover */}
                                <div className="absolute bottom-0 w-full bg-black bg-opacity-70 text-white text-sm p-2 opacity-0 translate-y-full transition-all duration-500 group-hover:opacity-100 group-hover:translate-y-0 pointer-events-none group-hover:pointer-events-auto">
                                  <div className="flex">
                                    <div className="ml-1">
                                      <div className="font-semibold"><span className="mr-1 font-semibold">From:</span>{item.restaurantId.name}</div>
                                      <div className="flex">
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              <div className="p-2 flex flex-col gap-1">
                                <div className="text-color5 font-semibold text-xl">{item.name}</div>
                                <div className="text-color5">{item.smallDescription}</div>
                                <div className="flex mb-2">
                                  <RatingShow ratingCount={item.avgreview} maxRatingCount={5} size={20} />
                                  <span className="bg-color5 border-1 border-color4 px-2 py-[1px] rounded-full text-sm text-white ml-1">{item.totalReview.toString().length < 4
                                    ? `${'0'.repeat(4 - item.totalReview.toString().length)}${item.totalReview}`
                                    : item.totalReview}</span>
                                </div>
                                <div className="flex gap-2">
                                  {item.foodTypes.slice(0, 3).map((item,i) => {
                                    return (
                                        <div className="bg-color0 text-color4 px-2 py-[2px] rounded-xl" key={i}>
                                          {item}
                                        </div>
                                    )
                                  })}
                                </div>
                                <div className="text-color5 text-justify">
                                  <span className="mr-2 font-semibold text-color5 ">Description:</span>
                                  {item.description.length > 60 ? `${item.description}`.substring(0, 60) + "..." : item.description}
                                </div>
                              </div>
                            </div>
                        )
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      ):(
        <LoaderSelf/>
      )}
    </div>
  )
}

export default HomePage
