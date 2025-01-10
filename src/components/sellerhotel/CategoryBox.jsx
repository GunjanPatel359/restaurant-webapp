/* eslint-disable react/prop-types */

import { Plus } from "lucide-react"
import FoodItemBox from "./FoodItemBox"
import { useModal } from "@/hooks/zusthook"
import { MdDeleteForever, MdEdit } from "react-icons/md"
import { SortableContext, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { createPortal } from "react-dom"
import { DragOverlay } from "@dnd-kit/core"

const CategoryBox = ({ item, role, activeFoodItem }) => {
  const { onOpen } = useModal()

  const { setNodeRef, attributes, listeners, transform, transition, isDragging } = useSortable({
    id: item._id,
    data: {
      type: "Category",
      item
    }
  })

  const style = {
    transition,
    transform: CSS.Translate.toString(transform)
  }

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={{
          transition,
          transform: CSS.Transform.toString(transform)
        }}
        className="bg-color0 border border-color5 p-4 rounded mt-4 border-dashed text-lg flex flex-col shadow-lg opacity-60">
        <div className="flex justify-between" >
          <div className="text-2xl font-semibold text-color5">{item.categoryName}</div>
          <div className="flex gap-2">
            <span className="text-white bg-color5 rounded w-[32px] items-center flex shadow cursor-pointer hover:opacity-90" onClick={() => onOpen("create-food-item", { addfooditem: item })}>
              <Plus className="m-auto" size={24} />
            </span>
            <span className="text-white bg-color5 rounded w-[32px] items-center flex shadow cursor-pointer hover:opacity-90" onClick={() => onOpen('edit-food-category', { categoryItem: item })}>
              <MdEdit className="m-auto" size={24} />
            </span>
            <span className="text-white bg-color5 rounded w-[32px] items-center flex shadow cursor-pointer hover:opacity-90" onClick={() => onOpen('Delete-Food-Category', { categoryDelete: item })}>
              <MdDeleteForever className="m-auto" size={24} />
            </span>

          </div>
        </div>
        <div className="text-color4">
          {item.description}
        </div>
        {item.foodItemIds.length > 0 && item.foodItemIds.map((item, i) => {
          return (
            <FoodItemBox key={i} item={item} role={role} />
          )
        })}
      </div>
    )
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-color0 border border-color5 p-4 rounded mt-4 pt-0 border-dashed text-lg flex flex-col shadow-lg">
      <div className="w-full flex my-2" {...attributes} {...listeners}>
        <div className="flex gap-1 mx-auto">
          <div className="w-[5px] h-[5px] rounded-full bg-color5"></div>
          <div className="w-[5px] h-[5px] rounded-full bg-color5"></div>
          <div className="w-[5px] h-[5px] rounded-full bg-color5"></div>
        </div>
      </div>
      <div className="flex justify-between">
        <div className="text-2xl font-semibold text-color5">{item.categoryName}</div>
        <div className="flex gap-2">
          <span className="text-white bg-color5 rounded w-[32px] items-center flex shadow cursor-pointer hover:opacity-90" onClick={() => onOpen("create-food-item", { addfooditem: item })}>
            <Plus className="m-auto" size={24} />
          </span>
          <span className="text-white bg-color5 rounded w-[32px] items-center flex shadow cursor-pointer hover:opacity-90" onClick={() => onOpen('edit-food-category', { categoryItem: item })}>
            <MdEdit className="m-auto" size={24} />
          </span>
          <span className="text-white bg-color5 rounded w-[32px] items-center flex shadow cursor-pointer hover:opacity-90" onClick={() => onOpen('Delete-Food-Category', { categoryDelete: item })}>
            <MdDeleteForever className="m-auto" size={24} />
          </span>

        </div>
      </div>
      <div className="text-color4">
        {item.description}
      </div>
      {/* <div className="bg-color0 border border-color5 rounded mt-1 border-dashed text-lg flex flex-col"> */}
      <SortableContext items={item.foodItemIds.map((item) => item._id) || []} strategy={verticalListSortingStrategy}>
        {item.foodItemIds.length > 0 && item.foodItemIds.map((item, i) => {
          return (
            <FoodItemBox key={i} item={item} role={role} />
          )
        })}
      </SortableContext>
      {createPortal(
        <DragOverlay>
          {activeFoodItem &&
            <FoodItemBox
            item={activeFoodItem}
            role={role}/>}
        </DragOverlay>, document.body
      )}
      {/* </div> */}
    </div>
  )
}

export default CategoryBox
