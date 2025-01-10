import { useEffect, useState } from 'react'
import { useModal } from '@/hooks/zusthook'

import { CiWarning } from 'react-icons/ci'
import { IoSearch } from 'react-icons/io5'
import { MdCancel, MdOutlineWhatsapp } from 'react-icons/md'
import { RiFacebookCircleLine } from 'react-icons/ri'
import { HiChevronRight } from 'react-icons/hi'
import { FaRegCircleUser } from 'react-icons/fa6'
import { GoDotFill } from 'react-icons/go'
import { PlusCircle } from 'lucide-react'
import { GoPaperclip } from 'react-icons/go'
import { AiOutlineCheckCircle } from 'react-icons/ai'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { toast } from 'react-toastify'
import { useParams } from 'next/navigation'
import { addMember, getMemberSellerIds, removeMember } from '@/actions/member'
import { getSellerInfo, searchInviteSeller, searchInviteSellerById } from '@/actions/seller'
import { SERVER_URL } from '@/lib/server'
import { useTheme } from '@/hooks/use-theme'

const InviteMemberModal = () => {
  const {theme}=useTheme()
  const params = useParams()
  const hotelId = params.hotelId
  const [seller, setSeller] = useState()
  const { isOpen, type, data, onlyReloadCom, onClose } = useModal()
  const isModelOpen = isOpen && type === 'invite-member'
  const [openArrow, setOpenArrow] = useState(false)
  const [usingId, setUsingId] = useState(false)
  const [query, setQuery] = useState('')
  const [resultBoxOpen, setResultBoxOpen] = useState(false)
  const [searchResult, setSearchResult] = useState('')
  const [searchError, setSearchError] = useState('')

  const [item, setItem] = useState()
  const [roleMembers, setRoleMembers] = useState([])

  useEffect(() => {
    const fetchSeller = async () => {
      try {
        const res = await getSellerInfo()
        if (res.success) {
          setSeller(res.data)
        }
      } catch (error) {
        toast.error(error)
      }
    }
    fetchSeller()
  }, [])

  useEffect(() => {
    const roleMembers = async () => {
      try {
        const response = await getMemberSellerIds(data?.inviteRole._id, hotelId)
        if (response.success) {
          setRoleMembers(response.members)
        }
      } catch (error) {
        console.log(error)
        toast.error(error)
      }
    }
    if (data) {
      if (data?.inviteRole) {
        setItem(data.inviteRole)
        roleMembers()
      }
    }
  }, [data, hotelId])

  if (!isModelOpen) {
    return null
  }

  const handleMemberNameSearch = async e => {
    setQuery(e.target.value)
    if (query.length < 2) {
      setResultBoxOpen(false)
      setSearchResult('')
      return setSearchError('please provide more than two characters')
    }
    setResultBoxOpen(true)
    try {
      const response = await searchInviteSeller(query)
      if (response.success) {
        setSearchResult(response.data)
      }
      if (!response.success) {
        setSearchError('no result found')
      }
    } catch (error) {
      console.log(error)
    }
  }

  const handleMemberIdSearch = async e => {
    setQuery(e.target.value)
    if (e.target.value.length > 24) {
      setResultBoxOpen(true)
      setSearchResult('')
      return setSearchError('id length should 24 character')
    }
    if (e.target.value.length != 24) {
      setResultBoxOpen(false)
      setSearchResult('')
      return setSearchError('id length should 24 character')
    }
    setResultBoxOpen(true)
    try {
      const response = await searchInviteSellerById(e.target.value)
      if (response.success) {
        setSearchResult(response.data)
      }
      if (!response.success) {
        setSearchError('no result found')
      }
    } catch (error) {
      console.log(error)
    }
  }

  const addFunMember = async (id) => {
    try {
      const response = await addMember(hotelId, data.inviteRole._id, id)
      if (response.success) {
        setRoleMembers((rest) => [...rest, id]);
        toast.success(response.message)
        onlyReloadCom()
      }
      if (!response.success) {
        toast.error(response.message)
      }
    } catch (error) {
      toast.error(error)
    }
  }

  const removeFunMember = async (id) => {
    try {
      const response = await removeMember(hotelId, data.inviteRole._id, id)
      if (response.success) {
        setRoleMembers((rest) => rest.filter(memberId => memberId != id));
        toast.success(response.message)
        onlyReloadCom()
      }
      if (!response.success) {
        toast.error(response.message)
      }
    } catch (error) {
      toast.error(error)
    }
  }

  return (
    <Dialog open={isModelOpen} onOpenChange={onClose}>
      <DialogContent className={`w-[550px] p-4 px-10 pt-7 theme-${theme} border border-color5`} aria-describedby="invite-modal">
        <DialogHeader>
          <DialogTitle>
          <div className='font-semibold text-2xl text-color5 mb-3'>
                Invite Member
              </div>
              <div className='w-full h-[2px] bg-color5'></div>
          </DialogTitle>
        </DialogHeader>
        {item && (
          <div>
            <div>
              <div className='text-color5 mb-2'>
                <CiWarning className='mr-1 inline' size={22} />{' '}
                <span className='underline font-semibold text-color5'>
                  {item.roleName}
                </span>{' '}
                role will be assigned to invited member
              </div>

              <div className='flex'>
                <div className='w-full border border-color4 outline-color4 rounded-full flex hover:border-color4 p-2 rounded-tr-none rounded-br-none'>
                  <IoSearch
                    className='inline mr-[7px] ml-[6px] m-auto translate-y-[1px] text-color5'
                    size={18}
                  />
                  {usingId ? (
                    <>
                      <input
                        type='text'
                        placeholder='Enter member unique Id'
                        className='text-color5 placeholder:text-color4 focus:outline-none inline w-full'
                        value={query}
                        onChange={handleMemberIdSearch}
                      // onClick={() => setResultBoxOpen(true)}
                      />
                      <div className='absolute -translate-x-8'>
                      {resultBoxOpen && (
                        <div className='bg-white border border-color5 p-4 px-6 rounded shadow shadow-color3 translate-x-7 translate-y-9 w-[400px]'>
                          <div className='font-semibold text-color5'>Search Result</div>
                          <div className='w-full h-[1px] bg-color5 mt-1 mb-2'></div>
                          {searchResult ? (
                            (data?.ownerId != searchResult._id) ?
                              <>
                                <div className='flex border border-color5 p-2 justify-between rounded shadow'>
                                  <div className='flex'>
                                    <div className='my-auto cursor-pointer'>
                                      {searchResult.avatar ? (
                                        <img
                                          src={`${SERVER_URL}/uploads/${searchResult.avatar}`}
                                          className='rounded-full w-[40px]'
                                        />
                                      ) : (
                                        <FaRegCircleUser size={40} className='text-color5' />
                                      )}
                                    </div>
                                    <div className='flex flex-col ml-2'>
                                      <div className='font-semibold text-color5'>
                                        {searchResult._id}
                                      </div>
                                      <div className='text-sm text-color5'>{searchResult.email}</div>
                                    </div>
                                  </div>
                                  <div className='flex mr-1'>
                                    {roleMembers.length >= 0 && roleMembers.includes(item._id) ? (
                                      <>
                                        <AiOutlineCheckCircle
                                          className='m-auto cursor-pointer text-color5'
                                          size={30}
                                          onClick={() => removeFunMember(item._id)}
                                        />
                                      </>
                                    ) : (
                                      <>
                                        <PlusCircle
                                          className='m-auto cursor-pointer text-color5'
                                          size={30}
                                          onClick={() => addFunMember(item._id)}
                                        />
                                      </>
                                    )}
                                  </div>
                                </div>
                              </>
                              : <>
                                <div className='mt-3 text-color5 text-justify'>
                                  * cannot perform any task on owner of this restaurant
                                </div>
                              </>
                          ) : (
                            <>
                              {searchError && (
                                <div className='mt-3 text-color5'>
                                  * {searchError}
                                </div>
                              )}
                            </>
                          )}
                        </div>
                      )}
                      </div>
                    </>
                  ) : (
                    <div>
                      <input
                        type='text'
                        placeholder='Enter member email address or name'
                        className='text-color5 placeholder:text-color4 focus:outline-none inline w-[300px]'
                        value={query}
                        onChange={handleMemberNameSearch}
                      // onClick={() => setResultBoxOpen(true)}
                      />
                      <div className='absolute -translate-x-8'>
                      {resultBoxOpen && (
                        <div className='bg-white border border-color5 p-4 px-6 rounded shadow shadow-color3 translate-y-9 w-[420px]  max-h-[200px] overflow-scroll'>
                          <div className='font-semibold text-color5'>Search Result</div>
                          <div className='w-full h-[1px] bg-color5 mt-1'></div>
                          {searchResult ? (
                            <>
                              <div className='mt-2 flex flex-col gap-y-2'>
                                {searchResult.map((item, i) => {
                                  if (data?.ownerId == item._id || seller?._id == item?._id) {
                                    return null
                                  }
                                  return (
                                    <div
                                      key={i}
                                      className='flex border border-color5 p-2 justify-between rounded shadow'
                                    >
                                      <div className='flex'>
                                        <div className='my-auto cursor-pointer'>
                                          {item.avatar ? (
                                            <img
                                              src={`${SERVER_URL}/uploads/${item.avatar}`}
                                              className='rounded-full w-[40px]'
                                            />
                                          ) : (
                                            <FaRegCircleUser size={40} className='text-color5' />
                                          )}
                                        </div>
                                        <div className='flex flex-col ml-2'>
                                          <div className='font-semibold text-color5'>
                                            {item.name}
                                          </div>
                                          <div className='text-sm text-color5'>
                                            {item.email}
                                          </div>
                                        </div>
                                      </div>
                                      <div className='flex mr-1'>
                                        {roleMembers.length >= 0 && roleMembers.includes(item._id) ? (
                                          <>
                                            <AiOutlineCheckCircle
                                              className='m-auto cursor-pointer text-color5'
                                              size={30}
                                              onClick={() => removeFunMember(item._id)}
                                            />
                                          </>
                                        ) : (
                                          <>
                                            <PlusCircle
                                              className='m-auto cursor-pointer text-color5'
                                              size={30}
                                              onClick={() => addFunMember(item._id)}
                                            />
                                          </>
                                        )}
                                      </div>
                                    </div>
                                  )
                                })}
                              </div>
                            </>
                          ) : (
                            <>
                              {searchError && (
                                <div className='mt-3 text-color5'>
                                  * {searchError}
                                </div>
                              )}
                            </>
                          )}
                        </div>
                      )}
                      </div>
                    </div>
                  )}
                </div>
                <div className='border border-color5 rounded-tr-full rounded-br-full'>
                  <HiChevronRight
                    size={22}
                    className={`transition-all text-color5 inline m-2 translate-y-[1px] ${openArrow ? 'rotate-90' : ''
                      } cursor-pointer`}
                    onClick={() => setOpenArrow(!openArrow)}
                  />
                  <div
                    className={`transition-all w-[225px] absolute flex flex-col bg-white p-2 rounded-2xl border border-color3 shadow ${openArrow ? 'visible' : 'invisible -translate-y-2'
                      }`}
                  >
                    <div
                      className='p-2 cursor-pointer text-color5'
                      onClick={() => {
                        setOpenArrow(false)
                        setUsingId(true)
                        setQuery('')
                        setSearchResult('')
                        setResultBoxOpen(false)
                        setSearchError('')
                      }}
                    >
                      {usingId ? (
                        <GoDotFill size={20} className='inline text-color5' />
                      ) : (
                        <span className='ml-[20px]'></span>
                      )}
                      find with unique ID
                    </div>
                    <div className='w-[90%] m-auto h-[1px] bg-color3'></div>
                    <div
                      className='p-2 cursor-pointer text-color5'
                      onClick={() => {
                        setOpenArrow(false)
                        setUsingId(false)
                        setQuery('')
                        setSearchResult('')
                        setResultBoxOpen(false)
                        setSearchError('')
                      }}
                    >
                      {!usingId ? (
                        <GoDotFill size={20} className='inline' />
                      ) : (
                        <span className='ml-[20px]'></span>
                      )}
                      find with name or email
                    </div>
                  </div>
                </div>
              </div>
              <div className='w-full h-[0.1px] border border-color3 mt-5'></div>

              <div className='flex justify-between mt-2 text-color5'>
                Share Invite link
                <div>
                  <MdOutlineWhatsapp
                    size={22}
                    className='inline cursor-pointer'
                  />
                  <RiFacebookCircleLine
                    size={22}
                    className='inline cursor-pointer'
                  />
                  <GoPaperclip size={20} className='inline cursor-pointer' />
                </div>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

export default InviteMemberModal
