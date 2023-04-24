import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import {
  IGQLHistory,
  tardesAtom,
  tardesPageAtom,
  tardesTotalPageAtom,
  updateActivePageNumber,
} from './Hooks/usePastTradeQuery';
import { BlackScholes } from '@Utils/Formulas/blackscholes';

import { SVGProps, useState } from 'react';
import { UpTriangle } from '@Public/ComponentSVGS/UpTriangle';
import DownIcon from '@SVG/Elements/DownIcon';
import { formatDistanceExpanded } from '@Hooks/Utilities/useStopWatch';
import { Variables } from '@Utils/Time';
import { divide } from '@Utils/NumString/stringArithmatics';
import { IToken } from '.';
import { getPriceFromKlines } from '@TV/useDataFeed';
import { priceAtom } from '@Hooks/usePrice';
import { Display } from '@Views/Common/Tooltips/Display';
import { Bar } from '@Views/Common/Toast/style';
import NumberTooltip from '@Views/Common/Tooltips';

const tableTypes = ['Open', 'Closed', 'Cancelled'];
export const UserTrades: React.FC<any> = ({}) => {
  const [tableType, setTableType] = useState(tableTypes[0]);
  const { active, history } = useAtomValue(tardesAtom);
  const { active: activePages, history: historyPages } =
    useAtomValue(tardesTotalPageAtom);
  const totalPages = activePages;
  const filteredData = active;

  const setActivePage = useSetAtom(updateActivePageNumber);
  const { active: activePage } = useAtomValue(tardesPageAtom);
  return (
    <>
      <div className="w-full bg-1 flex justify-evenly text-f14 rounded-t-[8px] py-[8px]  ">
        {tableTypes.map((s) => {
          return (
            <div
              className={' cursor-pointer ' + (tableType == s ? 'text-1' : '')}
              onClick={() => setTableType(s)}
            >
              {s}
            </div>
          );
        })}
      </div>
      <ol>
        {history?.map((s) => (
          <li key={s.optionID}>
            <ClosedTradeMarkup trade={s} />
          </li>
        ))}
        {/* {active?.map((s) => (
          <li key={s.optionID}>
            <ActiveTradeMarkup trade={s} />
          </li>
        ))} */}
      </ol>
    </>
  );
  // return <div>{active?.length}</div>;
};

export function getTradeSize(trade: IGQLHistory) {
  return divide(trade.totalFee, (trade.depositToken as IToken).decimals);
}
export function getDuration(trade: IGQLHistory) {
  return formatDistanceExpanded(
    Variables(+trade.expirationTime - +trade.creationTime)
  );
}
export function getBarWidthAndTimeTillExpiration(trade: IGQLHistory) {
  const totalDiff = Variables(+trade.expirationTime - +trade.creationTime);

  const currentEpoch = Math.round(new Date().getTime() / 1000);
  const currDiff = Variables(+trade.expirationTime - currentEpoch);

  return {
    width:
      100 -
      (totalDiff.distance && currDiff.distance
        ? Math.round((currDiff.distance / totalDiff.distance) * 100)
        : 100),
    timeTillExpiration: formatDistanceExpanded(currDiff),
  };
}
export const PRICE_DECIMALS = 1e8;

