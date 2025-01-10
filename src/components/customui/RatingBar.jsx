/* eslint-disable react/prop-types */

const RatingBar = ({count,totalCount,height}) => {

    return (
                <div className="flex relative flex-1">
                    <div className="w-full h-[15px] border-2 rounded-full border-color0 bg-color0" style={{height: `${height}`}}></div>
                    <div className="absolute left-0 h-[15px] bg-color4 rounded-full" style={{width:`${(count/totalCount)*100}%`,height: `${height}`}}></div>
                </div>
    )
}

export default RatingBar
