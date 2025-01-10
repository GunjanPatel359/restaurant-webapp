"use client"
import { Button } from '@/components/ui/button';
import { toast } from 'react-toastify'
import { useParams } from 'next/navigation';
import { activateSeller } from '@/actions/seller';

const SellerActivationPage = () => {
    const params=useParams()
    const token=params.token
    console.log(token);
    const handleClick = async () => {
        try {
            const res=await activateSeller(token)
            console.log(res)
            if(res.success){
                return toast.success('User activated successfully');
            }
            return toast.error(res.message);
        } catch (err) {
            toast.error(err)
        }
    }

    return (
        <div className='flex flex-col text-center justify-center min-h-screen min-w-screen theme-blue'>
            <div>
                <Button onClick={handleClick} className='h-min'>Click here to active your account</Button>
            </div>
        </div>
    )
}

export default SellerActivationPage
