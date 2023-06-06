import { useGlobal } from '@Contexts/Global';
import { useToast } from '@Contexts/Toast';
import { useAtom, useAtomValue } from 'jotai';
import { useState } from 'react';
import ERC20ABI from 'src/ABIs/Token.json';
import { toFixed } from '@Utils/NumString';
import routerABI from '@Views/BinaryOptions/ABI/routerABI.json';
import {
  add,
  divide,
  getPosInf,
  gt,
  multiply,
} from '@Utils/NumString/stringArithmatics';
import { getPriceFromKlines } from 'src/TradingView/useDataFeed';
import { useWriteCall } from '@Hooks/useWriteCall';
import { useReferralCode } from '@Views/Referral/Utils/useReferralCode';
import { useHighestTierNFT } from '@Hooks/useNFTGraph';
import { priceAtom } from '@Hooks/usePrice';
import { isTestnet } from 'config';
import axios from 'axios';
import { useAccount, useContractEvent, useProvider, useSigner } from 'wagmi';
import { useActiveChain } from '@Hooks/useActiveChain';
import { ethers } from 'ethers';
import { arrayify, hashMessage } from 'ethers/lib/utils.js';
import { is1CTEnabled } from '@Views/OneCT/useOneCTWallet';
import secureLocalStorage from 'react-secure-storage';
import { approveModalAtom } from '@Views/BinaryOptions/PGDrawer';
import { knowTillAtom } from '@Views/BinaryOptions/Hooks/useIsMerketOpen';
import {
  getUserError,
  timeToMins,
} from '@Views/BinaryOptions/PGDrawer/TimeSelector';
import { useSwitchPool } from './useSwitchPool';
import { useBuyTradeData } from './useBuyTradeData';
import { useActiveMarket } from './useActiveMarket';
import { joinStrings } from '../utils';
import { appConfig, marketsForChart } from '../config';
import { AssetCategory } from '../type';
import { timeSelectorAtom, tradeSettingsAtom } from '../atoms';

