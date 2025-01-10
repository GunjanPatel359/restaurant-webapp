import { useModal } from "@/hooks/zusthook";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useTheme } from '@/hooks/use-theme';
import { toast } from "react-toastify";
import { IoWarning } from "react-icons/io5";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog'
import { updateOrderTable } from "@/actions/ordertable";

const EditOrderTableInfoModal = () => {
  const { theme } = useTheme()
  const params = useParams()
  const hotelId = params.hotelId
  const { type, data, isOpen, reloadCom, onClose } = useModal();
  const isModelOpen = isOpen && type === "edit-order-table";
  const [tableNumber, setTableNumber] = useState()
  const [tableDescription, setTableDescription] = useState("")
  const [seats, setSeats] = useState()

  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (data && data.editOrderTable) {
      setTableNumber(data.editOrderTable.tableNumber)
      setTableDescription(data.editOrderTable.tableDescription)
      setSeats(data.editOrderTable.seats)
    }
  }, [data])

  if (!isModelOpen) {
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const response = await updateOrderTable({ hotelId, orderTableId:data.editOrderTable._id, tableDetails:{ tableNumber, tableDescription, seats}})
      console.log(response)
      if (response.success) {
        toast.success(response.message)
        reloadCom()
      }
    } catch (error) {
      console.log(error)
      toast.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={isModelOpen} onOpenChange={onClose}>
      <DialogContent className={`w-[520px] overflow-y-scroll theme-${theme} border border-color5 pt-5 pb-5 px-9`} aria-describedby="create-food-category">
        <DialogHeader>
          <DialogTitle>
            <div className='text-2xl font-semibold pb-3 text-color5'>Update Table</div>
            <div className='w-full border border-color4 shadow-2xl shadow-color2'></div>
          </DialogTitle>
        </DialogHeader>
        <div>
          <div>
            <form onSubmit={handleSubmit} className='flex flex-col gap-2 mt-4'>
              <div className='bg-white rounded border-2 border-color4 p-2 border-dotted'>
                <div className=' font-semibold text-color5'>Table Number:</div>
                <div className='flex justify-between'>
                  <input type='number' placeholder='Enter the table number' className='p-2 w-full text-color5 border border-color1 outline-color3 rounded  hover:border-color4 placeholder:text-color3' required value={tableNumber} onChange={(e) => setTableNumber(e.target.value)} />
                </div>
                <p className='pl-1 h-auto text-justify mt-1 text-color5'>
                  <IoWarning size={22} className='text-color5 inline mr-1' />
                  Please note that give the numbers accroding to your hotel
                </p>
              </div>

              <div className='p-2 border-color4 border-2 border-dotted'>
                <div className='font-semibold text-color5'>Role Description:</div>
                <input type='text' placeholder='Enter the role description' className='p-2 w-full text-color5 border border-color1 outline-color3 rounded  hover:border-color4 placeholder:text-color3' required value={tableDescription} onChange={(e) => setTableDescription(e.target.value)} />
              </div>

              <div className='bg-white rounded border-2 border-color4 p-2 border-dotted'>
                <div className=' font-semibold text-color5'>Number of seats:</div>
                <div className='flex justify-between'>
                  <input type='number' placeholder='Enter the number of seats' className='p-2 w-full text-color5 border border-color1 outline-color3 rounded  hover:border-color4 placeholder:text-color3' required value={seats} onChange={(e) => setSeats(e.target.value)} />
                </div>

              </div>
              <button type='submit' className='transition-all hover:opacity-90 bg-color5 p-2 text-white rounded' disabled={loading}>Update Table</button>
              <button type='button' className='transition-all hover:opacity-90 bg-white p-2 text-color5 rounded border border-color5' onClick={() => onClose()}>Cancel</button>
            </form>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default EditOrderTableInfoModal
