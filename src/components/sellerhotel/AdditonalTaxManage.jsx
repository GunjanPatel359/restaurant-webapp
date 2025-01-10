import { updateHotelTaxData } from '@/actions/hotel'
import { getSellerHotel } from '@/actions/seller'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'

const AdditonalTaxManage = ({hotelId}) => {

    const [gstCharge, setgstCharge] = useState(0)
    const [serviceCharge, setServiceCharge] = useState(0)

    useEffect(() => {
        const initiatePage = async () => {
            try {
                const res = await getSellerHotel(hotelId)
                console.log(res)
                if (res.success) {
                    setgstCharge((res.hotel.hotelGSTTax).toFixed(2))
                    setServiceCharge((res.hotel.hotelServiceTax).toFixed(2))
                }
            } catch (error) {
                console.error(error)
                toast.error(error.message)
            }
        }
        initiatePage()
    }, [hotelId])

    const updateTaxInfo = async () => {
        try {
            console.log(gstCharge, serviceCharge)
            if (gstCharge == null || serviceCharge == null) {
                return toast.error("Please fill in the values");
            }
            const res = await updateHotelTaxData(hotelId,gstCharge, serviceCharge)
            if (res.success) {
                setgstCharge(res.hotel.hotelGSTTax)
                setServiceCharge(res.hotel.hotelServiceTax)
                toast.success("Tax info updated successfully");
            }
        } catch (error) {
            console.error(error)
            toast.error(error.message)
        }
    }

    return (
        <div className='m-5'>
            <div className='m-5 mt-8'>
                <div className='text-color5 font-semibold text-2xl mb-4'>
                    Additional Cost
                </div>
                <div className='flex flex-col gap-2'>
                    <div className='flex'>
                        <div className='text-color5 w-24 font-semibold'>GST Tax:</div>
                        <div className="ml-2">
                            <input
                                onChange={(e) => {
                                    const value = e.target.value;
                                    if (/^\d*\.?\d*$/.test(value)) {
                                        setgstCharge(value);
                                    }
                                }}
                                onBlur={() => {
                                    setgstCharge(parseFloat(gstCharge).toFixed(2));
                                }}
                                value={gstCharge}
                                type="number"
                                className="border border-color2 focus:outline-none rounded h-7 w-16 px-2 text-right focus:ring-1 text-color5"
                            />
                        </div>
                        <div className='ml-1 my-auto text-lg text-color5 font-semibold'>
                            %
                        </div>
                    </div>
                    <div className='flex'>
                        <div className='text-color5 w-24 font-semibold'>Service Tax:</div>
                        <div className="ml-2">
                            <input
                                onChange={(e) => {
                                    const value = e.target.value;
                                    if (/^\d*\.?\d*$/.test(value)) {
                                        setServiceCharge(value);
                                    }
                                }}
                                onBlur={() => {
                                    setServiceCharge(parseFloat(serviceCharge).toFixed(2));
                                }}
                                value={serviceCharge}
                                type="number"
                                className="border border-color2 focus:outline-none rounded h-7 w-16 text-right px-2 focus:ring-1 text-color5"
                            />
                        </div>
                        <div className='ml-1 my-auto text-lg text-color5 font-semibold'>
                            %
                        </div>
                    </div>
                    <div className='mt-3'>
                        <span className='border-2 border-color5 p-2 py-1 rounded text-color5 font-semibold cursor-pointer hover:shadow-md transition-all ml-24' onClick={() => updateTaxInfo()}>Update</span>
                    </div>
                </div>

                <div className="mt-5 flex items-center bg-color0 border border-color2 rounded-lg p-3 text-color4 text-sm">
                    <span className='flex mr-2 border border-color0 rounded-full w-6 h-6 bg-color5'>
                        <span className="text-white mx-auto my-auto text-md">i</span>
                    </span>
                    <span><span className='text-color5'>Note:</span> You can set the GST and service charge for customer bills here.</span>
                </div>

                <div className='text-color5 font-semibold text-2xl mb-4 mt-4'>
                    Payment Methods
                </div>

                <div>
                    {/* remaining to implement */}
                </div>

            </div>
        </div>
    )
}

export default AdditonalTaxManage
