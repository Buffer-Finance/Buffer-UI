import axios from 'axios';
import { binaryTabs } from 'config';
import { useGlobal } from '@Contexts/Global';
import useStopWatch from '@Hooks/Utilities/useStopWatch';
import { useAtom } from 'jotai';
import ShareIcon from 'public/shareModal/ShareIcon';
import { useState } from 'react';
import FailedSuccess from 'src/SVG/Elements/FailedSuccess';
import InfoIcon from 'src/SVG/Elements/InfoIcon';
import SuccessIcon from 'src/SVG/Elements/SuccessIcon';
import { getDisplayTime } from '@Utils/Dates/displayDateTime';
import { BlackScholes } from '@Utils/Formulas/blackscholes';
import { toFixed } from '@Utils/NumString';
import routerABI from '@Views/BinaryOptions/ABI/routerABI.json';

import {
  add,
  divide,
  gt,
  lt,
  multiply,
  subtract,
} from '@Utils/NumString/stringArithmatics';
import { CellContent, CellInfo } from '@Views/Common/BufferTable/CellInfo';
import TableErrorMsg from '@Views/Common/BufferTable/ErrorMsg';
import TableAssetCell from '@Views/Common/BufferTable/TableAssetCell';
import NumberTooltip from '@Views/Common/Tooltips';
import { Display } from '@Views/Common/Tooltips/Display';
import { BlackBtn } from '@Views/Common/V2-Button';
import { IMarket, IToken, IV, useQTinfo } from '..';
import { SetShareBetAtom, SetShareStateAtom } from '../Components/shareModal';
import { IGQLHistory } from '../Hooks/usePastTradeQuery';
import { expiryPriceCache } from '../Hooks/useTradeHistory';
import { getPendingData } from './Desktop';
import { UpTriangle } from '@Public/ComponentSVGS/UpTriangle';
import { DOwnTriangle } from '@Public/ComponentSVGS/DownTriangle';
import FailureIcon from 'src/SVG/Elements/FailureIcon';
import { BetState } from '@Hooks/useAheadTrades';
import { getPriceFromKlines } from 'src/TradingView/useDataFeed';
import { useToast } from '@Contexts/Toast';
import { useWriteCall } from '@Hooks/useWriteCall';
import { PairTokenImage } from '../Components/PairTokenImage';
export const PRICE_DECIMALS = 1e8;

export const getExpireNotification = async (
  currentRow: IGQLHistory,
  toastify,
  openShareModal: (trade: IGQLHistory, expiry: string) => void
) => {
  let response;
  const query = {
    pair: currentRow.configPair.tv_id,
    timestamp: currentRow.expirationTime,
  };
  response = await axios.post(`https://oracle.buffer.finance/price/query/`, [
    query,
  ]);
  if (!response.data?.length) {
    response = await axios.post(`https://oracle.buffer.finance/price/query/`, [
      query,
    ]);
  }

  if (!Array.isArray(response.data) || !response.data?.[0]?.price) {
    return null;
  }

  const expiryPrice = response.data[0].price.toString();
  let win = true;
  if (lt(currentRow.strike, expiryPrice)) {
    if (currentRow.isAbove) {
      win = true;
    } else {
      win = false;
    }
  } else if (currentRow.strike == expiryPrice) {
    //to be asked
    win = false;
  } else {
    if (currentRow.isAbove) {
      win = false;
    } else {
      win = true;
    }
  }

  if (win) {
    openShareModal(currentRow, expiryPrice.toString());
    return;
  } else {
    const openTimeStamp = currentRow.creationTime;
    const closeTimeStamp = +currentRow.expirationTime;
    toastify({
      type: 'loss',
      // inf: true,
      msg: (
        <div className="flex-col">
          <div className="flex whitespace-nowrap">
            {currentRow.configPair.token1}-{currentRow.configPair.token2}{' '}
            {currentRow.isAbove ? 'Up' : 'Down'} @&nbsp;
            <Display
              data={divide(currentRow.strike, 8)}
              unit={currentRow.configPair.token2}
              className="!whitespace-nowrap"
            />{' '}
            &nbsp;
            <span
              className={`flex !whitespace-nowrap `}
              style={{ color: win ? 'var(--green)' : 'text-1' }}
            >
              (+{' '}
              <Display
                className={'text-1 !whitespace-nowrap ' + win && 'green'}
                data={
                  win ? subtract(currentRow.amount, currentRow.totalFee) : 0
                }
                unit={(currentRow.depositToken as IToken).name}
              />
              )
            </span>
          </div>
          <div className="nowrap f12 mt5 text-6 @whitespace-nowrap">
            {getDisplayTime(openTimeStamp)} -&nbsp;
            {getDisplayTime(closeTimeStamp)}
          </div>
        </div>
      ),
    });
  }
};

