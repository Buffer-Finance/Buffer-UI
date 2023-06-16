import {
  getDisplayDate,
  getDisplayDateUTC,
  getDisplayTime,
  getDisplayTimeUTC,
} from '@Utils/Dates/displayDateTime';
import { CellContent } from '@Views/Common/BufferTable/CellInfo';
import NumberTooltip from '@Views/Common/Tooltips';
import { BlackScholes } from '@Utils/Formulas/blackscholes';
import { OngoingTradeSchema } from '@Views/TradePage/Hooks/ongoingTrades';
import { baseUrl } from '@Views/TradePage/config';
import axios from 'axios';
import { GreyBtn } from '@Views/Common/V2-Button';
import { marketType } from '@Views/TradePage/type';
import { Display } from '@Views/Common/Tooltips/Display';
import InfoIcon from '@SVG/Elements/InfoIcon';
import {
  add,
  divide,
  multiply,
  subtract,
  toFixed,
} from '@Utils/NumString/stringArithmatics';

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

export const getProbability = (trade: OngoingTradeSchema, price: number) => {
  console.log(`OngoingTradesTable-price: `, price);
  let currentEpoch = Math.round(Date.now() / 1000);
  const IV = 1.2;

  const probability =
    BlackScholes(
      true,
      trade.is_above,
      price,
      +trade.strike / 1 ** 8,
      +trade.close_time - currentEpoch,
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

export const StrikePriceComponent = ({
  trade,
  configData,
}: {
  trade: OngoingTradeSchema;
  configData: marketType;
}) => {
  if (!configData) return <></>;
  const decimals = 2;
  return (
    <>
      <Display
        data={divide(trade.strike, 8)}
        unit={configData.token1}
        precision={decimals}
        className={`justify-self-start content-start  w-max`}
      />
      {trade.state === 'QUEUED' ? (
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
