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
import { sessionAtom } from 'src/atoms/generic';
import { getPriceFromKlines, sleep } from 'src/TradingView/useDataFeed';
import { approveModalAtom, QuickTradeExpiry } from '../PGDrawer';
import { getUserError, timeToMins } from '../PGDrawer/TimeSelector';
import { slippageAtom } from '../Components/SlippageModal';
import { useActiveAssetState } from './useActiveAssetState';
import { useQTinfo } from '..';
import { useWriteCall } from '@Hooks/useWriteCall';
import { useReferralCode } from '@Views/Referral/Utils/useReferralCode';
import { useActivePoolObj } from '../PGDrawer/PoolDropDown';
import { useHighestTierNFT } from '@Hooks/useNFTGraph';
import { priceAtom } from '@Hooks/usePrice';
import { knowTillAtom } from './useIsMerketOpen';
import { getDisplayDate, getDisplayTime } from '@Utils/Dates/displayDateTime';
import { useTradePolOrBlpPool } from './useTradePolOrBlpPool';
import { isTestnet } from 'config';
import axios from 'axios';
import { useAccount, useSigner } from 'wagmi';
import { useActiveChain } from '@Hooks/useActiveChain';
import { ethers } from 'ethers';
import { multicallv2 } from '@Utils/Contract/multiContract';
import { arrayify, hexlify } from 'ethers/lib/utils.js';

