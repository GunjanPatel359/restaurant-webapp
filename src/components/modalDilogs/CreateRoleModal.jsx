import { useModal } from '@/hooks/zusthook';
import { useState } from 'react'
import { Switch } from '../ui/switch';
import { toast } from 'react-toastify'

import { IoWarning } from "react-icons/io5";
import { useParams } from 'next/navigation'
import { useTheme } from '@/hooks/use-theme';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { createRole } from '@/actions/role';

const CreateRoleModal = () => {
  const { theme } = useTheme()
  const params = useParams()
  const hotelId = params.hotelId
  const { isOpen, type, data, reloadCom, onClose } = useModal()

  const isModelOpen = isOpen && type === 'create-roles'

  const [roleName, setRoleName] = useState("")
  const [roleDescription, setRoleDescription] = useState("")
  const [canUpdateRestaurantImg, setCanUpdateRestaurantImg] = useState(false)
  const [canUpdateRestaurantDetails, setCanUpdateRestaurantDetails] = useState(false)
  const [canManageRoles, setCanManageRoles] = useState(false)
  const [canManageFoodItemData, setCanManageFoodItemData] = useState(false)
  const [adminPower, setAdminPower] = useState(false)
  const [canAddMember, setCanAddMember] = useState(false)

  if (!isModelOpen) {
    return null
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await createRole(hotelId,{ roleName, roleDescription, canUpdateRestaurantImg, canUpdateRestaurantDetails, canManageRoles, canAddMember, adminPower, canManageFoodItemData })
      if (response.success) {
        toast.success(response.message)
        setRoleName("")
        setRoleDescription("")
        setCanUpdateRestaurantImg(false)
        setCanUpdateRestaurantDetails(false)
        setCanManageRoles(false)
        setCanManageFoodItemData(false)
        setAdminPower(false)
        setCanAddMember(false)
        return reloadCom()
      }
      return toast.error("Something went wrong")
    } catch (error) {
      console.error(error)
      toast.error(error)
    }
  }
  return (
    <Dialog open={isModelOpen} onOpenChange={onClose}>
      <DialogContent className={`lg:w-[530px] w-[480px] h-[580px] overflow-y-scroll theme-${theme} border border-color5 pt-5 pb-5 px-9`} aria-describedby="create-role">
        <DialogHeader>
          <DialogTitle>
            <div className='text-2xl font-semibold pb-3 text-color5'>
              Create Role
            </div>
            <div className='w-full border border-color4 shadow-2xl shadow-color2'></div>
          </DialogTitle>
        </DialogHeader>
        <div>
          <div>
            <div className='bg-color0 w-full border border-color3'>
              <form onSubmit={handleSubmit} className='p-4 flex flex-col gap-2'>

                <div className=' font-semibold text-color5'>Role Name:</div>
                <input type='text' placeholder='Enter the Role name' className='p-2 w-full text-color5 border border-color1 outline-color3 rounded  hover:border-color4 placeholder:text-color3 bg-white' required value={roleName} onChange={(e) => setRoleName(e.target.value)} />

                <div className=' font-semibold text-color5'>Role Description:</div>
                <input type='text' placeholder='Enter the role description' className='p-2 w-full text-color5 border border-color1 outline-color3 rounded  hover:border-color4 placeholder:text-color3' required value={roleDescription} onChange={(e) => setRoleDescription(e.target.value)} />


                <div className='p-2 bg-white rounded border border-color3'>
                  <div className='flex justify-between'>
                    <span className='pl-1 font-semibold text-color5'>member can update Restaurant image</span>
                    <Switch checked={canUpdateRestaurantImg} onCheckedChange={() => setCanUpdateRestaurantImg(!canUpdateRestaurantImg)} className="my-auto mr-1" />
                  </div>
                  <p className='pl-1 h-auto text-justify mt-1'>
                  </p>
                </div>

                <div className='p-2 bg-white rounded border border-color3'>
                  <div className='flex justify-between'>
                    <span className='pl-1 font-semibold text-color5'>member can update Restaurant info</span>
                    <Switch checked={canUpdateRestaurantDetails} onCheckedChange={() => setCanUpdateRestaurantDetails(!canUpdateRestaurantDetails)} className="my-auto mr-1" />
                  </div>
                  <p className='pl-1 h-auto text-justify mt-1'>
                  </p>
                </div>

                <div className='p-2 bg-white rounded border border-color3'>
                  <div className='flex justify-between'>
                    <span className='pl-1 font-semibold text-color5'>Manage roles</span>
                    <Switch checked={canManageRoles} onCheckedChange={() => setCanManageRoles(!canManageRoles)} className="my-auto mr-1"
                    //  disabled={data.role.adminPower?false:true}
                    />
                  </div>
                  <p className='pl-1 h-auto text-justify mt-1'>

                  </p>
                </div>

                <div className='p-2 bg-white rounded border border-color3'>
                  <div className='flex justify-between'>
                    <span className='pl-1 font-semibold text-color5'>Manage food items</span>
                    <Switch checked={canManageFoodItemData} onCheckedChange={() => setCanManageFoodItemData(!canManageFoodItemData)} className="my-auto mr-1"
                    //  disabled={data.role.adminPower?false:true}
                    />
                  </div>
                  <p className='pl-1 h-auto text-justify mt-1'>

                  </p>
                </div>

                <div className='p-2 bg-white rounded border border-color3'>
                  <div className='flex justify-between'>
                    <span className='pl-1 font-semibold text-color5'>Admin Power</span>
                    <Switch checked={adminPower} onCheckedChange={() => setAdminPower(!adminPower)} className="my-auto mr-1"
                      disabled={data.role.adminPower ? false : true}
                    />
                  </div>
                  <p className='pl-1 h-auto text-justify mt-1 text-color5'>
                    <IoWarning size={22} className='text-color5 inline mr-1' />
                    This permission grants full access to the member, allowing them to perform all actions within the system. Please assign this permission thoughtfully to ensure responsible use.
                  </p>
                </div>


                <div className='p-2 bg-white rounded border border-color3'>
                  <div className='flex justify-between'>
                    <span className='pl-1 font-semibold text-color5'>invite member</span>
                    <Switch checked={canAddMember} onCheckedChange={() => setCanAddMember(!canAddMember)} className="my-auto mr-1" />
                  </div>
                  <p className='pl-1 h-auto text-justify mt-1'>
                  </p>
                </div>

                {/* will be adding other stuff later */}
                <div className="flex gap-2">
                  <button type='submit' className='bg-color5 hover:opacity-90 text-white font-bold py-2 px-4 rounded w-full'>Create Role</button>
                  <button type='button' className='bg-white hover:text-color4 border border-color5 text-color5 py-2 px-4 rounded w-full' onClick={() => onClose()}>Cancel</button>
                </div>

              </form>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default CreateRoleModal
