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
