/* eslint-disable react/prop-types */

import { ChevronLast, ChevronFirst } from 'lucide-react'
import { useState } from 'react'
import { IoFastFoodOutline } from 'react-icons/io5'

const SlideMenu = ({menuItemList, select, setSelected}) => {
  const [expanded, setExpanded] = useState(true)

  return (
    <aside className='h-screen mt-1'>
      <nav className='h-full flex flex-col bg-white border-r shadow rounded border-color2 transition-all duration-1000'>
        <div className='p-4 pb-2 flex justify-between items-center transition-all duration-1000 bg-transparent'>
          {/* <img
            src="https://img.logoipsum.com/243.svg"
            className={`overflow-hidden transition-all duration-1000 ${
              expanded ? "w-32" : "w-0"
            }`}
            alt=""
          /> */}
          <span
            className={`overflow-hidden transition-all duration-1000 ${
              expanded ? 'w-10 text-color5' : 'w-0 text-white '
            }`}
          >
            <IoFastFoodOutline className='inline bg-transparent' size={40} />
          </span>
          <span
            className={`overflow-hidden bg-transparent text-[30px] text-color5 transition-all duration-1000 ${
              expanded ? 'w-32' : 'w-0 text-white'
            }`}
          >
            Taste
          </span>
          <button
            onClick={() => setExpanded(curr => !curr)}
            className='p-1.5 rounded bg-color0 hover:bg-color1 text-color5'
          >
            {expanded ? <ChevronFirst /> : <ChevronLast />}
          </button>
        </div>

        <ul className='flex-1 px-3 transition-all duration-1000'>
         {menuItemList.map((item,i)=><SidebarItem active={select === i?true:false} setSelected={setSelected} index={i} key={i} item={item} expanded={expanded} />
         )}
        </ul>

        {/* <div className="border-t flex p-3">
          <img
            src="https://ui-avatars.com/api/?background=c7d2fe&color=3730a3&bold=true"
            alt=""
            className="w-10 h-10 rounded-md"
          />
          <div
            className={`
              flex justify-between items-center
              overflow-hidden transition-all duration-1000 ${expanded ? "w-52 ml-3" : "w-0"}
          `}
          >
            <div className="leading-4">
              <h4 className="font-semibold">John Doe</h4>
              <span className="text-xs text-gray-600">johndoe@gmail.com</span>
            </div>
            <MoreVertical size={20} />
          </div>
        </div> */}
      </nav>
    </aside>
  )
}

export function SidebarItem ({ item, expanded,active,setSelected,index }) {
  if(!item || item==undefined || item==null){
    return <></>
  }
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
            ? ' bg-color5 opacity-90 text-white' //bg-gradient-to-tr from-color4 to-color3
            : 'hover:bg-color0 bg-white text-color5'
        }
    `}
    onClick={()=>setSelected(index)}
    >
      {icon}
      <span
        className={`overflow-hidden transition-all duration-1000 whitespace-nowrap  ${
          expanded ? 'w-52 ml-3' : 'w-0'
        } ${active?"text-white":"text-color5"}`}
      >
        {text}
      </span>

      {alert && (
        <div
          className={`absolute right-2 w-2 h-2 rounded ${
            expanded ? '' : 'top-2'
          } ${active?"bg-white":"bg-color5"} `}
        />
      )}

      {!expanded && (
        <div
          className={`
          absolute left-full rounded-full px-2 py-1 ml-6
          text-sm
          invisible opacity-20 -translate-x-3 transition-all duration-200
          group-hover:visible group-hover:opacity-100 group-hover:translate-x-0
          z-10 over whitespace-nowrap
          ${active?"bg-color5 text-white":"bg-color0"}
      `}
        >
          {text}
        </div>
      )}
    </li>
  )
}

export default SlideMenu
