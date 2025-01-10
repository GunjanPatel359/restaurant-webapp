
import clsx from "clsx"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card.jsx"
import { Check } from "lucide-react"
import { Button } from "../ui/button.jsx"
import { useModal } from "@/hooks/zusthook.js"
import { useEffect, useState } from "react"
import { getAllSubscriptionPlans } from "@/actions/subscription.js"
import { toast } from "react-toastify"

const SellerSubscription = () => {
  const {onOpen}=useModal()
  const [sellerPlans,setSellerPlans]=useState([])
  useEffect(()=>{
    const fetchpurchse=async()=>{
      try {
        const res=await getAllSubscriptionPlans()
        setSellerPlans(res.data)
      } catch (error) {
        toast.error(error)
      }
    }
      fetchpurchse()
  },[])
  return (
    <div className="m-10">
    <div className="flex justify-evenly flex-wrap">
      {sellerPlans.map((card)=>
            <Card key={card.title} className={clsx('w-[300px] flex flex-col justify-between m-2 text-color5 rounded-xl shadow-md border-color4 shadow-color1',{"border-2 border-color3 text-white bg-color5":card.title==="Premium"})}>
              <CardHeader>
                <CardTitle className={clsx('',{'text-muted-foreground':card.title!=='Premium'})}>
                  {card.title}
                </CardTitle>
                <CardDescription>{card.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <span className="text-4xl font-bold">{card.price}</span>
                <span className="text-muted-foreground">/m</span>
              </CardContent>
              <CardFooter className="flex flex-col items-start gap-4">
                <div>{card.features.map((feature)=>
                  <div key={feature} className="flex gap-2 items-center">
                    <Check  className="text-muted-foreground"/>
                    <p>{feature}</p>
                  </div>
                )}</div>
                <Button className={clsx('w-full text-center bg-primary p-2 text-color5 bg-white shadow-md hover:text-color5 hover:bg-white hover:border-color4 hover:border transition-all rounded-2xl text-md',{
                    '!bg-muted-foreground border border-color5 hover:border-color5 shadow-color1 ':card.title !== 'Premium'
                })}
                onClick={()=>onOpen('purchase-subscription',card)}
                >
                  Get Started
                </Button>
              </CardFooter>
            </Card>
          )}
    </div>
    </div>
  )
}

export default SellerSubscription
