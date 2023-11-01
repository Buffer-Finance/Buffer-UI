import { multicallv2 } from '@Utils/Contract/multiContract';
import getDeepCopy from '@Utils/getDeepCopy';
import { convertBNtoString, useSignerOrPorvider } from '@Utils/useReadCall';
import { ethers } from 'ethers';
import useSWR from 'swr';
import routerAbi from '../ABIs/NoLossRouter.json';
import optionsAbi from '../ABIs/OptionsABI.json';
import { getLogs } from '../helpers/getLogs';
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
  '0x46961a5320eafc3fb71b3051774237104d4cec1687a31eed0c32262f0be47902';
const createTopic =
  '0xe3a07e2ac405f9c908f600ba464ed28dd28f04e308ccc0610a33ca7ed1c59abb';
const initiateTrade =
  '0xa058ea17deb3dad493dcf014f030710e90240e4bf900bace442ac371365ac3ec';

const cancelTrade =
  '0xc804e178cb25d48cffff5de67dd01d385e72784ce35bbc52affad3e13dfa269a';

const useAheadTrades = (
  startBlock: number,
  account: string,
  shouldNotFilterAccount?: boolean
) => {
  const signer = useSignerOrPorvider();
  const multicall = '0x842eC2c7D803033Edf55E478F461FC547Bc54EB2';
  // const { data: recentBlock } = useBlockNumber();
  const recentBlock = null;
  return useSWR(
    `${account}-augmentatio-v1-alltrades-${shouldNotFilterAccount}`,
    {
      fetcher: async (args) => {
        let splittedArgs = args.split('-');
        let restTopics = [];
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
        if (!startBlock) return -1;
        // if (recentBlock <= startBlock) return baseState;

        const decodedLogs = await getLogs({
          ifcs: [routerIfc, optionsIfc],
          events: {
            [createTopic]: 1,
            [initiateTrade]: 0,
            [cancelTrade]: 0,
            [openTrade]: 0,
          },
          provider: signer,
          restTopics,
          fromBlock: startBlock,
          toBlock: recentBlock,
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
        // TODO Update multicall address
        const calls = toFetchIdData.map((data) => ({
          address: data.address,
          name: CallConfig[data.link].functionName,
          params: [data.id.toString()],
          abi: CallConfig[data.link].abi,
        }));
        let tempRes = await multicallv2(
          calls,
          signer,
          multicall,
          `augmentation-${startBlock}`
        );
        let resCopy = getDeepCopy(tempRes);

        convertBNtoString(resCopy);
        const maliciousResponse = calls.filter((c, i) => {
          const res = resCopy?.[i];
          if (
            res.targetContract ===
              '0x0000000000000000000000000000000000000000' ||
            res?.expiration == '0' ||
            res?.expiration == 0
          ) {
            console.log('[bug:aug]culprit-found 1', res, calls?.[i]);
            return true;
          }
          return false;
        });
        if (maliciousResponse.length > 0) {
          tempRes = await multicallv2(calls, signer);
          resCopy = getDeepCopy(tempRes);
          convertBNtoString(resCopy);
        }
        let tempOptions: IGQLHistory[] = calls.map((c, i) => {
          const ip = toFetchIdData[i];

          let res: ILogTrade = resCopy?.[i];

          if (
            res.targetContract ===
              '0x0000000000000000000000000000000000000000' ||
            res?.expiration == '0' ||
            res?.expiration == 0
          ) {
            console.log('[bug:aug]culprit-found 2', res, ip);
            return null;
          }
          if (ip.link == Link.Option) {
            return {
              strike: res[1],
              totalFee: res.totalFee,
              state: BetState.active,
              depositToken: 'USDC',
              isAbove: res.isAbove,
              optionContract: {
                address: ip.address,
              },
              amount: res[2],
              blockNumber: ip.blockNumber,
              creationTime: res.createdAt,
              expirationTime: res.expiration,
              user: {
                address: account,
              },
              optionID: ip.id?.toString(),

              isQueued: false,
            };
          } else {
            return {
              strike: res.expectedStrike,
              totalFee: res.totalFee,
              state: ip.state,
              depositToken: 'USDC',
              isAbove: res.isAbove,
              optionContract: {
                address: res.targetContract,
                // asset: "ETH",
              },
              user: {
                address: account,
              },
              blockNumber: ip.blockNumber,
              slippage: res.slippage,
              queueID: res.queueId,
              isQueued: res.isQueued,
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
          ['del']: toDeleteData,
          fromBlock: startBlock,
          toBlock: recentBlock,
        };

        return tempState;
      },
      refreshInterval: 300,
    }
  );
  // return data || baseState;
};

export { useAheadTrades };
