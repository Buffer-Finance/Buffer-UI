import { ReactNode, useEffect, useState } from "react";
import Background from "./style";
import Fade from "react-reveal/Fade";
import ErrorIcon from "src/SVG/Elements/ErrorIcon";
import { twMerge } from "tailwind-merge";
export interface IBufferInputBase {
  placeholder?: string;
  unit?: React.ReactChild;
  header?: React.ReactChild;
  value: string;
  onChange: (val: string) => void;
  className?: string;
  ipClass?: string;
  inputType?: "number" | "datetime-local" | "text";
  onError?: ([]) => void;
  title?: string;
  bgClass?: string;
}

interface IBufferTextInputRoot extends IBufferInputBase {
  validations: ((val: string) => (ReactNode | boolean)[])[];
  numeric: boolean;
  isGrey?: boolean;
  id?:string;
  label?:ReactNode;
  type?: boolean;
  isDisabled?: boolean;
}
const BufferTextInputRoot: React.FC<IBufferTextInputRoot> = ({
  placeholder,
  unit,
  header,
  value,
  onChange,
  onError,
  className,
  inputType,
  ipClass,
  bgClass,
  validations,
  id,
  label,
  numeric,
  isGrey,
  type,
  title,
  isDisabled = false,
}) => {
  const [errs, setErrs] = useState<ReactNode[]>([]);
  const validate = (value: string) => {

    let currentErrors: string[] = [];
    let goAhead = true;
    validations.map((singleValidation, idx) => {
      // set the errors if any
      const [val, err, donGoAhead] = singleValidation(value);
      if (err) {
        currentErrors.push(err as string);
      }
      if (donGoAhead) {
        goAhead = false;
      }
    });
    setErrs([...currentErrors]);

    return goAhead;
  };
  const textChangeHandler = (e: any) => {
    let currValue = e.target.value;
    if (currValue === "") {
      setErrs([]);
      return onChange("");
    }
    validate(currValue) && onChange(currValue);
  };
  useEffect(() => {
    if (value === "") return setErrs([]);
    validate(value);
  }, [validations]);
  const err = errs.length && errs[0];
  // useEffect(() => {
  //   onError(errs);
  // }, [errs]);
  return (
    <Background className={className}>
      <div
        className={` background h-full ${err && "error-boundary"} ${
          isGrey && "bg"
        } ${bgClass}`}
      >
        <div className="upper-part ">{header}</div>
        <div className="lower-part h-full">
          {label ?label:null }
          <input
          
            className={`${ipClass} inputStyle font3 weight-400`}
            placeholder={placeholder}
            type={
              inputType || numeric ? "number" : type ? "datetime-local" : "text"
            }
            onChange={textChangeHandler}
            value={value}
            step="1"
            id={id}
            pattern="^\d*(\.\d{0,2})?$"
            disabled={isDisabled}
            title={title}
          />
          {unit ? unit:null}
        </div>
      </div>
        <Fade center when={err} collapse duration={500}>
           <div className="error-message ">
            <ErrorIcon className="error-icon" />
            <span className="text-6">{err}</span>
          </div>
        </Fade>
    </Background>
  );
};

export default BufferTextInputRoot;

interface IComponent {
  className?:string;
  children?:React.ReactChild
}
export const BufferInputUnit = ({className,children}:IComponent)=>{
  return <div className={className}>{children}</div>
}