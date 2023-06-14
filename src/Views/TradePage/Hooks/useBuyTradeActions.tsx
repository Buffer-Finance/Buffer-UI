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
import { is1CTEnabled, useOneCTWallet } from '@Views/OneCT/useOneCTWallet';
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
import { appConfig, baseUrl, marketsForChart } from '../config';
import { AssetCategory } from '../type';
import { timeSelectorAtom, tradeSettingsAtom } from '../atoms';
import { useSettlementFee } from './useSettlementFee';
import UpIcon from '@SVG/Elements/UpIcon';
import DownIcon from '@SVG/Elements/DownIcon';
import { generateTradeSignature } from './generateTradeSignature';
import { duration } from '@mui/material';
enum ArgIndex {
  Strike = 4,
  Period = 2,
  TargetContract = 3,
  UserAddress = 0,
  Size = 1,
  PartialFill = 6,
  Referral = 7,
  NFT = 8,
  Slippage = 5,
}
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
  const settelmentFee = useSettlementFee();
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

  const toastify = useToast();
  const knowTill = useAtomValue(knowTillAtom);
  const option_contract = switchPool?.optionContract;
  const { oneCtPk } = useOneCTWallet();

  const buyHandler = async (customTrade: {
    is_up: boolean;
    strike: string;
    limitOrderExpiry: number;
  }) => {
    const price = customTrade?.strike;
    const isCustom = typeof customTrade?.is_up === 'boolean';
    const expirationInMins = expiration.seconds / 60;
    const isForex = activeAsset?.category === AssetCategory[0];
    const maxDuration = switchPool?.max_duration;
    const minDuration = switchPool?.min_duration;
    console.log(`useBuyTradeActions-minDuration: `, minDuration);
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
      console.log(`useBuyTradeActions-userInput: `, userInput);

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
      if (!oneCtPk) {
        return toastify({
          type: 'error',
          msg: 'Please activate your Trading Account first.',
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

      let currentTimestamp = Date.now();
      let currentUTCTimestamp = Math.round(currentTimestamp / 1000);
      const oneCTWallet = new ethers.Wallet(
        oneCtPk!,
        provider as ethers.providers.StaticJsonRpcProvider
      );
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
      const signatures = await generateTradeSignature(
        address,
        multiply(userInput, decimals),
        expirationInMins,
        option_contract,
        price,
        toFixed(multiply(settings.slippageTolerance.toString(), 2), 0),
        settings.partialFill,
        referralData[2],
        highestTierNFT?.tokenId || '0',
        currentUTCTimestamp,
        settelmentFee?.settlement_fee!,
        customTrade.is_up,
        oneCTWallet
      );
      const apiParams = {
        signature_timestamp: currentUTCTimestamp,
        strike: baseArgs[ArgIndex.Strike],
        period: baseArgs[ArgIndex.Period],
        target_contract: baseArgs[ArgIndex.TargetContract],
        partial_signature: signatures[0],
        full_signature: signatures[1],
        user_address: baseArgs[ArgIndex.UserAddress],
        trade_size: baseArgs[ArgIndex.Size],
        allow_partial_fill: baseArgs[ArgIndex.PartialFill],
        referral_code: baseArgs[ArgIndex.Referral],
        trader_nft_id: baseArgs[ArgIndex.NFT],
        slippage: baseArgs[ArgIndex.Slippage],
        is_above: customTrade.is_up,
        is_limit_order: customTrade.limitOrderExpiry ? true : false,
        limit_order_expiration: customTrade.limitOrderExpiry,
        settlement_fee: settelmentFee?.settlement_fee,
        settlement_fee_sign_expiration:
          settelmentFee?.settlement_fee_sign_expiration,
        settlement_fee_signature: settelmentFee?.settlement_fee_signature,
        environment: activeChain.id,
      };
      console.log(`useBuyTradeActions-apiParams: `, apiParams);
      // const sig = ethers.utils.splitSignature(signature);
      const resp = await axios.post(baseUrl + 'trade/create/', null, {
        params: apiParams,
      });
      const content = (
        <div className="flex flex-col gap-y-2 text-f12 ">
          <div className="nowrap font-[600]">
            {customTrade.limitOrderExpiry ? 'Limit' : 'Trade'} order placed
            {/* at Strike : {toFixed(divide(baseArgs[ArgIndex.Strike], 8), 3)} */}
          </div>
          <div className="flex items-center">
            {activeAsset.token0 + '-' + activeAsset.token1}&nbsp;&nbsp;
            <span className="!text-3">to go</span>&nbsp;
            {customTrade.is_up ? (
              <>
                <UpIcon className="text-green scale-125" /> &nbsp;Higher
              </>
            ) : (
              <>
                <DownIcon className="text-red scale-125" />
                &nbsp; Lower
              </>
            )}
          </div>
          <div>
            <span>
              <span className="!text-3">Total amount:</span>
              {userInput}&nbsp;USDC
            </span>
          </div>
        </div>
      );
      toastify({
        price,
        type: 'success',
        timings: 100,
        body: null,
        msg: content,
      });
      console.log(`useBuyTradeActions-resp: `, resp);
      // } catch (e) {
      //   con
      // }
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
