/* eslint-disable react/prop-types */
import { getSellerHotel } from '@/actions/seller'
import { SERVER_URL } from '@/lib/server'
import { X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { GrPowerReset } from 'react-icons/gr'
import { toast } from 'react-toastify'

const SellerRestaurant = ({ hotelId }) => {
  const [isUserVerified, setIsUserVerified] = useState(false)
  const [hotel, setHotel] = useState('')
  const [previewImage, setPreviewImage] = useState('')
  const fileInputRef = useRef()
  useEffect(() => {
    const getUserHotel = async () => {
      try {
        const res = await getSellerHotel(hotelId)
        if (res.success) {
          setIsUserVerified(true)
          setHotel(res.hotel)
          setPreviewImage(res.hotel.imgUrl)
        }
      } catch (error) {
        toast.error(error)
      }
    }
    getUserHotel()
  }, [isUserVerified, hotelId])

  const handleImageChange = async (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const fileSizeInKB = file.size / 1024; // Convert file size to KB

      // Validate file size
      if (fileSizeInKB > 500) {
        toast.warning("File size must be less than 500 KB.");
        return;
      }
      try {
        const formData = new FormData()
        formData.append('updateHotelImage', e.target.files[0])
        const res = await axios.post(`${backend_url}/restaurant/updateImage/${hotelId}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          },
          withCredentials: true,
        })
        console.log(res)
        if (res.data.success) {
          setPreviewImage(res.data.filename)
        }
      } catch (error) {
        toast.error(error)
      }
    }
  }
  return (
    <div className='flex justify-center '>
      {isUserVerified && hotel && (
        <div className='flex flex-col m-14 lg:mx-20 mb-3'>
          <div className='text-color5 text-3xl font-semibold mb-4'>Restaurant Info</div>
          <div className='border border-color4 rounded-xl shadow-xl shadow-color0 p-2 flex flex-col align-center w-[600px]'>
            <div className='flex items-center p-3'>
              <form className='m-auto'>
                <div className='w-full flex border rounded-xl border-color5 shadow shadow-color0'>
                  <img
                    className='m-auto w-[550px] transition-all rounded-xl'
                    src={`${SERVER_URL}/uploads/${previewImage}`}
                    onClick={() => fileInputRef.current.click()}
                  />
                </div>
                <input
                  className='hidden'
                  type='file'
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  accept='.jpg,.jpeg,.png'
                />
              </form>
            </div>
            <div>
              <HotelInfo
                hotel={{
                  name: hotel.name,
                  addresses: hotel.addresses,
                  cusineTypes: hotel.cusineTypes
                }}
                setHotel={setHotel}
                hotelId={hotelId}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

const HotelInfo = ({ hotel, setHotel, hotelId }) => {

  function deepEqual(obj1, obj2) {
    if (typeof obj1 !== 'object' || obj1 === null ||
      typeof obj2 !== 'object' || obj2 === null) {
      return obj1 === obj2;
    }
    if (Object.keys(obj1).length !== Object.keys(obj2).length) {
      return false;
    }
    for (const [key, value] of Object.entries(obj1)) {
      if (!Object.prototype.hasOwnProperty.call(obj2, key)) {
        return false;
      }
      if (typeof value === 'object' && value !== null) {
        if (!deepEqual(value, obj2[key])) {
          return false;
        }
      } else {
        if (value !== obj2[key]) {
          return false;
        }
      }
    }
    return true;
  }

  const [name, setName] = useState(hotel.name)
  const [country, setCountry] = useState(hotel.addresses.country)
  const [state, setState] = useState(hotel.addresses.state)
  const [city, setCity] = useState(hotel.addresses.city)
  const [address, setAddress] = useState(hotel.addresses.address)
  const [zipCode, setZipcode] = useState(hotel.addresses.zipCode)
  const [tag, setTag] = useState("")
  const [cusineTypes, setCusionTypes] = useState(hotel.cusineTypes)

  const handleReset = () => {
    setName(hotel.name)
    setCountry(hotel.addresses.country)
    setState(hotel.addresses.state)
    setCity(hotel.addresses.city)
    setAddress(hotel.addresses.address)
    setZipcode(hotel.addresses.zipCode)
    setTag("")
    setCusionTypes(hotel.cusineTypes)
  }

  const formdata = {
    name: hotel.name,
    addresses: {
      country: hotel.country,
      state: hotel.state,
      city: hotel.city,
      address: hotel.address,
      zipCode: hotel.zipCode
    },
    cusineTypes: hotel.cusineTypes
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
    if (e.target.value != " ") {
      setTag(e.target.value)
    }
  }

  const handletagcancelbtn = ind => {
    setCusionTypes(cusineTypes.filter((item, i) => i !== ind))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (deepEqual(formdata, hotel)) {
      return
    }
    try {
      const res = await axios.patch(`${backend_url}/seller/updaterestaurantinfo/${hotelId}`, {
        name,
        country,
        state,
        city,
        address,
        zipCode,
        cusineTypes
      }, {
        headers: {
          'Content-Type': 'application/json'
        },
        withCredentials: true
      })
      if (res.data.success) {
        toast.success('Restaurant Info Updated Successfully')
        setHotel(res.data.hotel)
      }
    } catch (error) {
      toast.error(error)
    }
  }

  return (
    <form
      className='p-4'
      onSubmit={handleSubmit}
    >
      <div className='flex flex-col gap-1' >
        <div className='text-color5 font-bold w-[200px]'>
          Restaurant name:
        </div>
        <input
          type='text'
          placeholder='Enter your restaurant name'
          className='p-2 w-full text-color5 border border-color3 outline-color3 rounded  hover:border-color4 placeholder:text-color3 mb-1'
          required
          value={name}
          onChange={e => setName(e.target.value)}
        />

        <div className=' text-color5 font-bold'>Country: </div>
        <input
          type='text'
          className='p-2 w-full text-color5 border border-color3 outline-color3 rounded  hover:border-color4 placeholder:text-color3 mb-1'
          required
          placeholder='Enter Country'
          value={country}
          onChange={e => setCountry(e.target.value)}
        />

        <div className=' text-color5 font-bold'>State: </div>
        <input
          type='text'
          className='p-2 w-full text-color5 border border-color3 outline-color3 rounded  hover:border-color4 placeholder:text-color3 mb-1'
          required
          placeholder='Enter State'
          value={state}
          onChange={e => setState(e.target.value)}
        />

        <div className=' text-color5 font-bold'>City: </div>
        <input
          type='text'
          className='p-2 w-full text-color5 border border-color3 outline-color3 rounded  hover:border-color4 placeholder:text-color3 mb-1'
          required
          placeholder='Enter City'
          value={city}
          onChange={e => setCity(e.target.value)}
        />

        <div className=' text-color5 font-bold'>Address: </div>
        <input
          type='text'
          className='p-2 w-full text-color5 border border-color3 outline-color3 rounded  hover:border-color4 placeholder:text-color3 mb-1'
          required
          placeholder='Enter your Restuarant address'
          value={address}
          onChange={e => setAddress(e.target.value)}
        />

        <div className=' text-color5 font-bold'>zipcode: </div>
        <input
          placeholder='Enter zipCode'
          type='text'
          required
          value={zipCode}
          onKeyDown={handlezipkeychange}
          onChange={e => setZipcode(e.target.value)}
          inputMode='numeric'
          pattern='[0-9]*'
          className='p-2 w-full text-color5 border border-color3 outline-color3 rounded  hover:border-color4 placeholder:text-color3 mb-1'
        />


        <div className=' font-semibold mt-1 text-color5'>Food Tags:</div>
        <div className='border border-color5 focus:border-color5 outline-none rounded shadow overflow-y-scroll h-auto'>
          <span className='flex w-full p-2 bg-transparent flex-wrap'>
            {cusineTypes &&
              cusineTypes.map((item, i) => {
                return (
                  <span
                    key={i}
                    className='flex border rounded-xl border-color4 p-1 bg-color0 m-[1px] hover:brightness-95 shadow'
                  >
                    <span className='text-color5'>{item}</span>
                    <span className='flex justify-center align-middle items-center'>
                      <X
                        className='inline text-color5 h-full mt-[3px] ml-1 hover:text-color4 cursor-pointer hover:brightness-50'
                        size={14}
                        onClick={() => handletagcancelbtn(i)}
                      />
                    </span>
                  </span>
                )
              })}
            <input
              className='outline-0 border-0 p-1 focus-within:border-0 text-color5 rounded-xl outline-none  placeholder:text-color4'
              type='text'
              placeholder='Enter your foodtypes'
              onKeyDown={handletagkeydown}
              onChange={handletagchange}
              value={tag}
            />
          </span>
        </div>



        <div className='flex flex-1 gap-1'>
          <input
            className={`transition-all w-full text-white bg-color5 ${deepEqual(formdata, hotel) ? '' : 'hover:opacity-90 hover:shadow-md cursor-pointer'
              }  p-2 rounded font-semibold `}
            type='submit'
            value='Update'
          />
          <div className='border border-color5 flex rounded px-2  shadow shadow-color2 cursor-pointer hover:opacity-90'
            onClick={handleReset}
          >
            <GrPowerReset className='m-auto text-color5' size={22} />
          </div>
        </div>
      </div>
    </form>
  )
}

export default SellerRestaurant
