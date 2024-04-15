// replace all th occurances with a typescript enabled TableHead component that expects a prop called children in this file

import { divide } from '@Utils/NumString/stringArithmatics';
import { Display } from '@Views/Common/Tooltips/Display';
import { ReactNode } from 'react';
import { Variables } from '@Utils/Time';
import useStopWatch, { formatDistance } from '@Hooks/Utilities/useStopWatch';
import { usePlatformEvent, usePlatformEventAB } from '@Hooks/usePlatformEvent';
import { useTimer2 } from '@Hooks/Utilities/usestopwatch2';

const TableHead: React.FC<any> = ({ children }) => {
  return (
    <th className="text-left text-f12 text-[#808191] font-[500]">{children}</th>
  );
};

const TableCell: React.FC<{ className?: string; children?: ReactNode }> = ({
  children,
  className,
  ...props
}) => {
  return (
    <td {...props} className={['font-[500] text-f12', className].join(' ')}>
      {children}
    </td>
  );
};
type UDEvent = {
  user: string;
  id: string;
  updatedAt: number;
  payout: string;
  event: string;
  expiration: string;
};
type ABEvent = {
  user: string;
  id: string;
  updatedAt: string;
  payout: string;
  event: string;
};
const Token2Decimal = {
  ARB: 18,
  USDC: 6,
};
const getDecimal = (t: any) => {
  return Token2Decimal[t.optionContract.pool];
};
const PlatformTradesTab: React.FC<{ events: UDEvent[] | ABEvent[] }> = ({
  events,
}) => {
  if (!events?.length) return null;
  return (
    <div className="flex flex-col min-w-[270px] h-full  ">
      <div className="bg-[#282B39] sm:hidden rounded-[5px] mb-1 text-[14px] py-[3px] px-[12px] w-full ">
        Platform Trades
      </div>
      <div className="bg-[#141823] rounded-[5px] mt-[1px] overflow-auto max-h-[79vh] h-full w-full">
        <table className=" border-spacing-3 border-spacing-x-2 border-separate px-3 w-full ">
          <thead>
            <tr className="">
              <TableHead>Strike Price</TableHead>
              <TableHead>Size</TableHead>
              <TableHead>ROI</TableHead>
              <TableHead>Expires in</TableHead>
            </tr>
          </thead>
          <tbody>
            {events?.map((e) => (
              <tr className="" key={e.id}>
                <TableCell className={e.isAbove ? 'text-green' : 'text-red '}>
                  <Display
                    data={divide(e.strike, 8)}
                    className="!justify-start !w-fit"
                  />
                </TableCell>
                <TableCell>
                  <Display
                    data={divide(e.amount, getDecimal(e))}
                    className="!justify-start !w-fit"
                    unit={e.optionContract.pool}
                  />
                </TableCell>
                <TableCell width="17%">{getROI(e)}%</TableCell>
                <TableCell>
                  <span
                    className={[
                      'capitalize',
                      e.event == 'WIN'
                        ? 'text-green'
                        : e.event == 'LOSE'
                        ? 'text-red'
                        : '',
                    ].join(' ')}
                  >
                    {e.event == 'CREATE' ? (
                      <Duration trade={e} />
                    ) : (
                      e.event.toLowerCase()
                    )}
                  </span>
                </TableCell>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export { PlatformTradesTab };
function getROI(e: any) {
  const payout = BigInt(e.payout);
  const amount = BigInt(e.totalFee);
  if (!payout) {
    return 0;
  } else {
    const x = (payout * 100n) / amount - 100n;
    console.log(`PlatformTradesTab-x: `, x, payout, amount);
    return x.toString();
  }
  // return percentange of payout

  return '75';
}

function Duration({ trade }) {
  const timer = useStopWatch(+trade.expirationTime);

  return timer;
}

export const PlatformEvents = () => {
  const { data } = usePlatformEvent();
  return <PlatformTradesTab events={data} />;
};
export const PlatformEventsAB = () => {
  const { data } = usePlatformEventAB();
  return <PlatformTradesTab events={data} />;
};
