"use client"
import { Plus } from 'lucide-react'
import { useModal } from '@/hooks/zusthook';
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { IoSettingsOutline } from "react-icons/io5";
import MyTooltip from '../customui/Tooltip'
import { useRouter } from 'next/navigation'

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip"
import { SERVER_URL } from '@/lib/server';
import { getAllManagingHotels, getAllSellerHotels } from '@/actions/seller';

const SellerResturantInfo = () => {
  const router = useRouter()

  const { onOpen } = useModal()
  const [sellerHotels, setSellerHotels] = useState([])
  const [manageHotels, setManageHotels] = useState([])

  useEffect(() => {
    const fetchSellerHotels = async () => {
      try {
        const res = await getAllSellerHotels()
        console.log(res)
        if (res.success) {
          setSellerHotels(res.hotel)
        }
      } catch (error) {
        console.log(error)
        toast.error(error)
      }
    }
    fetchSellerHotels()
  }, [])

  useEffect(() => {
    const fetchManagingHotels = async () => {
      try {
        const res = await getAllManagingHotels()
        if (res.success) {
          setManageHotels(res.hotel)
        }
      } catch (error) {
        console.log(error)
        toast.error(error)
      }
    }
    fetchManagingHotels()
  }, [])


  return (
    <TooltipProvider>
      <div className='p-10 pt-1'>
        <div className='flex justify-end p-2 pr-4'>
          <Tooltip>
            <TooltipTrigger>
              <p className="text-color5 transition-all duration-200 bg-color1 p-1 rounded cursor-pointer hover:bg-color2 font-extrabold" onClick={() => onOpen("create-restaurant")}><Plus size={25} /></p>
            </TooltipTrigger>
            <TooltipContent className="p-0 rounded-full shadow-none shadow-color0 border-0">
              <p className='text-color5 border-0 bg-color0 p-2 rounded-full'>Create restaurant</p>
            </TooltipContent>
          </Tooltip>
        </div>
        {
          sellerHotels.length > 0 &&
          <div className='ml-3 mb-2 text-2xl text-color5 font-semibold'>My restaurants</div>
        }
        {sellerHotels.length > 0 && (
          <>
            <div className='w-full h-[300px] flex flex-wrap'>
              {sellerHotels.map((item, i) => {
                return (
                  <div key={i} className='transition-all duration-300 p-3 border min-w-[250px] border-color5 rounded-xl bg-white shadow-xl m-2 relative'
                  >
                    <div className='bg-white right-3 top-3 rounded-bl-[10px] rounded-tr-xl absolute p-[4px] border-t border-color4 border-r shadow-md shadow-color5 border-l border-l-color3 border-b border-b-color4'>
                      <MyTooltip position="right" content="settings" TooltipStyle="text-color5 bg-white border border-color4 ml-3 z-10 shadow mt-[-2px] shadow-lg">
                        <IoSettingsOutline className='text-color5 transition-all duration-500 cursor-pointer hover:rotate-180' size={25}
                          onClick={() => router.push(`/seller/${item._id}`)}
                        />
                      </MyTooltip>
                    </div>
                    <img src={`${SERVER_URL}/uploads/${item.imgUrl}`} className='h-[170px] rounded-xl m-auto' />
                    <div className='flex flex-col p-1'>
                      <div className='text-2xl text-color5 font-bold flex flex-wrap'>{item.name}</div>
                      <div className='text-color5 font-semibold flex flex-wrap'>Country: <span className='ml-1 text-color5 font-normal'>{item.addresses.country}</span></div>
                      <div className='text-color5 font-semibold flex flex-wrap'>State: <span className='ml-1 text-color5 font-normal'>{item.addresses.state}</span></div>
                      <div className='text-color5 font-semibold flex flex-wrap'>City: <span className='ml-1 text-color5 font-normal'>{item.addresses.city}</span></div>
                      <div className='text-color5 font-semibold mb-2 flex flex-wrap'>zipcode: <span className='ml-1 text-color5 font-normal'>{item.addresses.zipCode}</span></div>
                      <button className='mb-1 transition-all bg-color5 text-white p-1 rounded-xl px-3 hover:opacity-90 shadow'
                        onClick={() => router.push(`/seller/restaurant/${item._id}`)}
                      >View</button>
                      <button className='bg-white text-color5 p-1 rounded-xl px-3 border border-color5 shadow hover:text-color4' onClick={() => onOpen("delete-restaurant", item)}>Delete</button>
                    </div>
                  </div>
                )
              })}
            </div>
          </>
        )}

        {
          manageHotels.length > 0 &&
          <div className='ml-3 mb-2 text-2xl text-color5 font-semibold'>working Restaurant</div>
        }
        {manageHotels.length > 0 && (
          <>
            <div className='w-full h-[300px] flex flex-wrap'>
              {manageHotels.map((item, i) => {
                return (
                  <div key={i} className='transition-all duration-300 p-3 border min-w-[250px] border-color5 rounded-xl bg-white shadow-xl m-2 relative'
                  >
                    <div className='bg-white right-3 top-3 rounded-bl-[10px] rounded-tr-xl absolute p-[4px] border-t border-color4 border-r shadow-md shadow-color5 border-l border-l-color3 border-b border-b-color4'>
                      <MyTooltip position="right" content="settings" TooltipStyle="text-color5 bg-white border border-color4 ml-3 z-10 shadow mt-[-2px] shadow-lg">
                        <IoSettingsOutline className='text-color5 transition-all duration-500 cursor-pointer hover:rotate-180' size={25}
                          onClick={() => router.push(`/seller/${item._id}`)}
                        />
                      </MyTooltip>
                    </div>
                    <img src={`${SERVER_URL}/uploads/${item.imgUrl}`} className='h-[170px] rounded-xl m-auto' />
                    <div className='flex flex-col p-1'>
                      <div className='text-2xl text-color5 font-bold flex flex-wrap'>{item.name}</div>
                      <div className='text-color5 font-semibold flex flex-wrap'>Country: <span className='ml-1 text-color5 font-normal'>{item.addresses.country}</span></div>
                      <div className='text-color5 font-semibold flex flex-wrap'>State: <span className='ml-1 text-color5 font-normal'>{item.addresses.state}</span></div>
                      <div className='text-color5 font-semibold flex flex-wrap'>City: <span className='ml-1 text-color5 font-normal'>{item.addresses.city}</span></div>
                      <div className='text-color5 font-semibold mb-2 flex flex-wrap'>zipcode: <span className='ml-1 text-color5 font-normal'>{item.addresses.zipCode}</span></div>
                      <button className='mb-1 transition-all bg-color5 text-white p-1 rounded-xl px-3 hover:opacity-90 shadow'
                        onClick={() => router.push(`/seller/restaurant/${item._id}`)}
                      >View</button>
                    </div>
                  </div>
                )
              })}
            </div>
          </>
        )}
      </div>
    </TooltipProvider>
  )
}

export default SellerResturantInfo
