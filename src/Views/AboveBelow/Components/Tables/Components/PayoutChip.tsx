import FailedSuccessIcon from '@Assets/Elements/FailedSuccess';
import SuccessIcon from '@Assets/Elements/SuccessIcon';
import FailureIcon from '@SVG/Elements/FailureIcon';
import { divide, gt, subtract } from '@Utils/NumString/stringArithmatics';
import { BetState } from '@Views/AboveBelow/Hooks/useAheadTrades';
import {
  IGQLHistory,
  expiryPriceCache,
} from '@Views/AboveBelow/Hooks/usePastTradeQuery';
import NumberTooltip from '@Views/Common/Tooltips';
import { TradeType } from '@Views/TradePage/type';

function isTradeType(data: IGQLHistory | TradeType): data is TradeType {
  return (data as TradeType).environment !== undefined;
}

export const PayoutChip: React.FC<{
  data: IGQLHistory | TradeType;
  className?: string;
}> = ({ data, className = '' }) => {
  let net_pnl: string | null = null;
  let isPending = false;
  let isWin = false;
  let isCancelled = false;
  let isQueued = false;
  let betExpiryPrice: string | undefined = undefined;
  if (!isTradeType(data)) {
    net_pnl = data.payout
      ? divide(subtract(data.payout, (data.totalFee ?? '0') as string), 18)
      : divide(subtract('0', (data.totalFee ?? '0') as string), 18);

    isPending = data.state === BetState.active;
    isWin = gt(net_pnl as string, '0');
    isCancelled = data.state === BetState.cancelled;
    isQueued = data.state === BetState.queued;

    betExpiryPrice = expiryPriceCache?.[data.optionID as string];
    if (isPending && betExpiryPrice) {
      if (data.isAbove) {
        isWin = gt(betExpiryPrice, data.strike);
      } else {
        isWin = !gt(betExpiryPrice, data.strike);
      }
    }
  } else {
    net_pnl = data.payout
      ? divide(subtract(data.payout, (data.trade_size ?? '0') as string), 18)
      : divide(subtract('0', (data.trade_size ?? '0') as string), 18);
    isPending = false;
    isWin = gt(net_pnl as string, '0');
    isCancelled = data.is_cancelled;
    isQueued = data.state === 'QUEUED';
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
        icon: <FailedSuccessIcon width={14} height={14} />,
        textColor: 'text-red',
      };
  }

  // if (data.state === BetState.active) {
  //   return null;
  // }
  return (
    <NumberTooltip content={getChipContent().tooltip}>
      <div
        className={`flex sm:flex-row-reverse items-center justify-between w-max web:pl-3 web:pr-[6px] web:py-2 web:bg-2 rounded-[5px] ${className}`}
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