export const IV = 12000;
export function getProbability(trade: IGQLHistory, price) {
  const currentEpoch = Math.round(new Date().getTime() / 1000);
  return (
    BlackScholes(
      true,
      trade.isAbove,
      price,
      +trade.strike / PRICE_DECIMALS,
      +trade.expirationTime - currentEpoch,
      0,
      IV / 1e4
    ) * 100
  );
}
export const ActiveTradeMarkup: React.FC<{ trade: IGQLHistory }> = ({
  trade,
}) => {
  console.log(`trade: `, trade);
  const [marketPrice] = useAtom(priceAtom);

  let price = getPriceFromKlines(marketPrice, trade.configPair);
  if (typeof price === 'string') {
    price = +price;
  }
  console.log(`price: `, price);
  const probability = getProbability(trade, price);
  const { width, timeTillExpiration } = getBarWidthAndTimeTillExpiration(trade);
  console.log(`probability: `, probability);
  return (
    <div className="bg-2 flex flex-col px-[10px] pb-[20px] pt-[15px]">
      <div className="flex items-center justify-between text-1 text-f12">
        <div className="flex ">
          {trade.isAbove ? (
            <UpTriangle className={`scale-[0.70] mt-1`} />
          ) : (
            <DownIcon className={`scale-[0.70] mt-1`} />
          )}
          {trade.configPair?.tv_id}
        </div>
        <NumberTooltip content={timeTillExpiration + ' lerft'}>
          <div className="flex items-center gap-x-[4px]">
            <TimerIcon />
            {getDuration(trade)}
          </div>
        </NumberTooltip>
      </div>
      <div className="flex items-center justify-between mt-[6px] text-f12 ">
        <div className="flex flex-col items-start ">
          <div>Size</div>
          <div className="text-1">{getTradeSize(trade)}</div>
        </div>
        <div className="flex items-center flex-col items-end ">
          <div>Probability</div>
          <div className="text-1">
            {probability ? (
              <Display data={probability} unit={'%'} />
            ) : (
              'Calculating..'
            )}
          </div>
        </div>
      </div>
      <div className="mt-[8px]">
        <NumberTooltip content={timeTillExpiration + ' left'}>
          <div className="relative w-full mt-[4px]">
            <Bar
              width={width + '%'}
              className={trade.isAbove ? 'bg-green' : 'bg-red'}
            />
          </div>
        </NumberTooltip>
      </div>
    </div>
  );
};
export const ClosedTradeMarkup: React.FC<{ trade: IGQLHistory }> = ({
  trade,
}) => {
  console.log(`trade: `, trade);
  const [marketPrice] = useAtom(priceAtom);

  let price = getPriceFromKlines(marketPrice, trade.configPair);
  if (typeof price === 'string') {
    price = +price;
  }
  console.log(`price: `, price);
  const probability = getProbability(trade, price);
  const { width, timeTillExpiration } = getBarWidthAndTimeTillExpiration(trade);
  console.log(`probability: `, probability);
  return (
    <div className="bg-2 flex flex-col px-[10px] pb-[20px] pt-[15px]">
      <div className="flex items-center justify-between text-1 text-f12">
        <div className="flex ">
          {trade.isAbove ? (
            <UpTriangle className={`scale-[0.70] mt-1`} />
          ) : (
            <DownIcon className={`scale-[0.70] mt-1`} />
          )}
          {trade.configPair?.tv_id}
        </div>
        <NumberTooltip content={timeTillExpiration + ' lerft'}>
          <div className="flex items-center gap-x-[4px]">
            <TimerIcon />
            {getDuration(trade)}
          </div>
        </NumberTooltip>
      </div>
      <div className="flex items-center justify-between mt-[6px] text-f12 ">
        <div className="flex flex-col items-start ">
          <div>Size</div>
          <div className="text-1">{getTradeSize(trade)}</div>
        </div>
        <div className="flex items-center flex-col items-end ">
          <div>Probability</div>
          <div className="text-1">
            {probability ? (
              <Display data={probability} unit={'%'} />
            ) : (
              'Calculating..'
            )}
          </div>
        </div>
      </div>
      <div className="mt-[8px]">
        <NumberTooltip content={timeTillExpiration + ' left'}>
          <div className="relative w-full mt-[4px]">
            <Bar
              width={width + '%'}
              className={trade.isAbove ? 'bg-green' : 'bg-red'}
            />
          </div>
        </NumberTooltip>
      </div>
    </div>
  );
};

const TimerIcon = () => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={11} height={12} fill="none">
      <path
        fill="#6B728E"
        fillRule="evenodd"
        d="M4.53.575C1.646 1.07-.398 3.936.064 6.83c.48 2.998 3.309 5.074 6.27 4.602 4.166-.665 6.064-5.45 3.505-8.836C8.69 1.072 6.493.237 4.53.575Zm2.116.911a4.627 4.627 0 0 1 2.136 7.795c-1.84 1.857-4.682 1.854-6.562-.006-2.582-2.554-1.395-6.82 2.17-7.8.757-.209 1.424-.205 2.256.011ZM5.288 3.24c-.114.046-.155.529-.155 1.816V6.81l.838.83c.852.845 1.118.971 1.382.654.199-.24.057-.473-.788-1.301l-.69-.675V4.813c0-1.258-.032-1.517-.195-1.58a.89.89 0 0 0-.217-.065l-.175.072Z"
        clipRule="evenodd"
      />
    </svg>
  );
};
