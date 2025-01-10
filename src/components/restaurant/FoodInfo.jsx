/* eslint-disable react/prop-types */

import { useEffect, useState } from "react"
import RatingShow from "../customui/RatingShow"
import { User } from "lucide-react"
import { FaRegStar, FaStar } from "react-icons/fa"
import RatingBar from "../customui/RatingBar"
import { toast } from "react-toastify"
import { foodPublicReview } from "@/actions/review"
import { SERVER_URL } from "@/lib/server"
import { getFoodItemUserRating, submitFoodItemReview } from "@/actions/user"
import { useRouter } from "next/navigation"

const FoodInfo = ({ fooditem }) => {
    const router=useRouter()
    const [userRating, setUserRating] = useState('')
    const [publicRating, setPublicRating] = useState([])

    useEffect(() => {
        const retrieveUserRating = async () => {
            try {
                const res = await getFoodItemUserRating(fooditem._id)
                if (res.success) {
                    console.log(res.review)
                    setUserRating(res.review)
                }
            } catch (error) {
                console.log(error)
            }
        }
        if (fooditem && fooditem._id) {
            retrieveUserRating()
        }
    }, [fooditem])

    useEffect(() => {
        const retrievePublicRating = async () => {
            try {
                const res = await foodPublicReview(fooditem._id)
                if (res.success) {
                    setPublicRating(res.reviews)
                }
            } catch (error) {
                console.log(error)
            }
        }
        if (fooditem && fooditem._id) {
            retrievePublicRating()
        }
    }, [fooditem])
    return (
        <>
            <div className="sm:flex m-2 border border-color5 rounded lg:w-[70%] mx-auto">
                <div className="sm:w-[40%] w-[100%] p-2">
                    <img src={`${SERVER_URL}/uploads/${fooditem.imageUrl}`} className="rounded shadow shadow-color4 w-full my-auto" />
                </div>
                <div className="sm:w-[60%] p-2 pt-0 sm:pt-2 flex flex-col gap-1">
                    <div className="text-2xl font-bold text-color5">{fooditem.name}</div>
                    <div className="text-lg text-color4">{fooditem.smallDescription}</div>
                    <div className="flex">
                        <span className="text-color5 font-semibold text-md mr-1">Ratings:</span>
                        <span className="p-[1px]"><RatingShow ratingCount={parseFloat(fooditem.avgreview).toFixed(1)} maxRatingCount={5} size={20} /></span>
                        <span className="text-color4 text-sm ml-1 my-auto">{parseFloat(fooditem.avgreview).toFixed(1)}/5</span>
                        <span className="text-sm my-auto text-color4 ml-1 border border-color4 rounded-full px-3 bg-color0">Total ratings: {fooditem.totalReview}</span>
                    </div>
                    <div className="my-2">{fooditem.foodTypes.length > 0 && fooditem.foodTypes.map((item, i) => {
                        return (
                            <div key={i} className="inline border border-color5 p-1 rounded-xl mr-1 text-color5 bg-color0 px-2 text-center shadow shadow-color2">
                                <div className="inline text-center relative -top-[1px] -left-[1px]">{item}</div>
                            </div>)
                    })}</div>
                    <div>
                        <div className="text-color4"><span className="font-semibold text-color5">description:</span> {fooditem.description}</div>
                    </div>
                </div>
            </div>
            <div className="lg:w-[70%] m-auto">
                <div className="text-color5 text-2xl font-bold my-4 mx-2">Reviews and Ratings</div>
                <div className="flex m-4 mb-8">
                    <div className="w-[35%] flex flex-col items-center">
                        <div className="flex flex-col gap-1">
                            <div className="text-7xl text-color5">
                                {parseFloat(fooditem.avgreview).toFixed(1)}
                            </div>
                            <RatingShow ratingCount={fooditem.avgreview} maxRatingCount={5} size={20} />
                            <div className="mt-1 flex"><span className="bg-color5 border-1 border-color4 p-1 px-3 rounded-full text-sm text-white mx-auto min-w-10 text-end">{fooditem.totalReview.toString().length < 4
                                ? `${'0'.repeat(4 - fooditem.totalReview.toString().length)}${fooditem.totalReview}`
                                : fooditem.totalReview}</span></div>
                        </div>
                    </div>
                    <div className=" w-[2px] bg-color4 flex flex-col">
                    </div>
                    <div className="w-[65%] pl-10">
                        <div className="flex text-color5">5<FaStar className="text-color5 my-auto ml-1 mr-4" /><div className="flex w-full flex-1 m-auto"><RatingBar count={fooditem.reviewCount["5"]} totalCount={fooditem.totalReview} /></div></div>
                        <div className="flex text-color5">4<FaStar className="text-color5 my-auto ml-1 mr-4" /><div className="flex w-full flex-1 m-auto"><RatingBar count={fooditem.reviewCount["4"]} totalCount={fooditem.totalReview} /></div></div>
                        <div className="flex text-color5">3<FaStar className="text-color5 my-auto ml-1 mr-4" /><div className="flex w-full flex-1 m-auto"><RatingBar count={fooditem.reviewCount["3"]} totalCount={fooditem.totalReview} /></div></div>
                        <div className="flex text-color5">2<FaStar className="text-color5 my-auto ml-1 mr-4" /><div className="flex w-full flex-1 m-auto"><RatingBar count={fooditem.reviewCount["2"]} totalCount={fooditem.totalReview} /></div></div>
                        <div className="flex text-color5">1<FaStar className="text-color5 my-auto ml-1 mr-4" /><div className="flex w-full flex-1 m-auto"><RatingBar count={fooditem.reviewCount["1"]} totalCount={fooditem.totalReview} /></div></div>
                    </div>
                </div>

                {publicRating.length > 0 ? (
                    <div>
                    {publicRating.map((item,i)=>{
                        return (
                            <div key={i}>
                        <div className="text-color5 text-xl font-bold mx-2">Rating</div>
                        <div className="flex mb-2 p-2">
                            <div className="flex">
                                <div className="flex">
                                    <div className="p-3">
                                        {item.userId.avatar? (
                                            <div>
                                        <img src={`${SERVER_URL}/uploads/${item.userId.avatar}`} className="w-[55px] h-[55px] rounded-full" />
                                            </div>
                                        ):(
                                            <div className="border-2 border-color5 rounded-full p-1">
                                            <User size={40} className='text-color5' />
                                            </div>
                                        )}
                                    </div>
                                    <div className="ml-3">
                                        <div>
                                            <div className="text-lg text-color5 font-semibold">
                                                {item.userId.name}
                                            </div>
                                            <div className="flex">
                                                <RatingShow ratingCount={item.rating} maxRatingCount={5} size={20} />
                                                <span className="text-color4 ml-2 text-sm mt-1">
                                                    {new Date(`${item.createdAt}`).toLocaleDateString('en-GB').replace(/\//g, '/')}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="mt-1 text-color4">
                                            {item.description}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        </div>
                    )
                    })}
                    </div>
                ) : (
                    <div>
                    </div>
                )
                }

                {userRating ? (
                    <div>
                        <div className="text-color5 text-xl font-bold mx-2">Your Rating</div>
                        <div className="flex mb-2 p-2">
                            <div className="flex">
                                <div className="flex">
                                    <div className="p-3">
                                    {userRating.userId.avatar? (
                                            <div>
                                        <img src={`${SERVER_URL}/uploads/${userRating.userId.avatar}`} className="w-[55px] h-[55px] rounded-full" />
                                            </div>
                                        ):(
                                            <div className="border-2 border-color5 rounded-full p-1">
                                            <User size={40} className='text-color5' />
                                            </div>
                                        )}
                                    </div>
                                    <div className="ml-3">
                                        <div>
                                            <div className="text-lg text-color5 font-semibold">
                                                {userRating.userId.name}
                                            </div>
                                            <div className="flex">
                                                <RatingShow ratingCount={userRating.rating} maxRatingCount={5} size={20} />
                                                <span className="text-color4 ml-2 text-sm mt-1">
                                                    {new Date(`${userRating.createdAt}`).toLocaleDateString('en-GB').replace(/\//g, '/')}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="mt-1 text-color4">
                                            {userRating.description}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="border border-color3 p-4 rounded">
                        <div className="text-color5 text-2xl font-bold my-2">Rate Us</div>
                        <div>
                            <RatingForm maxRatingCount={5} size={50} foodItemId={fooditem._id} />
                        </div>
                    </div>
                )}

            </div>
        </>
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
            const res = await submitFoodItemReview(foodItemId,count,text)
            if (res.success) {
                router.refresh()
                toast.success("review submitted")
            }
        } catch (error) {
            toast.error(error)
        }
    }
    return (
        <>
            <div className="flex flex-col gap-2">
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
                    <textarea className="w-full h-[100px] border-2 border-color1 hover:border-color2 rounded p-2 placeholder:text-color2 outline-color5 text-color5" placeholder="please share your experince with others" value={text} onChange={(e) => setText(e.target.value)} />
                </div>
                <div className="flex gap-2">
                    <button className="w-[50%] p-2 bg-color4 text-white" onClick={() => submitReview()}>Submit review</button>
                    <button className="w-[50%] border-2 border-color4 text-color4">cancel</button>
                </div>
            </div>
        </>
    )
}

export default FoodInfo
