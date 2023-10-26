import { TradeType, marketType, poolInfoType } from '../type';
import { divide, lt } from '@Utils/NumString/stringArithmatics';
import { Display } from '@Views/Common/Tooltips/Display';
import { getDisplayTime } from '@Utils/Dates/displayDateTime';
import { getCachedPrice } from '../Hooks/useBuyTradeActions';
import { getExpiry } from '../Views/AccordionTable/Common';
import { getPayout } from '../Views/AccordionTable/ShareModal/utils';

export const getExpireNotification = async (
  currentRow: TradeType,
  toastify: (a: any) => void,
  openShareModal: (
    trade: TradeType,
    expiry: string,
    market: marketType,
    poolInfo: poolInfoType
  ) => void,
  poolInfo: poolInfoType,
  shouldOpenModal: boolean
) => {
  try {
    const tradeMarket = currentRow.market as marketType;
    const query = {
      pair: tradeMarket.tv_id,
      timestamp: getExpiry(currentRow),
    };
    const expiryPrice = await getCachedPrice(query);

    let win = true;
    const { pnl } = getPayout(currentRow, expiryPrice, poolInfo.decimals);

    if (lt(pnl?.toString() ?? '0', '0')) {
      win = false;
    }

    if (win && shouldOpenModal) {
      openShareModal(currentRow, expiryPrice.toString(), tradeMarket, poolInfo);
      return;
    } else {
      const openTimeStamp = currentRow.open_timestamp;
      const closeTimeStamp = +currentRow.expiration_time!;

      toastify({
        type: !win ? 'loss' : 'success',
        msg: (
          <TradeResult
            tradeMarket={tradeMarket}
            currentRow={currentRow}
            openTimeStamp={openTimeStamp}
            closeTimeStamp={closeTimeStamp}
            isWin={win}
            pnl={pnl.toString()}
            unit={poolInfo.token}
          />
        ),
        id: currentRow.queue_id,
      });
    }
  } catch (e) {
    console.log('TableComponents-err', e);
  }
};

const TradeResult = ({
  tradeMarket,
  currentRow,
  closeTimeStamp,
  openTimeStamp,
  isWin,
  pnl,
  unit,
}: {
  tradeMarket: marketType;
  currentRow: TradeType;
  openTimeStamp: number;
  closeTimeStamp: number;
  isWin: boolean;
  pnl: string;
  unit: string;
}) => {
  return (
    <div className="flex-col">
      <div className="flex whitespace-nowrap">
        {tradeMarket?.token0}-{tradeMarket?.token1}{' '}
        {currentRow.is_above ? 'Up' : 'Down'} @&nbsp;
        <Display
          data={divide(currentRow.strike, 8)}
          unit={tradeMarket.token1}
          className="!whitespace-nowrap"
        />{' '}
        &nbsp;
        <span className={`flex !whitespace-nowrap `}>
          <Display
            className={`${
              isWin ? 'text-green' : 'text-red'
            } !whitespace-nowrap `}
            data={pnl}
            unit={unit}
          />
        </span>
      </div>
      <div className="nowrap f12 mt5 text-6 @whitespace-nowrap">
        {getDisplayTime(openTimeStamp)} -&nbsp;
        {getDisplayTime(closeTimeStamp)}
      </div>
    </div>
  );
};
