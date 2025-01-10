import { setSellerImage } from '@/actions/seller'
import { SERVER_URL } from '@/lib/server'
import { useEffect, useRef, useState } from 'react'
import { FaRegUser } from 'react-icons/fa'
import { toast } from 'react-toastify'

const SellerInfo = ({seller,setSeller}) => {
  
  const fileInputRef = useRef(null)
  const [previewImage, setPreviewImage] = useState(null)
  const [name,setName]=useState(seller?.name)
  const [oldName,setOldName]=useState(seller?.name)

  useEffect(()=>{
    setPreviewImage(seller?.avatar)
  },[seller?.avatar])

  const handleImageChange = async(e) => {
    try {
      if (e.target.files && e.target.files[0]) {
        const newForm = new FormData();
        newForm.append('sellerimage', e.target.files[0]);
        const res=await setSellerImage(newForm)
        if(res.success){
          setSeller(res.seller)
          setPreviewImage(res.seller.avatar)
          toast.success("successfully changed the profile image");
        }
      }
    } catch (error) {
      toast.error(error)
    }
  };
  return (
    <div className='flex flex-col w-full items-center justify-center mt-8'>
      <div
        className='w-40 h-40 rounded-full border-4 border-color4 flex items-center justify-center cursor-pointer'
        onClick={() => fileInputRef.current.click()}
      >
        <div className='w-full h-full border border-white rounded-full flex justify-center items-center'>

        {previewImage ? (
          <img
            className='text-color3 rounded-full hover:opacity-85 transition-all duration-300'
            alt=''
            src={`${SERVER_URL}/uploads/${previewImage}`}
          />
        ) : (
          <FaRegUser className='text-color3 hover:text-color4' size={85} />
        )}
        <input
          className='hidden'
          type='file'
          ref={fileInputRef}
          onChange={handleImageChange}
          id="sellerimage"
          accept=".jpg,.jpeg,.png"
          />
          </div>
      </div>

      <div className='mt-5'>
        <div>
          <form>
          <input
            placeholder='Your name'
            className='p-2 pl-5 rounded-full border-2 border-color5 text-color5 placeholder-color5 focus:border-color5 outline-none hover:border-color4 hover:text-color4 hover:focus:border-color4'
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          {/* <input placeholder='Your name' className='p-2 pl-5 rounded-full border-2 border-color5 text-color5 placeholder-color5 focus:border-color5 outline-none' /> */}
          <button className={`transition-all duration-300 ml-3 text-white py-2 px-4 rounded-xl hover:bg-color4 ${name===oldName?"bg-color4 opacity-85":" bg-color5 opacity-100"}`}>
            Change name
          </button>
            </form>
        </div>
      </div>
    </div>
  )
}

export default SellerInfo