export const useBuyTradeActions = (userInput: string) => {
  const { activeChain } = useActiveChain();
  const [settings] = useAtom(tradeSettingsAtom);
  const referralData = useReferralCode();
  const { switchPool, poolDetails } = useSwitchPool();
  const readcallData = useBuyTradeData();
  const decimals = poolDetails?.decimals;
  const balance = divide(readcallData?.balance, decimals as number) as string;
  const tokenName = poolDetails?.token;
  const res = readcallData?.user2signer;
  const tokenAddress = poolDetails?.tokenAddress;

  const [expiration] = useAtom(timeSelectorAtom);
  const provider = useProvider({ chainId: activeChain.id });
  const { highestTierNFT } = useHighestTierNFT({ userOnly: true });
  const [, setIsApproveModalOpen] = useAtom(approveModalAtom);
  const { state, dispatch } = useGlobal();
  const { activeMarket: activeAsset } = useActiveMarket();
  const marketId = joinStrings(
    activeAsset?.token0 as string,
    activeAsset?.token1 as string,
    ''
  );
  const pairName = joinStrings(
    activeAsset?.token0 as string,
    activeAsset?.token1 as string,
    '-'
  );

  const chartMarket = marketsForChart[marketId as keyof typeof marketsForChart];
  const { address } = useAccount();

  const configData =
    appConfig[activeChain.id as unknown as keyof typeof appConfig];
  const { writeCall } = useWriteCall(configData.router, routerABI);
  const { writeCall: approve } = useWriteCall(tokenAddress as string, ERC20ABI);
  const [loading, setLoading] = useState<number | { is_up: boolean } | null>(
    null
  );
  useContractEvent({
    address: configData.router,
    abi: routerABI,
    eventName: 'OpenTrade',
    listener(assetPair, optionsAddress, configAddress, ...args) {
      console.log(
        'opentrade called',
        assetPair,
        optionsAddress,
        configAddress,
        ...args
      );
    },
  });
  const marketPrice = useAtomValue(priceAtom);
  const toastify = useToast();
  const knowTill = useAtomValue(knowTillAtom);
  const option_contract = switchPool?.optionContract;
  const min_amount = switchPool?.min_fee;

  const cb = (a) => {
    setLoading(null);
  };
  const pk = secureLocalStorage.getItem('one-ct-wallet-pk' + address);

  const registeredOneCT = res ? is1CTEnabled(res, pk, provider) : false;
  const { data: signer } = useSigner({ chainId: activeChain.id });

  const buyHandler = async (customTrade?: { is_up: boolean }) => {
    const isCustom = typeof customTrade?.is_up === 'boolean';
    const expirationInMins = expiration.seconds / 60;
    const isForex = activeAsset?.category === AssetCategory[0];
    const maxDuration = switchPool?.max_duration;
    const maxdurationInMins = timeToMins(maxDuration);
    const minDuration = switchPool?.min_duration;
    const mindurationInMins = timeToMins(minDuration);
    const minTradeAmount = switchPool?.min_fee;

    if (
      isCustom === undefined ||
      customTrade === undefined ||
      isForex === undefined ||
      maxDuration === undefined ||
      maxdurationInMins === undefined ||
      minDuration === undefined ||
      mindurationInMins === undefined ||
      minTradeAmount === undefined ||
      decimals === undefined ||
      option_contract === undefined
    ) {
      return toastify({
        type: 'error',
        msg: 'Pool Data missing! Please try again later',
        id: 'PoolNotFound',
      });
    } else {
      if (state.txnLoading > 1) {
        toastify({
          id: '2321123',
          type: 'error',
          msg: 'Please confirm your previous pending transactions.',
        });
        return true;
      }

      if (isForex && knowTill === false) {
        return toastify({
          type: 'error',
          msg: 'Forex Market is closed currently!',
          id: 'binaryBuy',
        });
      }
      if (expirationInMins > maxdurationInMins) {
        return toastify({
          type: 'error',
          msg: `Expiration time should be within ${getUserError(maxDuration)}`,
          id: 'binaryBuy',
        });
      }

      if (expirationInMins < mindurationInMins) {
        return toastify({
          type: 'error',
          msg: `Expiration time should be greater than ${getUserError(
            minDuration
          )}`,
          id: 'binaryBuy',
        });
      }
      if (!userInput) {
        return toastify({
          type: 'error',
          msg: 'Plese enter a positive integer as trade Amount',
          id: 'binaryBuy',
        });
      }
      const noBalance = gt(userInput || '0', balance ? balance : '0');
      if (noBalance) {
        return toastify({
          type: 'error',
          msg:
            "You don't have enough " + tokenName + ' to make this transaction',
          id: 'binaryBuy',
        });
      }
      if (!userInput) {
        return toastify({
          type: 'error',
          msg: 'Plese enter a positive integer as trade Amount',
          id: 'binaryBuy',
        });
      }

      const price = getPriceFromKlines(marketPrice, chartMarket);
      if (!activeAsset) {
        return toastify({
          type: 'error',
          msg: 'There is some error while fetching the data!',
          id: 'binaryBuy',
        });
      }
      if (gt(divide(minTradeAmount, decimals) as string, userInput)) {
        return toastify({
          type: 'error',
          msg:
            'Trade Amount must be atleast ' + minTradeAmount + ' ' + tokenName,
          id: 'binaryBuy',
        });
      }
      if (!activeChain || !price) {
        return toastify({
          type: 'error',
          msg: 'Please try again',
          id: 'binaryBuy',
        });
      }
      if (loading) {
        return toastify({
          type: 'error',
          msg: 'Please wait for previous transaction confirmation.',
          id: 'ddd',
        });
      }
      if (customTrade && isCustom) {
        setLoading({ is_up: customTrade.is_up });
      } else {
        setLoading(2);
      }

      let args = [
        toFixed(multiply(userInput, decimals), 0),
        expirationInMins * 60 + '',
        customTrade.is_up,
        option_contract,
        toFixed(multiply(('' + price).toString(), 8), 0),
        toFixed(multiply(settings.slippageTolerance.toString(), 2), 0),
        settings.partialFill,
        referralData[2],
        highestTierNFT?.tokenId || '0',
      ];

      const confirmationModal = {
        content: (
          <div className="nowrap flex">
            Position opened for&nbsp;
            <div className={`${customTrade.is_up ? 'green' : 'red'} mr5`}>
              {pairName}&nbsp; {customTrade.is_up ? 'Up' : 'Down'}
            </div>
          </div>
        ),
      };

      if (isTestnet) {
        const id = hashMessage;
        toastify({
          id,
          msg: 'Transaction confirmation in progress...',
          type: 'info',
          inf: 1,
        });
        const instantTradingApiUrl =
          'https://oracle.buffer-finance-api.link/instant-trading/trade/initiate/';
        let currentTimestamp = Date.now();
        let currentUTCTimestamp = Math.round(currentTimestamp / 1000);

        const msg = [address, ...args, currentUTCTimestamp];
        const argTypes = [
          'address',
          'uint256',
          'uint256',
          'bool',
          'address',
          'uint256',
          'uint256',
          'bool',
          'string',
          'uint256',
          'uint256',
        ];
        try {
          const hashedMessage = arrayify(
            ethers.utils.solidityKeccak256(argTypes, msg)
          );
          let signature = null;
          if (registeredOneCT) {
            const oneCTWallet = new ethers.Wallet(
              pk,
              provider as ethers.providers.StaticJsonRpcProvider
            );
            signature = await oneCTWallet?.signMessage(hashedMessage);
          } else {
            signature = await signer?.signMessage(hashedMessage);
          }
          // const sig = ethers.utils.splitSignature(signature);

          const TradeQuery = {
            totalFee: args[0],
            period: args[1],
            isAbove: args[2],
            targetContract: args[3],
            expectedStrike: args[4],
            slippage: args[5],
            allowPartialFill: args[6],
            referralCode: args[7],
            traderNFTId: args[8],
          };
          const reqBody = {
            pair: chartMarket.tv_id,
            user_address: address,
            user_signature: signature,
            signature_timestamp: currentUTCTimestamp,
            env: activeChain.id,
            isOneCT: registeredOneCT ? true : false,
          };
          // console.log(
          //   `useBinaryActions[1ct]-reqBody: `,
          //   reqBody,
          //   state.txnLoading
          // );
          // console.log(`useBinaryActions[1ct]-TradeQuery: `, TradeQuery);
          const response = await axios.post(instantTradingApiUrl, TradeQuery, {
            params: reqBody,
          });
          // console.log(`useBinaryActions[1ct]-response: `, response);
          if (response.data?.error) {
            // error code
            toastify({
              id,
              msg: (
                <span>
                  Oops! There is some error. Can you please try again?
                  <br />
                  <span className="!text-3">Error: {response.data.error}</span>
                </span>
              ),
              type: 'error',
            });
          } else {
            // no error
            toastify({
              id,
              msg: confirmationModal.content,
              type: 'success',
              hash: `${activeChain.blockExplorers?.default.url}/tx/${response.data?.hash}`,
              body: null,
              confirmationModal: null,
              timings: 100,
            });
          }
        } catch (e) {
          toastify({
            id,
            msg: (
              <span>
                Oops! There is some error. Can you please try again?
                <br />
                <span className="!text-3">Error: {e?.reason}</span>
              </span>
            ),
            type: 'error',
          });
        }
        setLoading(null);
      } else {
        writeCall(cb, 'initiateTrade', args, null, confirmationModal);
      }
    }
  };

  const handleApproveClick = async (ammount = toFixed(getPosInf(), 0)) => {
    if (state.txnLoading > 1) {
      toastify({
        id: 'dddafsd3',
        type: 'error',
        msg: 'Please confirm your previous pending transactions.',
      });
      return true;
    }
    dispatch({ type: 'SET_TXN_LOADING', payload: 2 });
    setLoading(1);
    if (ammount !== '0' && ammount !== toFixed(getPosInf(), 0)) {
      ammount = add(ammount, multiply(ammount, '0.1'));
    }
    approve(
      (p) => {
        if (p.payload) {
          setIsApproveModalOpen(false);
        }
        setLoading(null);
      },
      'approve',
      [configData.router, ammount]
    );
  };

  const cancelHandler = async (
    queuedId: number,
    cb: (loadingState: boolean) => void
  ) => {
    if (queuedId === null || queuedId === undefined) {
      toastify({
        id: 'queuedId',
        type: 'error',
        msg: 'Something went wrong. Please try again later.',
      });
      return true;
    }
    cb(true);
    writeCall(() => cb(false), 'cancelQueuedTrade', [queuedId]);
  };

  return {
    handleApproveClick,
    buyHandler,
    loading,
    balance,
    cancelHandler,
  };
};
// function getWeekId(timestamp: number): number {
//   return Math.floor((timestamp - 3 * 86400 - 17 * 3600) / 604800);
// }

