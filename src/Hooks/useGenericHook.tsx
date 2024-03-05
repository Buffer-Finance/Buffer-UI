import { useToast } from '@Contexts/Toast';
import { getDisplayTime } from '@Utils/Dates/displayDateTime';
import { divide, lt, subtract } from '@Utils/NumString/stringArithmatics';
import { Display } from '@Views/Common/Tooltips/Display';
import { TradeType } from '@Views/TradePage/type';
import axios from 'axios';
import { useEffect, useRef } from 'react';

export const getIdentifier = (a: TradeType) => {
  if (a.option_id === null) return '';
  return +a.option_id + '-' + a.market.pair;
};

const useGenericHooks = (binaryData: (TradeType | null)[]) => {
  const tradeCache = useRef<{
    [tradeId: string]: { trade: TradeType; visited: boolean };
  }>({});
  // const binaryData = [];
  const toastify = useToast();

  useEffect(() => {
    const delay = 2;
    if (!binaryData) return;
    if (typeof binaryData.forEach !== 'function') return;
    for (let trade of binaryData) {
      if (!trade) return;

      if (trade.state == 'OPENED') {
        let tradeIdentifier = getIdentifier(trade);
        tradeCache.current[tradeIdentifier] = { trade, visited: true };
      }
    }
    for (let tradeIdentifier in tradeCache.current) {
      const currTrade = tradeCache.current[tradeIdentifier];
      if (!currTrade.visited) {
        console.log(`notif-called-on-currTrade: `, currTrade);
        setTimeout(() => {
          getExpireNotification({ ...currTrade.trade }, toastify);
        }, delay * 1000);
        delete tradeCache.current[tradeIdentifier];
      }
    }

    return () => {
      // make all false
      for (let tradeIdentifier in tradeCache.current) {
        tradeCache.current[tradeIdentifier] = {
          ...tradeCache.current[tradeIdentifier],
          visited: false,
        };
      }
    };
    // if some trade left with visited:false - that trade is the one for which we want to show notif
  }, [binaryData]);
};

export { useGenericHooks };

const getExpireNotification = async (currentRow: TradeType, toastify: any) => {
  let response;
  const query = {
    pair: currentRow.market.tv_id,
    timestamp: currentRow.expiration_time,
  };
  response = await axios.post(
    `https://oracle.buffer-finance-api.link/price/query/`,
    [query]
  );
  if (!response.data?.length) {
    response = await axios.post(
      `https://oracle.buffer-finance-api.link/price/query/`,
      [query]
    );
  }

  if (!Array.isArray(response.data) || !response.data?.[0]?.price) {
    return null;
  }

  const expiryPrice = response.data[0].price.toString();
  console.log(`getExpireNotification: `, currentRow, expiryPrice);

  let win = true;
  if (lt(currentRow.strike.toString(), expiryPrice)) {
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

  const openTimeStamp = currentRow.open_timestamp;
  const closeTimeStamp = +currentRow.expiration_time;
  toastify({
    type: 'loss',
    // inf: true,
    msg: (
      <div className="flex-col">
        <div className="flex whitespace-nowrap">
          {currentRow.market.token0}-{currentRow.market.token1}{' '}
          {currentRow.is_above ? 'Up' : 'Down'} @&nbsp;
          <Display
            data={divide(currentRow.strike, 8)}
            unit={currentRow.market.token1}
            className="!whitespace-nowrap"
          />
          &nbsp;
          <span
            className={`flex !whitespace-nowrap `}
            style={{ color: win ? 'var(--green)' : 'text-1' }}
          >
            (+{' '}
            <Display
              className={'text-1 !whitespace-nowrap ' + win && 'green'}
              data={
                win
                  ? divide(
                      subtract(
                        currentRow.payout as string,
                        currentRow.trade_size
                      ),
                      18
                    )
                  : 0
              }
              // unit={(currentRow.depositToken as IToken).name}
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
};