export const SlippageTooltip: React.FC<{
  option: IGQLHistory;
  className?: string;
}> = ({ option, className }) => {
  return (
    <InfoIcon
      className={className}
      sm
      tooltip={`The strike price will be in the range of ${toFixed(
        subtract(
          divide(option.strike, 8),
          divide(
            multiply(divide(option.strike, 8), divide(option.slippage, 2)),
            '100'
          )
        ),

        4
      )} - ${toFixed(
        add(
          divide(option.strike, 8),
          divide(
            multiply(divide(option.strike, 8), divide(option.slippage, 2)),
            '100'
          )
        ),

        4
      )}`}
    />
  );
};

export const Cancel: React.FC<{
  queue_id: number;
}> = ({ queue_id }) => {
  const toastify = useToast();
  const binary = useQTinfo();
  //
  const { writeCall } = useWriteCall(binary.routerContract, routerABI);
  const cancelHandler = async (
    queuedId: number,
    cb: (loadingState) => void
  ) => {
    if (queuedId === null || queuedId === undefined) {
      toastify({
        id: 'queuedId',
        type: 'error',
        msg: 'Something went wrong. Please try again later.',
      });
      return true;
    }
    cb(true);
    writeCall(() => cb(false), 'cancelQueuedTrade', [queuedId]);
  };
  //
  const [isLoading, setIsLoading] = useState(false);
  return (
    <BlackBtn
      onClick={() => {
        console.log(`queue_id: `, queue_id);
        cancelHandler(queue_id, setIsLoading);
      }}
      className="!h-fit !px-4 !py-2 !rounded-md !text-f14 !font-medium !w-fit "
      isLoading={isLoading}
    >
      Cancel
    </BlackBtn>
  );
};

export const StopWatch: React.FC<{
  expiry: number;
}> = ({ expiry }) => {
  const stopwatch = useStopWatch(expiry);
  const result = stopwatch.replace(/(.)\1+/g, '$1');
  return (
    <div>
      {result == '' || !result || result == ' ' || result.includes('-')
        ? 'Processing...'
        : stopwatch}
    </div>
  );
};

export const PayoutChip: React.FC<{
  data: IGQLHistory;
  className?: string;
}> = ({ data, className = '' }) => {
  const net_pnl = data.payout
    ? divide(
        subtract(data.payout, data.totalFee),
        (data.depositToken as IToken).decimals
      )
    : divide(
        subtract('0', data.totalFee),
        (data.depositToken as IToken).decimals
      );

  const isPending = data.state === BetState.active;
  let isWin = gt(net_pnl, '0');
  const isCancelled = data.state === BetState.cancelled;
  const isQueued = data.state === BetState.queued;

  let betExpiryPrice = expiryPriceCache?.[data.optionID];

  if (isPending && betExpiryPrice) {
    if (data.isAbove) {
      isWin = gt(betExpiryPrice, data.strike);
    } else {
      isWin = !gt(betExpiryPrice, data.strike);
    }
  }

  function getChipContent() {
    if (isPending && !betExpiryPrice) {
      return {
        tooltip: 'Fetching latest states.',
        chip: 'Fetching State',
        icon: (
          <img src="/Gear.png" className="transition-transform animate-spin" />
        ),
        textColor: 'text-3',
      };
    }
    if (isQueued)
      return {
        tooltip: 'The trade is queued.',
        chip: 'Queued',
        icon: (
          <img src="/Gear.png" className="transition-transform animate-spin" />
        ),
        textColor: 'text-3',
      };
    if (isCancelled)
      return {
        tooltip: 'The trade is cancelled',
        chip: 'Cancelled',
        icon: <FailureIcon width={14} height={14} />,
        textColor: 'text-3',
      };
    if (isWin) {
      if (isPending)
        return {
          tooltip: 'You won the trade. Transfering the amount...',
          chip: 'Processing',
          icon: (
            <img
              src="/Gear.png"
              className="transition-transform animate-spin"
            />
          ),
          textColor: 'text-green',
        };
      else
        return {
          tooltip: 'You won this bet!',
          chip: 'Win',
          icon: <SuccessIcon width={14} height={14} />,
          textColor: 'text-green',
        };
    } else
      return {
        tooltip: 'You lost this trade!',
        chip: 'Loss',
        icon: <FailedSuccess width={14} height={14} />,
        textColor: 'text-red',
      };
  }

  // if (data.state === BetState.active) {
  //   return null;
  // }
  return (
    <NumberTooltip content={getChipContent().tooltip}>
      <div
        className={`flex sm:flex-row-reverse items-center justify-between w-fit web:pl-3 web:pr-[6px] web:py-2 web:bg-2 rounded-[5px] ${className}`}
      >
        <div
          className={
            'text-f13 font-normal web:mr-3 tab:mx-2' +
            ` ${getChipContent().textColor}`
          }
        >
          {getChipContent().chip}
        </div>

        {getChipContent().icon}
      </div>
    </NumberTooltip>
  );
};

export const AssetCell: React.FC<{
  currentRow: IGQLHistory;
  split?: boolean;
  configData: IMarket;
}> = ({ currentRow, split, configData }) => {
  const isUp = currentRow.isAbove;

  return (
    <TableAssetCell
      img={
        <div className="w-[20px] h-[20px] mr-[6px]">
          <PairTokenImage pair={currentRow.configPair?.pair} />
        </div>
      }
      head={
        <div className={`flex ${split ? 'flex-col' : 'flex-row'} -ml-[6px]`}>
          <span className={`weight-400 text-f15 `}>
            {configData.token1 + '-' + configData.token2}{' '}
          </span>
          <UpDownChip isUp={isUp} />
        </div>
      }
      desc={<></>}
    />
  );
};

export const UpDownChip: React.FC<{
  isUp: boolean;
  className?: string;
  shouldShowImage?: boolean;
  upText?: string;
  downText?: string;
}> = ({
  isUp,
  className = '',
  shouldShowImage = true,
  upText = 'Up',
  downText = 'Down',
}) => {
  return (
    <div
      className={`px-3 text-f12 flex gap-1 items-center rounded-[8px] font-medium  ml-2 bg-1 brightness-125 w-fit ${
        isUp ? 'green' : 'red'
      }  ${className}`}
    >
      {shouldShowImage &&
        (isUp ? (
          <UpTriangle className={`scale-[0.70] mt-1`} />
        ) : (
          <DOwnTriangle className={`mt-1 scale-[0.70]`} />
        ))}
      {isUp ? upText : downText}
    </div>
  );
};

export const UpDownChipWOText: React.FC<{
  isUp: boolean;
}> = ({ isUp }) => {
  return isUp ? (
    <UpTriangle className={`ml-2 scale-[0.90]`} />
  ) : (
    <DOwnTriangle className={`ml-2`} />
  );
};

export const ErrorMsg: React.FC<{ isHistoryTable: boolean }> = ({
  isHistoryTable,
}) => {
  const { dispatch } = useGlobal();
  const errMssg = 'No' + (isHistoryTable ? '' : ' active') + ' trades yet.';
  return (
    <TableErrorMsg
      msg={errMssg}
      onClick={() => {
        dispatch({
          type: 'SET_ACIVE_TAB',
          payload: binaryTabs[0],
        });
      }}
    />
  );
};

export const StrikePriceComponent = ({
  trade,
  configData,
  isMobile = false,
}: {
  trade: IGQLHistory;
  configData: IMarket;
  isMobile?: boolean;
}) => {
  const decimals = configData.price_precision.toString().length - 1;
  return (
    <>
      <Display
        data={divide(trade.strike, 8)}
        unit={configData.token2}
        precision={decimals}
        className={`${
          !isMobile
            ? 'justify-self-start content-start'
            : 'justify-self-end content-end'
        }  w-fit`}
      />
      {!isMobile && trade.state === BetState.queued ? (
        <div className="flex gap-2 align-center">
          <SlippageTooltip option={trade} className="mt-[2px] mr-[3px]" />
          Slippage -
          <Display
            data={divide(trade.slippage, 2)}
            unit="%"
            className="mr-[3px]"
            precision={2}
          />
        </div>
      ) : null}
    </>
  );
};

export const ExpiryCurrentComponent: React.FC<{
  isHistoryTable: boolean;
  trade: IGQLHistory;
  marketPrice: any;
  configData: IMarket;
}> = ({ isHistoryTable, trade, marketPrice, configData }) => {
  const decimals = configData.price_precision.toString().length - 1;

  if (isHistoryTable) {
    if (trade.state === BetState.active) {
      const computedExpiryPrice = expiryPriceCache?.[trade.optionID];

      if (computedExpiryPrice)
        return (
          <CellContent
            content={[
              computedExpiryPrice ? (
                <Display
                  data={divide(computedExpiryPrice, 8)}
                  precision={decimals}
                  unit={configData.token2}
                  className="justify-self-start content-start w-fit"
                />
              ) : (
                '-'
              ),
            ]}
          />
        );
      else {
        return <>Fetching Price</>;
      }
    }
    return (
      <CellContent
        content={[
          trade.expirationPrice ? (
            <Display
              data={divide(trade.expirationPrice, 8)}
              precision={decimals}
              unit={configData.token2}
              className="justify-self-start content-start w-fit"
            />
          ) : (
            '-'
          ),
        ]}
      />
    );
  }

  return (
    <CellContent
      content={[
        <Display
          data={getPriceFromKlines(marketPrice, configData)}
          precision={decimals}
          unit={configData.token2}
          className="justify-self-start content-start w-fit"
        />,
      ]}
    />
  );
};

