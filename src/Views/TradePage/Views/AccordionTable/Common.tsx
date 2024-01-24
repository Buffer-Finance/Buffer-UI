import InfoIcon from '@SVG/Elements/InfoIcon';
import {
  getDisplayDate,
  getDisplayDateUTC,
  getDisplayTime,
  getDisplayTimeUTC,
} from '@Utils/Dates/displayDateTime';
import { BlackScholes } from '@Utils/Formulas/blackscholes';
import {
  add,
  divide,
  multiply,
  subtract,
  toFixed,
} from '@Utils/NumString/stringArithmatics';
import { CellContent } from '@Views/Common/BufferTable/CellInfo';
import NumberTooltip from '@Views/Common/Tooltips';
import { Display } from '@Views/Common/Tooltips/Display';
import { GreyBtn } from '@Views/Common/V2-Button';
import { TradeType } from '@Views/TradePage/type';
import styled from '@emotion/styled';

export const DisplayTime = ({
  ts,
  className,
  reverse = false,
}: {
  ts: number | string;
  className?: string;
  reverse?: boolean;
}) => {
  const content = reverse
    ? [`${getDisplayDate(+ts)}`, `${getDisplayTime(+ts)}`]
    : [`${getDisplayTime(+ts)}`, `${getDisplayDate(+ts)}`];
  return (
    <NumberTooltip
      content={`${getDisplayTimeUTC(+ts)} ${getDisplayDateUTC(+ts)} UTC`}
    >
      <div className={`w-max ${className}`}>
        <CellContent content={content} />
      </div>
    </NumberTooltip>
  );
};

export const getProbability = (
  trade: TradeType,
  price: number,
  IV: number,
  expiryTs?: string
) => {
  let currentEpoch = Math.round(Date.now() / 1000);
  let expiryTime = getExpiry(trade, expiryTs);

  return getProbabilityByTime(trade, price, currentEpoch, expiryTime, IV);
};

export const getProbabilityByTime = (
  trade: TradeType,
  price: number,
  currentTime: number,
  expirationTime: number,
  IV: number
) => {
  const probability =
    BlackScholes(
      true,
      trade.is_above,
      price,
      +trade.strike / 100000000,
      expirationTime - currentTime,
      0,
      IV
    ) * 100;

  return probability;
};

export const queuedTradeFallBack = (
  trade: TradeType,
  icon?: boolean,
  custom?: boolean
) => {
  if (trade.state == 'QUEUED') {
    if (icon)
      return (
        <NumberTooltip content={'The trade is queued.'}>
          <div className="flex items-center gap-x-[3px]">
            <img
              src="/Gear.png"
              className="transition-transform animate-spin"
            />
            <span className="text-2">Queued</span>
          </div>
        </NumberTooltip>
      );
    if (custom) return true;
    return '-';
  }
  return null;
};
export const tableButtonClasses =
  'text-1 !h-auto !py-2 !px-3 !text-f12 !mr-2 !w-fit';

export const TableButton = (props: any) => {
  return (
    <GreyBtn {...props} className="!text-1 !p-2">
      {props.children}
    </GreyBtn>
  );
};

interface ITableHeads {
  children: string | JSX.Element;
  tooltip?: string;
  style?: string;
}

const TableHeads: React.FC<ITableHeads> = ({ children, style, tooltip }) => {
  return (
    <div className={`f14 capitialize ${style}`}>
      {children}
      {tooltip && (
        <img src="/PredictionGames/info.svg" alt="" className="info-tooltip" />
      )}
    </div>
  );
};
interface ITableHeader {
  col: number;
  headsArr: (string | JSX.Element)[];
  className?: string;
  firstColClassName?: string;
}
export const TableHeader: React.FC<ITableHeader> = ({
  col,
  headsArr,
  className,
  firstColClassName,
}) => {
  if (col > headsArr.length) return <div>Unhandled col of header</div>;
  return (
    <TableHeads
      style={col === 0 ? firstColClassName + ' ' + className : className}
    >
      {headsArr[col]}
    </TableHeads>
  );
};

