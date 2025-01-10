import { useEffect, useState } from 'react';
import { useModal } from '@/hooks/zusthook';
import { Country, State, City } from 'country-state-city';
import { MdCancel } from 'react-icons/md';
import { Select, SelectItem, SelectLabel, SelectContent, SelectValue, SelectTrigger, SelectGroup } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'react-toastify';
import { Button } from '@/components/ui/button';
import { Dialog, DialogTitle, DialogTrigger, DialogContent, DialogClose, DialogHeader, DialogDescription } from '@/components/ui/dialog';
import { IoWarning } from 'react-icons/io5';

const AddAddressModal = () => {
  const { isOpen, type, onClose } = useModal();
  const isModalOpen = isOpen && type === 'add-address';

  const [mcountry, setCountry] = useState('');
  const [mstate, setState] = useState('');
  const [city, setCity] = useState('');
  const [address, setAddress] = useState('');
  const [zipCode, setZipCode] = useState('');

  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isModalOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!mcountry || !mstate || !city || !address || !zipCode) {
      return toast.error('Please fill all the required fields');
    }

    const country = Country.getCountryByCode(mcountry)?.name;
    const state = State.getStateByCodeAndCountry(mstate, mcountry)?.name;

    if (zipCode.length !== 6) {
      return toast.error('Invalid zipcode');
    }

    try {
      const res = await axios.patch(
        `${backend_url}/user/add-address`,
        {
          country,
          state,
          city,
          address,
          zipCode,
        },
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true,
        }
      );

      if (res.status === 200 || res.status === 201) {
        dispatch(addUser(res.data.user));
        toast.success('Address added successfully');
        onClose();
      } else {
        return toast.error(res.data.message);
      }
    } catch (err) {
      return toast.error(err.response.data.message || 'Error adding address');
    }
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg p-6 bg-gradient-to-tr from-color5 to-color4 shadow-2xl rounded-xl border border-color5">
      <DialogHeader>
          <DialogTitle><div className="text-center text-xl mb-3">Add Address</div></DialogTitle>
          <DialogDescription>
            <div className='text-red-500 font-semibold text-justify text-lg p-2 border border-red-500 border-dashed rounded'>
            <IoWarning size={20} className='inline text-red-500' /> this modal is under development see /seller/profile portion for better understand
            </div>
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-end">
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-y-4">
          <Select onValueChange={setCountry} required>
            <SelectTrigger className="w-full rounded-3xl shadow-lg">
              <SelectValue placeholder="* Select Your Country" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Country</SelectLabel>
                {Country.getAllCountries().map((item) => (
                  <SelectItem key={item.isoCode} value={item.isoCode}>
                    {item.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>

          <Select onValueChange={setState} required>
            <SelectTrigger className="w-full rounded-3xl shadow-lg">
              <SelectValue placeholder="* Select a State" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>State</SelectLabel>
                {mcountry &&
                  State.getStatesOfCountry(mcountry).map((item) => (
                    <SelectItem key={item.isoCode} value={item.isoCode}>
                      {item.name}
                    </SelectItem>
                  ))}
              </SelectGroup>
            </SelectContent>
          </Select>

          <Select onValueChange={setCity} required>
            <SelectTrigger className="w-full rounded-3xl shadow-lg">
              <SelectValue placeholder="* Select a City" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>City</SelectLabel>
                {mcountry &&
                  mstate &&
                  City.getCitiesOfState(mcountry, mstate).map((item) => (
                    <SelectItem key={item.name} value={item.name}>
                      {item.name}
                    </SelectItem>
                  ))}
              </SelectGroup>
            </SelectContent>
          </Select>

          <Textarea
            placeholder="* Enter your address"
            onChange={(e) => setAddress(e.target.value)}
            required
          />
          <Input
            type="number"
            placeholder="* Enter your zipcode"
            onChange={(e) => setZipCode(e.target.value)}
            required
          />

          <Button type="submit" className="w-full rounded-3xl py-2">
            Submit
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddAddressModal;
