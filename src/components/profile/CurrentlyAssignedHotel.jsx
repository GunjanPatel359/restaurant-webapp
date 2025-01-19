import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { LuTriangleAlert } from "react-icons/lu";
import RatingShow from "../customui/RatingShow";
import { useRouter } from "next/navigation";
import { findAssignedHotels } from "@/actions/user";
import { SERVER_URL } from "@/lib/server";

const CurrentlyAssignedHotel = () => {
  const router = useRouter();
  const [hotels, setHotels] = useState([]);
  useEffect(() => {
    const fetchInitiatePage = async () => {
      try {
        const res = await findAssignedHotels();
        console.log(res);
        if (res.success) {
          setHotels(res.hotels);
        }
      } catch (error) {
        console.error(error);
        toast.error(error.message);
      }
    };
    fetchInitiatePage();
  }, []);
  return (
    <div className="m-5">
      <div className="m-5 mt-8">
        <div className="font-semibold text-2xl mb-4 text-color5">
          Occupied Tables
        </div>
        <div className="border mb-5 border-color3"></div>
        <div className="border p-5 shadow shadow-color4">
          {hotels?.length > 0 ? (
            <>
              <div className="flex gap-3 flex-wrap">
                {hotels.map((item, i) => {
                  return (
                    <div key={i}>
                      <div className="bg-white min-w-[300px] w-[250px] border border-color1 rounded shadow-color0 overflow-hidden shadow-lg">
                        <div className="relative w-full h-44 overflow-hidden shadow-md shadow-color0">
                          <img
                            className="w-full h-full object-cover transition-transform duration-500 ease-in-out transform hover:scale-110 rounded-ss rounded-se cursor-pointer"
                            src={`${SERVER_URL}/uploads/${item.restaurantId.imgUrl}`}
                          />
                        </div>
                        <div className="p-2 flex flex-col gap-1">
                          <div className="text-color5 font-semibold text-xl">
                            {item.restaurantId.name}
                          </div>
                          <div className="flex mb-2">
                            <RatingShow
                              ratingCount={item.restaurantId.avgreview}
                              maxRatingCount={5}
                              size={20}
                            />
                            <span className="bg-color5 border-1 border-color4 px-2 py-[1px] rounded-full text-sm text-white ml-1">
                              {item.restaurantId.totalReview.toString().length <
                              4
                                ? `${"0".repeat(
                                    4 -
                                      item.restaurantId.totalReview.toString()
                                        .length
                                  )}${item.restaurantId.totalReview}`
                                : item.restaurantId.totalReview}
                            </span>
                          </div>
                          <div className="text-color5">
                            <span className="mr-2 font-semibold text-color5">
                              Table Number:
                            </span>
                            {item.tableNumber}
                          </div>
                          <div className="text-right mt-2 mb-2 mr-2">
                            <span
                              className="text-white bg-color5 font-semibold p-4 py-2 rounded shadow shadow-color1 cursor-pointer hover:shadow-md hover:shadow-color1 transition-all"
                              onClick={() =>
                                router.push(
                                  `/user/${item.restaurantId._id}/${item._id}/user-table`
                                )
                              }
                            >
                              Visit
                            </span>
                          </div>
                          {/* <div className="text-color5 w-full text-justify"><span className="text-color5 font-semibold">location:</span> {`${item.addresses.address}, ${item.addresses.city}, ${item.addresses.state}, ${item.addresses.country}`
                                                    .length > 35
                                                    ? `${item.addresses.address}, ${item.addresses.city}, ${item.addresses.state}, ${item.addresses.country}`.substring(0, 35) + "..."
                                                    : `${item.addresses.address}, ${item.addresses.city}, ${item.addresses.state}, ${item.addresses.country}`}
                                                </div> */}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center bg-red-50 border border-red-300 rounded-lg p-3 text-sm text-red-500">
                <LuTriangleAlert size={20} className="mr-2 text-red-500" />
                <span>
                  <span className="text-color5 text-red-500">404:</span>{" "}
                  Currently not assigned to any tables.
                </span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CurrentlyAssignedHotel;
