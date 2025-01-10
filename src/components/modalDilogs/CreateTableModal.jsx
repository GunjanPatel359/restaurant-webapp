import { useState } from 'react'
import { useModal } from '@/hooks/zusthook'
import { useParams } from 'next/navigation'
import { IoWarning } from 'react-icons/io5'
import { toast } from 'react-toastify'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog'
import { createOrderTable } from '@/actions/ordertable'
import { useTheme } from '@/hooks/use-theme'

const CreateTableModal = () => {
  const { theme } = useTheme()
  const params = useParams()
  const hotelId = params.hotelId
  const { isOpen, type, reloadCom, onClose } = useModal()
  const [tableNumber, setTableNumber] = useState()
  const [tableDescription, setTableDescription] = useState("")
  const [seats, setSeats] = useState()

  const isModelOpen = isOpen && type === 'create-order-table'
  if (!isModelOpen) {
    return null
  }
  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await createOrderTable(hotelId,tableNumber, tableDescription, seats)
      if (response.success) {
        setTableNumber()
        setTableDescription('')
        setSeats()
        toast.success(response.message)
        reloadCom()
      } else {
        toast.error(response.message)
      }
    } catch (error) {
      console.log(error)
      return toast.error(error.message)
    }
  }
  return (
    <Dialog open={isModelOpen} onOpenChange={onClose}>
      <DialogContent
        className={`w-[520px] overflow-y-scroll theme-${theme} border border-color5 pt-5 pb-5 px-9`} aria-describedby="create-table">
        <DialogHeader>
          <DialogTitle>
          <div className='text-2xl font-semibold pb-3 text-color5'>Create Table</div>
          <div className='w-full border border-color5 shadow-2xl shadow-color2'></div>
          </DialogTitle>
        </DialogHeader>
        <div>
          <div>
            <form onSubmit={handleSubmit} className='flex flex-col gap-2'>
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
                <div className='font-semibold text-color5'>Table Description:</div>
                <input type='text' placeholder='Enter the Table description' className='p-2 w-full text-color5 border border-color1 outline-color3 rounded  hover:border-color4 placeholder:text-color3' required value={tableDescription} onChange={(e) => setTableDescription(e.target.value)} />
              </div>

              <div className='bg-white rounded border-2 border-color4 p-2 border-dotted'>
                <div className=' font-semibold text-color5'>Number of seats:</div>
                <div className='flex justify-between'>
                  <input type='number' placeholder='Enter the number of seats' className='p-2 w-full text-color5 border border-color1 outline-color3 rounded  hover:border-color4 placeholder:text-color3' required value={seats} onChange={(e) => setSeats(e.target.value)} />
                </div>
                {/* <p className='pl-1 h-auto text-justify mt-1'>
                                <IoWarning size={22} className='text-color5 inline mr-1'/>
                                Please note that give the numbers accroding to your hotel
                             </p> */}
              </div>
              <button type='submit' className='transition-all hover:opacity-90 bg-color5 p-2 text-white rounded'>Create Table</button>
              <button type='button' className='transition-all hover:opacity-90 bg-white p-2 text-color5 rounded border border-color5' onClick={() => onClose()}>Cancel</button>
            </form>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default CreateTableModal
