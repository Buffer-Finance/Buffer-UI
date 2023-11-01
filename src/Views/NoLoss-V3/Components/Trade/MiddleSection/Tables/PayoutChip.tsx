import FailedSuccessIcon from '@Assets/Elements/FailedSuccess';
import SuccessIcon from '@Assets/Elements/SuccessIcon';
import FailureIcon from '@SVG/Elements/FailureIcon';
import { divide, gt, subtract } from '@Utils/NumString/stringArithmatics';
import NumberTooltip from '@Views/Common/Tooltips';
import { BetState } from '@Views/NoLoss-V3/Hooks/useAheadTrades';
import {
  IGQLHistory,
  expiryPriceCache,
} from '@Views/NoLoss-V3/Hooks/usePastTradeQuery';

export const PayoutChip: React.FC<{
  data: IGQLHistory;
  className?: string;
}> = ({ data, className = '' }) => {
  const net_pnl = data.payout
    ? divide(subtract(data.payout, data.totalFee), 18)
    : divide(subtract('0', data.totalFee), 18);

  const isPending = data.state === BetState.active;
  let isWin = gt(net_pnl as string, '0');
  const isCancelled = data.state === BetState.cancelled;
  const isQueued = data.state === BetState.queued;

  let betExpiryPrice = expiryPriceCache?.[data.optionID as string];

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
