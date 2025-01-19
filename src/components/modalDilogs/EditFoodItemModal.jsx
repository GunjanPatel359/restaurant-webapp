import { useEffect, useRef, useState } from 'react'
import { useModal } from '@/hooks/zusthook'
import { useParams } from 'next/navigation'
import {useTheme} from "@/hooks/use-theme"
import { toast } from 'react-toastify'
import { Switch } from '../ui/switch'
import { IoWarning } from 'react-icons/io5'
import { X } from 'lucide-react'
import { GrPowerReset } from "react-icons/gr";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog'
import { SERVER_URL } from '@/lib/server'
import { updateFoodItemWithImage, updateFoodItemWithoutImage } from '@/actions/fooditem'

const EditFoodItemModal = () => {
    const { theme } = useTheme()
    const params = useParams()
    const hotelId = params.hotelId
    const { type, data, isOpen, reloadCom, onClose } = useModal()
    const isModelOpen = isOpen && type === 'edit-food-item'

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

    useEffect(() => {
        if (data?.editFoodItem) {
            const item = data.editFoodItem
            setName(item.name)
            setSmallDescription(item?.smallDescription)
            setDescription(item.description)
            setVeg(item.veg)
            setPrice(item.price)
            setTag(item.tag)
            setFoodTypes(item.foodTypes)
        }

    }, [data?.editFoodItem])

    const handleImageChange = (e) => {
        if (e.target.files && e.target.files[0]) {
          const file = e.target.files[0];
          const fileSizeInKB = file.size / 1024; // Convert file size to KB
      
          if (fileSizeInKB > 500) {
            toast.warning("File size must be less than 500 KB.");
            return;
          }
      
          setPreviewImage(file); // Update state with the valid file
        }
      };

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
            let formdata = new FormData()
            let response
            const category = data.editFoodItem
            if (previewImage == null) {
                formdata.append('name', name)
                formdata.append('smallDescription', smallDescription)
                formdata.append('description', description)
                formdata.append('veg', veg)
                formdata.append('price', price)
                formdata.append('foodTypes', JSON.stringify(foodTypes))
                formdata.append('categoryId', category.foodCategoryId)
                response=await updateFoodItemWithoutImage(formdata, hotelId, data.editFoodItem._id,data.editFoodItem.foodCategoryId
                )
            } else {
                formdata.append('name', name)
                formdata.append('smallDescription', smallDescription)
                formdata.append('description', description)
                formdata.append('veg', veg)
                formdata.append('price', price)
                formdata.append('item-image', previewImage)
                formdata.append('foodTypes', JSON.stringify(foodTypes))
                formdata.append('categoryId', category.foodCategoryId)
                response = await updateFoodItemWithImage(formdata, hotelId, data.editFoodItem._id,data.editFoodItem.foodCategoryId
                )
            }
            if (response.success) {
                toast.success("Food Item updated successfully")
                return reloadCom()
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        } finally {
            setloading(false)
        }
    }
    const handleReset = () => {
        setloading(true)
        try {
            const item = data.editFoodItem
            setName(item.name)
            setSmallDescription(item?.smallDescription)
            setDescription(item.description)
            setVeg(item.veg)
            setPrice(item.price)
            setTag(item.tag)
            setFoodTypes(item.foodTypes)
            setPreviewImage(null)
        } catch (error) {
            toast.error(error.message)
        } finally {
            setloading(false)
        }
    }
    return (
        <Dialog open={isModelOpen} onOpenChange={onClose}>
            <DialogContent className={`w-[550px] h-[90vh] overflow-y-scroll theme-${theme} border border-color5 pt-5 pb-5 px-9`} aria-describedby="edit-food-item">
                <DialogHeader>
                    <DialogTitle>
                        <div className='text-color5 text-2xl font-semibold mt-4 mb-2'>
                            Edit Food Item Info
                        </div>
                        <div className='w-full h-[2px] bg-color4 m-auto'></div>
                    </DialogTitle>
                </DialogHeader>
                <div className='flex flex-col'>
                    <div>
                        <form
                            onSubmit={handleSubmit}
                            className='flex flex-col text-color-500 gap-y-1'
                            encType='multipart/form-data'
                        >
                            <div className='flex w-full'>
                                <div
                                    onClick={() => fileInputRef.current.click()}
                                    className='m-auto shadow-md h-auto flex justify-between  border-2 border-color5 cursor-pointer rounded-xl bg-color0 shadow-color1'
                                >
                                    {previewImage ? (
                                        <img
                                            className='transition-all h-auto rounded-xl border-2 border-white hover:opacity-90 shadow-sm'
                                            src={URL.createObjectURL(previewImage)}
                                        />
                                    ) : (
                                        <>
                                            {/* <div className='w-full m-7 flex justify-normal border-2 border-dashed border-color5 rounded-xl'>
                        <div className='transition-all m-auto p-6 flex justify-between items-center align-middle bg-color1  hover:opacity-95 shadow-sm rounded-full border-dashed border-2 border-color5'>
                          <Plus className='text-color5' size={40} />
                        </div>
                      </div> */}
                                            <div className='flex w-[100%]'>
                                                <img src={`${SERVER_URL}/uploads/${data?.editFoodItem?.imageUrl}`} className='w-[500px] m-auto rounded-xl' />
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
                                    provide this data for better user experience
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
                                                    className='flex border rounded-xl border-color4 p-1 bg-color0 m-[1px] shadow hover:brightness-95'
                                                >
                                                    <span className='text-color5'>{item}</span>
                                                    <span className='flex justify-center align-middle items-center'>
                                                        <X
                                                            className='inline text-color5 h-full mt-[3px] ml-1 hover:text-color4 hover:brightness-50 cursor-pointer'
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

                            <div className=' font-semibold text-color5'>Food Price:</div>
                            <input
                                type='number'
                                pattern="\d+"
                                placeholder='Enter the Role name'
                                className='p-2 w-full text-color4 border border-color5 outline-color3 rounded  hover:border-color4 placeholder:text-color3 shadow'
                                required
                                value={price}
                                onChange={e => setPrice(e.target.value)}
                            />

                            <div className="flex mt-2 gap-2">
                                <button
                                    type='submit'
                                    disabled={loading ? true : false}
                                    className={`w-full transition-all border border-color5 shadow p-2 bg-color5 rounded text-white text-center  ${loading ? 'opacity-70 cursor-none' : 'hover:opacity-90'
                                        }`}
                                >
                                    Update Food Item
                                </button>
                                <div className='border border-color5 flex rounded px-2 m-[1px] shadow shadow-color2 cursor-pointer hover:opacity-90' onClick={handleReset}>
                                    <GrPowerReset className='m-auto text-color5' size={22} />
                                </div>
                            </div>
                            <button
                                type="button"
                                disabled={loading ? true : false}
                                className={`transition-all border border-color5 shadow p-2 bg-white rounded text-color5 text-center mb-2  ${loading ? 'opacity-70 cursor-none' : 'hover:opacity-90'
                                    }`}
                                onClick={() => onClose()}
                            >
                                Cancel
                            </button>
                        </form>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default EditFoodItemModal
