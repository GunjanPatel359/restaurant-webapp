/* eslint-disable react/prop-types */

import { ChevronLast, ChevronFirst } from 'lucide-react'
import { useState } from 'react'
import { IoFastFoodOutline } from 'react-icons/io5'

const SlideMenuVariant2 = ({menuItemList, select, setSelected }) => {
  const [expanded, setExpanded] = useState(true)

  return (
    <aside className='h-screen mt-1 shadow-xl'>
      <nav className='h-full flex flex-col bg-rose-400 border-r shadow rounded border-gray-200 transition-all duration-1000'>
        <div className='p-4 pb-2 flex justify-between items-center transition-all duration-1000'>
          <span
            className={`overflow-hidden transition-all duration-1000 ${
              expanded ? 'w-10 text-white' : 'w-0 text-rose-400 '
            }`}
          >
            <IoFastFoodOutline className='inline' size={40} />
          </span>
          <span
            className={`overflow-hidden bg-transparent text-[30px] transition-all duration-1000 ${
              expanded ? 'w-32 text-white' : 'w-0 text-rose-400'
            }`}
          >
            Taste
          </span>
          <button
            onClick={() => setExpanded(curr => !curr)}
            className='transition-all p-1.5 rounded-xl mr-[2px] hover:bg-rose-300 text-white'
          >
            {expanded ? <ChevronFirst /> : <ChevronLast />}
          </button>
        </div>
        <div className='w-full'><div className={`transition-all duration-1000 mx-auto border border-white mb-2 rounded-3xl shadow-xl ${expanded?"w-[85%]":"w-[60%]"}`}></div></div>
        <ul className='flex-1 px-3 transition-all duration-1000'>
         {menuItemList.map((item,i)=><SidebarItem active={select === i?true:false} setSelected={setSelected} index={i} key={i} item={item} expanded={expanded} />
         )}
        </ul>

      </nav>
    </aside>
  )
}

export function SidebarItem ({ item, expanded,active,setSelected,index }) {
  const icon=item.icon;
  const text=item.text;
  const alert=item.alert;
  return (
    <li
      className={`
        relative flex items-center py-2 px-3 my-1
        font-medium rounded-full cursor-pointer
        group transition-all duration-1000 h-[47px] shadow
        ${
          active
            ? 'border border-white shadow-2xl bg-rose-400 text-white' //bg-gradient-to-tr from-rose-400 to-rose-300
            : 'border hover:bg-red-100 bg-white text-rose-400'
        }
    `}
    onClick={()=>setSelected(index)}
    >
      {icon}
      <span
        className={`overflow-hidden transition-all duration-1000  ${
          expanded ? 'w-52 ml-3' : 'w-0'
        } ${active?"text-white":"text-rose-500"}`}
      >
        {text}
      </span>

      {alert && (
        <div
          className={`absolute right-2 w-2 h-2 rounded ${
            expanded ? '' : 'top-2'
          } ${active?"bg-white":"bg-rose-300"} `}
        />
      )}

      {!expanded && (
        <div
          className={`
          absolute left-full rounded-full px-2 py-1 ml-6
          text-sm
          invisible opacity-20 -translate-x-3 transition-all duration-200
          group-hover:visible group-hover:opacity-100 group-hover:translate-x-0
          ${active?"bg-gradient-to-tr from-rose-400 to-rose-300 text-white":"bg-rose-50"}
      `}
        >
          {text}
        </div>
      )}
    </li>
  )
}

export default SlideMenuVariant2
