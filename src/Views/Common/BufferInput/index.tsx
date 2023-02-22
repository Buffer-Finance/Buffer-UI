import { useCallback, ReactNode } from "react";
import Big from "big.js";
import BufferTextInputRoot, { IBufferInputBase } from "../BufferTextInputRoot";
import { BN } from "src/Interfaces/interfaces";
import { useToast } from "@Contexts/Toast";

interface IError {
  val: string | number | boolean;
  error: ReactNode;
}
interface INumError {
  val: number;
}
interface IBoolError extends IError {
  val: boolean;
}
interface IStrError extends IError {
  val: string;
}

interface IValidation {
  min?: IStrError;
  max?: IStrError;
  decimals?: INumError;
}
export interface IBufferInput extends IBufferInputBase {
  numericValidations?: IValidation;
  isGrey?: boolean;
  type?: boolean;
  addsValidations?: boolean;
  hideSearchBar?: boolean;
  label?:ReactNode;
  id?:string;
  remark?: ReactNode;
  isDisabled?: boolean;
}

const BufferInput: React.FC<IBufferInput> = ({
  placeholder,
  unit,
  header,
  numericValidations,
  value,
  onChange,
  className,
  inputType,
  id,
  onError,
  label,
  bgClass,
  isGrey,
  ipClass,
  type,
  isDisabled,
  title,
}) => {
  if (!numericValidations)
    return (
      <BufferTextInputRoot
        {...{
          placeholder,
          unit,
          header,
          bgClass,
          label,
          inputType,
          value,
          onChange,
          onError,
          className,
          numeric: false,
          ipClass,
          validations: [],
          isGrey,
          type,
          id,
          isDisabled,
          title,
        }}
      />
    );
  const getErr = (isError: boolean, error: ReactNode, value: string) => {
    if (isError) {
      return [value, error];
    }
    return [value, null];
  };
  const minValidation = useCallback(
    (val: string) => {
      const { min } = numericValidations;
      if (!min) return [val, null];
      const valBN: BN = Big(val);
      const minBN: BN = Big(min.val);
      const ok = valBN.gte(minBN);
      return getErr(!ok, min.error, val);
    },
    [numericValidations]
  );
  const maxValidation = useCallback(
    (val: string) => {
      const { max } = numericValidations;
      if (!max) return [val, null];
      const valBN: BN = Big(val);
      const maxBN: BN = Big(max.val);
      const ok = maxBN.gte(valBN);
      return getErr(!ok, max.error, val);
    },
    [numericValidations]
  );
  const toastify = useToast();
  const decimalValidation = useCallback(
    (val: string) => {
      const { decimals } = numericValidations;
      if (!decimals) return [val, null];

      const valBN: BN = Big(val);
      const regexArr = [
        /^\d*(\.)?(\d{0,0})?$/,
        /^\d*(\.)?(\d{0,1})?$/,
        /^\d*(\.)?(\d{0,2})?$/,
        /^\d*(\.)?(\d{0,3})?$/,
        /^\d*(\.)?(\d{0,4})?$/,
        /^\d*(\.)?(\d{0,5})?$/,
        /^\d*(\.)?(\d{0,6})?$/,
      ];
      val = valBN.toString();
      console.log(`val: `, val);

      if (!regexArr[decimals.val].test(val)) {
        toastify({
          type: "error",
          msg: !decimals.val
            ? "Decimal values aren't allowed"
            : "Only " + decimals.val + " decimals are allowed!",
          id: "decimals",
        });
        return [false, false, true];
      }
      return [];
    },
    [numericValidations]
  );

  return (
    <BufferTextInputRoot
      {...{
        placeholder,
        unit,
        onError,
        label,
        id,
        header,
        value,
        bgClass,
        onChange,
        className,
        numeric: numericValidations ? true : false,
        ipClass,
        validations: [minValidation, maxValidation, decimalValidation],
        isGrey,
        type,
        inputType,
        isDisabled,
        title,
      }}
    />
  );
};

export default BufferInput;
