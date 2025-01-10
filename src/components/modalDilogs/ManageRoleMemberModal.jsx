import { useEffect, useState } from 'react'
import { useModal } from '@/hooks/zusthook'
import { toast } from 'react-toastify'
import { useParams } from 'next/navigation'
import { FaRegCircleUser } from 'react-icons/fa6'
import { MdCancel } from 'react-icons/md'
import { getMembersWithDetails, removeMember } from '@/actions/member'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog'
import { useTheme } from '@/hooks/use-theme'
import { SERVER_URL } from '@/lib/server'

const ManageRoleMemberModal = () => {
    const { theme } = useTheme()
    const params = useParams()
    const hotelId = params.hotelId
    const { isOpen, data, type, onlyReloadCom, onClose } = useModal()

    const [roleMembers, setRoleMembers] = useState([])
    const [roleId, setRoleId] = useState([])
    const [loading, setLoading] = useState(false)
    const isModelOpen = isOpen && type == "manage-role-member"

    useEffect(() => {
        const roleMembers = async () => {
            try {
                setLoading(true)
                const response = await getMembersWithDetails(data.manageMemberRole._id, hotelId)
                if (response.success) {
                    setRoleMembers(response.roleMembers)
                    setRoleId(response.roleId)
                }
            } catch (error) {
                toast.error(error.message)
            } finally {
                setLoading(false)
            }
        }
        if (data && data.manageMemberRole) {
            roleMembers()
        }
    }, [hotelId, data])

    if (!isModelOpen) {
        return null
    }

    const handleRemoveMember = async (id) => {
        if (loading) {
            return null
        }
        setLoading(true)
        try {
            const response = await removeMember(hotelId, roleId, id)
            if (response.success) {
                onlyReloadCom()
                setRoleMembers((item) => item.filter((item) => item._id != id))
                toast.success("member deleted successfully")
            }
        } catch (error) {
            toast.error(error.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <Dialog open={isModelOpen} onOpenChange={onClose}>
            <DialogContent
                className={`lg:w-[600px] w-[480px] max-h-[500px] overflow-y-scroll theme-${theme} border border-color5 p-3 px-10 pt-7`} aria-describedby="manage-role">
                <DialogHeader>
                    <DialogTitle>
                    <div className="text-2xl font-semibold pb-3 text-color5">Members</div>
                    <div className="w-full border border-color4 shadow-2xl shadow-color2"></div>
                    </DialogTitle>
                </DialogHeader>
                <div className='flex flex-col gap-2'>
                    {roleMembers.length > 0 ? roleMembers.map((item, i) => {
                        return (
                            <div
                                key={i}
                                className='flex border border-color5 p-2 justify-between rounded shadow shadow-color5'
                            >
                                <div className='flex'>
                                    <div className='my-auto cursor-pointer'>
                                        {item?.avatar ? (
                                            <img
                                                src={`${SERVER_URL}/uploads/${item?.avatar}`}
                                                className='rounded-full w-[40px]'
                                            />
                                        ) : (
                                            <FaRegCircleUser className='text-color5' size={40} />
                                        )}
                                    </div>
                                    <div className='flex flex-col ml-2'>
                                        <div className='font-semibold text-color5'>
                                            {item?.name}
                                        </div>
                                        <div className='text-sm text-color5'>
                                            {item?.email}
                                        </div>
                                    </div>
                                </div>
                                <div className='flex mr-1'>
                                    <MdCancel size={30} className={`text-color5 m-auto ${loading ? 'opacity-80 cursor-not-allowed' : 'hover:opacity-80 cursor-pointer'}`} onClick={() => handleRemoveMember(item?._id)} />
                                </div>
                            </div>
                        )
                    }) : <>
                        <div className='mt-3 mb-3'>
                            <p className='text-lg font-bold text-center text-color5'>No members yet</p>
                        </div>
                    </>}
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default ManageRoleMemberModal
