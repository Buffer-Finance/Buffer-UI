import { useActiveChain } from '@Hooks/useActiveChain';
import { useUserAccount } from '@Hooks/useUserAccount';
import useSWR from 'swr';
import { IGQLHistory } from './usePastTradeQuery';
import { multicallv2 } from '@Utils/Contract/multiContract';
import routerAbi from '@Views/BinaryOptions/ABI/routerABI.json';
import { convertBNtoString, useReadCall } from '@Utils/useReadCall';
import { useEffect, useMemo, useState } from 'react';
import getDeepCopy from '@Utils/getDeepCopy';
import { useProvider } from 'wagmi';
interface IGQLResponse {
  historyTrades: IGQLHistory[];
  activeTrades: IGQLHistory[];
  queuedTrades: IGQLHistory[];
  cancelledTrades: IGQLHistory[];
  historyLength: { id: string }[];
  activeLength: { id: string }[];
  cancelledLength: { id: string }[];
  _meta: {
    block: {
      number: number;
    };
  };
}

interface QueuedTrade {
  allowPartialFill: boolean;
  expectedStrike: string;
  isAbove: boolean;
  isQueued: boolean;
  period: string;
  queueId: string;
  queuedTime: string;
  referralCode: string;
  slippage: string;
  targetContract: string;
  totalFee: string;
  traderNFTId: string;
  user: string;
  userQueueIndex: string;
}
interface Options {
  amount: string;
  createdAt: string;
  expiration: string;
  isAbove: boolean;
  lockedAmount: string;
  premium: string;
  state: number;
  strike: string;
  totalFee: string;
}
interface Response {
  optionId: string;
  queueId: string;
  queuedTrade: QueuedTrade;
  option: Options;
  isCancelled: boolean;
}

