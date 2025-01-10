import { useModal } from "@/hooks/zusthook"
import { Check } from "lucide-react"
import SellerPayPalPayment from "@/provider/SellerPayPalPayment"
import { Dialog } from "@radix-ui/react-dialog"
import { DialogContent, DialogHeader, DialogTitle } from "../ui/dialog"
import { useTheme } from "@/hooks/use-theme"

const SellerBuyingSubscriptionModal = () => {
  const { theme } = useTheme()
  const { data, isOpen, type, onClose } = useModal()
  const isModelOpen = isOpen && type === 'purchase-subscription'
  return (
    <Dialog open={isModelOpen} onOpenChange={onClose}>
      <DialogContent className={`h-auto w-[360px] theme-${theme} border border-color5`} aria-describedby="seller-buying-subscription">
        <DialogHeader>
          <DialogTitle className='w-full font-bold text-2xl pl-2 py-1 text-color5'>
            Purchasing subscription
          </DialogTitle>
        </DialogHeader>
        <div className='w-full  pt-0 pb-0'>
          <div className='flex flex-col justify-center'>
            <div  className="pl-3">
              <div>
                <div className="text-color5">
                  Purchasing {data?.title} Package
                </div>
                {/* <div>{data.description}</div> */}
              </div>
              <div>
                <span className="text-4xl font-bold text-color5">{data?.price}</span>
                <span className="text-muted-foreground text-color5">/m</span>
              </div>
              <div className="flex flex-col items-start gap-4 text-color5">
                <div>{data?.features?.map((feature) =>
                  <div key={feature} className="flex gap-2 items-center">
                    <Check className="text-muted-foreground" />
                    <p>{feature}</p>
                  </div>
                )}</div>
              </div>
            </div>
            <div className=" mt-3">
              <SellerPayPalPayment item={data} />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default SellerBuyingSubscriptionModal
