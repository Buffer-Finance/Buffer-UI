import {
  add,
  divide,
  gt,
  lte,
  multiply,
  subtract,
} from '@Utils/NumString/stringArithmatics';
import axios from 'axios';

export async function fetchAllTradesOfTheDay(
  baseURL: string,
  startTimeStamp: number,
  endTimestamp: number
) {
  const query = `{
        userOptionDatas(first: 400

            orderBy: creationTime
            orderDirection: desc
            where: {
            creationTime_gte: ${startTimeStamp},
            creationTime_lte: ${endTimestamp},
            depositToken: "USDC",
            state_not: 1          }) {
            id
            optionContract {
              category
              id
              address
              isPaused
              openUp
              openDown
              openInterest
              tradeCount
              volume
              currentUtilization
              token
              asset
              pool
              poolContract
            }
            optionID
            strike
            totalFee
            user {
              id
              address
            }
            creationTime
            expirationPrice
            payout
            state
            amount
            expirationTime
            depositToken
            settlementFee
            lag
            poolToken
            queueID
            closeTime
          }
    }`;

  const response = await axios.post(baseURL, {
    query,
  });
  console.log(response, 'test-userNetPnlUSDC-fetchAllTradesOfTheDay');
  // return response.data.data.userOptionDatas;
  return response.data.data.userOptionDatas;
}

function calculateUserNetPNL(allTrades) {
  let profit = '0';
  let loss = '0';
  let earlyClosedTrades = 0;
  let expiredTrades = 0;
  let excerisedTrades = 0;
  allTrades.forEach((trade) => {
    const settlementFee = trade.settlementFee;
    const totalFee = trade.totalFee;
    const payout = trade.payout || '0';
    const premium = subtract(totalFee, settlementFee);
    if (payout === '0') {
      loss = add(loss, premium);
      expiredTrades++;
    } else if (payout === multiply(premium, '2')) {
      profit = add(profit, premium);
      excerisedTrades++;
    } else if (lte(payout, premium)) {
      loss = add(loss, subtract(premium, payout));
      earlyClosedTrades++;
    } else if (gt(payout, premium)) {
      profit = add(profit, subtract(payout, premium));
      earlyClosedTrades++;
    } else {
      console.log('test-userNetPnlUSDC-error', trade);
    }

    // console.log(payout, premium, userNetPNL, "test-userNetPnlUSDC");
  });
  console.log(
    earlyClosedTrades,
    excerisedTrades,
    expiredTrades,
    'test-userNetPnlUSDC-earlyClosedTrades'
  );
  return divide(subtract(profit, loss), 6) as string;
}

async function fetchUsersNetPNL(
  baseURL: string,
  startTimeStamp: number,
  endTimestamp: number
) {
  const query = `{
    tradingStats(
        orderBy: timestamp
        orderDirection: desc
        first: 10000
        where: { period: daily,timestamp_gte: ${startTimeStamp}, timestamp_lte: ${endTimestamp}}
        subgraphError: allow
    ) {
      lossUSDC
      profitUSDC
      profitCumulativeUSDC
      timestamp
      lossCumulativeUSDC
    }
  
    }`;

  const response = await axios.post(baseURL, {
    query,
  });
  console.log(response, 'test-userNetPnlUSDC-fetchUsersNetPNL');
  return response.data.data.tradingStats;
}

function calculateTradesNetPNL(stats) {
  const lastStat = stats[0];
  return divide(subtract(lastStat.profitUSDC, lastStat.lossUSDC), 6) as string;
}

async function matchUsersAndTradesPnlOfTheDay() {
  try {
    const allTrades = await fetchAllTradesOfTheDay(
      'https://subgraph.satsuma-prod.com/e66b06ce96d2/bufferfinance/arbitrum-sandbox-testnet/version/v0.0.5-lp-profit-lp-loss/api',
      1693929600,
      1694016000
    );
    const userNetPNL = calculateUserNetPNL(allTrades);
    const tradersStats = await fetchUsersNetPNL(
      'https://subgraph.satsuma-prod.com/e66b06ce96d2/bufferfinance/arbitrum-sandbox-testnet/version/v0.0.5-lp-profit-lp-loss/api',
      1693929600,
      1694016000
    );
    const tradesNetPNL = calculateTradesNetPNL(tradersStats);
    console.log(
      userNetPNL,
      tradesNetPNL,
      userNetPNL == tradesNetPNL,
      'test-userNetPnlUSDC-final-pnls'
    );
    return userNetPNL == tradesNetPNL;
  } catch (e) {
    console.log(e, 'test-userNetPnlUSDC-Exception');
  }
  return false;
}
export { matchUsersAndTradesPnlOfTheDay };
