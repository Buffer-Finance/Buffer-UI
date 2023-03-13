import { useGlobal } from '@Contexts/Global';
import { useToast } from '@Contexts/Toast';
import { useAtom, useAtomValue } from 'jotai';
import React, { useState } from 'react';
import { postRes } from '@Utils/apis/api';
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
import {
  getPriceFromKlines,
  marketPriceAtom,
} from 'src/TradingView/useDataFeed';
import { approveModalAtom, QuickTradeExpiry } from '../PGDrawer';
import {
  getUserError,
  MINIMUM_MINUTES,
  timeToMins,
} from '../PGDrawer/TimeSelector';
import { slippageAtom } from '../Components/SlippageModal';
import { useActiveAssetState } from './useActiveAssetState';
import { useQTinfo } from '..';
import { useWriteCall } from '@Hooks/useWriteCall';
import { useReferralCode } from '@Views/Referral/Utils/useReferralCode';
import { useActivePoolObj } from '../PGDrawer/PoolDropDown';
import { useHighestTierNFT } from '@Hooks/useNFTGraph';
import { knowTillAtom } from './useIsMerketOpen';
import { getDisplayDate, getDisplayTime } from '@Utils/Dates/displayDateTime';

export const useBinaryActions = (userInput, isYes, isQuickTrade = false) => {
  const binary = useQTinfo();
  const [settings] = useAtom(slippageAtom);
  const referralData = useReferralCode(binary.activeChain);
  const activeAssetState = useActiveAssetState(userInput, referralData);
  const [balance, allowance, _, currStats] = activeAssetState;
  const [expiration] = useAtom(QuickTradeExpiry);
  const [token] = useAtom(sessionAtom);
  const { highestTierNFT } = useHighestTierNFT({ userOnly: true });

  const [, setIsApproveModalOpen] = useAtom(approveModalAtom);
  const { state, dispatch } = useGlobal();
  const activeAsset = binary.activePair;
  const { activePoolObj } = useActivePoolObj();
  const { writeCall } = useWriteCall(binary.routerContract, routerABI);
  const { writeCall: approve } = useWriteCall(
    activePoolObj.token.address,
    ERC20ABI
  );
  const [loading, setLoading] = useState<number | { is_up: boolean } | null>(
    null
  );
  const [marketPrice] = useAtom(marketPriceAtom);
  const toastify = useToast();
  const knowTill = useAtomValue(knowTillAtom);

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
    // if (isCustom && expirationInMins< MINIMUM_MINUTES) {
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
    if (gt('1', userInput)) {
      return toastify({
        type: 'error',
        msg: 'Trade Amount must be atleast 1 ' + activePoolObj.token.name,
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
      activePoolObj.options_contracts.current,
      toFixed(multiply(('' + price).toString(), 8), 0),
      // '10000000000',
      toFixed(multiply(settings.slippage.toString(), 2), 0),
      settings.allowPartial,
      referralData[2],
      highestTierNFT?.tokenId || '0',
    ];

    writeCall(cb, 'initiateTrade', args, null, {
      content: (
        <div className="nowrap flex">
          Position opened for&nbsp;
          <div className={`${customTrade.is_up ? 'green' : 'red'} mr5`}>
            {activeAsset?.pair}&nbsp; {customTrade.is_up ? 'Up' : 'Down'}
          </div>
          {/* @ <Display data={priceData?.close} label="$" /> */}
        </div>
      ),
    });
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
