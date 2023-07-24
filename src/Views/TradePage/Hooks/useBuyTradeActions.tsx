import { useGlobal } from '@Contexts/Global';
import { useToast } from '@Contexts/Toast';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { useEffect, useState } from 'react';
import ERC20ABI from 'src/ABIs/Token.json';
import { toFixed } from '@Utils/NumString';
import OptionsABI from '@Views/TradePage/ABIs/OptionContract.json';
import { privateKeyToAccount } from 'viem/accounts';
import 'viem/window';

import {
  add,
  divide,
  getPosInf,
  gt,
  multiply,
} from '@Utils/NumString/stringArithmatics';
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
import {
  appConfig,
  baseUrl,
  marketsForChart,
  pricePublisherBaseUrl,
} from '../config';
import { AssetCategory, TradeType } from '../type';
import {
  queuets2priceAtom,
  timeSelectorAtom,
  tradeSettingsAtom,
} from '../atoms';
import { useSettlementFee } from './useSettlementFee';
import UpIcon from '@SVG/Elements/UpIcon';
import DownIcon from '@SVG/Elements/DownIcon';
import { generateTradeSignature } from '@Views/TradePage/utils';
import { duration } from '@mui/material';
import { getCallId, multicallLinked } from '@Utils/Contract/multiContract';
import { BuyUSDCLink } from '@Views/BinaryOptions/PGDrawer/BuyUsdcLink';
import {
  generateApprovalSignature,
  generateBuyTradeSignature,
} from '../utils/generateTradeSignature';
import { getSingatureCached } from '../cahce';
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
  const setPriceCache = useSetAtom(queuets2priceAtom);
  const priceCache = useAtomValue(queuets2priceAtom);
  const referralData = useReferralCode();
  const { switchPool, poolDetails } = useSwitchPool();
  const readcallData = useBuyTradeData();
  const decimals = poolDetails?.decimals;
  const balance = divide(readcallData?.balance, decimals as number) as string;
  const tokenName = poolDetails?.token;
  const res = readcallData?.user2signer;
  const nonces = readcallData?.nonces;
  const tokenAddress = poolDetails?.tokenAddress;
  const { data: allSettlementFees } = useSettlementFee();
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
  const { oneCtPk, oneCTWallet } = useOneCTWallet();
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
    if (!maxDuration || !minDuration) {
      return toastify({
        type: 'error',
        msg: 'Pool Data missing! Please try again later',
        id: 'PoolNotFound',
      });
    }
    const maxdurationInMins = timeToMins(maxDuration);
    const mindurationInMins = timeToMins(minDuration);
    const minTradeAmount = switchPool?.min_fee ?? '0';
    const maxTradeAmount =
      readcallData?.maxTradeSizes[switchPool.optionContract] ?? '0';

    const platfromFee = divide(switchPool.platformFee, decimals as number);

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
      // if (state.txnLoading > 1) {
      //   toastify({
      //     id: '2321123',
      //     type: 'error',
      //     msg: 'Please confirm your previous pending transactions.',
      //   });
      //   return true;
      // }

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
      if (!userInput || userInput === '0' || userInput === '') {
        return toastify({
          type: 'error',
          msg: 'Plese enter a positive integer as trade Amount',
          id: 'binaryBuy',
        });
      }
      const noBalance = gt(
        userInput || '0',
        add(balance ? balance : '0', platfromFee ?? '0')
      );
      const platformFee = divide(switchPool.platformFee, poolDetails?.decimals);
      console.log(
        `useBuyTradeActions-add(userInput, platformFee): `,
        add(userInput, platformFee),
        balance
      );
      if (gt(add(userInput, platformFee), balance)) {
        return toastify({
          type: 'error',
          msg: (
            <>
              Addition {platformFee} {poolDetails?.token} are required on top of
              Trade Size as Platform Fee.{' '}
              <BuyUSDCLink token={poolDetails?.token} />
            </>
          ),
          id: 'binaryBuy',
        });
      }
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

      if (!allSettlementFees || !activeAsset) {
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
            'Trade Amount must be atleast ' +
            divide(minTradeAmount, decimals) +
            ' ' +
            tokenName,
          id: 'binaryBuy',
        });
      }
      if (gt(userInput, divide(maxTradeAmount, decimals) as string)) {
        const msg = settings.partialFill ? (
          'Trade will be partially filled according to available utilization.'
        ) : (
          <div>
            Trade Amount must be less than&nbsp;
            {divide(maxTradeAmount, decimals)}&nbsp;
            {tokenName}.
            <div className="text-3 text-f12">
              If you still want to Buy the trade then turn on the Partial Fill
              from settings.
            </div>
          </div>
        );
        const type = settings.partialFill ? 'info' : 'error';
        toastify({
          type,
          msg,
          id: 'binardsfyBuy',
        });
        if (!settings.partialFill) {
          return;
        }
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

      let settelmentFee = allSettlementFees[activeAsset.tv_id];
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

      const signatures = await generateBuyTradeSignature(
        address,
        toFixed(multiply(userInput, decimals), 0),
        expirationInMins,
        option_contract,
        price,
        toFixed(multiply(settings.slippageTolerance.toString(), 2), 0),
        settings.partialFill,
        referralData[2],
        highestTierNFT?.tokenId || '0',
        currentUTCTimestamp,
        customTrade.limitOrderExpiry ? 0 : settelmentFee?.settlement_fee!,
        customTrade.is_up,
        oneCtPk,
        configData.router
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
        limit_order_duration: customTrade.limitOrderExpiry,
        settlement_fee: settelmentFee?.settlement_fee,
        settlement_fee_sign_expiration:
          settelmentFee?.settlement_fee_sign_expiration,
        settlement_fee_signature: settelmentFee?.settlement_fee_signature,
        environment: activeChain.id,
      };
      console.log('apiParams', apiParams);

      const resp: { data: TradeType } = await axios.post(
        baseUrl + 'trade/create/',
        null,
        {
          params: apiParams,
        }
      );
      setLoading(null);

      if (!customTrade.limitOrderExpiry) {
        getLockedAmount(
          baseArgs[ArgIndex.Strike],
          baseArgs[ArgIndex.Size],
          baseArgs[ArgIndex.Period],
          baseArgs[ArgIndex.PartialFill],
          address as string,
          baseArgs[ArgIndex.Referral],
          baseArgs[ArgIndex.NFT],
          settelmentFee.settlement_fee,
          baseArgs[ArgIndex.Slippage],
          baseArgs[ArgIndex.TargetContract],
          provider,
          appConfig[activeChain.id].multicall
        ).then((lockedAmount) => {
          console.timeEnd('read-call');

          setPriceCache((t) => ({
            ...t,
            [activeAsset.tv_id + baseArgs[ArgIndex.Size]]: lockedAmount.amount,
          }));
        });
        const queuedPrice = await getPrice({
          pair: activeAsset.tv_id,
          timestamp: resp.data.open_timestamp,
        });

        setPriceCache((t) => ({
          ...t,
          [resp.data.queue_id]: queuedPrice,
        }));
      }

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
      // } catch (e) {
      //   con
      // }
    }
  };

  const handleApproveClick = async (ammount = '100000000000000') => {
    if (state.txnLoading > 1) {
      toastify({
        id: 'dddafsd3',
        type: 'error',
        msg: 'Please confirm your previous pending transactions.',
      });
      return true;
    }
    if (readcallData?.nonces == undefined || readcallData.nonces == null) {
      toastify({
        id: 'dddad3',
        type: 'error',
        msg: 'Fetching metadata.',
      });
      return true;
    }
    // dispatch({ type: 'SET_TXN_LOADING', payload: 2 });
    setLoading(1);
    if (ammount !== '0' && ammount !== toFixed(getPosInf(), 0)) {
      ammount = add(ammount, multiply(ammount, '0.1'));
    }
    //  fetch nonce 7min
    // sign data : 1hr
    // call api :15
    const deadline = (Math.round(Date.now() / 1000) + 6000).toString();
    try {
      const [approvalSignature, RSV] = await generateApprovalSignature(
        readcallData.nonces,
        ammount,
        address!,
        tokenAddress,
        configData.router,
        deadline,
        oneCtPk
      );
      const user_signature = await getSingatureCached(oneCTWallet);
      const apiSignature = {
        user: address,
        nonce: +readcallData.nonces,
        allowance: +ammount,
        deadline: +deadline,
        v: parseInt(RSV.v, 16),
        r: RSV.r,
        s: RSV.s,
        user_signature,
        environment: activeChain.id,
        state: 'PENDING',
      };
      const resp = await axios.post(baseUrl + 'approve/', null, {
        params: apiSignature,
      });
      setLoading(null);

      toastify({ type: 'success', msg: 'Approved Successfully.', id: '10231' });
    } catch (e) {
      setLoading(null);

      toastify({ type: 'error', msg: 'Something went wrong.', id: '10231' });
    }
  };

  return {
    handleApproveClick,
    buyHandler,
    loading,
  };
};

