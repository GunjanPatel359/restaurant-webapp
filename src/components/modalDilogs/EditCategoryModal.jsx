import { useModal } from "@/hooks/zusthook";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { toast } from "react-toastify";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { editCategory } from "@/actions/category";
import {useTheme} from "@/hooks/use-theme"

const EditCategoryModal = () => {
  const { theme } = useTheme()
  const params = useParams()
  const hotelId = params.hotelId
  const { type, data, isOpen, reloadCom, onClose } = useModal();
  const isModelOpen = isOpen && type === "edit-food-category";
  const [categoryData, setCategoryData] = useState('')
  const [categoryName, setCategoryName] = useState('')
  const [description, SetDescription] = useState('')

  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const setValues = () => {
      setCategoryName(categoryData.categoryName)
      SetDescription(categoryData.description)
    }
    if (data && data?.categoryItem) {
      setCategoryData(data.categoryItem)
      setValues()
    }
  }, [categoryData.categoryName, categoryData.description, data])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const response = await editCategory({hotelId, categoryId:categoryData._id, categoryName, description})
      console.log(response)
      if (response.success) {
        toast.success(response.message)
        reloadCom()
      }
    } catch (error) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={isModelOpen} onOpenChange={onClose}>
      <DialogContent className={`w-[500px] overflow-y-scroll theme-${theme} border border-color5 pt-5 pb-5 px-9`} aria-describedby="delete-food-category">
        <DialogHeader>
          <DialogTitle>
          <div className='font-semibold text-2xl text-color5 mb-3'>
              Edit Food Category
            </div>
            <div className='w-full h-[2px] bg-color5'></div>
          </DialogTitle>
        </DialogHeader>
        <div>
          <div>
            <div>
              <form className='flex flex-col gap-1' onSubmit={handleSubmit}>
                <div className=' font-semibold text-color5'>Category Name:</div>
                <input
                  type='text'
                  placeholder='Enter the category name'
                  className='p-2 w-full text-color5 border border-color1 outline-color3 rounded  hover:border-color4 placeholder:text-color3 mb-1'
                  required
                  value={categoryName}
                  onChange={e => setCategoryName(e.target.value)}
                />

                <div className=' font-semibold text-color5'>Category Description:</div>
                <input
                  type='text'
                  placeholder='Enter the category description'
                  className='p-2 w-full text-color5 border border-color1 outline-color3 rounded  hover:border-color4 placeholder:text-color3 mb-1'
                  required
                  value={description}
                  onChange={e => SetDescription(e.target.value)}
                />
                <button type="submit" className='w-full bg-color5 text-white p-2 rounded border border-color5 hover:opacity-90' disabled={loading}>Edit Food Category</button>
                <button type="button" className='w-full bg-white text-color5 p-2 rounded border border-color3 hover:opacity-90' disabled={loading} onClick={() => onClose()}>Cancel</button>
              </form>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default EditCategoryModal
