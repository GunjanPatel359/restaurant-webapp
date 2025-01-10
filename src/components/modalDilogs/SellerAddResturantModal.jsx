import { useRef, useState } from 'react'
import { useModal } from '@/hooks/zusthook'
import { Plus, X } from 'lucide-react'
import { toast } from 'react-toastify'
import { createRestaurant } from '@/actions/hotel'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog'
import { useTheme } from '@/hooks/use-theme'

const SellerAddResturantModal = () => {
  const {theme}=useTheme()
  const { isOpen, type, onClose } = useModal()
  const isModelOpen = isOpen && type === 'create-restaurant'

  const fileInputRef = useRef(null)
  const [previewImage, setPreviewImage] = useState(null)

  const [name, setName] = useState('')
  const [country, setCountry] = useState('')
  const [state, setState] = useState('')
  const [city, setCity] = useState('')
  const [address, setAddress] = useState('')
  const [zipcode, setZipcode] = useState('')
  const [tag, setTag] = useState('')
  const [cusineTypes, setCusionTypes] = useState([])
  const [loading, setloading] = useState(false)

  const handleImageChange = e => {
    if (e.target.files && e.target.files[0]) {
      setPreviewImage(e.target.files[0])
    }
  }

  const handlezipkeychange = e => {
    const allowedKeys = [48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 8, 13]
    if (allowedKeys.includes(e.keyCode)) {
      return
    } else {
      e.preventDefault()
    }
  }
  const handletagkeydown = e => {
    if (e.keyCode === 13 && tag) {
      e.preventDefault()
      setCusionTypes([...cusineTypes, tag])
      setTag('')
    } else if (e.keyCode === 32 && tag) {
      setCusionTypes([...cusineTypes, tag])
      setTag('')
    } else if (e.keyCode === 8 && !tag && cusineTypes.length > 0) {
      setCusionTypes(
        cusineTypes.filter((item, i) => i != cusineTypes.length - 1)
      )
    } else if (e.keyCode === 32 && !tag) {
      e.preventDefault()
    }
  }

  const handletagchange = e => {
    setTag(e.target.value)
  }

  const handletagcancelbtn = ind => {
    console.log(ind)
    setCusionTypes(cusineTypes.filter((item, i) => i !== ind))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setloading(true)
      if (!previewImage) {
        return toast.warning('image is required')
      }
      if (!name || !country || !state || !city || !address || !zipcode) {
        return toast.warning('Please fill all the fields')
      }
      const formData = new FormData()
      formData.append('name', name)
      formData.append('country', country)
      formData.append('state', state)
      formData.append('city', city)
      formData.append('address', address)
      formData.append('zipCode', zipcode)
      formData.append('cusineTypes', JSON.stringify(cusineTypes))
      formData.append('restaurantimage', previewImage)

      const res = await createRestaurant(formData)
      if (res.success === true) {
        toast.success("Restaurant created successfully")
        onClose()
      } else {
        toast.error(res.message)
      }
    } catch (error) {
      toast.error(error)
    } finally {
      setloading(false)
    }
  }

  return (
    <Dialog open={isModelOpen} onOpenChange={onClose}>
      <DialogContent className={`max-w-[520px] h-[90vh] overflow-y-scroll theme-${theme} border border-color5`} aria-describedby="create-restaurant">
         <DialogHeader>
           <DialogTitle className="text-2xl font-semibold text-center mb-4">
            <div className='text-center text-color5 text-2xl font-semibold'>
            Create Restaurants
          </div>
          </DialogTitle>
         </DialogHeader>
          <div className='flex flex-col w-[430px] mx-auto'>
            <div>
              <form
                className='flex flex-col text-color5 gap-y-1'
                onSubmit={handleSubmit}
                encType="multipart/form-data" 
                method="post"
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
                        <div className='transition-all m-auto p-6 flex justify-between items-center align-middle bg-color1  hover:opacity-85 shadow-lg rounded-full border-dashed border-2 border-color5'>
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
                <input
                  type='text'
                  required
                  placeholder='Enter your restaurant name'
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className='p-2 shadow-md text-color5 border-2 border-color3 rounded-xl outline-none focus:border-color5 hover:border-color5 placeholder:text-color4'
                />
                <input
                  type='text'
                  required
                  placeholder='Enter Country'
                  value={country}
                  onChange={e => setCountry(e.target.value)}
                  className='p-2 shadow-md text-color5 border-2 border-color3 rounded-xl outline-none focus:border-color5 hover:border-color5 placeholder:text-color4'
                />
                <input
                  type='text'
                  required
                  placeholder='Enter State'
                  value={state}
                  onChange={e => setState(e.target.value)}
                  className='p-2 shadow-md text-color5 border-2 border-color3 rounded-xl outline-none focus:border-color5 hover:border-color5 placeholder:text-color4'
                />
                <input
                  type='text'
                  required
                  placeholder='Enter City'
                  value={city}
                  onChange={e => setCity(e.target.value)}
                  className='p-2 shadow-md text-color5 border-2 border-color3 rounded-xl outline-none focus:border-color5 hover:border-color5 placeholder:text-color4'
                />
                <input
                  type='text'
                  placeholder='Enter your Restuarant address'
                  required
                  className='p-2 shadow-md text-color5 border-2 border-color3 rounded-xl outline-none focus:border-color5 hover:border-color5 placeholder:text-color4'
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                />
                <input
                  placeholder='Enter zipCode'
                  type='text'
                  required
                  value={zipcode}
                  onKeyDown={handlezipkeychange}
                  onChange={e => setZipcode(e.target.value)}
                  inputMode='numeric'
                  pattern='[0-9]*'
                  className='p-2 shadow-md text-color5 border-2 border-color3 rounded-xl outline-none focus:border-color5 hover:border-color5 placeholder:text-color4'
                />
                <div className='border-2 border-color4 focus:border-color5 outline-none rounded-xl shadow-md'>
                  <span className='flex w-full p-2 bg-transparent flex-wrap'>
                    {cusineTypes &&
                      cusineTypes.map((item, i) => {
                        return (
                          <span
                            key={i}
                            className='flex border rounded-xl border-color3 p-1 bg-color0 m-[1px] hover:bg-color1 shadow'
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
                      placeholder='Enter your cusineTypes'
                      onKeyDown={handletagkeydown}
                      onChange={handletagchange}
                      value={tag}
                    />
                  </span>
                </div>
                <div className='flex gap-2 mt-3'>
                <button disabled={loading?true:false} 
                className={`w-full transition-all border border-red-500 shadow p-2 bg-white rounded-xl text-red-600  ${loading ? "opacity-70":"hover:opacity-90"}`}
                onClick={onClose}
                >
                  Cancel
                </button>
                <button disabled={loading?true:false} 
                className={`w-full transition-all border border-color5 shadow p-2 bg-color5 rounded-xl text-white text-center  ${loading ? "opacity-70":"hover:opacity-90"}`}
                >
                  Create Restaurant
                </button>
                </div>
              </form>
            </div>
          </div>
          </DialogContent>
    </Dialog>
  )
}

export default SellerAddResturantModal
