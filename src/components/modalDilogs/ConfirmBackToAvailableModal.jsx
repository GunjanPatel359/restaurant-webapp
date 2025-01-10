import { useModal } from '@/hooks/zusthook'
import { toast } from 'react-toastify'
import { useParams } from 'next/navigation'
import { useState } from 'react'
import { IoWarning } from 'react-icons/io5'
// import { socket } from '../../../socket'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog'
import { useTheme } from '@/hooks/use-theme'
import { handleBackToAvailable } from '@/actions/ordertable'

const ConfirmBackToAvailableModal = () => {
  const {theme}=useTheme()
  const params = useParams()
  const hotelId = params.hotelId
  const { isOpen, type, data, onClose } = useModal()
  const isModalOpen = isOpen && type === 'back-to-available'
  const [loading, setLoading] = useState(false)

  const fetchHandleBackToAvailable = async () => {
    setLoading(true)
    try {
      const res = await handleBackToAvailable(hotelId, data.backToAvailable._id)
      console.log(res)
      if (res.success) {
        toast.success("back to available succesfully")
        // socket.emit("restaurant/hotel/order-tables",hotelId)
        onClose()
      }
    } catch (error) {
      toast.error(error)
    } finally {
      setLoading(false)
    }
  }
  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className={`w-[500px] overflow-y-scroll theme-${theme} border border-color5`} aria-describedby="confirm-back-to-available">
        <DialogHeader>
          <DialogTitle>
            <div className="text-color5 font-semibold text-2xl mb-2">
              Back To Available
            </div>
            <div className="w-full h-[2px] bg-color5"></div>
          </DialogTitle>
        </DialogHeader>
        <div>
          <div className='text-justify text-color5'>
            <IoWarning className='inline mr-1 text-color5' size={22} />
            Are you sure you want to transfer table number <span className='text-color5 font-semibold underline'>{data?.backToAvailable?.tableNumber}</span> to available?
          </div>
          <div className='flex w-full gap-1 mt-4'>
            <button className='text-white bg-color5 w-full p-2 rounded' onClick={fetchHandleBackToAvailable} disabled={loading}>Confirm</button>
            <button className='text-color5 bg-white w-full p-2 border border-color5 rounded' disabled={loading} onClick={() => onClose()}>cancel</button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default ConfirmBackToAvailableModal
