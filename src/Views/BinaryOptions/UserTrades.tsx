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
import { formatDistanceExpanded } from '@Hooks/Utilities/useStopWatch';
import { Variables } from '@Utils/Time';
import { divide, subtract } from '@Utils/NumString/stringArithmatics';
import { IToken } from '.';
import { getPriceFromKlines } from '@TV/useDataFeed';
import { priceAtom } from '@Hooks/usePrice';
import { Display } from '@Views/Common/Tooltips/Display';
import { Bar } from '@Views/Common/Toast/style';
import NumberTooltip from '@Views/Common/Tooltips';
import FailureIcon from '@SVG/Elements/FailureIcon';
import BasicPagination from '@Views/Common/pagination';
import { ErrorMsg } from './Tables/TableComponents';
import { Skeleton } from '@mui/material';
import { getErrorFromCode } from '@Utils/getErrorFromCode';
import { DOwnTriangle } from '@Public/ComponentSVGS/DownTriangle';
import { useUserAccount } from '@Hooks/useUserAccount';
const userTradeRootDivStyle =
  'bg-2 flex flex-col py-[9px] px-[10px] my-1 rounded-[4px]';
const tableTypes = ['Open', 'Closed', 'Cancelled'];
export const UserTrades: React.FC<any> = ({}) => {
  const [tableType, setTableType] = useState(tableTypes[0]);
  const { active, history, cancelled } = useAtomValue(tardesAtom);
  const {
    active: activePages,
    history: historyPages,
    cancelled: cancelledPages,
  } = useAtomValue(tardesTotalPageAtom);
  console.log(`UserTrades-activePages: `, activePages, historyPages);

  const totalPages = {
    Open: activePages,
    Closed: historyPages,
    Cancelled: cancelledPages,
  };

  const [pageNumber, setPageNumber] = useAtom(tardesPageAtom);
  const activePage = {
    Open: pageNumber.active,
    Closed: pageNumber.history,
    Cancelled: pageNumber.cancelled,
  };
  const { address } = useUserAccount();
  const data = [active, history, cancelled];
  const renderers = [UserTrade, UserTradeClosed, UserTradeCancelled];
  console.log(`UserTrades-activePage[tableType] : `, activePage[tableType]);

  return (
    <div className=" overflow-y-scroll absolute  top-[0px] left-[0px] right-[0px] bottom-[0px] pb-3">
      <div className="sticky top-[0px] z-40 w-full bg-1 flex justify-evenly text-f14 rounded-t-[8px] py-[8px]  ">
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
      {tableTypes.map((d, idx) => {
        if (d != tableType) return null;
        const ActiveRenderer = renderers[idx];

        return (
          <ol>
            {!address ? (
              <li className="text-f13">
                <ErrorMsg
                  isHistoryTable={idx ? true : false}
                  className="!mt-1 !bg-2"
                />
              </li>
            ) : !data[idx] ? (
              <Skeleton
                className="!w-full !rounded-md !h-[100px] lc "
                variant="rectangular"
              />
            ) : data[idx].length ? (
              data[idx].map((s) => (
                <li key={s.optionID}>
                  <ActiveRenderer trade={s} tableType={tableType} />
                </li>
              ))
            ) : (
              <li className="text-f13">
                <ErrorMsg
                  isHistoryTable={idx ? true : false}
                  className="!mt-1 !bg-2"
                />
              </li>
            )}
          </ol>
        );
      })}
      {totalPages[tableType] ? (
        <BasicPagination
          onChange={(e, pageNumber) =>
            setPageNumber((d) => {
              const updatedNumbers = { ...d };
              switch (tableType) {
                case tableTypes[0]:
                  updatedNumbers['active'] = pageNumber;
                  break;
                case tableTypes[1]:
                  updatedNumbers['history'] = pageNumber;
                  break;

                case tableTypes[2]:
                  updatedNumbers['cancelled'] = pageNumber;
                  break;
              }
              console.log(`UserTrades-updatedNumbers: `, updatedNumbers);
              return updatedNumbers;
            })
          }
          size="small"
          count={totalPages[tableType]}
          page={activePage[tableType]}
        />
      ) : null}
    </div>
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
    width: Math.min(
      100 -
        (totalDiff.distance && currDiff.distance
          ? Math.round((currDiff.distance / totalDiff.distance) * 100)
          : 100),
      100
    ),
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
export const UserTrade: React.FC<{
  trade: IGQLHistory;
  tableType?: 'Closed' | 'Open' | 'Cancel';
}> = ({ trade, tableType }) => {
  console.log(`trade: `, trade);
  const [marketPrice] = useAtom(priceAtom);

  let price = getPriceFromKlines(marketPrice, trade.configPair);
  if (typeof price === 'string') {
    price = +price;
  }
  const probability = getProbability(trade, price);
  const { width, timeTillExpiration } = getBarWidthAndTimeTillExpiration(trade);

  return (
    <div className={userTradeRootDivStyle}>
      <div className="flex items-center justify-between text-1 text-f12">
        <TradeMarket trade={trade} />
        <div className="flex-col">
          {timeTillExpiration} left<div>Ony shown in dev </div>
        </div>
        <NumberTooltip content={timeTillExpiration + ' lerft'}>
          <div className="flex items-center gap-x-[4px]">
            <TimerIcon />
            {getDuration(trade)}
          </div>
        </NumberTooltip>
      </div>
      <div className="flex items-center justify-between mt-[4px] text-f12 ">
        <div className="flex flex-col items-start ">
          <div>Size</div>
          <div className="text-1">
            {<Display data={getTradeSize(trade)} unit={'USDC'} />}
          </div>
        </div>
        <div className="flex  flex-col items-end ">
          {' '}
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
export const UserTradeClosed: React.FC<{
  trade: IGQLHistory;
  tableType?: 'Closed' | 'Open' | 'Cancel';
}> = ({ trade, tableType }) => {
  console.log(`trade: `, trade);
  const [marketPrice] = useAtom(priceAtom);

  let price = getPriceFromKlines(marketPrice, trade.configPair);
  if (typeof price === 'string') {
    price = +price;
  }

  const net_pnl = trade.payout
    ? subtract(trade.payout, trade.totalFee)
    : subtract('0', trade.totalFee);
  return (
    <div className={userTradeRootDivStyle}>
      <div className="flex items-center justify-between text-1 text-f12">
        <TradeMarket trade={trade} />

        <div className="flex items-center gap-x-[4px]">
          <TimerIcon />
          {getDuration(trade)}
        </div>
      </div>
      <div className="flex items-center justify-between mt-[4px] text-f12 ">
        <div className="flex flex-col items-start ">
          <div>Size</div>
          <div className="text-1">
            {<Display data={getTradeSize(trade)} unit={'USDC'} />}
          </div>
        </div>
        <div className="flex  flex-col items-end ">
          <div className="flex">
            Expire @
            <Display
              unit={(trade.depositToken as IToken).name}
              data={divide(trade.expirationPrice, 8)}
              className="f15 weight-400"
            />
          </div>
          <div className="flex  items-start">
            <span
              className={`nowrap flex ${
                +net_pnl < 0 ? 'text-red' : 'text-green'
              }`}
            >
              <Display
                label={+net_pnl > 0 ? '+' : ''}
                data={divide(net_pnl, (trade.depositToken as IToken).decimals)}
                unit={(trade.depositToken as IToken).name}
              />
            </span>
          </div>{' '}
        </div>
      </div>
    </div>
  );
};
export const UserTradeCancelled: React.FC<{
  trade: IGQLHistory;
  tableType?: 'Closed' | 'Open' | 'Cancel';
}> = ({ trade, tableType }) => {
  console.log(`trade: `, trade);
  const [marketPrice] = useAtom(priceAtom);

  let price = getPriceFromKlines(marketPrice, trade.configPair);
  if (typeof price === 'string') {
    price = +price;
  }

  const net_pnl = trade.payout
    ? subtract(trade.payout, trade.totalFee)
    : subtract('0', trade.totalFee);
  return (
    <div className={userTradeRootDivStyle}>
      <div className="flex items-center justify-between text-1 text-f12">
        <TradeMarket trade={trade} />
        <div className="flex items-center gap-x-[4px]">
          <FailureIcon width={14} height={14} /> Cancelled
        </div>
      </div>
      <div className="flex items-center justify-between mt-[4px] text-f12 ">
        <div className="flex flex-col items-start ">
          <div>Size</div>
          <div className="text-1">
            {<Display data={getTradeSize(trade)} unit={'USDC'} />}
          </div>
        </div>
        <div className="flex  flex-col items-end ">
          <div className="flex flex-col items-end">
            Reason
            <div className="text-1">{getErrorFromCode(trade.reason)}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

const TradeMarket = ({ trade }: { trade: IGQLHistory }) => {
  return (
    <NumberTooltip content={'Strike : ' + divide(trade.strike, 8)}>
      <div className="flex items-center">
        {trade.isAbove ? (
          <UpTriangle className={`scale-[0.70] mt-1`} />
        ) : (
          <DOwnTriangle className={`scale-[0.70] mt-1`} />
        )}
        {trade.configPair?.tv_id}
      </div>
    </NumberTooltip>
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
