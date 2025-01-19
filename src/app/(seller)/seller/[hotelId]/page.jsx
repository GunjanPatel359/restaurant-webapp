"use client"
import { useEffect, useState } from "react"
import dynamic from "next/dynamic";
import { useRouter, useParams } from "next/navigation"
import { toast } from "react-toastify";
import { getSellerInfo } from "@/actions/seller"
import { BsFillInfoCircleFill } from "react-icons/bs";
import { MdOutlineManageAccounts } from "react-icons/md"
import { IoFastFoodOutline } from "react-icons/io5"
// import { MdManageAccounts } from "react-icons/md";
import { MdOutlineTableBar } from "react-icons/md";
import { LuSettings2 } from "react-icons/lu";
import { MdAttachMoney } from "react-icons/md";

import SellerProfileHeader from "@/components/sellerprofile/SellerProfileHeader"
import SlideMenu from "@/components/slidemenu/SlideMenu"
import { LoaderSelf } from "@/components/loader/loader";

const SellerRestaurant = dynamic(() => import('@/components/sellerhotel/SellerRestaurant'), {
  loading: () => <LoaderSelf/>,
});
const SellerManageRole = dynamic(() => import('@/components/sellerhotel/SellerManageRole'), {
  loading: () => <LoaderSelf/>,
});
const HotelFoodItems = dynamic(() => import('@/components/sellerhotel/HotelFoodItems'), {
  loading: () => <LoaderSelf/>,
});
const OrderTableManage = dynamic(() => import('@/components/sellerhotel/OrderTableManage'), {
  loading: () => <LoaderSelf/>,
});
const AdditionalSettingsHotel = dynamic(() => import('@/components/sellerhotel/AdditionalSettingsHotel'), {
  loading: () => <LoaderSelf/>,
});
const AdditonalTaxManage = dynamic(() => import('@/components/sellerhotel/AdditonalTaxManage.jsx'), {
  loading: () => <LoaderSelf/>,
});

const SellerRestaurantPage = () => {

  const params = useParams()
  const hotelId = params.hotelId
  const router = useRouter()
  const [seller, setSeller] = useState()
  const [loading, setLoading] = useState(true)
  const [select, setSelected] = useState(0)

  const menuItemList = [
    { icon: <BsFillInfoCircleFill size={22} />, text: "Hotel", alert: false },
    { icon: <MdOutlineManageAccounts size={22} />, text: "roles", alert: false },
    { icon: <IoFastFoodOutline size={22} />, text: "foodItem", alert: false },
    { icon: <MdOutlineTableBar size={22} />, text: "OrderTables", alert: false },
    { icon: <MdAttachMoney size={22} />, text: "Payment", alert: false },
    { icon: <LuSettings2 size={22} />, text: "preferences", alert: false }
  ]

  useEffect(() => {
    const userinfo = async () => {
      setLoading(true)
      try {
        const res = await getSellerInfo()
        if (res.success) {
          return setSeller(res.seller)
        }
        router.push('/seller/login')
      } catch (err) {
        console.log(err)
        toast.error(err)
        router.push("/seller/login")
      } finally {
        setLoading(false)
      }
    }
    userinfo()
  }, [router])

  return (
    <div>
      {!loading ? (
        <>
          <SellerProfileHeader seller={seller} />
          <div className="flex">
            <SlideMenu menuItemList={menuItemList} select={select} setSelected={setSelected} />
            <div className="w-full">
              {select === 0 && <SellerRestaurant hotelId={hotelId} />}
              {select === 1 && <SellerManageRole hotelId={hotelId} />}
              {select === 2 && <HotelFoodItems hotelId={hotelId} />}
              {select === 3 && <OrderTableManage hotelId={hotelId} />}
              {select === 4 && <AdditonalTaxManage hotelId={hotelId} />}
              {select === 5 && <AdditionalSettingsHotel />}
            </div>
          </div>
        </>
      ) : (
        <div className="w-full h-full">
          <LoaderSelf />
        </div>
      )}
    </div>
  )
}

export default SellerRestaurantPage
