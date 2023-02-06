import { styled } from "@mui/system";

import SwitchUnstyled, {
  switchUnstyledClasses,
} from "@mui/base/SwitchUnstyled";

const blue = {
  500: "#007FFF",
};

const grey = {
  400: "#BFC7CF",
  500: "#AAB4BE",
  600: "#6F7E8C",
};

const BufferStyles = styled("span")(
  ({ theme }) => `
    font-size: 0;
    position: relative;
    display: inline-block;
    width: 40px;
    height: 20px;
    margin: 10px;
    cursor: pointer;
  
    &.${switchUnstyledClasses.disabled} {
      opacity: 0.4;
      cursor: not-allowed;
    }
  
    & .${switchUnstyledClasses.track} {
      background: var(--bg-14);
      border-radius: 10px;
      display: block;
      height: 100%;
      width: 100%;
      position: absolute;
    }
  
    & .${switchUnstyledClasses.thumb} {
      display: block;
      width: 14px;
      height: 14px;
      top: 3px;
      left: 3px;
      border-radius: 16px;
      background-color: #fff;
      position: relative;
      transition: all 200ms ease;
    }
  
    &.${switchUnstyledClasses.focusVisible} .${switchUnstyledClasses.thumb} {
      background-color:var(--bg-14);
      box-shadow: 0 0 1px 8px rgba(0, 0, 0, 0.25);
    }
  
    &.${switchUnstyledClasses.checked} {
      .${switchUnstyledClasses.thumb} {
        left: 22px;
        top: 3px;
        opacity:1;
        background-color: var(--primary);
      }
  
      .${switchUnstyledClasses.track} {
        background: var(--bg-14);
      }
    }
  
    & .${switchUnstyledClasses.input} {
      cursor: inherit;
      position: absolute;
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
      opacity: 0;
      z-index: 1;
      margin: 0;
    }
    `
);
export default BufferStyles;