export const ProbabilityPNL = ({
  trade,
  isHistoryTable,
  marketPrice,
  configData,
  onlyPnl = false,
}: {
  trade: IGQLHistory;
  isHistoryTable: boolean;
  marketPrice: any;
  configData: IMarket;
  onlyPnl?: boolean;
}) => {
  let currentEpoch = Math.round(new Date().getTime() / 1000);
  const net_pnl = trade.payout
    ? subtract(trade.payout, trade.totalFee)
    : subtract('0', trade.totalFee);

  if (trade.state === BetState.queued || trade.state === BetState.cancelled)
    return <CellContent content={['-']} />;

  if (isHistoryTable) {
    if (trade.state === BetState.active) {
      const computedExpiryPrice = expiryPriceCache?.[trade.optionID];
      if (!computedExpiryPrice) return <>-</>;
      const [pnl, payout] = getPendingData(trade, computedExpiryPrice);
      if (onlyPnl)
        return (
          <span
            className={`nowrap flex ${
              lt(pnl, '0') ? 'text-red' : 'text-green'
            }`}
          >
            <Display
              data={divide(
                pnl.toString(),
                (trade.depositToken as IToken).decimals
              )}
              unit={(trade.depositToken as IToken).name}
            />
          </span>
        );

      return (
        <div className="flex flex-row items-center gap-x-8">
          <div className="flex flex-col items-start">
            <Display
              unit={(trade.depositToken as IToken).name}
              data={divide(
                payout.toString(),
                (trade.depositToken as IToken).decimals
              )}
              className="f15 weight-400"
            />
            <div className="flex content-sbw full-width">
              <span
                className={`nowrap flex ${
                  lt(pnl, '0') ? 'text-red' : 'text-green'
                }`}
              >
                Net PnL :&nbsp;{' '}
                <Display
                  data={divide(
                    pnl.toString(),
                    (trade.depositToken as IToken).decimals
                  )}
                  unit={(trade.depositToken as IToken).name}
                />
              </span>
            </div>
          </div>
        </div>
      );
    }
    if (onlyPnl)
      return (
        <span
          className={`nowrap flex ${+net_pnl < 0 ? 'text-red' : 'text-green'}`}
        >
          <Display
            data={divide(net_pnl, (trade.depositToken as IToken).decimals)}
            unit={(trade.depositToken as IToken).name}
          />
        </span>
      );

    return (
      <div className="flex flex-row items-center gap-x-8">
        <div className="flex flex-col items-start">
          <Display
            unit={(trade.depositToken as IToken).name}
            data={divide(trade.payout, (trade.depositToken as IToken).decimals)}
            className="f15 weight-400"
          />
          <div className="flex content-sbw full-width">
            <span
              className={`nowrap flex ${
                +net_pnl < 0 ? 'text-red' : 'text-green'
              }`}
            >
              Net PnL :&nbsp;{' '}
              <Display
                data={divide(net_pnl, (trade.depositToken as IToken).decimals)}
                unit={(trade.depositToken as IToken).name}
              />
            </span>
          </div>
        </div>
      </div>
    );
  }
  let price = getPriceFromKlines(marketPrice, configData);
  if (typeof price === 'string') {
    price = +price;
  }
  const probability =
    BlackScholes(
      true,
      trade.isAbove,
      price,
      +trade.strike / PRICE_DECIMALS,
      +trade.expirationTime - currentEpoch,
      0,
      IV / 1e4
    ) * 100;

  return (
    <CellInfo
      labels={[
        +trade.expirationTime > currentEpoch ? (
          <Display data={probability} unit={'%'} />
        ) : (
          '-'
        ),
      ]}
      whiteIdx={0}
    />
  );
};

export const TradeSize: React.FC<{
  trade: IGQLHistory;
}> = ({ trade }) => {
  return (
    <CellInfo
      labels={[
        <Display
          data={divide(trade.totalFee, (trade.depositToken as IToken).decimals)}
          unit={(trade.depositToken as IToken).name}
          className="text-1"
        />,
      ]}
      whiteIdx={0}
    />
  );
};

export const Share: React.FC<{
  data: IGQLHistory;
}> = ({ data }) => {
  const [, setIsOpen] = useAtom(SetShareStateAtom);
  const [, setBet] = useAtom(SetShareBetAtom);

  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        setIsOpen(true);
        setBet({
          trade: data,
          expiryPrice:
            data.state === BetState.active
              ? expiryPriceCache[data.optionID]
              : data.expirationPrice,
        });
      }}
    >
      <ShareIcon />
    </button>
  );
};
