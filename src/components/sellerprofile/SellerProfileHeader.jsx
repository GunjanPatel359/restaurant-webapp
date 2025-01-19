import { User } from "lucide-react";
import { IoFastFoodOutline } from "react-icons/io5";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { SERVER_URL } from "@/lib/server";
import { sellerLogout } from "../../lib/authMiddleware";
import { toast } from "react-toastify";
import { IoMdExit } from "react-icons/io";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

const SellerProfileHeader = ({ seller }) => {
  const router = useRouter();
  const handleSellerLogout = async () => {
    try {
      const res = await sellerLogout()
      if (res.success) {
        toast.success("successfully logged out")
        router.push("/seller/login")
      }
    } catch (error) {
      console.error(error);
    }
  }
  return (
    <div>
      <div className="w-full shadow-md border-b border-color0">
        <div className="w-full bg-white">
          <div className="w-[80%] m-auto flex  text-color5 h-[80px] justify-between">
            <span
              className="flex text-4xl gap-x-4 cursor-pointer m-4"
              onClick={() => router.push("/seller/profile")}
            >
              <IoFastFoodOutline size={40} className="text-color5" />
              <span>Taste</span>
            </span>
            <span className="text-center items-center flex ">
              <Link href="/seller/profile">
                <div className="border-2 border-color5 hover:bg-color0 rounded-full">
                  {seller?.avatar ? (
                    <>
                      <img
                        src={`${SERVER_URL}/uploads/${seller.avatar}`}
                        className="md:w-[45px] w-[45px] rounded-full border border-white shadow-lg"
                      />
                    </>
                  ) : (
                    <>
                      <User size={30} className="text-color5 m-1" />
                    </>
                  )}
                </div>
              </Link>
              <>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="ml-2 rounded-full p-1 text-red-500 border border-red-500 bg-white cursor-pointer hover:text-red-400 hover:border-red-400 hover:shadow-md shadow transition-all" onClick={handleSellerLogout}>
                        <IoMdExit size={28} />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-red-500">Logout</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerProfileHeader;
