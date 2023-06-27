import { OngoingTradeSchema, marketType, poolInfoType } from '../type';
import { divide, lt } from '@Utils/NumString/stringArithmatics';
import { Display } from '@Views/Common/Tooltips/Display';
import { getDisplayTime } from '@Utils/Dates/displayDateTime';
import { getPrice } from '../Hooks/useBuyTradeActions';
import { getExpiry } from '../Views/AccordionTable/Common';

export const getExpireNotification = async (
  currentRow: OngoingTradeSchema,
  tradeMarket: marketType,
  toastify: (a: any) => void,
  openShareModal: (
    trade: OngoingTradeSchema,
    expiry: string,
    market: marketType,
    poolInfo: poolInfoType
  ) => void,
  poolInfo: poolInfoType
) => {
  try {
    const query = {
      pair: tradeMarket.tv_id,
      timestamp: getExpiry(currentRow),
    };
    console.log(`TableComponents-query: `, query);
    const expiryPrice = await getPrice(query);
    console.log(`TableComponents-expiryPrice: `, expiryPrice, currentRow);
    let win = true;
    if (lt(currentRow.strike + '', expiryPrice)) {
      if (currentRow.is_above) {
        win = true;
      } else {
        win = false;
      }
    } else if (currentRow.strike == expiryPrice) {
      //to be asked
      win = false;
    } else {
      if (currentRow.is_above) {
        win = false;
      } else {
        win = true;
      }
    }
    console.log(`TableComponents-win: `, win);

    if (win) {
      openShareModal(currentRow, expiryPrice.toString(), tradeMarket, poolInfo);
      return;
    } else {
      const openTimeStamp = currentRow.queued_timestamp;
      const closeTimeStamp = +currentRow.expiration_time!;
      console.log(
        `TableComponents-openTimeStamp: `,
        openTimeStamp,
        closeTimeStamp
      );

      toastify({
        type: 'loss',
        // inf: true,
        msg: (
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
                  className={'text-red !whitespace-nowrap '}
                  data={'-' + divide(currentRow.trade_size, 6)}
                  unit={'USDC'}
                />
              </span>
            </div>
            <div className="nowrap f12 mt5 text-6 @whitespace-nowrap">
              {getDisplayTime(openTimeStamp)} -&nbsp;
              {getDisplayTime(closeTimeStamp)}
            </div>
          </div>
        ),
        id: currentRow.queue_id,
      });
    }
  } catch (e) {
    console.log('TableComponents-err', e);
  }
};
