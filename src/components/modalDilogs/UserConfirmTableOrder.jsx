/* eslint-disable react/prop-types */
import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { useModal } from "@/hooks/zusthook"
import Tooltip from "../customui/Tooltip"
import { Minus, Plus } from "lucide-react"
import { FiMinusCircle } from "react-icons/fi";

import { toast } from "react-toastify"
import { IoWarning } from "react-icons/io5"
import { handleUserOrder } from "@/actions/ordertable"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog"
import { useTheme } from "@/hooks/use-theme"

const UserConfirmTableOrder = () => {
    const params = useParams()
    const hotelId = params.hotelId
    const { theme } = useTheme
    const { isOpen, type, data, onClose, reloadCom } = useModal()
    const isModelOpen = isOpen && type === 'Ordertable-make-Order-user'
    const [loading, setLoading] = useState(false)

    const [order, setOrder] = useState([])
    const [tableId, setTableId] = useState()

    useEffect(() => {
        if (data?.orderTableOrderFood) {
            setOrder(data?.orderTableOrderFood.order)
            setTableId(data?.orderTableOrderFood.orderTabelId)
        }
    }, [data?.orderTableOrderFood])

    const handleOrder = async () => {
        setLoading(true)
        try {
            const res = await handleUserOrder(hotelId, tableId, order)
            if (res.success) {
                toast.success("order created successfully")
                reloadCom()
            }
        } catch (error) {
            toast.error(error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <Dialog open={isModelOpen} onOpenChange={onClose}>
            <DialogContent className={`w-[600px] overflow-y-scroll theme-${theme} border border-color5`} aria-describedby="Ordertable-make-Order-user">
                <DialogHeader>
                    <DialogTitle>
                        <div className="text-color5 font-semibold text-2xl">Confirm order</div>
                        <div className="w-full h-[1px] bg-color5 mt-2"></div>
                    </DialogTitle>
                </DialogHeader>
                {order.length <= 0 ? (
                    <div>
                        <div className="p-5">
                            <div className="text-color5"><IoWarning className="inline mr-1" size={23} />Please select somthing from the menu to proceed</div>
                            <button className="text-color5 text-center p-2 w-full border border-color5 rounded-md mt-5 hover:text-color4" onClick={() => onClose()}>Back to menu</button>
                        </div>
                    </div>
                ) : (
                    <div className="w-full p-5">
                        <div>
                            {order.length > 0 && (
                                <>
                                    {order.map((item, index) =>
                                        <FoodItemOpen item={item.item} order={order} setOrder={setOrder} key={index} index={index} />
                                    )}
                                </>
                            )}
                        </div>
                        <div className="flex gap-2 mt-2">
                            <button className="w-full bg-white text-color5 border border-color5 shadow p-2 rounded"
                                onClick={() => onClose()}
                            >Cancel</button>
                            <button className={`w-full bg-color5 text-white shadow p-2 rounded ${loading ? "" : "hover:opacity-90"}`} disabled={loading}
                                onClick={handleOrder}
                            >Order</button>
                        </div>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    )
}

const FoodItemOpen = ({ item, order, setOrder, index }) => {
    const [count, setCount] = useState(order[index].quantity)
    const onValueup = () => {
        const check = order.find((food) => {
            if ((food._id).toString() == (item._id).toString())
                return item
        })
        if (check) {
            const newOrder = order.map((food) => {
                if ((food._id).toString() == (item._id).toString())
                    return { ...food, quantity: food.quantity + 1 }
                return food
            })
            setOrder(newOrder)
        }
        setCount(count + 1)
    }
    const onValuedown = () => {
        const check = order.find((food) => {
            if ((food._id).toString() == (item._id).toString())
                return item
        })
        if (check && check.quantity > 1) {
            const newOrder = order.map((food) => {
                if ((food._id).toString() == (item._id).toString())
                    return { ...food, quantity: food.quantity - 1 }
                return food
            })
            setOrder(newOrder)
            setCount(count - 1)
            return
        }
        if (count > 1) {
            setCount(count - 1)
        }

    }
    const handleCancel = () => {
        const newOrder = order.filter((food) => {
            if ((food._id).toString() != (item._id).toString())
                return food
        })
        setOrder(newOrder)
    }
    return (
        <div className='p-2 bg-white border-b border-color2'>
            <div className='flex transition-all'>
                <FiMinusCircle className="my-auto mr-2 cursor-pointer text-color5" size={35} onClick={handleCancel} />
                <img
                    src={`${img_url}/${item.imageUrl}`}
                    className='h-[90px] rounded shadow shadow-color3'
                />
                <div className='ml-2 w-full flex-col flex gap-1'>
                    <div className='flex justify-between w-full'>
                        <div className='text-xl text-color5 font-semibold'>
                            {item.name}
                        </div>
                        <div>
                            <span>
                                <div className="text-color5 font-semibold text-xl">{item.price}/-</div>
                            </span>
                        </div>

                    </div>
                    <div className='flex justify-between w-full '>
                        <div className='text-color5'>{item.smallDescription}</div>
                        <div>
                            <span>
                                <div className='text-color5 font-semibold flex gap-2'>
                                    <span className="border border-color5 rounded text-center bg-color5 shadow">
                                        <Minus className="inline text-white cursor-pointer" onClick={onValuedown} />
                                    </span>
                                    <input type="number" value={count} onChange={() => { }} className="inline w-6 text-center outline-none border border-color5  rounded" inputMode="numeric" />
                                    <span className="border border-color5 rounded text-center bg-color5 shadow">
                                        <Plus className="inline text-white cursor-pointer" onClick={onValueup} />
                                    </span>
                                </div>
                            </span>
                        </div>
                    </div>
                    <div className='flex'>
                        <Tooltip position="right" content={`${item.veg ? 'veg' : 'non-veg'}`} TooltipStyle={`whitespace-nowrap ${item.veg ? 'bg-green-600 text-green-50 border-white shadow-sm shadow-black' : 'bg-red-600 text-red-50 border-white shadow-sm shadow-black'}`}>
                            <span className={`border-2 w-6 h-6 flex justify-evenly p-[2.3px] ${item.veg ? 'border-green-500' : 'border-red-500'}`}>
                                <span className={`m-auto mx-auto rounded-full w-full h-full ${item.veg ? 'bg-green-500' : 'bg-red-500'} `} size={17}>
                                </span>
                            </span>
                        </Tooltip>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default UserConfirmTableOrder