const dataD = {
  historyTrades: [
    {
      amount: '10320000000000000005',
      creationTime: '1683795025',
      depositToken: 'ARB',
      expirationPrice: '2741581335821',
      expirationTime: '1683795205',
      isAbove: true,
      payout: '10320000000000000005',
      queueID: '8215',
      optionID: '52',
      state: 2,
      strike: '2739400250000',
      totalFee: '6000000000000000000',
      user: {
        address: '0xfbea9559ae33214a080c03c68ecf1d3af0f58a7d',
      },
      optionContract: {
        asset: null,
        address: '0x6406d4fb22ebac283cbdab0806684da0013615fb',
      },
    },
  ],
  activeTrades: [
    {
      amount: '9100009',
      creationTime: '1684230291',
      depositToken: 'USDC',
      expirationPrice: null,
      expirationTime: '1684230591',
      isAbove: true,
      payout: null,
      queueID: '8261',
      optionID: '2970',
      state: 1,
      strike: '2715100000000',
      totalFee: '5000000',
      user: {
        address: '0xfbea9559ae33214a080c03c68ecf1d3af0f58a7d',
      },
      optionContract: {
        asset: null,
        address: '0x0823584a67005c9855ff583fc7840d40cfb30276',
      },
    },
  ],
  cancelledTrades: [
    {
      depositToken: null,
      isAbove: true,
      queueID: '7956',
      reason: 'Wait time too high',
      state: 5,
      slippage: '50',
      strike: '6978500000',
      totalFee: '10000000',
      queueTimestamp: '1682605892',
      cancelTimestamp: '1682610543',
      user: {
        address: '0xfbea9559ae33214a080c03c68ecf1d3af0f58a7d',
      },
      optionContract: {
        asset: null,
        address: '0x70e84ab3e9fda874f0c86a3ce10ab3e5f6dc0b12',
      },
    },
  ],
};
const useAugmentedTrades = (data: IGQLResponse) => {
  console.log(`remotedata: `, data);
  const { configContracts, activeChain } = useActiveChain();
  const { address } = useUserAccount();
  const p = useProvider({ chainId: activeChain.id });

  const [upatedData, setUpdatedData] = useState(data);
  useEffect(() => {
    const interval = setInterval(async () => {
      let lastQueueId = -1;
      if (data?.queuedTrades?.length) {
        lastQueueId = data.queuedTrades[data.queuedTrades.length - 1]?.queueID;
      } else if (data?.activeTrades?.length) {
        lastQueueId = data.activeTrades?.[0].queueID;
      } else if (data?.historyTrades?.length) {
        lastQueueId = data.historyTrades?.[0].queueID;
      }
      console.log(`lastQueueId: `, lastQueueId);
      const calls = address &&
        data && [
          {
            address: configContracts.router,
            abi: routerAbi,
            name: 'getLatestUserData',
            params: [address, lastQueueId],
          },
        ];

      let t = await multicallv2(
        calls,
        p,
        configContracts.multicall,
        `dd-${address}`
      );
      let tempRes = getDeepCopy(t);

      convertBNtoString(tempRes);
      if (!tempRes) return null;
      const dataClone = JSON.parse(JSON.stringify(data));
      if (!tempRes?.length) return null;

      const updatedTrades: Response[] = tempRes[0].trades;
      updatedTrades.forEach((trade) => {
        // search for an q->a trade
        if (trade.isCancelled) {
          // cancelled option
          // q->c

          // if already in cancelled then ignore
          const foundTrade =
            data?.cancelledTrades &&
            data?.cancelledTrades.find((aTrade) => {
              return aTrade.queueID == trade.queueId;
            });
          if (!foundTrade) {
            //delete from queued
            dataClone.queuedTrades = dataClone.queuedTrades.filter((qTrade) => {
              return qTrade.queueID != trade.queueId;
            });

            // add to cancelled
            const optionsContract = {
              asset: 'BTCUSD',
              address: trade.queuedTrade.targetContract,
            };
            console.log(`optionsContract: `, optionsContract);
            const cancelledTrade: IGQLHistory = {
              depositToken: null,
              isAbove: trade.queuedTrade.isAbove,
              optionContract: optionsContract,
              queueID: trade.queueId,
              slippage: trade.queuedTrade.slippage,
              state: 5,
              strike: trade.queuedTrade.expectedStrike,
              totalFee: trade.queuedTrade.totalFee,
              augmented: true,
            };
            dataClone.cancelledTrades.push(cancelledTrade);
          }
        } else if (trade.option.strike === '0') {
          // queued option
          const foundTrade =
            data?.queuedTrades &&
            data.queuedTrades.find((qTrade) => {
              console.log(`qTrade.queueID: `, qTrade, trade);
              return qTrade.queueID == trade.queueId;
            });
          if (!foundTrade) {
            const optionsContract = {
              asset: 'BTCUSD',
              address: trade.queuedTrade.targetContract,
            };
            console.log(`optionsContract: `, optionsContract);
            const queuedTrade: IGQLHistory = {
              depositToken: null,
              isAbove: trade.queuedTrade.isAbove,
              optionContract: optionsContract,
              queueID: trade.queueId,
              slippage: trade.queuedTrade.slippage,
              state: 4,
              strike: trade.queuedTrade.expectedStrike,
              totalFee: trade.queuedTrade.totalFee,
              augmented: true,
            };
            dataClone.queuedTrades.push(queuedTrade);
          }
          // []->[q]
          // search in existing queued option if it exists or not.
        } else {
          // active option
          // q->a

          // if already in active then discard.
          const foundTrade =
            data?.activeTrades &&
            data?.activeTrades.find((aTrade) => {
              return aTrade.queueID == trade.queueId;
            });

          // can be in history
          const foundTradeInHistory = data?.historyTrades?.find((aTrade) => {
            return aTrade.queueID == trade.queueId;
          });

          if (!foundTrade && !foundTradeInHistory) {
            // delete from queued
            dataClone.queuedTrades = dataClone.queuedTrades.filter((qTrade) => {
              return qTrade.queueID != trade.queueId;
            });

            // add to active
            const optionsContract = {
              asset: 'BTCUSD',
              address: trade.queuedTrade.targetContract,
            };
            const newActiveTrade: IGQLHistory = {
              ammount: trade.option.amount,
              creationTime: trade.option.createdAt,
              depositToken: 'USDC',
              expirationPrice: null,
              expirationTime: trade.option.expiration,
              isAbove: trade.option.isAbove,
              payout: null,
              queueID: trade.queueId,
              optionID: trade.optionId,
              state: 1,
              strike: trade.option.strike,
              totalFee: trade.option.totalFee,
              user: { address: address },
              optionContract: optionsContract,
              augmented: true,
            };
            dataClone.activeTrades.push(newActiveTrade);
          }
        }
      });
      setUpdatedData(dataClone);
    }, 1000);

    return () => clearInterval(interval);
  }, [data, address, configContracts, activeChain]);
  return { data: upatedData || data };
  // return data || baseState;
};

export { useAugmentedTrades };