export const useBinaryActions = (userInput, isYes, isQuickTrade = false) => {
  const binary = useQTinfo();
  const [settings] = useAtom(slippageAtom);
  const { configContracts } = useActiveChain();
  const referralData = useReferralCode(binary.activeChain);
  const activeAssetState = useActiveAssetState(userInput, referralData);
  const [balance, allowance, _, currStats] = activeAssetState;
  const [expiration] = useAtom(QuickTradeExpiry);
  const [token] = useAtom(sessionAtom);
  const { highestTierNFT } = useHighestTierNFT({ userOnly: true });
  const [, setIsApproveModalOpen] = useAtom(approveModalAtom);
  const { state, dispatch } = useGlobal();
  const activeAsset = binary.activePair;
  const { address } = useAccount();
  const { activePoolObj } = useActivePoolObj();
  const { writeCall } = useWriteCall(binary.routerContract, routerABI);
  const { writeCall: approve } = useWriteCall(
    activePoolObj.token.address,
    ERC20ABI
  );
  const [loading, setLoading] = useState<number | { is_up: boolean } | null>(
    null
  );
  const marketPrice = useAtomValue(priceAtom);
  const toastify = useToast();
  const knowTill = useAtomValue(knowTillAtom);
  const { option_contract, min_amount: minTradeAmount } =
    useTradePolOrBlpPool();

  const cb = (a) => {
    setLoading(null);
  };
  const { data: signer } = useSigner({ chainId: binary.activeChain.id });

  const buyHandler = async (customTrade?: { is_up: boolean }) => {
    const isCustom = typeof customTrade.is_up === 'boolean';
    const expirationInMins = timeToMins(expiration);
    const isForex = activeAsset.category === 'Forex';
    const currentTime = Math.floor(new Date().getTime() / 1000);

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
    if (isCustom && expirationInMins > timeToMins(activeAsset.max_duration)) {
      return toastify({
        type: 'error',
        msg: `Expiration time should be within ${getUserError(
          activeAsset.max_duration
        )}`,
        id: 'binaryBuy',
      });
    }
    if (isCustom && expirationInMins < timeToMins(activeAsset.min_duration)) {
      return toastify({
        type: 'error',
        msg: `Expiration time should be greater than ${getUserError(
          activeAsset.min_duration
        )}`,
        id: 'binaryBuy',
      });
    }
    // if (isCustom && expirationInMins < MINIMUM_MINUTES) {
    //   return toastify({
    //     type: 'error',
    //     msg: 'Expiration should be greater then 5 minutes due to network congestion',
    //     id: 'binaryBuy',
    //   });
    // }

    if (!userInput) {
      return toastify({
        type: 'error',
        msg: 'Plese enter a positive integer as trade Amount',
        id: 'binaryBuy',
      });
    }
    const noBalance = gt(
      userInput || '0',
      balance ? divide(balance, activePoolObj.token.decimals) : '0'
    );
    if (noBalance) {
      return toastify({
        type: 'error',
        msg:
          "You don't have enough " +
          activePoolObj.token.name +
          ' to make this transaction',
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
    // if (!currStats) {
    //   return toastify({
    //     type: "error",
    //     msg: "Something went wrong! Please buy your option again,",
    //   });
    // }
    const price = getPriceFromKlines(marketPrice, activeAsset);
    if (!activeAsset) {
      return toastify({
        type: 'error',
        msg: 'There is some error while fetching the data!',
        id: 'binaryBuy',
      });
    }
    if (gt(minTradeAmount.toString(), userInput)) {
      return toastify({
        type: 'error',
        msg:
          'Trade Amount must be atleast ' +
          minTradeAmount +
          ' ' +
          activePoolObj.token.name,
        id: 'binaryBuy',
      });
    }
    if (!binary.activeChain || !price) {
      return toastify({
        type: 'error',
        msg: 'Please try again',
        id: 'binaryBuy',
      });
    }
    if (isCustom) {
      setLoading({ is_up: customTrade.is_up });
    } else {
      setLoading(2);
    }

    let args = [
      toFixed(multiply(userInput, activePoolObj.token.decimals), 0),
      expirationInMins * 60 + '',
      customTrade.is_up,
      option_contract.current,
      toFixed(multiply(('' + price).toString(), 8), 0),
      toFixed(multiply(settings.slippage.toString(), 2), 0),
      settings.allowPartial,
      referralData[2],
      highestTierNFT?.tokenId || '0',
    ];
    const confirmationModal = {
      content: (
        <div className="nowrap flex">
          Position opened for&nbsp;
          <div className={`${customTrade.is_up ? 'green' : 'red'} mr5`}>
            {activeAsset?.pair}&nbsp; {customTrade.is_up ? 'Up' : 'Down'}
          </div>
          {/* @ <Display data={priceData?.close} label="$" /> */}
        </div>
      ),
    };
    if (isTestnet) {
      const id = 'InstantTradingId';
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
      console.log(`useBinaryActions-msg: `, msg);
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
      /*
      
      0x17d18dab7a5519e2fb6820cad3c1f02f89b6b4c5d8fa6e99f07330f6ba6b021e51e5a97384d13c47bf5613809b79d38cf9cbc3015f81cb15ad7c267e2c8cb9691c - defaultABiencoder
      0xd96787c4586ee6cc855b789219901dd2d22ddd3532beff762e07e1a9a97b46dd47e49140babd9265dd4f13ed7da6f16956e0d52349fd1f62dc2751ed647ee7451c - solidity keccak
      0xfe233d5ac7aafbdb70a5bca39cab7ea269c40ef8a956b085b45f60dee823aec3262d7dc981899b725c8181164540b3066ce59138fa28f1f8c2c10ad8ef6d61ca1c - solidity pack
      0xf4f26d1699b1029317f045d2a49fdae49c58f7e8253ddc56679c017fe55f05672b681ef25ffce02b173bfe3cbbed9ae3c595cbaddb9ee2f461387e68a1d4266f1c - solidity sha256
      */
      try {
        const hashedMessage = ethers.utils.solidityKeccak256(argTypes, msg);
        console.log(`useBinaryActions-msg: `, msg);
        console.log(`useBinaryActions-hashedMessage: `, hashedMessage);
        const signature = await signer?.signMessage(arrayify(hashedMessage));
        // const sig = ethers.utils.splitSignature(signature);

        console.log(`useBinaryActions-signature: `, signature);
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
          pair: activeAsset.tv_id,
          user_address: address,
          user_signature: signature,
          signature_timestamp: currentUTCTimestamp,
          env: binary.activeChain.id,
        };
        console.log(`useBinaryActions-reqBody: `, reqBody);
        const response = await axios.post(instantTradingApiUrl, TradeQuery, {
          params: reqBody,
        });
        console.log(`useBinaryActions-response: `, response);
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
            hash: `${binary.activeChain.blockExplorers?.default.url}/tx/${response.data?.hash}`,
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
      [binary.routerContract, ammount]
    );
  };

  const cancelHandler = async (
    queuedId: number,
    cb: (loadingState) => void
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
    allowance,
    currStats,
    balance,
    cancelHandler,
    activeAssetState,
  };
};
function getWeekId(timestamp: number): number {
  return Math.floor((timestamp - 3 * 86400 - 17 * 3600) / 604800);
}

const getUsualRoutine = (start?: number | null, end?: boolean) => {
  if (end) {
    return [[0, 17 * 60]];
  }
  return [
    [start || 0, 22 * 60],
    [23 * 60, 23 * 60 + 59],
  ];
};
const day2Intervals = {
  0: getUsualRoutine(17 * 50),
  1: getUsualRoutine(),
  2: getUsualRoutine(),
  3: getUsualRoutine(),
  4: getUsualRoutine(null, true),
  5: [[]],
};
console.log(`useBinaryActions-schedule: `, day2Intervals);
function isTradingOpen(): boolean {
  const now = new Date();
  const dayOfWeek = now.getUTCDay();
  const hour = now.getUTCHours();
  const min = now.getUTCMinutes();
  const nowMin = hour * 60 + min;
  const todaySchedule = day2Intervals[dayOfWeek];
  console.log(`useBinaryActions-todaySchedule: `, todaySchedule, nowMin);
}
// Check if it's a weekday (Mon-Fri) and within trading hours
// | [ ] [ ] [ ]   ||  [ ]|[ ] [ ]     open will be next%7 first arr[0]
//   [|] [ ] [ ]                       open will be arr[1]

isTradingOpen();

// 0 : 17:00 22::00_23:00 23:59
// 1 : 00:00 22::00_23:00 23:59
// ..
// 5 : 00:00 17:00 __
// sat off
