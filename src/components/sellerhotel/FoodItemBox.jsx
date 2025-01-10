/* eslint-disable react/prop-types */
import { MdEdit } from 'react-icons/md'
import { MdDeleteForever } from 'react-icons/md'
import Tooltip from '../customui/Tooltip'
import { useModal } from '@/hooks/zusthook'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { SERVER_URL } from '@/lib/server'

const FoodItemBox = ({ item,role }) => {
  const {onOpen}=useModal()

  const { setNodeRef, attributes, listeners, transform, transition, isDragging } = useSortable({
    id: item._id,
    data: {
      type: "FoodItem",
      foodItem:item
    }
  })

  const style = {
    transition,
    transform: CSS.Translate.toString(transform),
    cursor: isDragging ? 'grab' : '',
  }

  if(isDragging){
    return (
      <div
    ref={setNodeRef}
    style={style}
    className='opacity-30 m-1 p-2 pl-0 rounded border border-color5 border-dashed bg-white shadow-md flex'>
      <div className="my-auto flex gap-1 mx-3">
        <div className="flex gap-1 mx-auto flex-col">
          <div className="w-[5px] h-[5px] rounded-full bg-color5"></div>
          <div className="w-[5px] h-[5px] rounded-full bg-color5"></div>
          <div className="w-[5px] h-[5px] rounded-full bg-color5"></div>
        </div>
        <div className="flex gap-1 mx-auto flex-col">
          <div className="w-[5px] h-[5px] rounded-full bg-color5"></div>
          <div className="w-[5px] h-[5px] rounded-full bg-color5"></div>
          <div className="w-[5px] h-[5px] rounded-full bg-color5"></div>
        </div>
      </div>
      <div className='flex transition-all flex-1'>
        <img
          src={`${SERVER_URL}/uploads/${item.imageUrl}`}
          className='h-[90px] rounded shadow shadow-color3'
        />
        <div className='ml-2 w-full'>
          <div className='flex justify-between w-full'>
            <div className='text-2xl text-color5 font-semibold'>
              {item.name}
            </div>
            {(role.adminPower || role.canManageFoodItemData)&&(
            <div className='my-auto flex gap-2'>
              <span>
                <button className='border border-color5 bg-color5 flex p-[3px] rounded shadow cursor-pointer' onClick={()=>onOpen('edit-food-item',{editFoodItem:item})}>
                  <MdEdit className='bg-color5 text-white inline' size={18} />
                </button>
              </span>
              <span>
                <button className='border border-color5 bg-color5 flex p-[3px] rounded shadow cursor-pointer' onClick={()=>onOpen('Delete-Food-Item',{deleteFoodItem:item})}>
                  <MdDeleteForever
                    className='bg-color5 text-white inline'
                    size={18}
                  />
                </button>
              </span>
            </div>)}
          </div>
          <div className='flex justify-between w-full'>
            <div className='text-color5'>{item.smallDescription}</div>
            <div>
              <span>
                <div className='text-color5 font-semibold'>
                  {item.price}/-
                </div>
              </span>
            </div>
          </div>
          <div className='flex'>
            <Tooltip position="bottom" content={`${item.veg ? 'veg' : 'non-veg'}`} TooltipStyle={`whitespace-nowrap ${item.veg?'bg-green-600 text-green-50 border-white shadow-sm shadow-black' : 'bg-red-600 text-red-50 border-white shadow-sm shadow-black'}`}>
            <span className={`border-2 w-6 h-6 flex justify-evenly p-[2.3px] ${item.veg ? 'border-green-500' : 'border-red-500'}`}>
              <span className={`m-auto mx-auto rounded-full w-full h-full ${item.veg ? 'bg-green-500' : 'bg-red-500'} `} size={17}>
              </span>
            </span>
            </Tooltip>
          </div>
        </div>
      </div>
    </div>
    )
  }

  return (
    <div
    ref={setNodeRef}
    style={style}
    className='m-1 p-2 pl-0 rounded border border-color5 border-dashed bg-white shadow-md flex'>
      <div className="my-auto flex gap-1 mx-3" {...attributes} {...listeners}>
        <div className="flex gap-1 mx-auto flex-col">
          <div className="w-[5px] h-[5px] rounded-full bg-color5"></div>
          <div className="w-[5px] h-[5px] rounded-full bg-color5"></div>
          <div className="w-[5px] h-[5px] rounded-full bg-color5"></div>
        </div>
        <div className="flex gap-1 mx-auto flex-col">
          <div className="w-[5px] h-[5px] rounded-full bg-color5"></div>
          <div className="w-[5px] h-[5px] rounded-full bg-color5"></div>
          <div className="w-[5px] h-[5px] rounded-full bg-color5"></div>
        </div>
      </div>
      <div className='flex transition-all flex-1'>
        <img
          src={`${SERVER_URL}/uploads/${item.imageUrl}`}
          className='h-[90px] rounded shadow shadow-color3'
        />
        <div className='ml-2 w-full'>
          <div className='flex justify-between w-full'>
            <div className='text-2xl text-color5 font-semibold'>
              {item.name}
            </div>
            {(role.adminPower || role.canManageFoodItemData)&&(
            <div className='my-auto flex gap-2'>
              <span>
                <button className='border border-color5 bg-color5 flex p-[3px] rounded shadow cursor-pointer' onClick={()=>onOpen('edit-food-item',{editFoodItem:item})}>
                  <MdEdit className='bg-color5 text-white inline' size={18} />
                </button>
              </span>
              <span>
                <button className='border border-color5 bg-color5 flex p-[3px] rounded shadow cursor-pointer' onClick={()=>onOpen('Delete-Food-Item',{deleteFoodItem:item})}>
                  <MdDeleteForever
                    className='bg-color5 text-white inline'
                    size={18}
                  />
                </button>
              </span>
            </div>)}
          </div>
          <div className='flex justify-between w-full'>
            <div className='text-color5'>{item.smallDescription}</div>
            <div>
              <span>
                <div className='text-color5 font-semibold'>
                  {item.price}/-
                </div>
              </span>
            </div>
          </div>
          <div className='flex'>
            <Tooltip position="bottom" content={`${item.veg ? 'veg' : 'non-veg'}`} TooltipStyle={`whitespace-nowrap ${item.veg?'bg-green-600 text-green-50 border-white shadow-sm shadow-black' : 'bg-red-600 text-red-50 border-white shadow-sm shadow-black'}`}>
            <span className={`border-2 w-6 h-6 flex justify-evenly p-[2.3px] ${item.veg ? 'border-green-500' : 'border-red-500'}`}>
              <span className={`m-auto mx-auto rounded-full w-full h-full ${item.veg ? 'bg-green-500' : 'bg-red-500'} `} size={17}>
              </span>
            </span>
            </Tooltip>
          </div>
        </div>
      </div>
      {/* <div className="m-1">
        {item.foodTypes.map((item,i)=>{
          return <span key={i} className="p-1 rounded border border-color5 text-sm text-white bg-color5 mr-2">
            {item}
          </span>
        })}
      </div> */}
    </div>
  )
}

export default FoodItemBox
