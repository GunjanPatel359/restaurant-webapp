/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { useModal } from "@/hooks/zusthook";
import QRCode from "react-qr-code";
import { useParams } from "next/navigation";
import { toast } from "react-toastify";
import { getMemberOfHotel } from "@/actions/member";
import { SERVER_URL } from "@/lib/server";
import { useTheme } from "@/hooks/use-theme";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";

const QrCodeModal = () => {
  const params = useParams();
  const hotelId = params.hotelId;
  const { theme } = useTheme();
  const [color4, setColor5] = useState("");
  const { isOpen, type, data, onClose } = useModal();
  const isModalOpen = isOpen && type === "table-qr-code";
  const [qrCodeString, setQrCodeString] = useState("");

  useEffect(() => {
    const findMember = async () => {
      try {
        const response = await getMemberOfHotel(hotelId);
        if (response.success) {
          initiatQr(response.data);
        }
      } catch (error) {
        toast.error(error.mesage);
      }
    };
    const initiatQr = async (memberId) => {
      setQrCodeString(
        `${SERVER_URL}/user/restaurant/${hotelId}/qrcode/${data.QrCodeSetUserTable._id}/${data.QrCodeSetUserTable.randomString}/${memberId}`
      );
    };
    if (data && data?.QrCodeSetUserTable) {
      findMember();
    }
  }, [data, hotelId]);

  // useEffect(() => {
  //   const color5 = window.getComputedStyle(document.documentElement).getPropertyValue('--color-5');
  //   setColor5(color5);
  // }, [theme])

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent
        className={`w-[400px] overflow-y-scroll theme-${theme} border border-color5`}
      >
        <DialogHeader>
          <DialogTitle>
            <div className="text-color5 font-semibold text-2xl mb-2">
              Scan Qr Code
            </div>
            <div className="w-full h-[2px] bg-color5"></div>
          </DialogTitle>
        </DialogHeader>
        {data?.QrCodeSetUserTable && (
          <div className="text-color4 text-lg">
            <span className="text-color5 font-semibold text-xl">
              Table Number :
            </span>{" "}
            {data?.QrCodeSetUserTable?.tableNumber}
          </div>
        )}
        <div className="mt-2 flex justify-center h-[300px] text-center m-auto align-middle">
          <QRCode
            value={qrCodeString}
            size={200}
            // fgColor={`${color4}`}
            className="my-auto"
          />
        </div>
        {qrCodeString}
      </DialogContent>
    </Dialog>
  );
};

export default QrCodeModal;
