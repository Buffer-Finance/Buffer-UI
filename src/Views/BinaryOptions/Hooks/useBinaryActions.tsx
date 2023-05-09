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
import { useAccount } from 'wagmi';
import { useActiveChain } from '@Hooks/useActiveChain';

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
  console.log(`useBinaryActions-state: `, state);
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

  const buyHandler = async (customTrade?: { is_up: boolean }) => {
    const isCustom = typeof customTrade.is_up === 'boolean';
    const expirationInMins = timeToMins(expiration);
    const isForex = activeAsset.category === 'Forex';
    const marketCloseTime = Math.floor(knowTill.date / 1000);
    const currentTime = Math.floor(new Date().getTime() / 1000);

    if (state.txnLoading > 1) {
      toastify({
        id: '2321123',
        type: 'error',
        msg: 'Please confirm your previous pending transactions.',
      });
      return true;
    }

    if (isForex && currentTime + expirationInMins * 60 >= marketCloseTime) {
      return toastify({
        type: 'error',
        msg: `Expiration time should be less than ${getDisplayTime(
          +marketCloseTime
        )} ${getDisplayDate(
          +marketCloseTime
        )} as the market will be closed by then.`,
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
      const user_signature = 'sign';
      const signature_timestamp = 'sing-ts';
      const instantTradingApiUrl =
        'https://app.buffer.finance/api/v1/instant-trading';
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
        trade: TradeQuery,
        pair: activeAsset.tv_id,
        user_address: address,
        user_signature,
        signature_timestamp,
        env: configContracts.env,
      };
      // dispatch({ type: 'SET_TXN_LOADING', payload: 1 });
      toastify({
        id,
        msg: 'Transaction confirmation in progress...',
        type: 'info',
        inf: 1,
      });
      try {
        await sleep(2000);
        const txHash = 'fsadfasd';
        console.log(`useBinaryActions-reqBody: `, reqBody);
        // dispatch({ type: 'SET_TXN_LOADING', payload: 0 });
        toastify({
          id,
          msg: confirmationModal.content,
          type: 'success',
          hash: `${binary.activeChain.blockExplorers?.default.url}/tx/${txHash}`,
          body: null,
          confirmationModal: null,
          timings: 100,
        });
      } catch (e) {
        toastify({
          id,
          msg: (
            <span>
              Oops! There is some error. Can you please try again?
              <br />
              <span className="!text-3">Error: {JSON.stringify(e)}</span>
            </span>
          ),
          type: 'error',
        });
      }
      setLoading(null);
      // const response = await axios.post(instantTradingApiUrl, reqBody);
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
