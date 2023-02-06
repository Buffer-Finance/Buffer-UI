import Button from "@mui/material/Button";
import StyledButton from "./style";
import { StylesProvider } from "@mui/styles";
import EnterIcon from "src/SVG/buttons/enter";
import EnterDisabledIcon from "src/SVG/buttons/enterDisabled";
import InIcon from "src/SVG/buttons/exit";
interface IBufferButton {
  children: any;
  className?: string;
  disabled?: boolean;
  onClick?: (a: any) => void;
  style?: any;
  isDisabled?: boolean;
  hideIcon?: boolean;
  icon?: JSX.Element;
  title?: string;
}

const Gradientbtn: React.FC<IBufferButton> = (props) => {
  return (
    <StylesProvider injectFirst>
      <StyledButton
        {...props}
        className={`${props.className ? props.className : ""} `}
        disabled={props.disabled}
        onClick={props.onClick}
        style={props.style}
        isDisabled={props.isDisabled}
        hideIcon={props.hideIcon}
      >
        {props.children}
      </StyledButton>
    </StylesProvider>
  );
};

export default Gradientbtn;

const PrimaryBtn: React.FC<IBufferButton> = ({
  className,
  isDisabled,
  hideIcon = false,
  ...props
}) => {
  return (
    <Gradientbtn className={`primary-btn ${className}`} {...props}>
      <div className="flex flex-center">
        {/* {!hideIcon ? (
          !isDisabled ? (
            <EnterIcon className="smr" />
          ) : (
            <EnterDisabledIcon className="smr" />
          )
        ) : (
          <></>
        )} */}
      </div>
      {props.children}
    </Gradientbtn>
  );
};

const PrimaryActionBtn: React.FC<IBufferButton> = ({ className, ...props }) => {
  return (
    <Gradientbtn className={`primary-action-btn ${className}`} {...props}>
      {props.children}
    </Gradientbtn>
  );
};
const SecondaryActionBtn: React.FC<IBufferButton> = ({
  className,
  ...props
}) => {
  return (
    <Gradientbtn className={`secondary-action-btn ${className}`} {...props}>
      {props.children}
    </Gradientbtn>
  );
};

const SecondaryBtn: React.FC<IBufferButton> = ({
  className,
  hideIcon,
  icon,
  ...props
}) => {
  return (
    <Gradientbtn className={`secondary-btn ${className}`} {...props}>
      {/* {icon && icon}
      {!icon && !hideIcon && <InIcon className="smr"></InIcon>} */}
      {props.children}
    </Gradientbtn>
  );
};

interface IBufferButton {
  children: any;
  class?: string;
  disabled?: boolean;
  onClick?: (a: any) => void;
  hideIcon?: boolean;
}

export {
  PrimaryBtn,
  SecondaryBtn,
  PrimaryActionBtn,
  SecondaryActionBtn,
  Gradientbtn,
};
