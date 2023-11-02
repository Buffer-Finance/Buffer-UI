import { getCallId } from '@Utils/Contract/multiContract';
import { useCall2Data } from '@Utils/useReadCall';
import { ethers } from 'ethers';
import { useAtomValue } from 'jotai';
import { useMemo } from 'react';
import useSWR from 'swr';
import { createPublicClient, http } from 'viem';
import routerAbi from '../ABIs/NoLossRouter.json';
import optionsAbi from '../ABIs/OptionsABI.json';
import { activeChainAtom } from '../atoms';
import { getLogs } from '../helpers/getLogs';
import { getNoLossV3Config } from '../helpers/getNolossV3Config';
import { IGQLHistory } from './usePastTradeQuery';
const routerIfc = new ethers.utils.Interface(routerAbi);

enum Link {
  Router = 0,
  Option = 1,
}
export interface RawLog {
  topics: Array<string>;
  data: string;
  transactionIndex: number;
  logIndex: number;
  address: string;
  blockNumber: number;
}
export interface Log {
  topic: string;
  address: string;
  args: string;
  blockNumber: number;
}

export enum BetState {
  active = 1,
  exercised = 2,
  expired = 3,
  queued = 4,
  cancelled = 5,
}

const CallConfig = {
  [Link.Router]: { abi: routerAbi, functionName: 'queuedTrades' },
  [Link.Option]: { abi: optionsAbi, functionName: 'options' },
};
export interface TradeInputs {
  id: number;
  state: BetState;
  blockNumber: number;
  link: Link;
  address: string;
}

const testAcc =
  '0x00000000000000000000000032a49a15f8ee598c1eedc21138deb23b391f425b';
('0xc977c5c0c972f982a1184c34ffef73f4c4a8ef2876956f704ed91b4ab6af0004');
interface IRouterOption {
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
  userQueueIndex: number;
}
interface ILogTrade extends IRouterOption {
  createdAt: string;
  expiration: string;
}

const parseId = (n) => {
  return parseInt(n.toString());
};

const optionsIfc = new ethers.utils.Interface(optionsAbi);
// TODO = Make these topics dynamic
// For 7.5k blocks  it is taking 1.5s to scan
const openTrade =
  '0x277b2c03e846b9440fc7acc69bbc99c7e9ff528bc2317b61bc7aacc92923005e';
const createTopic =
  '0x1bbfc9eb113af4226de738bd6f2c94b98c4618014c7d65650e0b5d179697bf27';
const initiateTrade =
  '0xf1a94b570b334fe3f40ce034179ad1035f6e2e25fa052bddecfc3df9daf6fa89';

const cancelTrade =
  '0x4fd0b12c63928d90d39e46144c6b88f9ff4c5bcfef779a67d9fd98649b381307';