// const getUsualRoutine = (start?: number | null, end?: boolean) => {
//   if (end) {
//     return [[0, 17 * 60]];
//   }
//   return [
//     [start || 0, 22 * 60],
//     [23 * 60, 23 * 60 + 59],
//   ];
// };
// const day2Intervals = {
//   0: getUsualRoutine(17 * 50),
//   1: getUsualRoutine(),
//   2: getUsualRoutine(),
//   3: getUsualRoutine(),
//   4: getUsualRoutine(null, true),
//   5: [[]],
// };
// console.log(`useBinaryActions-schedule: `, day2Intervals);
// function isTradingOpen(): boolean {
//   const now = new Date();
//   const dayOfWeek = now.getUTCDay();
//   const hour = now.getUTCHours();
//   const min = now.getUTCMinutes();
//   const nowMin = hour * 60 + min;
//   const todaySchedule = day2Intervals[dayOfWeek];
//   console.log(`useBinaryActions-todaySchedule: `, todaySchedule, nowMin);
// }
// Check if it's a weekday (Mon-Fri) and within trading hours
// | [ ] [ ] [ ]   ||  [ ]|[ ] [ ]     open will be next%7 first arr[0]
//   [|] [ ] [ ]                       open will be arr[1]

// isTradingOpen();

// 0 : 17:00 22::00_23:00 23:59
// 1 : 00:00 22::00_23:00 23:59
// ..
// 5 : 00:00 17:00 __
// sat off
