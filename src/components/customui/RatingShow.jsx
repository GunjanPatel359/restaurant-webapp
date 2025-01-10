/* eslint-disable react/prop-types */
import { FaRegStar } from "react-icons/fa";
import { FaStar } from "react-icons/fa";

const RatingShow = ({ ratingCount, maxRatingCount, fillColor, size, emptyColor }) => {
    return (
            <div className="flex">
                <div className="flex relative my-auto">
                    {[...new Array(maxRatingCount)].map((_,i)=>{
                        return (
                            <FaStar className="text-color5" size={size} color={fillColor} key={i} />
                        )
                    })}
                    <div className={`h-full absolute right-0 bg-white`} style={{ width: `${((maxRatingCount - ratingCount) / maxRatingCount) * 100}%` }}></div>
                    <div className="flex absolute">
                    {[...new Array(maxRatingCount)].map((_,i)=>{
                        return (
                            <FaRegStar className="text-color5" size={size} color={emptyColor} key={i} />
                        )
                    })}
                    </div>
                </div>
                {/* <div className="flex flex-1 justify-end absolute z-0 w-max">
            <div className="w-[5px] h-[3px]">
            </div>
        </div> */}
            </div>
    )
}

export default RatingShow
