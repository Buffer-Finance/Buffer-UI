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
  const { writeCall: approve } = useWriteCall(tokenAddress as string, ERC20ABI);
  const [loading, setLoading] = useState<number | { is_up: boolean } | null>(
    null
  );

  const marketPrice = useAtomValue(priceAtom);
  const toastify = useToast();
  const knowTill = useAtomValue(knowTillAtom);
  const option_contract = switchPool?.optionContract;

  const pk = secureLocalStorage.getItem('one-ct-wallet-pk' + address) as string;

  const registeredOneCT = res ? is1CTEnabled(res, pk, provider) : false;
  console.log(`useBuyTradeActions-registeredOneCT: `, registeredOneCT, res, pk);

  const buyHandler = async (customTrade?: { is_up: boolean }) => {
    const isCustom = typeof customTrade?.is_up === 'boolean';
    const expirationInMins = expiration.seconds / 60;
    const isForex = activeAsset?.category === AssetCategory[0];
    const maxDuration = switchPool?.max_duration;
    const minDuration = switchPool?.min_duration;
    if (!maxDuration || !minDuration) {
      return toastify({
        type: 'error',
        msg: 'Pool Data missing! Please try again later',
        id: 'PoolNotFound',
      });
    }
    const maxdurationInMins = timeToMins(maxDuration);
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
      if (!registeredOneCT) {
        return toastify({
          type: 'error',
          msg: 'Please activate your acccount first!',
          id: 'activationfailure',
        });
      }
      if (customTrade && isCustom) {
        setLoading({ is_up: customTrade.is_up });
      } else {
        setLoading(2);
      }

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
      let baseArgs = [
        address,
        toFixed(multiply(userInput, decimals), 0),
        expirationInMins * 60 + '',
        option_contract,
        toFixed(multiply(('' + price).toString(), 8), 0),
        toFixed(multiply(settings.slippageTolerance.toString(), 2), 0),
        settings.partialFill,
        referralData[2],
        highestTierNFT?.tokenId || '0',
      ];

      /*
        partial
                params.user,
                params.totalFee,
                params.period,
                params.targetContract,
                params.strike,
                params.slippage,
                params.allowPartialFill,
                params.referralCode,
                params.traderNFTId,
                signInfo.timestamp


      full
                queuedTrade.user,
                queuedTrade.totalFee,
                queuedTrade.period,
                queuedTrade.targetContract,
                queuedTrade.strike,
                queuedTrade.slippage,
                queuedTrade.allowPartialFill,
                queuedTrade.referralCode,
                queuedTrade.traderNFTId,
                params.isAbove,
                signInfo.timestamp
    */
      const baseArgTypes = [
        'address',
        'uint256',
        'uint256',
        'address',
        'uint256',
        'uint256',
        'bool',
        'string',
        'uint256',
      ];

      const args = [
        {
          values: [...baseArgs, currentUTCTimestamp],
          types: [...baseArgTypes, 'uint256'],
        },
        {
          values: [...baseArgs, customTrade.is_up, currentUTCTimestamp],
          types: [...baseArgTypes, 'bool', 'uint256'],
        },
      ];

      try {
        const hashedMessage = ['partial', 'full'].map((s, idx) => {
          return arrayify(
            ethers.utils.solidityKeccak256(args[idx].types, args[idx].values)
          );
        });
        const oneCTWallet = new ethers.Wallet(
          pk,
          provider as ethers.providers.StaticJsonRpcProvider
        );
        const params = await Promise.all([
          oneCTWallet?.signMessage(hashedMessage[0]),
          oneCTWallet?.signMessage(hashedMessage[1]),
        ]);
        console.log(`useBuyTradeActions-params: `, params);
        // const sig = ethers.utils.splitSignature(signature);
      } catch (e) {}
      setLoading(null);
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

  return {
    handleApproveClick,
    buyHandler,
    loading,
  };
};
