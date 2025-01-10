import { useModal } from '@/hooks/zusthook';
import { useState } from 'react'
import { IoWarning } from 'react-icons/io5';
import { useParams } from 'next/navigation';
import { toast } from 'react-toastify';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { deleteCategory } from '@/actions/category';
import { useTheme } from '@/hooks/use-theme';

const DeleteFoodCategory = () => {
    const { theme } = useTheme()
    const params = useParams()
    const hotelId = params.hotelId

    const { type, data, isOpen, reloadCom, onClose } = useModal();
    const isModelOpen = isOpen && type === "Delete-Food-Category";
    const [loading, setLoading] = useState(false)
    if (!isModelOpen) {
        return null
    }
    const handleClick = async () => {
        setLoading(true)
        try {
            const response = await deleteCategory({hotelId, categoryId:data.categoryDelete._id})
            if (response.success) {
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
            <DialogContent className={`w-[520px] overflow-y-scroll theme-${theme} border border-color5 pt-5 pb-5 px-9`} aria-describedby="delete-food-category">
                <DialogHeader>
                    <DialogTitle>
                    <div className="text-2xl font-semibold pb-3 text-color5">Delete Food Category</div>
                    <div className="w-full border border-color4 shadow-2xl shadow-color2"></div>
                    </DialogTitle>
                </DialogHeader>
                <div>
                    <div>
                        <div className='text-color5'>
                            <IoWarning size={25} className="inline mr-1" />Are you sure you want to delete <span className="font-semibold text-color5 underline">{data.categoryDelete.categoryName}</span>?
                        </div>
                        <div className='text-color5'>All the items having category <span className="font-semibold text-color5 underline">{data.categoryDelete.categoryName}</span> will be deleted.</div>
                        <div className="flex w-full gap-2 mt-4 mb-3">
                            <button className="w-[50%] bg-color5 text-white p-2 rounded text-center hover:opacity-90 cursor-pointer" onClick={handleClick} disabled={loading ? true : false}>Delete Food Category</button>
                            <button className="w-[50%] bg-white text-color5 p-2 rounded text-center border border-color5 hover:opacity-90 cursor-pointer" disabled={loading ? true : false} onClick={() => onClose()}>Cancel</button>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default DeleteFoodCategory