const useAheadTrades = (
  startBlock: number,
  account: string,
  shouldNotFilterAccount?: boolean
) => {
  // const signer = useSignerOrPorvider();
  const activeChain = useAtomValue(activeChainAtom);

  const client = createPublicClient({
    batch: {
      multicall: true,
    },
    chain: activeChain,
    transport: http(),
  });

  const recentBlock = null;
  const { data } = useSWR(
    `${account}-augmentatio-v1-alltrades-${shouldNotFilterAccount}-activeChain-${activeChain?.id}`,
    {
      fetcher: async (args) => {
        if (!activeChain) return -1;
        const config = getNoLossV3Config(activeChain?.id);
        let splittedArgs = args.split('-');
        let restTopics = -1;
        if (!shouldNotFilterAccount) {
          const account = splittedArgs[0];
          if (!account) return -1;
          const splittedAccount = account.split('0x');
          const adds64 = `0x${splittedAccount[0]}${splittedAccount[1].padStart(
            64,
            '0'
          )}`;
          restTopics = [adds64];
        }
        if (!startBlock) return [];

        const decodedLogs = await getLogs({
          ifcs: [routerIfc, optionsIfc],
          events: {
            [createTopic]: 1,
            [initiateTrade]: 0,
            [cancelTrade]: 0,
            [openTrade]: 0,
          },
          client: client,
          restTopics,
          fromBlock: startBlock,
          toBlock: recentBlock,
          routerAddress: config.router,
        });
        const qid2status: { [id: number]: TradeInputs } = {};
        const toFetchIdData: TradeInputs[] = [];
        const toDeleteData: TradeInputs[] = [];

        // add all inititated in qid2status
        decodedLogs[initiateTrade]?.forEach((log) => {
          qid2status[parseId(log.args[1])] = {
            id: BetState.queued,
            blockNumber: log.blockNumber,
            state: BetState.queued,
            link: Link.Router,
            address: log.address,
          };
        });

        // Update cancelTrade status and add toFetch array to fetch there data.
        decodedLogs[cancelTrade]?.forEach((xtrade) => {
          const tradeEvent = {
            id: parseId(xtrade.args[1]),
            state: BetState.cancelled,
            blockNumber: xtrade.blockNumber,
            link: Link.Router,
            address: xtrade.address,
          };
          qid2status[parseId(xtrade.args[1])] = tradeEvent;
          toDeleteData.push(tradeEvent);
        });

        // Update openTrade's status and add toFetch array to fetch there data.
        decodedLogs[openTrade]?.forEach((otrade) => {
          const tradeEvent = {
            id: parseId(otrade.args[1]),
            state: BetState.active,
            blockNumber: otrade.blockNumber,
            link: Link.Router,
            address: otrade.address,
          };
          qid2status[parseId(otrade.args[1])] = tradeEvent;
          toDeleteData.push(tradeEvent);
        });

        // filter out all leftout trades which are still queued and not resolved.
        for (let id in qid2status) {
          if (qid2status[id].state == BetState.queued) {
            toFetchIdData.push({
              id: +id,
              state: BetState.queued,
              blockNumber: qid2status[id].blockNumber,
              link: Link.Router,
              address: qid2status[id].address,
            });
          }
        }

        //Take out create trades from latest create event
        decodedLogs[createTopic]?.forEach((createTradeEvent) => {
          const tradeEvent = {
            id: parseId(createTradeEvent.args[1]),
            state: BetState.active,
            blockNumber: createTradeEvent.blockNumber,
            link: Link.Option,
            address: createTradeEvent.address,
          };
          toFetchIdData.push(tradeEvent);
        });

        return {
          calls: toFetchIdData.map((data) => ({
            address: data.address,
            name: CallConfig[data.link].functionName,
            params: [data.id.toString()],
            abi: CallConfig[data.link].abi,
            id: getCallId(
              data.address,
              CallConfig[data.link].functionName,
              data.id.toString()
            ),
          })),
          toFetchIdData,
          toDeleteData,
        };
      },
      refreshInterval: 300,
    }
  );

  // let tempRes = await multicallv2(
  //   calls,
  //   signer,
  //   multicall,
  //   `augmentation-${startBlock}`
  // );
  // let resCopy = getDeepCopy(tempRes);
  // console.log(resCopy, 'resCopy');
  // convertBNtoString(resCopy);

  const { data: resCopy } = useCall2Data(
    data !== undefined && data !== -1 ? data.calls : undefined,
    `augmentation-${startBlock}`
  );

  const response = useMemo(() => {
    // const maliciousResponse = calls.filter((c, i) => {
    //   const res = resCopy?.[i];
    //   if (
    //     res.targetContract ===
    //       '0x0000000000000000000000000000000000000000' ||
    //     res?.expiration == '0' ||
    //     res?.expiration == 0
    //   ) {
    //     console.log('[bug:aug]culprit-found 1', res, calls?.[i]);
    //     return true;
    //   }
    //   return false;
    // });
    // if (maliciousResponse.length > 0) {
    //   tempRes = await multicallv2(calls, signer);
    //   resCopy = getDeepCopy(tempRes);
    //   convertBNtoString(resCopy);
    // }
    if (!resCopy) return -1;
    if (data === undefined) return -1;
    if (data === -1) return -1;

    let tempOptions: IGQLHistory[] = data.calls.map((c, i) => {
      const ip = data.toFetchIdData[i];

      let res: ILogTrade = resCopy?.[c.id]?.[0];
      if (!res) return null;
      console.log(res, resCopy, c.id, ip.link, 'res');
      // if (
      //   res.targetContract ===
      //     '0x0000000000000000000000000000000000000000' ||
      //   res?.expiration == '0' ||
      //   res?.expiration == 0
      // ) {
      //   console.log('[bug:aug]culprit-found 2', res, ip);
      //   return null;
      // }
      if (ip.link == Link.Option) {
        return {
          strike: res[1],
          totalFee: res[7],
          state: BetState.active,
          isAbove: res[6],
          optionContract: {
            address: ip.address,
          },
          amount: res[2],
          blockNumber: ip.blockNumber,
          creationTime: res[8],
          expirationTime: res[5],
          user: {
            address: account,
          },
          optionID: ip.id?.toString(),

          isQueued: false,
        };
      } else {
        return {
          strike: res[7],
          totalFee: res[3],
          state: ip.state,
          isAbove: res[5],
          optionContract: {
            address: res[6],
            // asset: "ETH",
          },
          user: {
            address: account,
          },
          blockNumber: ip.blockNumber,
          slippage: res[8],
          queueID: res[0],
          isQueued: res[10],
        };
      }
    });
    // filter out null values
    tempOptions = tempOptions.filter((x) => x);
    let tempState = {
      [BetState.cancelled]: tempOptions.filter(
        (single) => single.state === BetState.cancelled
      ),
      [BetState.queued]: tempOptions.filter(
        (single) => single.state === BetState.queued
      ),
      [BetState.active]: tempOptions.filter(
        (single) => single.state === BetState.active
      ),
      ['del']: data.toDeleteData,
      fromBlock: startBlock,
      toBlock: recentBlock,
    };

    return tempState;
  }, [resCopy]);
  return response;
};

export { useAheadTrades };
