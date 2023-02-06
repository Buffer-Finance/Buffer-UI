import { Dialog } from "@mui/material";
import { ReactNode } from "react";

interface IComingSoonModal {
  className?: string;
  children?: ReactNode;
}

const ComingSoonModal: React.FC<IComingSoonModal> = ({
  className,
  children,
}) => {
  return (
    <Dialog open={true}>
      <div className="text-center bg-3 text-1 text-[22px] w-[450px] p-5 px-[25px]">
        {/* <img
          src="/lightning.png"
          alt="lightning"
          className="mr-3 h-[18px] inline"
        />{" "} */}
        Trading is halted for now! We will be back in the next 48hrs.
        <div className=" text-2 mt-3">Stay Tuned!</div>
      </div>
    </Dialog>
  );
};

export default ComingSoonModal;
