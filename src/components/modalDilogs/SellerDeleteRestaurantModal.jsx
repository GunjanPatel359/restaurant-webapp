import { toast } from 'react-toastify';
import { useModal } from '@/hooks/zusthook';
import { IoIosWarning } from "react-icons/io";
import { useRouter } from 'next/navigation';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { useTheme } from '@/hooks/use-theme';
import { deleteRestaurant } from '@/actions/seller';

const SellerDeleteRestaurantModal = () => {
  const {theme}=useTheme()
  const router=useRouter()
  const { isOpen, type, onClose, data } = useModal()
  const isModelOpen = isOpen && type === 'delete-restaurant'
  const handleClick = async () => {
    try {
      const res = await deleteRestaurant()
      if (res.success) {
        router.push('/seller/profile')
        onClose()
      }
    } catch (error) {
      toast.error(error.message)
    }
  }
  return (
    <Dialog open={isModelOpen} onOpenChange={onClose}>
      <DialogContent className={`w-[400px] overflow-y-scroll theme-${theme} border border-color5`} aria-describedby="delete-restaurant">
        <DialogHeader>
          <DialogTitle>
          <div className='font-bold text-xl pl-3 text-color5 mb-2'>Deleting {data?.name}</div>
          <div className='w-[95%] h-[1px] bg-color4 m-auto'></div>
          </DialogTitle>
        </DialogHeader>
        <div className='py-0'>
          <div className='px-2 text-justify text-color5'><IoIosWarning className='inline translate-y-[-1px]' size={20} /> Are You Sure? You want to delete <span className='text-color5 font-semibold underline'>{data?.name}</span>. This action cannot be undone.</div>
          <div className='flex flex-col w-[94%] m-auto'>
            <button className='text-color5 w-full p-2 border border-color5 rounded-xl mb-2 shadow-color3 shadow-inner mt-4' onClick={handleClick}>Delete</button>
            <button className='transition-all font-semibold text-white w-full p-2 border bg-color4 rounded-xl hover:opacity-90' onClick={() => onClose()}>Cancel</button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default SellerDeleteRestaurantModal
