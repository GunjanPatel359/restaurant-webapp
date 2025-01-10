/* eslint-disable react/prop-types */
import { useEffect, useState } from "react"
import { useModal } from "../../../customhooks/zusthook"
import { useParams } from "react-router-dom"
import { toast } from "react-toastify"
import axios from "axios"
import { backend_url, img_url } from "../../../server"
import RatingShow from "../../customui/RatingShow"
import RatingBar from "../../../components/customui/RatingBar"
import { FaRegStar, FaStar } from "react-icons/fa"
import { User } from "lucide-react"

const UserFoodDescription = () => {
    const params = useParams()
    const { hotelId } = params
    const { isOpen, type, data, onClose, reloadCom } = useModal()
    const isModelOpen = isOpen && type === 'User-food-item'

    const [foodinfo, setFoodInfo] = useState('')
    const [userRating, setUserRating] = useState('')

    useEffect(() => {
        const initiatePage = async () => {
            try {
                const res = await axios.get(`${backend_url}/fooditem/getfooditem/table-user/${data.UserItemInfo}`, { withCredentials: true })
                console.log(res)
                if (res.data.success) {
                    setFoodInfo(res.data.fooditem)
                }
            } catch (error) {
                toast.error(error.response.data.message)
            }
        }
        if (data && data.UserItemInfo) {
            initiatePage()
        }
    }, [data, data.UserItemInto])

    useEffect(() => {
        const retrieveUserRating = async () => {
            try {
                const res = await axios.get(`${backend_url}/user/food-item/${foodinfo._id}/user-rating`, { withCredentials: true })
                if (res.data.success) {
                    setUserRating(res.data.review)
                }
            } catch (error) {
                toast.error(error.response.data.message)
            }
        }
        if (foodinfo && foodinfo._id) {
            retrieveUserRating()
        }
    }, [foodinfo])

    if (!isModelOpen) {
        return null
    }

    return (
        <div>
            {isModelOpen && (
                <div>
                    {foodinfo && (
                        <div className="p-4 flex">
                            <div className="my-auto">
                                <img src={`${img_url}/${foodinfo.imageUrl}`} className="w-[350px]" />
                            </div>
                            <div className="m-1.5"></div>
                            <div className="w-[450px]">
                                <div className="font-semibold text-color5 text-2xl">{foodinfo.name}</div>
                                <div className="font-semibold text-color5 text-md">{foodinfo.smallDescription}</div>
                                <div className="font-semibold text-color5">{foodinfo.description}</div>
                                {/* <div className="font-semibold text-color5 flex"><RatingShow ratingCount={3.3} maxRatingCount={5} size={18} /> <span className="my-auto ml-1">3/5</span></div> */}
                                <div className="flex mb-2 mt-1">
                                    <div className="w-[35%] flex flex-col items-center">
                                        <div className="flex flex-col gap-1">
                                            <div className="text-2xl text-color5 m-auto">
                                                {parseFloat(foodinfo.avgreview).toFixed(1)}
                                            </div>
                                            <RatingShow ratingCount={foodinfo.avgreview} maxRatingCount={5} size={17} />
                                            <div className="mt-1 flex"><span className="bg-color5 border-1 border-color5 p-1 px-3 rounded-full text-xs text-white mx-auto">{foodinfo.totalReview.toString().length < 4
                                                ? `${'0'.repeat(4 - foodinfo.totalReview.toString().length)}${foodinfo.totalReview}`
                                                : foodinfo.totalReview}</span></div>
                                        </div>
                                    </div>
                                    <div className=" w-[2px] bg-color4 flex flex-col">
                                    </div>
                                    <div className="w-[65%] pl-2 text-sm">
                                        <div className="flex text-color5">5<FaStar className="text-color5 my-auto ml-1 mr-4" /><div className="flex w-full flex-1 m-auto"><RatingBar height="10px" count={foodinfo.reviewCount["5"]} totalCount={foodinfo.totalReview} /></div></div>
                                        <div className="flex text-color5">4<FaStar className="text-color5 my-auto ml-1 mr-4" /><div className="flex w-full flex-1 m-auto"><RatingBar height="10px" count={foodinfo.reviewCount["4"]} totalCount={foodinfo.totalReview} /></div></div>
                                        <div className="flex text-color5">3<FaStar className="text-color5 my-auto ml-1 mr-4" /><div className="flex w-full flex-1 m-auto"><RatingBar height="10px" count={foodinfo.reviewCount["3"]} totalCount={foodinfo.totalReview} /></div></div>
                                        <div className="flex text-color5">2<FaStar className="text-color5 my-auto ml-1 mr-4" /><div className="flex w-full flex-1 m-auto"><RatingBar height="10px" count={foodinfo.reviewCount["2"]} totalCount={foodinfo.totalReview} /></div></div>
                                        <div className="flex text-color5">1<FaStar className="text-color5 my-auto ml-1 mr-4" /><div className="flex w-full flex-1 m-auto"><RatingBar height="10px" count={foodinfo.reviewCount["1"]} totalCount={foodinfo.totalReview} /></div></div>
                                    </div>
                                </div>
                                <div className="px-1">
                                    {userRating ? (
                                        <>
                                            <div className="text-color5 text-xl font-bold mx-2">Your Rating</div>
                                            <div className="flex mb-2 p-2">
                                                <div className="flex">
                                                    <div className="flex">
                                                        <div className="p-3">
                                                            {userRating.userId.avatar ? (
                                                                <>
                                                                    <img src={`${img_url}/${userRating.userId.avatar}`} className="w-[47px] h-[47px] rounded-full" />
                                                                </>
                                                            ) : (
                                                                <div className="border-2 border-color5 rounded-full p-1">
                                                                    <User size={35} className='text-color5' />
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div className="ml-3">
                                                            <div>
                                                                <div className="text-md text-color5 font-semibold">
                                                                    {userRating.userId.name}
                                                                </div>
                                                                <div className="flex">
                                                                    <span className="my-auto" >
                                                                        <RatingShow ratingCount={userRating.rating} maxRatingCount={5} size={15} />
                                                                    </span>
                                                                    <span className="text-color4 ml-2 text-sm my-auto">
                                                                        {new Date(`${userRating.createdAt}`).toLocaleDateString('en-GB').replace(/\//g, '/')}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                            <div className=" text-color4">
                                                                {userRating.description}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="border border-color3 p-4 py-2 rounded">
                                            <div className="text-color5 text-xl font-bold">Rate Food</div>
                                            <div>
                                                <RatingForm maxRatingCount={5} size={25} foodItemId={foodinfo._id} />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}

const RatingForm = ({ maxRatingCount = 5, size, foodItemId }) => {
    const [count, setCount] = useState(0)
    const [demon, setDemon] = useState(0)
    const [text, setText] = useState('')
    const submitReview = async () => {
        if (count <= 0 && count > 5) {
            return toast.error("please select star to rate")
        }
        if (!text) {
            return toast.error("please enter your review")
        }
        try {
            const res = await axios.post(`${backend_url}/user/food-item/${foodItemId}/submit-food-item-review`, {
                rating: count,
                comment: text
            }, { withCredentials: true })
            if (res.data.success) {
                console.log(res.data)
                toast.success("review submitted")
            }
        } catch (error) {
            toast.error(error)
        }
    }
    return (
        <>
            <div className="flex flex-col gap-1">
                <div className="flex relative m-auto">
                    {[...new Array(maxRatingCount)].map((_, i) => {
                        const index = i + 1;
                        var isFilled = false;
                        if (count) {
                            if (count >= index) {
                                isFilled = true;
                            }
                        } else {
                            if (demon) {
                                if (demon >= index) {
                                    isFilled = true;
                                }
                            }
                        }
                        // var isFilled = count >= index || (demon && demon >= index);
                        const StarComponent = isFilled ? FaStar : FaRegStar;

                        return (
                            <StarComponent
                                className="cursor-pointer text-color5"
                                size={size}
                                key={i}
                                onMouseEnter={() => setDemon(index)}
                                onMouseLeave={() => setDemon(0)}
                                onClick={() => setCount(index)}
                            />
                        );
                    })}
                </div>
                <div>
                    <textarea className="w-full h-[50px] border-2 border-color1 hover:border-color2 rounded p-1 placeholder:text-color2 outline-color5 text-color5 text-sm" placeholder="please share your experince with others" value={text} onChange={(e) => setText(e.target.value)} />
                </div>
                <div className="flex gap-2 text-sm">
                    <button className="w-[50%] p-1 bg-color4 text-white" onClick={() => submitReview()}>Submit review</button>
                    <button className="w-[50%] border-2 border-color4 text-color4">cancel</button>
                </div>
            </div>
        </>
    )
}

export default UserFoodDescription
