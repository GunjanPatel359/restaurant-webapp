"use client"
import { useEffect, useState } from "react"
import { MdOutlineTableBar } from "react-icons/md";
import { ImSpoonKnife } from "react-icons/im";
import { useParams, useRouter } from "next/navigation"
import { toast } from "react-toastify";
import SellerProfileHeader from "@/components/sellerprofile/SellerProfileHeader";
import SlideMenu from "@/components/slidemenu/SlideMenu";
import OrderTables from "@/components/restaurantManage/OrderTables";
import ManageOrders from "@/components/restaurantManage/ManageOrders";
import { getSellerInfo } from "@/actions/seller";
import { checkIsMember } from "@/actions/member";

const SellerRestaurantManagePage = () => {
    const params = useParams()
    const hotelId = params.hotelId
    const router = useRouter()

    const [seller,setSeller]=useState()
    const [select, setSelected] = useState(0)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const userinfo = async () => {
            try {
                const res = await getSellerInfo()
                if (res.success) {
                    setSeller(res.seller)
                    return 
                }
                router.push('/seller/login')
            } catch (err) {
                toast.error(err)
                router.push("/seller/login")
            } 
        }

        const memberInfo = async () => {
            try {
                const response = await checkIsMember(hotelId)
                if (response.data) {
                    return
                }
                router.push('/seller/login')
            } catch (error) {
                router.push('/seller/login')
            } finally {
                setLoading(false)
            }
        }

        userinfo()
        memberInfo()
    }, [hotelId])

    const menuItemList = [
        { icon: <MdOutlineTableBar size={22} />, text: "Table", alert: false },
        { icon: <ImSpoonKnife size={22} />, text: "Order", alert: false },
    ]

    console.log("see")
    return (
        <div>
            {!loading ? (
                <div>
                    <SellerProfileHeader seller={seller} />
                    <div className='flex w-full transition-all duration-1000'>
                        <SlideMenu select={select} setSelected={setSelected} menuItemList={menuItemList} />
                        <div className='w-full'>
                            {select === 0 && <OrderTables hotelId={hotelId} />}
                            {select === 1 && <ManageOrders />}
                        </div>
                    </div>
                </div>
            ) : (
                <div>
                </div>
                // <LoadingSpinner /> // Optional loading component
            )}
        </div>
    );
};

export default SellerRestaurantManagePage
