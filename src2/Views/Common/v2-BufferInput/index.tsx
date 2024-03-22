import React, { useEffect, useState } from "react";
import ErrorIcon from "src/SVG/Elements/ErrorIcon";
import BufferInput, { IBufferInput } from "../BufferInput";
import Background from "./style";

export const getAddsValidation = (value) => {
  if (value && value.length) {
    if (value[0] == "0") {
      if (value.length > 1) {
        if (value[1] == "x") {
          return false;
        } else {
          // if second char is not x
          return true;
        }
      } else {
        // if search text is of 1 length
        return false;
      }
    } else {
      // if first char is not zero
      return true;
    }
  } else {
    // if no text is entered
    return false;
  }
};
export default function V2BufferInput({
  placeholder,
  header,
  numericValidations,
  value,
  onChange,
  isGrey,
  type,
  remark,
  className,
  hideSearchBar = false,
  bgClass,
  addsValidations,
  ipClass,
  unit,
}: IBufferInput) {
  const [contractAddsValidation, setContractAddsValidation] = useState(false);
  useEffect(() => {
    // if (!value) return;
    const validation = getAddsValidation(value);
    setContractAddsValidation(validation);
  }, [value]);

  return (
    <Background className={className}>
      <BufferInput
        className={`temp ${className || ""}`}
        ipClass={`inputDesign ${ipClass || ""}`}
        unit={
          !hideSearchBar ? (
            <div>
              <svg
                width={25}
                height={25}
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect width={25} height={25} rx={5} fill="#3772FF" />
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M11.767 7C8.582 7 6 9.525 6 12.64c0 3.114 2.582 5.639 5.767 5.639a5.824 5.824 0 0 0 3.6-1.234l1.875 1.828.05.042c.174.126.42.112.578-.043a.428.428 0 0 0 0-.614l-1.853-1.807a5.552 5.552 0 0 0 1.517-3.812C17.534 9.526 14.952 7 11.767 7Zm0 .869c2.694 0 4.879 2.136 4.879 4.77 0 2.636-2.185 4.771-4.88 4.771-2.693 0-4.878-2.136-4.878-4.77 0-2.635 2.185-4.771 4.879-4.771Z"
                  fill="#fff"
                  stroke="#fff"
                />
              </svg>
            </div>
          ) : (
            <></>
          )
        }
        {...{
          header,
          value,
          onChange,
          numeric: false,
          placeholder,
          numericValidations,
          isGrey,
          type,
          bgClass,
          unit,
        }}
      />
      {(remark || (addsValidations && contractAddsValidation)) && (
        <div className="flex items-center text-6 fw5 err-container f12 ">
          {addsValidations && contractAddsValidation ? (
            <>
              <ErrorIcon className="error-icon" />
              Not a valid contract address
            </>
          ) : (
            remark
          )}
        </div>
      )}
    </Background>
  );
}
