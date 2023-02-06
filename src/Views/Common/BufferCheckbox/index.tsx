import { Tooltip } from "@mui/material";
import React from "react";
import Background from "./style";

interface IBufferCheckbox {
  checked: boolean;
  onCheckChange: () => void;
  children?: React.ReactChild;
  className?: string;
  isDisabled?: boolean;
}

const BufferCheckbox: React.FC<IBufferCheckbox> = ({
  checked,
  onCheckChange,
  children,
  className,
  isDisabled = false,
}) => {
  //   const tooltipStyles = {
  //     tooltip: styles.tooltip__modal,
  //     arrow: styles.arrow__modal,
  //   }
  //   let Open = validation !== ''
  //   if (checked) {
  //     Open = false
  //   }
  return (
    <Background onClick={onCheckChange} className={className + " !bg-2"}>
      {/* <Tooltip title={validation} id="tooltip" placement="top" arrow classes={tooltipStyles} open={Open}> */}
      <div
        className={`checkboxborder ${checked && "active__background"} ${
          isDisabled ? "disabled" : ""
        }`}
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 27 27"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="mt-[1px] ml-[1px]"
        >
          <line
            y1="-1.5"
            x2="15.4341"
            y2="-1.5"
            transform="matrix(0.549897 -0.835232 0.147219 0.989104 7.41302 17.5615)"
            strokeWidth="4"
            className={`checkbox__filled ${checked && "active"} ${
              isDisabled && "disabled"
            }`}
          />
          <line
            y1="-1.5"
            x2="10.5069"
            y2="-1.5"
            transform="matrix(0.678411 0.734682 -0.487676 0.873025 0 10.2808)"
            strokeWidth="3"
            className={`checkbox__filled ${checked && "active"} ${
              isDisabled && "disabled"
            }`}
          />
        </svg>
      </div>
      {/* </Tooltip> */}
      {children}
    </Background>
  );
};

export default BufferCheckbox;
