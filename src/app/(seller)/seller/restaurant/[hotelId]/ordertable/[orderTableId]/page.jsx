"use client"
import { IoIosArrowDown } from "react-icons/io"
import Tooltip from "@/components/customui/Tooltip"
import SellerProfileHeader from "@/components/sellerprofile/SellerProfileHeader"
import { useCallback, useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { toast } from "react-toastify"

import { IoIosArrowForward } from "react-icons/io";
import { Checkbox } from "@/components/ui/checkbox"
import SelectInput from "@/components/customui/SelectInput"
import { DoubleScrollBar } from "@/components/customui/DoubleScrollBar"
import OneWayScrollBar from "@/components/customui/OneWayScrollBar"
import { Minus, Plus } from "lucide-react"
import { useModal } from "@/hooks/zusthook"

// import { socket } from "../socket"
import { MdOutlineSearch } from "react-icons/md"
import { getHotelData, getSellerInfo } from "@/actions/seller"
import { getOrderTableDetails } from "@/actions/ordertable"
import { getAllFoodItems } from "@/actions/fooditem"
import { SERVER_URL } from "@/lib/server"

const SellerRestaurantOrderTablePage = () => {
    const params = useParams()
    const hotelId = params.hotelId
    const orderTableId = params.orderTableId

    const { onOpen, reloadCmd } = useModal()

    const [seller,setSeller]=useState()
    const [orderTableDetails, setOrderTableDetails] = useState('')
    const [orderFood, setOrderFood] = useState(true)

    const [food, setFood] = useState([]);
    const [filteredFood, setFilteredFood] = useState([])

    const [order, setOrder] = useState([])

    const [onGoing, setOnGoing] = useState([])

    useEffect(() => {
        const initiatePage = async () => {
            try {
                const res = await getSellerInfo()
                if(res.success){
                    setSeller(res.seller)
                }
            } catch (error) {
                toast.error("Somthing went wrong")
            }
        }
        initiatePage()
    }, [hotelId])

    // useEffect(() => {
    //     socket.connect()
    // }, [])

    useEffect(() => {
        const fetchInitiatePage = async () => {
            try {
                const response = await getOrderTableDetails(hotelId,orderTableId)
                if (response.success) {
                    setOrderTableDetails(response.orderTableDetails)
                    setOnGoing(response.orderTableDetails.orders)
                    setOrder([])
                }
            } catch (error) {
                console.log(error)
                toast.error(error)
            }
        }
        if (hotelId && orderTableId) {
            fetchInitiatePage()
        }
        // socket.on(`restaurant/${hotelId}/order-tables/${orderTableId}`, () => {
        //     initiatePage()
        //     console.log('working')
        // })
        // return () => {
        //     socket.off(`restaurant/${hotelId}/order-tables/${orderTableId}`)
        // }
    }, [hotelId, orderTableId, reloadCmd])


    useEffect(() => {
        const initialCom = async () => {
            try {
                const response = await getAllFoodItems(hotelId)
                if (response.success) {
                    setFood(response.food)
                    setFilteredFood(response.food)
                }
            } catch (error) {
                toast.error(error.message)
            }
        }
        initialCom()
    }, [hotelId])
    
    return (
        <div>
            <SellerProfileHeader seller={seller} />
            <div className="m-auto mt-8 mb-36">
                {
                    orderTableDetails && (
                        <div>
                            <div className="m-2">
                                <div className="text-color5 text-2xl"><span className="text-color5 font-semibold">Restaurant Name:</span> {orderTableDetails.restaurantId.name}</div>
                                <div className="text-color5 text-xl"><span className="text-color5 font-semibold">Table Number:</span> {orderTableDetails.tableNumber}</div>
                                <div className="text-color5 text-xl"><span className="text-color5 font-semibold">Table Description:</span> {orderTableDetails.tableDescription}</div>
                                <div className="text-color5"><span className="text-color5 font-semibold">Status:</span> {orderTableDetails.status}</div>
                                <div className="text-color5"><span className="text-color5 font-semibold">Seats:</span> {orderTableDetails.seats}</div>
                            </div>

                            <div className="flex mx-2 mb-2">
                                <div className="w-[400px] mr-2">
                                    <div>
                                        <RestaurantBill item={onGoing} hotel={orderTableDetails.restaurantId} />
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <div className="text-white font-semibold text-2xl bg-color5 p-2 pl-5">Orders</div>
                                    {onGoing.length > 0 ? (
                                        <div>
                                            {onGoing.map((item, i) =>
                                                <OrderItems item={item} key={i} />
                                            )}
                                            <div className="flex justify-between p-2">
                                                <span className="text-xl text-color5 font-semibold">
                                                    Total Amount
                                                </span>
                                                <span className="text-xl text-color5 font-semibold pr-1">
                                                    {onGoing.reduce((total, item) => total + item.foodItemId.price * item.quantity, 0)}/-
                                                </span>
                                            </div>
                                        </div>
                                    ) : <div className="text-color5 mt-3 text-center font-semibold">{`Haven't ordered anything yet`}</div>}
                                    <div className="w-full h-[2px] bg-color4 mt-3 shadow shadow-color0"></div>
                                </div>
                            </div>

                            <div className="flex mx-2">
                                <div className="w-[400px] mr-2">
                                    <Filter items={food} filteredFood={filteredFood} onFilter={setFilteredFood} />
                                </div>
                                <div className="flex-1">
                                    
                                    <div className="bg-color5 text-color2 p-3 text-xl flex justify-between mb-2">
                                        <div className="font-semibold text-2xl ml-2 text-white">Add Order</div>
                                        <div className="text-center items-center my-auto">
                                            <div className="p-1 bg-white mr-2 rounded cursor-pointer">
                                                <IoIosArrowForward className={`transition-all text-color5 ${orderFood ? "rotate-90" : ""}`} onClick={() => setOrderFood(!orderFood)} />
                                            </div>
                                        </div>
                                    </div>

                                    <div className={`transition-all duration-500 grid ${!orderFood ? "grid-rows-[0fr]" : "grid-rows-[1fr]"}`}>
                                        <div className="overflow-hidden">

                                            {filteredFood && filteredFood.map((item, i) =>
                                                <CategoryOpen item={item} key={i} order={order} setOrder={setOrder} />
                                            )
                                            }
                                            <div className="flex">
                                                <button className="text-xl bg-white text-color5 border border-color5 shadow shadow-color5 p-2 w-full rounded mr-1">reset</button>
                                                <button className="text-xl bg-color5 text-white p-2 w-full rounded shadow hover:opacity-90"
                                                    onClick={() => onOpen('Ordertable-make-Order-seller',
                                                        {
                                                            orderTableOrderFood: {
                                                                orderTabelId: orderTableDetails._id,
                                                                order
                                                            }
                                                        }
                                                    )}
                                                >Order</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    )
                }
            </div>
        </div>
    )
}

const OrderItems = ({ item }) => {
    const food = item.foodItemId
    var color = "text-rose-500"
    switch (item.status) {
        case 'Waiting': {
            color = "bg-rose-500"
            break
        }
        case 'Preparing': {
            color = "bg-blue-500"
            break
        }
        case 'Prepared': {
            color = "bg-purple-500"
            break
        }
        case 'Completed': {
            color = "bg-green-500"
            break
        }
    }
    // "Waiting","Preparing","prepared","Completed"
    return (
        <div className='p-2 bg-white border-b border-color2'>
            <div className='flex transition-all'>
                <img
                    src={`${SERVER_URL}/uploads/${food.imageUrl}`}
                    className='h-[90px] rounded shadow shadow-color3'
                />
                <div className='ml-2 w-full flex-col flex gap-1'>
                    <div className='flex justify-between w-full'>
                        <div className='text-xl text-color5 font-semibold'>
                            {food.name}
                        </div>
                        <div>
                            <span>
                                <div className={`p-1 rounded-full px-3 text-white ${color}`}>{item.status}</div>
                            </span>
                        </div>

                    </div>
                    <div className='flex justify-between w-full '>
                        <div className='text-color5'>{food.smallDescription}</div>
                        <div>
                            <span>
                                <div className="text-color5 font-semibold text-xl">{item.quantity} X {food.price}/-</div>
                            </span>
                        </div>
                    </div>
                    <div className='flex'>
                        <Tooltip position="right" content={`${food.veg ? 'veg' : 'non-veg'}`} TooltipStyle={`whitespace-nowrap ${food.veg ? 'bg-green-600 text-green-50 border-white shadow-sm shadow-black' : 'bg-red-600 text-red-50 border-white shadow-sm shadow-black'}`}>
                            <span className={`border-2 w-6 h-6 flex justify-evenly p-[2.3px] ${food.veg ? 'border-green-500' : 'border-red-500'}`}>
                                <span className={`m-auto mx-auto rounded-full w-full h-full ${food.veg ? 'bg-green-500' : 'bg-red-500'} `} size={17}>
                                </span>
                            </span>
                        </Tooltip>
                    </div>
                </div>
            </div>
        </div>
    )
}

const CategoryOpen = ({ item, order, setOrder }) => {
    const [open, setOpen] = useState(true)
    return (
        <div className="mb-1">
            <div className="flex bg-color0 text-color5 p-2 pl-4 w-full justify-between z-10">
                <div className="flex flex-col">
                    <div className="font-semibold text-2xl">
                        {item.categoryName}
                    </div>
                    <div>
                        {item.description}
                    </div>
                </div>
                <div className="flex">
                    <div className="m-auto mr-3">
                        <div className="border-1 bg-color1 p-1 cursor-pointer" onClick={() => setOpen(!open)}>
                            <IoIosArrowDown className={`${open ? "" : "-rotate-90"} transition-all duration-500 text-color5`} size={20} />
                        </div>
                    </div>
                </div>
            </div>
            <div className={`ease-linear duration-300 transition-all ${open ? "max-h-screen overflow-clip" : "max-h-0 overflow-hidden"}`}>
                {item?.foodItemIds && item.foodItemIds.length > 0 &&
                    item.foodItemIds.map((item, i) =>
                        <FoodItemOpen item={item} key={i} order={order} setOrder={setOrder} />
                    )
                }
            </div>
        </div>
    )
}

const FoodItemOpen = ({ item, order, setOrder }) => {
    const [count, setCount] = useState(1)
    useEffect(() => {
        const check = order.find((food) => {
            if ((food._id).toString() == (item._id).toString())
                return item
        })
        if (check) {
            setCount(check.quantity)
        }
    }, [item, order])
    const handleCheckClick = () => {
        const check = order.find((food) => {
            if ((food._id).toString() == (item._id).toString())
                return item
        })
        if (!check) {
            setOrder([...order, { _id: item._id, quantity: count, item }])
        }
        if (check) {
            const newOrder = order.filter((food) => {
                return (food._id).toString() != (item._id).toString()
            })
            setOrder(newOrder)
        }
    }
    const handlecheck = () => {
        const check = order.find((food) => {
            if ((food._id).toString() == (item._id).toString())
                return item
        })
        if (check) {
            return true
        }
        return false
    }
    const onValueup = () => {
        const check = order.find((food) => {
            if ((food._id).toString() == (item._id).toString())
                return item
        })
        if (check) {
            const newOrder = order.map((food) => {
                if ((food._id).toString() == (item._id).toString())
                    return { ...food, quantity: food.quantity + 1 }
                return food
            })
            setOrder(newOrder)
        }
        setCount(count + 1)
    }
    const onValuedown = () => {
        const check = order.find((food) => {
            if ((food._id).toString() == (item._id).toString())
                return item
        })
        if (check && check.quantity > 1) {
            const newOrder = order.map((food) => {
                if ((food._id).toString() == (item._id).toString())
                    return { ...food, quantity: food.quantity - 1 }
                return food
            })
            setOrder(newOrder)
            setCount(count - 1)
            return
        }
        if (count > 1) {
            setCount(count - 1)
        }

    }
    return (
        <div className='p-2 bg-white border-b border-color2'>
            <div className='flex transition-all'>
                <Checkbox
                    checked={handlecheck()}
                    onCheckedChange={() => handleCheckClick()}
                    className="m-auto mr-3 border-color4 text-color5 data-[state=checked]:bg-color0 rounded shadow shadow-color1 data-[state=checked]:text-color5" />
                <img
                    src={`${SERVER_URL}/uploads/${item.imageUrl}`}
                    className='h-[90px] rounded shadow shadow-color3'
                />
                <div className='ml-2 w-full flex-col flex gap-1'>
                    <div className='flex justify-between w-full'>
                        <div className='text-xl text-color5 font-semibold'>
                            {item.name}
                        </div>
                        <div>
                            <span>
                                <div className="text-color5 font-semibold text-xl">{item.price}/-</div>
                            </span>
                        </div>

                    </div>
                    <div className='flex justify-between w-full '>
                        <div className='text-color5'>{item.smallDescription}</div>
                        <div>
                            <span>
                                <div className='text-color5 font-semibold flex gap-2'>
                                    <span className="border border-color5 rounded text-center bg-color5 shadow">
                                        <Minus className="inline text-white cursor-pointer" onClick={onValuedown} />
                                    </span>
                                    <input type="number" value={count} onChange={() => { }} className="inline w-6 text-center outline-none border border-color5  rounded" inputMode="numeric" />
                                    <span className="border border-color5 rounded text-center bg-color5 shadow">
                                        <Plus className="inline text-white cursor-pointer" onClick={onValueup} />
                                    </span>
                                </div>
                            </span>
                        </div>
                    </div>
                    <div className='flex'>
                        <Tooltip position="right" content={`${item.veg ? 'veg' : 'non-veg'}`} TooltipStyle={`whitespace-nowrap ${item.veg ? 'bg-green-600 text-green-50 border-white shadow-sm shadow-black' : 'bg-red-600 text-red-50 border-white shadow-sm shadow-black'}`}>
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

const RestaurantBill = ({ item,hotel }) => {
    console.log(item,hotel)
    // Calculate the subtotal
    const calculateSubtotal = () => {
        return item.reduce((sum, item) => sum + item.foodItemId.price * item.quantity, 0);
    };

    // Calculate tax
    const calculateGSTTax = () => {
        return calculateSubtotal() * (hotel.hotelGSTTax/100);
    };

    const calculateServiceTax = () =>{
        return calculateSubtotal() * (hotel.hotelServiceTax/100)
    }

    // Calculate the total amount
    const calculateTotal = () => {
        return calculateSubtotal() + calculateServiceTax() + calculateGSTTax() ;
    };

    const handleFinish = ()=>{

    }

    return (
        <div className="mx-auto px-6 py-4 border border-color1 rounded-lg bg-white shadow-md">
            <h2 className="text-xl font-semibold mb-1 text-color5">Customer Bill</h2>
            <table className="w-full table-fixed mb-2">
                <thead>
                    <tr className="text-left border-b border-color3">
                        <th className="py-2 text-left truncate w-[120px] text-color5">Item</th>
                        <th className="py-2 text-right text-color5">Price</th>
                        <th className="py-2 text-center text-color5">Qty</th>
                        <th className="py-2 text-right text-color5">Total</th>
                    </tr>
                </thead>
                <tbody>
                    {item.map((item, index) => (
                        <tr key={index} className="border-b border-color3">
                            <td className="py-2 truncate overflow-hidden whitespace-nowrap text-color4">{item.foodItemId.name}djfherwgbebgiheebihwbtbh</td>
                            <td className="py-2 text-right text-color4">{item.foodItemId.price.toFixed(2)}</td>
                            <td className="py-2 text-center text-color4">{item.quantity}</td>
                            <td className="py-2 text-right text-color4">{(item.foodItemId.price * item.quantity).toFixed(2)}0</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="flex justify-between mb-2 text-color5">
                <span>Subtotal:</span>
                <span className="text-right">{calculateSubtotal().toFixed(2)}</span>
            </div>
            <div className="flex justify-between mb-2 text-color5">
                <span>Tax ({hotel.hotelGSTTax}%):</span>
                <span className="text-right">{calculateGSTTax().toFixed(2)}</span>
            </div>
            <div className="flex justify-between mb-2 text-color5">
                <span>Service Tax ({hotel.hotelServiceTax}%):</span>
                <span className="text-right">{calculateServiceTax().toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-semibold text-lg mt-2 text-color5">
                <span>Total:</span>
                <span className="text-right">{calculateTotal().toFixed(2)}</span>
            </div>
            <div className="text-right mt-2">
                <span className="px-4 py-1 border border-color5 font-semibold text-white bg-color5 rounded cursor-pointer hover:shadow hover:shadow-color1 transition-all" onClick={()=>handleFinish()}>Finish</span>
            </div>
        </div>

    );
};

const Filter = ({ items, onFilter }) => {
    const [filteredInfo, setFilteredInto] = useState({
        searchTerm: '',
        category: '',
        priceRange: { min: 0, max: 1000 },
        minRating: 0,
        minRatingCount: 0
    })

    const [searchTerm, setSearchTerm] = useState("");
    const [category, setCategory] = useState("");
    const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 })
    const [minRating, setMinRating] = useState(0); // Minimum rating range 0-5
    const [minRatingCount, setMinRatingCount] = useState(0); // Minimum rating count

    // Extract unique categories from items
    const categories = [...new Set(items.map(item => item.categoryName))];

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value)
        const filteredItems = items.map(categoryFilter => {
            // First, check if the entire category matches the selected category filter (if any)
            const matchesCategory = !filteredInfo.category || categoryFilter.categoryName == category;
            // Then, filter each food item within this category
            const filteredFoodItems = categoryFilter.foodItemIds.filter(foodItem => {
                const matchesSearch = searchTerm
                    ? foodItem.name.toLowerCase().includes(e.target.value.toLowerCase())
                    : true;
                // Check if the price of the food item is within the selected range
                const matchesPrice = foodItem.price >= parseFloat(filteredInfo.priceRange.min) &&
                    foodItem.price <= parseFloat(filteredInfo.priceRange.max);
                // Check if the average rating meets or exceeds the minimum rating
                const matchesRating = foodItem.avgreview >= parseFloat(filteredInfo.minRating);

                // Check if the total review count meets or exceeds the minimum rating count
                const matchesRatingCount = foodItem.totalReview >= parseInt(filteredInfo.minRatingCount, 10);

                // Only return food items that satisfy all filter conditions
                return matchesSearch && matchesPrice && matchesRating && matchesRatingCount;
            });

            if (matchesCategory && filteredFoodItems.length > 0) {
                return { ...categoryFilter, foodItemIds: filteredFoodItems };
            }
        }).filter(category => category != null || undefined);

        onFilter(filteredItems);
        // setSearchTerm(e.target.value);
        // applyFilters(e.target.value, category, priceRange, minRating, minRatingCount);
    };

    const handleCategoryChange = (option) => {
        setCategory(option);
    };

    const handlePriceRange = useCallback((newRange) => {
        setPriceRange(newRange);
    }, []);

    const handleMinRatingChange = (e) => {
        setMinRating(e.target.value);
    };

    const handleMinRatingCountChange = (e) => {
        setMinRatingCount(e.target.value);
    };

    const handleFilterApplyClick = () => {
        applyFilters(searchTerm, category, priceRange, minRating, minRatingCount);
    }

    const applyFilters = (searchTerm, category, priceRange, minRating, minRatingCount) => {
        const filteredItems = items.map(categoryFilter => {
            // First, check if the entire category matches the selected category filter (if any)
            const matchesCategory = !category || categoryFilter.categoryName == category;
            // Then, filter each food item within this category
            const filteredFoodItems = categoryFilter.foodItemIds.filter(foodItem => {
                const matchesSearch = searchTerm
                    ? foodItem.name.toLowerCase().includes(searchTerm.toLowerCase())
                    : true;
                // Check if the price of the food item is within the selected range
                const matchesPrice = foodItem.price >= parseFloat(priceRange.min) &&
                    foodItem.price <= parseFloat(priceRange.max);
                // Check if the average rating meets or exceeds the minimum rating
                const matchesRating = foodItem.avgreview >= parseFloat(minRating);

                // Check if the total review count meets or exceeds the minimum rating count
                const matchesRatingCount = foodItem.totalReview >= parseInt(minRatingCount, 10);

                // Only return food items that satisfy all filter conditions
                return matchesSearch && matchesPrice && matchesRating && matchesRatingCount;
            });

            if (matchesCategory && filteredFoodItems.length > 0) {
                return { ...categoryFilter, foodItemIds: filteredFoodItems };
            }

        }).filter(category => category != null || undefined);
        setFilteredInto({
            category: category,
            priceRange: priceRange,
            minRating: minRating,
            minRatingCount: minRatingCount
        })
        onFilter(filteredItems);
    };

    return (
        <div className="flex flex-col gap-2 p-4 border border-color2 rounded-lg bg-white shadow-md">
            <div className="px-2 py-2 border border-color3 rounded-md  focus:border-color5 text-color5 flex">
            <MdOutlineSearch className="my-auto translate-y-[2px] mr-1 text-color5" size={25} />
            <input
                type="text"
                placeholder="Search by name"
                value={searchTerm}
                onChange={handleSearchChange}
                className="placeholder:text-color3 text-color5 focus:outline-none"
            />
            </div>
            <div className="h-[2px] w-full bg-color4 rounded-full"></div>
            <div className="text-xl font-semibold text-color5">Filter</div>
            <SelectInput
                options={categories}
                selectedOption={category}
                onOptionSelect={handleCategoryChange}
                placeholder="Choose a category"
            />

            <label className="text-color5 font-semibold">Price Range:<span className="ml-2 font-normal">{priceRange.min} - {priceRange.max}</span></label>
            <div className="flex flex-col w-[80%] mx-auto">
                <DoubleScrollBar min={0} max={1000} onChange={handlePriceRange} />
            </div>

            <label className="text-color5 font-semibold">Min Rating: <span className="ml-2 font-normal">{minRating}/5</span></label>
            <div className="flex flex-col w-[80%] mx-auto">
                <OneWayScrollBar min={0} max={5} step={0.1} value={minRating} onChange={handleMinRatingChange} />
            </div>

            <label className=" text-color5 font-semibold">Min Rating Count: <span className="ml-2 font-normal">{minRatingCount}</span></label>
            <div className="flex flex-col w-[80%] mx-auto">
                <OneWayScrollBar min={0} max={500} step={1} value={minRatingCount} onChange={handleMinRatingCountChange} />
            </div>
            <div className="flex gap-1 mt-2">
                <div className="w-[50%] border p-1 text-center text-color4 border-color4 cursor-pointer transition-all hover:shadow"
                // onClick={handleClearFilterClick}
                >
                    Clear Filter
                </div>
                <div className="w-[50%] border p-1 text-center bg-color4 text-white cursor-pointer hover:bg-color5 transition-all hover:shadow"
                    onClick={handleFilterApplyClick}
                >
                    Apply
                </div>
            </div>
        </div>
    );
};

export default SellerRestaurantOrderTablePage
