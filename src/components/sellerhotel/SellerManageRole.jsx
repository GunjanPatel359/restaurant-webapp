/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { useModal } from '@/hooks/zusthook'
import RoleItem from './RoleItem'
import { Plus } from 'lucide-react'

import {
  closestCenter,
  DndContext,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors
} from '@dnd-kit/core'

import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
  sortableKeyboardCoordinates
} from '@dnd-kit/sortable'
import { getHotelData } from '@/actions/seller'
import { reorderRoles } from '@/actions/role'

const SellerManageRole = ({hotelId}) => {
  const { onOpen,reloadCmd } = useModal()
  const [member, setMember] = useState('')
  const [ownerId,setOwnerId]=useState('')
  const [role, setRole] = useState('')
  const [roles, setRoles] = useState('')
  const [roleId,setRolesId]=useState('')
  const [oldRole, setOldRole] = useState('')
  const [reloadcomponent,setReloadComponent]=useState(1);

  // const [loading,setLoading]=useState(false)
  
  useEffect(() => {
    const initiatePage = async () => {
      try {
        const hoteldata = await getHotelData(hotelId)
        if (hoteldata.success) {
          setOwnerId(hoteldata.hotel.sellerId)
          setMember(hoteldata.member)
          setRole(hoteldata.role)
          let sortingRoles = hoteldata.hotel.roleIds
          sortingRoles.sort((a, b) => a.order - b.order)
          setRoles(sortingRoles)
          setRolesId(sortingRoles.map((item,i)=> i))
          setOldRole(sortingRoles)
        }
      } catch (error) {
        toast.error(error)
      }
    }

    initiatePage()

  }, [reloadCmd,hotelId,reloadcomponent])

  function findObjectIndexById (data, id) {
    return data.findIndex(obj => obj._id === id)
  }
  function findObject (data, id) {
    return data.find(obj => obj._id === id)
  }

  function handleDragEnd (event) {
    const { active, over } = event
    if (!role.canManageRoles && !role.adminPower) {
      return toast.warning('You don not have permission to reorder the roles')
    }
    if (
      findObject(roles, active.id).order <= role.order ||
      findObject(roles, over.id).order <= role.order
    ) {
      return toast.warning('cannot change order of higher roles')
    }
    if (active.id != over.id) {
      setRoles(roles => {
        const oldIndex = findObjectIndexById(roles, active.id)
        const newIndex = findObjectIndexById(roles, over.id)
        return arrayMove(roles, oldIndex, newIndex)
      })
      setRolesId(roles.map((item)=> item._id))
    }
  }

  const changeRoleOrder = async () => {
    try {
      const response = await reorderRoles(hotelId,roles)
      if (response.success) {
        setReloadComponent(Date.now())
        toast.success(response.message)
      }
    } catch (error) {
      return toast.error(error)
    }
  }

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 0
      }
    })
  )
  return (
    <div className='m-5'>
      {member && (
        <div className='m-5 mt-8'>
          <div className='text-color5 font-semibold text-2xl mb-4'>Roles</div>

          {(role.adminPower || role.canManageRoles) &&
          <span
            className='bg-color0 p-2 py-2 transition-all text-color5 hover:opacity-80 cursor-pointer border border-color5 border-dashed rounded-full flex flex-row max-w-fit pr-5 shadow'
            onClick={() => onOpen('create-roles', { role })}
          >
            <span className='flex flex-row border border-color5 rounded-full mr-2 ml-1 border-dashed'>
              <Plus className='inline' />
            </span>{' '}
            Create Role
          </span>}

          <div className='bg-color0 border border-color5 p-4 rounded mt-4 border-dashed text-lg flex flex-col gap-y-2 shadow-md'>
            <DndContext
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
              sensors={sensors}
            >
              <SortableContext
                items={roleId}
                strategy={verticalListSortingStrategy}
              >
                {roles.map((item, i) => {
                  return (
                    <RoleItem
                      item={item}
                      key={item.order}
                      index={i + 1}
                      role={role}
                      ownerId={ownerId}
                    />
                  )
                })}
              </SortableContext>
            </DndContext>
          </div>
          <button
            className={`transition-all bg-color5 text-white mt-2 p-3 rounded font-semibold ${
              roles == oldRole ? 'opacity-90' : 'hover:'
            }`}
            disabled={roles == oldRole ? true : false}
            onClick={() => changeRoleOrder()}
          >
            Update order
          </button>
        </div>
      )}
    </div>
  )
}

export default SellerManageRole
