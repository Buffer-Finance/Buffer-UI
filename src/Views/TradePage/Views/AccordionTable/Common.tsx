import {
  getDisplayDate,
  getDisplayDateUTC,
  getDisplayTime,
  getDisplayTimeUTC,
} from '@Utils/Dates/displayDateTime';
import { CellContent } from '@Views/Common/BufferTable/CellInfo';
import NumberTooltip from '@Views/Common/Tooltips';
import { BlackScholes } from '@Utils/Formulas/blackscholes';
import { GreyBtn } from '@Views/Common/V2-Button';
import {
  OngoingTradeSchema,
  TradeType,
  marketType,
} from '@Views/TradePage/type';
import { Display } from '@Views/Common/Tooltips/Display';
import InfoIcon from '@SVG/Elements/InfoIcon';
import {
  add,
  divide,
  multiply,
  subtract,
  toFixed,
} from '@Utils/NumString/stringArithmatics';
import styled from 'styled-components';

export const DisplayTime = ({ ts }: { ts: number | string }) => {
  return (
    <NumberTooltip
      content={`${getDisplayTimeUTC(+ts)} ${getDisplayDateUTC(+ts)} UTC`}
    >
      <div className="w-max">
        <CellContent
          content={[`${getDisplayTime(+ts)}`, `${getDisplayDate(+ts)}`]}
        />
      </div>
    </NumberTooltip>
  );
};

export const getProbability = (
  trade: OngoingTradeSchema,
  price: number,
  expiryTs?: string
) => {
  let currentEpoch = Math.round(Date.now() / 1000);
  const IV = 1.2;
  let expiryTime = getExpiry(trade, expiryTs);

  return getProbabilityByTime(trade, price, currentEpoch, expiryTime);
};

export const getProbabilityByTime = (
  trade: OngoingTradeSchema,
  price: number,
  currentTime: number,
  expirationTime: number
) => {
  const probability =
    BlackScholes(
      true,
      trade.is_above,
      price,
      +trade.strike / 100000000,
      expirationTime - currentTime,
      0,
      12000 / 10000
    ) * 100;

  return probability;
};

export const queuedTradeFallBack = (
  trade: OngoingTradeSchema,
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
  '!text-1 !h-auto !py-2 !px-3 !text-f12 !mr-2 !w-fit';

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

export const StrikePriceComponent = ({
  trade,
  configData,
}: {
  trade: OngoingTradeSchema;
  configData: marketType;
}) => {
  const cachedPrices = useAtomValue(queuets2priceAtom);

  const { isPriceArrived, strikePrice } = getStrike(trade, cachedPrices);
  console.log(`Common-isPriceArrived: `, isPriceArrived, strikePrice);
  if (!configData) return <></>;
  const decimals = 2;
  return (
    <>
      <Display
        data={divide(strikePrice, 8)}
        // unit={configData.token1}
        precision={decimals}
        className={`justify-self-start content-start  w-max`}
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
  option: OngoingTradeSchema;
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

import NoMatchFound from 'src/SVG/Elements/NoMatchFound';
import { useAtomValue } from 'jotai';
import { queuets2priceAtom } from '@Views/TradePage/atoms';

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

export const getExpiry = (trade: OngoingTradeSchema, deb?: string) => {
  deb && console.log('TableComponents-deb-close' + deb, trade);
  return trade.close_time || trade.queued_timestamp + trade.period;
};
export const getStrike = (trade: OngoingTradeSchema, cachedPrice: any) => {
  let strikePrice = trade.strike;
  const isPriceArrived = cachedPrice?.[trade.queue_id];
  if (trade.state == 'QUEUED' && isPriceArrived) {
    strikePrice = cachedPrice?.[trade.queue_id];
  }

  return { isPriceArrived, strikePrice };
};

export const getLockedAmount = (trade: TradeType, cachedPrices: any) => {
  return (
    trade.locked_amount || cachedPrices?.[trade.market.tv_id + trade.trade_size]
  );
};
