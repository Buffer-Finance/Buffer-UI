import { divide } from '@Utils/NumString/stringArithmatics';
import { Display } from '@Views/Common/Tooltips/Display';
import { poolsType } from '@Views/LpRewards/types';
import { Skeleton } from '@mui/material';

export const InputField: React.FC<{
  setValue: (newValue: string) => void;
  activePool: poolsType;
  balance: string | undefined;
}> = ({ setValue, activePool, balance }) => {
  const unit = activePool === 'aBLP' ? 'ARB' : 'USDC';
  const decimals = activePool === 'aBLP' ? 18 : 6;
  return (
    <div className="w-full">
      <div className="flex flex-col items-center gap-3">
        <div className="flex justify-between">
          <div className="text-[#C4C7C7] text-f13 font-medium leading-[14px]">
            Amount
          </div>
          {balance !== undefined ? (
            <Display data={divide(balance, decimals)} unit={unit} />
          ) : (
            <Skeleton variant="rectangular" className="w-[50px] !h-5 lc " />
          )}
        </div>
        <div className="flex ">
          <input
            type="number"
            className="w-full h-[33px] bg-[#282B39] rounded-l-[5px] text-1 text-f14 font-medium leading-[18px] px-[16px] outline-none"
            placeholder="0.0"
            onChange={(e) => setValue(e.target.value)}
          />
          <div className="bg-[#303044] text-[#FFFFFF] rounded-r-[5px] px-5 py-3 text-f14 leading-[16px]">
            {activePool === 'aBLP' ? 'ARB' : 'USDC'}
          </div>
        </div>
      </div>
    </div>
  );
};
