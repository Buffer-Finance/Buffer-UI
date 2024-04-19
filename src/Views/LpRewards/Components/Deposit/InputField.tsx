import { divide } from '@Utils/NumString/stringArithmatics';
import { Display } from '@Views/Common/Tooltips/Display';
import { poolsType } from '@Views/LpRewards/types';
import { Skeleton } from '@mui/material';

export const InputField: React.FC<{
  value: string;
  setValue: (newValue: string) => void;
  activePool: poolsType;
  balance: string | undefined;
  unit: string;
  decimals: number;
  max: string;
}> = ({ setValue, activePool, balance, decimals, unit, max, value }) => {
  return (
    <div className="w-full">
      <div className="flex flex-col items-center gap-3">
        <div className="w-full flex justify-between items-center">
          <div className="text-[#C4C7C7] text-f13 font-medium leading-[14px]">
            Amount
          </div>
          {balance !== undefined ? (
            <div className="flex items-center gap-2">
              <svg
                width="10"
                height="10"
                viewBox="0 0 10 10"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g clip-path="url(#clip0_439_967)">
                  <path
                    d="M3.71899 7.22181V2.77857C3.7189 2.63251 3.74539 2.48785 3.79695 2.35289C3.84851 2.21792 3.92412 2.09529 4.01946 1.992C4.1148 1.88872 4.228 1.80681 4.35259 1.75095C4.47718 1.6951 4.6107 1.6664 4.74554 1.6665H9.48104V1.11227C9.48211 0.818729 9.37558 0.536733 9.18486 0.328219C8.99414 0.119705 8.73482 0.00172471 8.46385 0.000191127H1.05798C0.784152 -0.00527224 0.519401 0.106581 0.321286 0.311435C0.123171 0.516288 0.00770809 0.79758 0 1.09416V8.90623C0.00822638 9.20242 0.123916 9.48316 0.321975 9.68755C0.520033 9.89193 0.78449 10.0035 1.05798 9.99802H8.46185C8.59604 9.99745 8.7288 9.96822 8.85255 9.91199C8.9763 9.85577 9.08859 9.77366 9.18301 9.67037C9.27743 9.56707 9.35212 9.44462 9.4028 9.31002C9.45348 9.17542 9.47916 9.03131 9.47837 8.88594V8.33171H4.74286C4.47131 8.33133 4.21098 8.21425 4.01903 8.00616C3.82707 7.79808 3.71916 7.51599 3.71899 7.22181Z"
                    fill="#C3C2D4"
                  />
                  <path
                    d="M4.73558 3.17729V6.82287C4.73593 6.93324 4.77656 7.03897 4.8486 7.11701C4.92064 7.19505 5.01824 7.23907 5.12012 7.23945H9.61554C9.71742 7.23907 9.81502 7.19505 9.88706 7.11701C9.9591 7.03897 9.99972 6.93324 10.0001 6.82287V3.17729C9.99972 3.06692 9.9591 2.96119 9.88706 2.88315C9.81502 2.80511 9.71742 2.76109 9.61554 2.76071H5.11878C5.01714 2.76147 4.91987 2.80565 4.84812 2.88365C4.77637 2.96165 4.73593 3.06717 4.73558 3.17729ZM6.59006 5.83106C6.43394 5.8419 6.27847 5.80095 6.14438 5.71367C6.01028 5.62639 5.90391 5.49691 5.83945 5.3425C5.77499 5.18808 5.75549 5.01605 5.78355 4.84932C5.81161 4.68259 5.8859 4.52909 5.99652 4.40925C6.10714 4.28941 6.24884 4.20894 6.40274 4.17854C6.55665 4.14814 6.71545 4.16926 6.85799 4.2391C7.00053 4.30893 7.12005 4.42416 7.20062 4.56943C7.28119 4.7147 7.31899 4.88311 7.30898 5.05224C7.29701 5.25454 7.21742 5.44519 7.0851 5.58853C6.95278 5.73187 6.7768 5.81809 6.59006 5.83106Z"
                    fill="#C3C2D4"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_439_967">
                    <rect width="10" height="10" fill="white" />
                  </clipPath>
                </defs>
              </svg>

              <Display
                data={divide(balance, decimals)}
                unit={unit}
                className="text-[#C3C2D4] text-f12 leading-[14px]"
              />
            </div>
          ) : (
            <Skeleton variant="rectangular" className="w-[50px] !h-5 lc " />
          )}
        </div>
        <div className="flex w-full">
          <input
            value={value}
            type="number"
            className="w-full h-[33px] bg-[#282B39] rounded-l-[5px] text-1 text-f14 font-medium leading-[18px] px-[16px] outline-none"
            placeholder="0.0"
            onChange={(e) => setValue(e.target.value)}
          />
          <div className="bg-[#303044] flex flex-col items-center justify-center">
            <button
              className="bg-[#141823] text-1 text-[9px] px-3 rounded-sm h-fit"
              onClick={() => {
                setValue(divide(max, decimals) as string);
              }}
            >
              Max
            </button>
          </div>
          <div className="bg-[#303044] text-[#FFFFFF] rounded-r-[5px] pr-5 pl-3 py-3 text-f14 leading-[16px]">
            {unit}
          </div>
        </div>
      </div>
    </div>
  );
};
