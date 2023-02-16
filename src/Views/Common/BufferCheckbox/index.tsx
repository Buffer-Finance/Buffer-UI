import { Tooltip } from '@mui/material';
import React from 'react';
import Background from './style';

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
    <Background onClick={onCheckChange} className={className + ' !bg-2'}>
      {/* <Tooltip title={validation} id="tooltip" placement="top" arrow classes={tooltipStyles} open={Open}> */}
      <div
        className={`checkboxborder ${checked && 'active__background'} ${
          isDisabled ? 'disabled' : ''
        }`}
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
       
          <path
            d="M3.93555 11.5748L7.69501 13.7231L15.2139 6.74121"
            stroke="white"
            stroke-width="2"
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
