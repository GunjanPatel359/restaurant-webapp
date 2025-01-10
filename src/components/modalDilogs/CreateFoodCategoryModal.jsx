import { useState } from 'react'
import { useModal } from '@/hooks/zusthook'
import { toast } from 'react-toastify'
import { useParams } from 'next/navigation'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog'
import { createCategory } from '@/actions/category'
import { useTheme } from '@/hooks/use-theme'

const CreateFoodCategoryModal = () => {
  const {theme}=useTheme()
  const params = useParams()
  const hotelId = params.hotelId
  const { isOpen, type, reloadCom, onClose } = useModal()
  const isModelOpen = isOpen && type === 'create-food-category'
  const [categoryName, setCategoryName] = useState('')
  const [description, setDescription] = useState('')

  if (!isModelOpen) {
    return null
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await createCategory({ hotelId, categoryName, description })
      if (response.success) {
        setCategoryName('')
        setDescription('')
        toast.success(response.message)
        return reloadCom()
      }
    } catch (error) {
      toast.error(error)
    }
  }
  return (
    <Dialog open={isModelOpen} onOpenChange={onClose}>
      <DialogContent className={`w-[480px] overflow-y-scroll theme-${theme} border border-color5`} aria-describedby="create-food-category">
        <DialogHeader>
          <DialogTitle>
          <div className='font-semibold text-2xl text-color5 mb-3 mx-5 m-3'>
            Create Category
          </div>
          <div className='h-[2px] bg-color5 mx-5'></div>
          </DialogTitle>
        </DialogHeader>
        <div className='px-5'>
          <div>
            <form className='flex flex-col gap-1' onSubmit={handleSubmit}>
              <div className='text-color5 font-semibold'>Category Name:</div>
              <input
                type='text'
                placeholder='Enter the category name'
                className='p-2 w-full text-color5 border border-color1 outline-color3 rounded  hover:border-color4 placeholder:text-color3 mb-1'
                required
                value={categoryName}
                onChange={e => setCategoryName(e.target.value)}
              />

              <div className='text-color5 font-semibold'>Category Description:</div>
              <input
                type='text'
                placeholder='Enter the category description'
                className='p-2 w-full text-color5 border border-color1 outline-color3 rounded  hover:border-color4 placeholder:text-color3 mb-1'
                required
                value={description}
                onChange={e => setDescription(e.target.value)}
              />
              <button type='submit' className='w-full bg-color5 text-white p-2 rounded hover:opacity-90'>Create Category</button>
              <button type='button' className='w-full bg-white text-color5 p-2 rounded border border-color5 hover:opacity-90' onClick={() => onClose()}>Cancel</button>
            </form>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default CreateFoodCategoryModal
