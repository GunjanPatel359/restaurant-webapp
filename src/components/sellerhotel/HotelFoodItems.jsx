import { useEffect, useMemo, useState } from "react"
import { useModal } from "@/hooks/zusthook"
import { Plus } from "lucide-react"
import { toast } from "react-toastify"
import CategoryBox from "./CategoryBox"
import { DndContext, DragOverlay, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { arrayMove, SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { createPortal } from "react-dom"
import { produce } from "immer"
import { getMemberRoleInfo } from "@/actions/role"
import { getFoodItemsWithCategories } from "@/actions/hotel"

const HotelFoodItems = ({hotelId}) => {
    const { onOpen, reloadCmd } = useModal()
    const [category, setCategory] = useState([])
    const [role, setRole] = useState('')

    const CategoryIds = useMemo(() => category?.length>0?category.map((item) => item._id):[], [category])
    const [activeCategory, setActiveCategory] = useState(null)
    const [activeFoodItem, setActiveFoodItem] = useState(null)
    const [trigger, setTrigger] = useState()

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 3,
            }
        })
    )

    const onDragStart = (event) => {
        console.log(event)
        if (event.active.data.current?.type === "Category") {
            setActiveCategory(event.active.data.current.item);
        }

        if (event.active.data.current?.type === "FoodItem") {
            setActiveFoodItem(event.active.data.current.foodItem)
        }
    }

    const onDragEnd = (event) => {
        const { active, over } = event;
        console.log(active, over)
        if (!over) return;

        const activeType = active.data.current?.type;
        const overType = over.data.current?.type;

        console.log(active.data.current?.type, over.data.current?.type)

        // Handle sorting of categories
        if (activeType === "Category" && overType === "Category") {
            const activeIndex = category.findIndex(cat => cat._id === active.id);
            const overIndex = category.findIndex(cat => cat._id === over.id);

            if (activeIndex !== overIndex) {
                setCategory(prevCategories => arrayMove(prevCategories, activeIndex, overIndex));
            }
        }

        // Handle sorting of food items within a category
        if (activeType === "FoodItem" && overType === "FoodItem") {
            const activeCategoryIndex = category.findIndex(cat => cat.foodItemIds.some(item => item._id === active.id));
            const overCategoryIndex = category.findIndex(cat => cat.foodItemIds.some(item => item._id === over.id));

            // Only handle if food items are within the same category
            if (activeCategoryIndex === overCategoryIndex) {
                setCategory(
                    produce(category, (draft) => {
                        // Find the active and over indices in the specific foodItemIds array
                        const activeFoodIndex = draft[activeCategoryIndex].foodItemIds.findIndex(
                            (item) => item._id === active.id
                        );
                        const overFoodIndex = draft[activeCategoryIndex].foodItemIds.findIndex(
                            (item) => item._id === over.id
                        );
                        draft[activeCategoryIndex].foodItemIds = arrayMove(
                            draft[activeCategoryIndex].foodItemIds,
                            activeFoodIndex,
                            overFoodIndex
                        );
                    })
                );
                setTrigger(!trigger)
            } else {
                setCategory(
                    produce(category, (draft) => {
                        // Find and remove the active item from its original category
                        const activeItem = draft[activeCategoryIndex].foodItemIds.find(item => item._id === active.id);
                        draft[activeCategoryIndex].foodItemIds = draft[activeCategoryIndex].foodItemIds.filter(
                            item => item._id !== active.id
                        );

                        // Insert the active item into the new category at the position of the over item
                        const overFoodIndex = draft[overCategoryIndex].foodItemIds.findIndex(
                            item => item._id === over.id
                        );
                        draft[overCategoryIndex].foodItemIds.splice(overFoodIndex, 0, activeItem);
                    })
                );
                setTrigger(!trigger)
            }
        }

        if (activeType === "FoodItem" && overType === "Category") {
            const activeCategoryIndex = category.findIndex(cat => cat.foodItemIds.some(item => item._id === active.id));
            const targetCategoryIndex = category.findIndex(cat => cat._id === over.id);

            // Ensure both the active and target categories are valid
            if (activeCategoryIndex !== -1 && targetCategoryIndex !== -1 && activeCategoryIndex !== targetCategoryIndex) {
                setCategory(
                    produce(category, (draft) => {
                        // Find the item in the active category and remove it
                        const activeItemIndex = draft[activeCategoryIndex].foodItemIds.findIndex(item => item._id === active.id);
                        const [movedItem] = draft[activeCategoryIndex].foodItemIds.splice(activeItemIndex, 1);

                        // Add the item to the target category
                        draft[targetCategoryIndex].foodItemIds.push(movedItem);
                    })
                );
            }
        }

        setActiveCategory(null);
        setActiveFoodItem(null);
    }

    // const onDragOver = (event) => {
    //     const { active, over } = event;
    //     console.log(active, over)
    //     if (over && over.data.current?.type === "Category" && active.data.current?.type === "FoodItem") {
    //         setHoveredCategory(over.id); // Store the hovered category id
    //     } else {
    //         setHoveredCategory(null); // Clear when not hovering over a category
    //     }
    // };

    useEffect(() => {
        const initiatePage = async () => {
            try {
                const roleinfo = await getMemberRoleInfo(hotelId)
                if (roleinfo.success) {
                    setRole(roleinfo.role)
                }
                const response = await getFoodItemsWithCategories(hotelId)
                console.log(response)
                if (response.success) {
                    setCategory(response.categories)
                }
                console.log(response)
            } catch (error) {
                console.log(error)
                toast.error(error)
            }
        }
        initiatePage()
    }, [reloadCmd, hotelId])
    return (
        <div className="m-5">
            {
                <div className="m-5 mt-8">
                    <div className="text-color5 font-semibold text-2xl mb-4">Food Items</div>
                    <div className="flex gap-2">
                        {(role.adminPower || role?.canManageFoodItemData) && <span className="bg-color0 p-2 py-2 transition-all text-color5 hover:opacity-80 cursor-pointer border border-color5 border-dashed rounded-full flex flex-row max-w-fit pr-5" onClick={() => onOpen("create-food-category")}>
                            <span className="flex flex-row border border-color5 rounded-full mr-2 ml-1 border-dashed"><Plus className="inline" /></span> Create Category
                        </span>
                        }
                    </div>

                    {/* <div className="bg-color0 border border-color5 p-4 rounded mt-4 border-dashed text-lg flex flex-col gap-y-2"></div> */}
                    <DndContext
                        sensors={sensors}
                        onDragStart={onDragStart}
                        onDragEnd={onDragEnd}
                        // onDragOver={onDragOver}
                        onDragCancel={() => { setActiveCategory(null); setActiveFoodItem(null) }}>
                        <SortableContext items={CategoryIds} strategy={verticalListSortingStrategy}>
                            {category?.length > 0 && category?.map((item, i) => {
                                return (
                                    <CategoryBox
                                        key={trigger ? Date.now() + i : Date.now() + Date.now() + i}
                                        item={item}
                                        role={role}
                                        activeCategory={activeCategory}
                                        activeFoodItem={activeFoodItem} />
                                )
                            })}
                        </SortableContext>
                        {createPortal(
                            <DragOverlay>
                                {activeCategory &&
                                    <CategoryBox
                                        item={activeCategory}
                                        role={role} />}
                            </DragOverlay>, document.body
                        )}
                    </DndContext>
                </div>
            }
        </div>
    )
}

export default HotelFoodItems
