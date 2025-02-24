"use client"
import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic';

import { toast } from 'react-toastify'

import { User } from 'lucide-react'
import { BiPurchaseTagAlt } from "react-icons/bi";
import { HiOutlineBuildingStorefront } from "react-icons/hi2";
import { LuSettings2 } from 'react-icons/lu'
import { useRouter } from 'next/navigation';
import { getSellerInfo } from '@/actions/seller';

import SellerProfileHeader from '@/components/sellerprofile/SellerProfileHeader';
import SlideMenu from '@/components/slidemenu/SlideMenu'
import { LoaderSelf } from '@/components/loader/loader';

const SellerInfo = dynamic(() => import('@/components/sellerprofile/SellerInfo'), {
    loading: () => <LoaderSelf/>, // Optional loading state
});
const SellerResturantInfo = dynamic(() => import('@/components/sellerprofile/SellerResturantInfo'), {
    loading: () => <LoaderSelf/>,
});
const SellerSubscription = dynamic(() => import('@/components/sellerprofile/SellerSubscription'), {
    loading: () => <LoaderSelf/>,
});
const AdditionalSettingsSeller = dynamic(() => import('@/components/sellerprofile/AdditionalSettingsSeller.jsx'), {
    loading: () => <LoaderSelf/>,
});

const SellerProfilePage = () => {
    const router = useRouter()
    const [seller, setSeller] = useState(null)
    const [select, setSelected] = useState(0)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchSeller() {
            try {
                setLoading(true)
                const res = await getSellerInfo()
                if (res.success) {
                    return setSeller(res.seller)
                }
                router.push('/seller/login')
            } catch (error) {
                router.push('/seller/login')
                console.log(error)
            } finally {
                setLoading(false)
            }
        }
        fetchSeller()
    }, [])

    const menuItemList = [
        { icon: <User size={22} />, text: "Profile", alert: false },
        { icon: <HiOutlineBuildingStorefront size={22} />, text: "Hotel", alert: false },
        { icon: <BiPurchaseTagAlt size={22} />, text: "subscription", alert: false },
        { icon: <LuSettings2 size={22} />, text: "settings", alert: false }
    ]


    return (
        <div>
            {!loading ? (
                <div>
                    <div>
                        <SellerProfileHeader seller={seller} />

                        <div className='flex w-full transition-all duration-1000'>

                            <SlideMenu select={select} setSelected={setSelected} menuItemList={menuItemList} />

                            <div className='w-full h-full'>
                                {select === 0 && <SellerInfo seller={seller} setSeller={setSeller} />}
                                {select === 1 && <SellerResturantInfo />}
                                {select === 2 && <SellerSubscription />}
                                {select === 3 && <AdditionalSettingsSeller />}
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <LoaderSelf/>
            )}
        </div>
    )
}

export default SellerProfilePage