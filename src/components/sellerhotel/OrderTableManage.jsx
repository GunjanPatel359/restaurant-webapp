import { Plus } from 'lucide-react'
import { useModal } from '@/hooks/zusthook'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { MdDeleteForever, MdEdit } from 'react-icons/md'
import { getAllTables } from '@/actions/ordertable'

const OrderTableManage = ({hotelId}) => {

  const { onOpen,reloadCmd } = useModal()
  const [orderTables,setOrderTables]=useState([])

  useEffect(()=>{
    const getOrderTables=async()=>{
      try {
        const response=await getAllTables(hotelId)
        if(response.success){
          setOrderTables(response.hotel.tableIds)
        }
      } catch (error) {
        toast.error(error.message)
      }
    }
    getOrderTables()
  },[hotelId,reloadCmd])
  return (
    <div className='m-5'>
        <div className='m-5 mt-8'>
          <div className='text-color5 font-semibold text-2xl mb-4'>
            Manage Tables
          </div>
          <div className='flex gap-2'>
            <span
              className='bg-color0 p-2 py-2 transition-all text-color5 hover:opacity-80 cursor-pointer border border-color5 border-dashed rounded-full flex flex-row max-w-fit pr-5'
              onClick={() => onOpen('create-order-table')}
            >
              <span className='flex flex-row border border-color5 rounded-full mr-2 ml-1 border-dashed'>
                <Plus className='inline' />
              </span>{' '}
              Create Table
            </span>
          </div>
          <div className='bg-color0 border border-color5 p-4 rounded mt-4 border-dashed text-lg flex flex-col gap-y-2 shadow-md'>
            {
              orderTables.map((table, i) => (
                <div key={i} className='bg-white p-3 rounded text-color5 border border-dashed border-color5 shadow-md'>
                  <div className='flex justify-between'>
                  <div><span className='font-semibold'>Table Number:</span> {table.tableNumber}</div>
                  <div className='my-auto flex gap-2'>
              <span>
                <span className='border border-color5 bg-color5 flex p-[3px] rounded shadow cursor-pointer' onClick={()=>onOpen("edit-order-table",{editOrderTable:table})}>
                  <MdEdit className='bg-color5 text-white inline' size={18} />
                </span>
              </span>
              <span>
                <span className='border border-color5 bg-color5 flex p-[3px] rounded shadow cursor-pointer'>
                  <MdDeleteForever
                    className='bg-color5 text-white inline'
                    size={18}
                    onClick={()=>onOpen("Delete-Order-Table-Info",{deleteOrderTable:table})}
                  />
                </span>
              </span>
            </div>
                  </div>
                  <div className='flex justify-between'>
                  <div><span className='font-semibold'>Table Description:</span> {table.tableDescription}</div>
                  <div><span className='font-semibold'>Seats:</span> {table.seats}</div>
                    </div>
                </div>
              ))
            }
          </div>
        </div>
    </div>
  )
}

export default OrderTableManage
