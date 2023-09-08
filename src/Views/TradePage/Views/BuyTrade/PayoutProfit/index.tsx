import MemoBlueFire from '@SVG/Elements/BlueFire';
import MemoBlueMen from '@SVG/Elements/BlueMen';
import {
  add,
  divide,
  gt,
  multiply,
  subtract,
} from '@Utils/NumString/stringArithmatics';
import { Display } from '@Views/Common/Tooltips/Display';
import { RowGap } from '@Views/TradePage/Components/Row';
import { TimeElapsedBar } from '@Views/TradePage/Components/TimeElapsedBar';
import { tradeTypeAtom } from '@Views/TradePage/atoms';
import { Skeleton } from '@mui/material';
import { useAtom } from 'jotai';

const renderPayout = (payout: string, boost: boolean) => {
  if (boost)
    return (
      <div className="flex items-center  text-wc ">
        ({payout?.includes('-') ? '' : '+'}
        {payout}%
        <MemoBlueFire className="scale-[0.7]" />
        <MemoBlueMen className="scale-[1.2] mt-[2px] mx-[2px]" />)
      </div>
    );
  return payout + '%';
};

export const PayoutProfit = ({
  amount,
  totalPayout,
  tradeToken,
}: {
  amount: string | undefined | null;
  totalPayout: string | undefined | null;
  tradeToken: string;
}) => {
  const [activeTab, setActiveTab] = useAtom(tradeTypeAtom);
  const boost = true;
  if (amount && totalPayout) {
    return (
      <div
        className={` my-3 mb-4 ${
          boost
            ? 'bg-[#282B39] relative rounded-[8px] pt-[18px] pb-[8px] px-[10px] overflow-hidden '
            : ''
        }`}
      >
        <div className={`flex-sbw text-f14   `}>
          {boost ? (
            <div className="boost-button text-[black] text-f10 font-bold  w-fit  pl-[10px] pr-[7px] absolute top-[0px] right-[0px] rounded-bl-lg">
              Boost
            </div>
          ) : null}
          <div className="text-f14 b1200:text-f14 items-start flex-start flex-col  flex wrap  text-2 ">
            <span className={'nowrap mb-1 ' + boost ? 'text-wc text-f12' : ''}>
              Payout{' '}
              <span className="text-1 a1200:hidden">
                {activeTab == 'Limit' ? '>' : ''}&nbsp;
              </span>
            </span>
            <RowGap gap="4px">
              <Display
                className={`text-1 text-f16   !font-[500] !whitespace-nowrap  ${
                  boost ? '!text-f14' : ''
                }`}
                data={multiply(
                  add('1', divide(totalPayout, 2) as string),
                  amount
                )}
                unit={tradeToken}
              />
              {renderPayout(totalPayout, boost)}
            </RowGap>
          </div>
          <div
            className={
              'text-f14 items-end flex-col flex-start wrap flex text-2  gap-y-1  ' +
              (boost ? 'text-wc text-f12' : '')
            }
          >
            <div className="">Profit</div>
            <div className="flex">
              <span className="text-green a1200:hidden">
                {' '}
                {activeTab == 'Limit' ? '>' : ''}
              </span>
              <Display
                className={`  !font-[500] text-green text-f1 !whitespace-nowrap ${
                  boost ? '!text-f14' : ''
                }`}
                data={subtract(
                  multiply(add('1', divide(totalPayout, 2) as string), amount),
                  amount
                )}
                unit={tradeToken}
              />
            </div>
          </div>
        </div>
        <div className="flex items-center gap-x-[5px]">
          <TimeElapsedBar progressPercent={50} className={'boost-button'} />
          <div className="text-f11 font-[500]">2/4</div>
        </div>
      </div>
    );
  } else {
    return (
      <Skeleton
        className="custom-h full-width sr lc my-3 !h-6"
        variant="rectangular"
      />
    );
  }
};