export const getPrice = async (query: any): Promise<number> => {
  const priceResponse = await axios.post(pricePublisherBaseUrl, [query]);
  const priceObject = priceResponse?.data[0]?.price;
  console.log(`[aug]:: `, priceResponse);
  if (!priceObject) return getPrice(query);
  return priceObject;
};

let cache: { [key: string]: number } = {};
export const getCachedPrice = async (query: any): Promise<number> => {
  const id = query.pair + ':' + query.timestamp;
  if (!(id in cache)) {
    const priceResponse = await axios.post(pricePublisherBaseUrl, [query]);
    const priceObject = priceResponse?.data[0]?.price;
    console.log(`[aug]:: `, priceResponse);
    if (!priceObject) return getCachedPrice(query);
    cache[id] = priceObject;
  }
  return cache[id];
};
const getLockedAmount = async (
  price: string,
  totalFee: string,
  period: string,
  allowPartialFill: boolean,
  user: string,
  referrer: string,
  nftId: string,
  settlementFee: number,
  slippage: number,
  optionContract: string,
  provider: ethers.providers.Provider,
  multicallAddress: string
): Promise<{
  amount: string;
  isReferralValid: boolean;
  revisedFee: string;
}> => {
  const calls = [
    {
      address: optionContract,
      abi: OptionsABI,
      params: [
        [
          price,
          '0',
          period,
          allowPartialFill,
          totalFee,
          user,
          referrer,
          settlementFee,
        ],
        slippage + '',
      ],
      name: 'evaluateParams',
    },
  ];
  console.log(`useBuyTradeActions-optionContract: `, calls);
  // const calls = [];
  const res = await multicallLinked(
    calls,
    provider,
    multicallAddress,
    'hellowthere'
  );
  const callId = getCallId(optionContract, 'evaluateParams');
  if (!res?.[callId])
    return getLockedAmount(
      price,
      totalFee,
      period,
      allowPartialFill,
      user,
      referrer,
      nftId,
      settlementFee,
      slippage,
      optionContract,
      provider,
      multicallAddress
    );
  return res[callId];
};