//  export const earlyCloseStatus = (data:TradeType)=>{
//    return data.
//  }
export const StrikePriceComponent = ({
  trade,
  className,
  spread,
}: {
  trade: TradeType;
  className?: string;
  spread: number;
}) => {
  const cachedPrices = useAtomValue(queuets2priceAtom);
  // console.log(`Common-className: `, className);

  const { isPriceArrived, strikePrice } = getStrike(
    trade,
    cachedPrices,
    spread
  );
  return (
    <>
      <Display
        data={divide(strikePrice, 8)}
        // unit={configData.token1}
        precision={trade.market.price_precision.toString().length - 1}
        className={`justify-self-start content-start  w-max ${className}`}
      />
      {trade.state === 'QUEUED' && !isPriceArrived ? (
        <div className="flex gap-2 align-center">
          <SlippageTooltip option={trade} className="mt-[2px] mr-[3px]" />
          Slippage -
          <Display
            data={divide(trade?.slippage, 2)}
            unit="%"
            className="mr-[3px]"
            precision={2}
          />
        </div>
      ) : null}
      {/* {trade.state == 'QUEUED' ? 'queued' : null} */}
    </>
  );
};

export const SlippageTooltip: React.FC<{
  option: TradeType;
  className?: string;
}> = ({ option, className }) => {
  // if (!option?.slippage || option?.strike) return <></>;
  return (
    <InfoIcon
      className={className}
      sm
      tooltip={`The strike price will be in the range of ${toFixed(
        subtract(
          divide(option.strike, 8) as string,
          divide(
            multiply(
              divide(option.strike, 8) as string,
              divide(option.slippage, 2) as string
            ),
            '100'
          ) as string
        ),

        4
      )} - ${toFixed(
        add(
          divide(option.strike, 8) as string,
          divide(
            multiply(
              divide(option.strike, 8) as string,
              divide(option.slippage, 2) as string
            ),
            '100'
          ) as string
        ),

        4
      )}`}
    />
  );
};

import { formatDistance } from '@Hooks/Utilities/useStopWatch';
import { Variables } from '@Utils/Time';
import { queuets2priceAtom } from '@Views/TradePage/atoms';
import { getSafeStrike } from '@Views/TradePage/utils/getSafeStrike';
import { useAtomValue } from 'jotai';
import NoMatchFound from 'src/SVG/Elements/NoMatchFound';
export const getEarlyCloseStatus = (
  trade: TradeType
): [status: boolean, tooltip?: string] => {
  // very edgy case when pool isnot defined.
  if (!trade.pool) return [true, `Early close isn't available for this trade!`];
  if (!trade.pool?.earlyclose.enable)
    return [true, `Early Close isn't supported for this trade!`];
  if (trade.pool.earlyclose.threshold) {
    const now = Date.now();
    const timeElapsed = Math.round(now / 1000) - trade.open_timestamp;
    if (timeElapsed < +trade.pool.earlyclose.threshold) {
      return [
        true,
        `Wait ${formatDistance(
          Variables(+trade.pool.earlyclose.threshold - timeElapsed)
        )} until early close.`,
      ];
    }
    //when trade stuck in queued state
    if (trade.state == 'QUEUED') return [true, `Trade is not open yet!`];
  }
  return [false, ''];
};
const Background = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  row-gap: 2.5rem;
  padding: 1rem 0;
  padding-bottom: 2rem;
  font-family: Relative Pro;
  .button {
    width: fit-content;
    font-size: 1.4rem;
    padding: 0.6rem 1.4rem;
    font-family: Relative Pro;
    &:hover {
      width: fit-content;
      font-size: 1.4rem;
      padding: 0.6rem 1.4rem;
    }
  }
`;

export const TableErrorRow: React.FC<{
  msg: string;
  children?: JSX.Element;
}> = ({ msg, children }) => {
  return (
    <Background className={`mt-5 `}>
      <NoMatchFound />
      {msg}
      {children}
    </Background>
  );
};

export const getExpiry = (trade: TradeType, deb?: string) => {
  return trade.close_time || trade.open_timestamp + trade.period;
};
export const getStrike = (
  trade: TradeType,
  cachedPrice: any,
  spread: number
) => {
  let strikePrice = trade.strike;
  const isPriceArrived = trade.is_limit_order
    ? false
    : cachedPrice?.[trade.queue_id];
  if (trade.state == 'QUEUED' && isPriceArrived) {
    strikePrice = getSafeStrike(
      cachedPrice?.[trade.queue_id],
      trade.is_above!,
      spread
    );
  }

  return { isPriceArrived, strikePrice };
};

export const getLockedAmount = (trade: TradeType, cachedPrices: any) => {
  return (
    trade.locked_amount || cachedPrices?.[trade.market.tv_id + trade.trade_size]
  );
};
