/* eslint-disable react/prop-types */
import { useModal } from "@/hooks/zusthook"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useParams } from "next/navigation"
import { toast } from "react-toastify"
import { getAllAvailableTables, getAllOccupiedTables, handleOfflineBooking } from "@/actions/ordertable"
// import { socket } from "../../socket"

const OrderTables = ({hotelId}) => {
    return (
        <div>
            <div>
                <div className="m-4">
                    <AvailableTables hotelId={hotelId} />
                    <OccupiedTables hotelId={hotelId} />
                </div>
            </div>
        </div>
    )
}

const AvailableTables = ({ hotelId }) => {
    const [availableTables, setAvialableTables] = useState([])
    // useEffect(()=>{
    //     socket.connect()
    // },[])
    useEffect(() => {
        const initiatePage = async () => {
            try {
                const response = await getAllAvailableTables(hotelId)
                if (response.success) {
                    setAvialableTables(response.tables)
                }
            } catch (error) {
                toast.error(error)
            }
        }
        initiatePage()
        // socket.on(`restaurant/${hotelId}/order-tables`,()=>{
        //     initiatePage()
        // })
        // return ()=>{
        //     socket.off(`restaurant/${hotelId}/order-tables`)
        // }
    }, [hotelId])
    return (
        <>
            <div>
                <h1 className="text-2xl font-bold text-color5 ml-3">Available Tables</h1>
                <div className="w-full flex flex-wrap">
                    {availableTables.length > 0 ? availableTables.map((item, index) => {
                        return (
                            <AvailableTableBox key={index} table={item} />
                        )
                    }):(
                        <>
                        <div className="w-full text-center text-2xl text-color5 p-4" >No Available Tables</div>
                        </>
                    )}
                </div>
            </div>
        </>
    )
}

const OccupiedTables = ({ hotelId }) => {
    const [occupiedTables, setOccupiedTables] = useState([])
    useEffect(() => {
        const initiatePage = async () => {
            try {
                const response = await getAllOccupiedTables(hotelId)
                if (response.success) {
                    setOccupiedTables(response.tables)
                }
            } catch (error) {
                toast.error(error)
            }
        }
        initiatePage()
        // socket.on(`restaurant/${hotelId}/order-tables`,()=>{
        //     initiatePage()
        //     console.log("working")
        // })
        // return ()=>{
        //     socket.off(`restaurant/${hotelId}/order-tables`)
        // }
    }, [hotelId])
    return (
        <>
            <div>
                <h1 className="text-2xl font-bold text-color5 ml-3">Occupied Tables</h1>
                <div className="w-full flex flex-wrap">
                    {occupiedTables.length>0 && occupiedTables.map((item, index) => {
                        return (
                            <OccupiedTableBox key={index} table={item} hotelId={hotelId} />
                        )
                    })}
                </div>
            </div>
        </>
    )
}

const AvailableTableBox = ({ table }) => {
    const {hotelId}=useParams()
    const {onOpen}=useModal()
    const handleOfflineTable=async()=>{
        try {
            const res=await handleOfflineBooking(hotelId,table._id)
            if(res.success){
                toast.success('Table is now occupied')
            }
        } catch (error) {
            toast.error(error.message)
        }
    }
    return (
        <>
            <div className="m-2 p-4 bg-color0 rounded border border-color5 flex flex-col gap-1 shadow-md">
                <div className="text-color5"><span className="text-color5 font-semibold">Table Number:</span> {table.tableNumber}</div>
                <div className="text-color5"><span className="text-color5 font-semibold">Table Description:</span> {table.tableDescription}</div>
                <div className="text-color5"><span className="text-color5 font-semibold">Status:</span> {table.status}</div>
                <div className="text-color5"><span className="text-color5 font-semibold">Seats:</span> {table.seats}</div>
                <button className="bg-color5 w-full rounded p-1 text-white mt-2 shadow hover:opacity-90 transition-all"
                onClick={()=>onOpen('table-qr-code',{QrCodeSetUserTable:table})}>Scan QR Code</button>
                <button className="bg-white text-color5 p-1 mt-1 border border-color5 rounded shadow" onClick={handleOfflineTable}>offline occupied</button>
            </div>
        </>
    )
}

const OccupiedTableBox = ({ table,hotelId }) => {
    const router=useRouter()
    const {onOpen}=useModal()
    return (
        <>
            <div className="m-2 p-4 bg-color0 rounded border border-color5 flex flex-col gap-1 shadow-md">
                <div className="text-color5"><span className="text-color5 font-semibold">Table Number:</span> {table.tableNumber}</div>
                <div className="text-color5"><span className="text-color5 font-semibold">Table Description:</span> {table.tableDescription}</div>
                <div className="text-color5"><span className="text-color5 font-semibold">Status:</span> {table.status}</div>
                <div className="text-color5"><span className="text-color5 font-semibold">Seats:</span> {table.seats}</div>
                <button className="bg-color5 w-full rounded p-1 text-white mt-2 shadow hover:opacity-90 transition-all" onClick={()=>router.push(`/seller/restaurant/${hotelId}/ordertable/${table._id}`)}>View Orders</button>
                <button className="bg-white text-color5 p-1 mt-1 border border-color5 rounded shadow" onClick={()=>onOpen("back-to-available",{backToAvailable:table})}>Cancel Booking</button>
            </div>
        </>
    )
}

export default OrderTables
