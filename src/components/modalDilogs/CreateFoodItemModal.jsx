import { useRef, useState } from 'react'
import { useModal } from '@/hooks/zusthook'
import { toast } from 'react-toastify'
import { Plus, X } from 'lucide-react'
import { Switch } from '../ui/switch'
import { IoWarning } from 'react-icons/io5'
import { useParams } from 'next/navigation'
import { useTheme } from '@/hooks/use-theme'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog'
import { createFoodItem } from '@/actions/fooditem'

const CreateFoodItemModal = () => {
  const { theme } = useTheme()
  const params = useParams()
  const hotelId = params.hotelId
  const { isOpen, type, data, reloadCom, onClose } = useModal()
  const isModelOpen = isOpen && type === 'create-food-item'

  const fileInputRef = useRef(null)
  const [previewImage, setPreviewImage] = useState(null)
  const [loading, setloading] = useState(false)

  const [name, setName] = useState('')
  const [smallDescription, setSmallDescription] = useState('')
  const [description, setDescription] = useState('')
  const [veg, setVeg] = useState(false)
  const [price, setPrice] = useState(0)
  const [tag, setTag] = useState("")
  const [foodTypes, setFoodTypes] = useState([])

  const handleImageChange = e => {
    if (e.target.files && e.target.files[0]) {
      setPreviewImage(e.target.files[0])
    }
  }

  const handletagkeydown = e => {
    if (e.keyCode === 13 && tag) {
      e.preventDefault()
      setFoodTypes([...foodTypes, tag])
      setTag('')
    } else if (e.keyCode === 32 && tag) {
      setFoodTypes([...foodTypes, tag])
      setTag('')
    } else if (e.keyCode === 8 && !tag && foodTypes.length > 0) {
      setFoodTypes(
        foodTypes.filter((item, i) => i != foodTypes.length - 1)
      )
    } else if (e.keyCode === 32 && !tag) {
      e.preventDefault()
    }
  }

  const handletagchange = e => {
    if (e.target.value != " ") {
      setTag(e.target.value)
    }
  }
  const handletagcancelbtn = ind => {
    setFoodTypes(foodTypes.filter((item, i) => i !== ind))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (price < 0) {
      return toast.warning("Please set the price")
    }
    setloading(true)
    try {
      const category = data.addfooditem
      const formdata = new FormData()
      formdata.append('name', name)
      formdata.append('smallDescription', smallDescription)
      formdata.append('description', description)
      formdata.append('veg', veg)
      formdata.append('price', price)
      formdata.append('item-image', previewImage)
      formdata.append('foodTypes', JSON.stringify(foodTypes))
      formdata.append('categoryId', category._id)
      const response = await createFoodItem(formdata,hotelId)
      console.log(response)
      if (response.success) {
        toast.success("Food Item created successfully")
        return reloadCom()
      }
    } catch (error) {
      toast.error(error)
    } finally {
      setloading(false)
    }
  }

  return (
    <Dialog open={isModelOpen} onOpenChange={onClose}>
      <DialogContent className={`w-[600px] h-[90vh] overflow-y-scroll theme-${theme} border border-color5 pt-5 pb-5 px-10`} aria-describedby="create-fooditem">
        <DialogHeader>
          <DialogTitle>
            <div className='font-semibold text-2xl text-color5 mb-3 text-center mt-3'>
            Create Food Item
            </div>
          </DialogTitle>
        </DialogHeader>
        {/* <div className='flex flex-col w-[550px] p-12 pt-2 pb-2'> */}
          <div>
            <form
              className='flex flex-col text-color5 gap-y-1'
              onSubmit={handleSubmit}
              encType='multipart/form-data'
            >
              <div
                onClick={() => fileInputRef.current.click()}
                className='w-full shadow-md h-[250px] flex justify-between  border-2 border-color5 cursor-pointer rounded-xl bg-color0'
              >
                {previewImage ? (
                  <img
                    className='transition-all w-[450px] h-auto rounded-xl border-2 border-white hover:opacity-90 shadow-sm'
                    src={URL.createObjectURL(previewImage)}
                  />
                ) : (
                  <>
                    <div className='w-full m-7 flex justify-normal border-2 border-dashed border-color5 rounded-xl'>
                      <div className='transition-all m-auto p-6 flex justify-between items-center align-middle bg-color1  hover:opacity-95 shadow-md rounded-full border-dashed border-2 border-color5'>
                        <Plus className='text-color5' size={40} />
                      </div>
                    </div>
                  </>
                )}
                <input
                  className='hidden'
                  type='file'
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  accept='.jpg,.jpeg,.png'
                />
              </div>

              <div className=' font-semibold mt-3 text-color5'>Food Name:</div>
              <input
                type='text'
                placeholder='Enter the Food name'
                className='p-2 w-full text-color5 border border-color5 outline-color4 rounded  hover:border-color4 placeholder:text-color3 shadow'
                required
                value={name}
                onChange={e => setName(e.target.value)}
              />

              <div className=' font-semibold text-color5'>small description:</div>
              <input
                type='text'
                placeholder='Enter the short description'
                className='p-2 w-full text-color5 border border-color5 outline-color4 rounded  hover:border-color4 placeholder:text-color3 shadow'
                required
                value={smallDescription}
                onChange={e => setSmallDescription(e.target.value)}
              />

              <div className=' font-semibold text-color5'>Food description:</div>
              <input
                type='text'
                placeholder='Enter the Food description'
                className='p-2 w-full text-color4 border border-color5 outline-color3 rounded  hover:border-color4 placeholder:text-color3 shadow'
                required
                value={description}
                onChange={e => setDescription(e.target.value)}
              />

              <div className='p-3 bg-white rounded border border-color5 mt-2 shadow'>
                <div className='flex justify-between'>
                  <span className='pl-1 font-semibold text-color5'>Pure Veg</span>
                  <Switch
                    checked={veg}
                    onCheckedChange={() => setVeg(!veg)}
                    className='my-auto mr-1'
                  />
                </div>
                <div className='w-[98%] m-auto bg-color4 h-[1px] mt-2'></div>
                <p className='pl-1 h-auto text-justify mt-2 text-color5'>
                  <IoWarning
                    size={22}
                    className='text-color5 inline mr-1'
                  />
                  Use this option carefully. It will be use for better user experince. Failed to do so result in decrease ratings
                </p>
              </div>

              <div className=' font-semibold mt-1 text-color5'>Food Tags:</div>
              <div className='border border-color5 focus:border-color5 outline-none rounded shadow'>
                <span className='flex w-full p-2 bg-transparent flex-wrap'>
                  {foodTypes &&
                    foodTypes.map((item, i) => {
                      return (
                        <span
                          key={i}
                          className='flex border rounded-xl border-color4 p-1 bg-color0 m-[1px] hover:bg-color1 shadow'
                        >
                          <span className=''>{item}</span>
                          <span className='flex justify-center align-middle items-center'>
                            <X
                              className='inline text-color5 h-full mt-[3px] ml-1 hover:text-color5 cursor-pointer'
                              size={14}
                              onClick={() => handletagcancelbtn(i)}
                            />
                          </span>
                        </span>
                      )
                    })}
                  <input
                    className='inline outline-0 border-0 p-1 focus-within:border-0 text-color5 rounded-xl outline-none  placeholder:text-color4'
                    type='text'
                    placeholder='Enter your foodtypes'
                    onKeyDown={handletagkeydown}
                    onChange={handletagchange}
                    value={tag}
                  />
                </span>
              </div>

              <div className='font-semibold text-color5'>Food Price:</div>
              <input
                type='number'
                pattern="\d+"
                placeholder='Enter the Role name'
                className='p-2 w-full text-color4 border border-color5 outline-color3 rounded  hover:border-color4 placeholder:text-color3 shadow'
                required
                value={price}
                onChange={e => setPrice(e.target.value)}
              />

              <button
                type="submit"
                disabled={loading ? true : false}
                className={`transition-all border border-color5 shadow p-2 bg-color5 rounded-xl text-white text-center mt-2 ${loading ? 'opacity-70' : 'hover:opacity-90'
                  }`}
              >
                Create Food Item
              </button>
              <button
                type="button"
                disabled={loading ? true : false}
                className={`transition-all border border-color5 shadow p-2 bg-white text-color5 rounded-xl text-center mb-5  ${loading ? 'opacity-70' : 'hover:opacity-90'
                  }`}
                onClick={() => onClose()}
              >
                Cancel
              </button>
            </form>
          </div>
        {/* </div> */}
      </DialogContent>
    </Dialog>
  )
}

export default CreateFoodItemModal
