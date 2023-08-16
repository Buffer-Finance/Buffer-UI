import { useGlobal } from '@Contexts/Global';
import { useToast } from '@Contexts/Toast';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { useState } from 'react';
import ERC20ABI from 'src/ABIs/Token.json';
import { toFixed } from '@Utils/NumString';
import OptionsABI from '@Views/TradePage/ABIs/OptionContract.json';
import 'viem/window';

import { add, divide, gt, multiply } from '@Utils/NumString/stringArithmatics';
import { useWriteCall } from '@Hooks/useWriteCall';
import { useReferralCode } from '@Views/Referral/Utils/useReferralCode';
import { useHighestTierNFT } from '@Hooks/useNFTGraph';
import axios from 'axios';
import { useAccount, usePublicClient } from 'wagmi';
import { useActiveChain } from '@Hooks/useActiveChain';
import { ethers } from 'ethers';
import { useOneCTWallet } from '@Views/OneCT/useOneCTWallet';
import { useSwitchPool } from './useSwitchPool';
import { useBuyTradeData } from './useBuyTradeData';
import { useActiveMarket } from './useActiveMarket';
import { joinStrings } from '../utils';
import { appConfig, baseUrl, pricePublisherBaseUrl } from '../config';
import { AssetCategory, TradeType } from '../type';
import {
  approveModalAtom,
  queuets2priceAtom,
  timeSelectorAtom,
  tradeSettingsAtom,
} from '../atoms';
import { useSettlementFee } from './useSettlementFee';
import UpIcon from '@SVG/Elements/UpIcon';
import DownIcon from '@SVG/Elements/DownIcon';
import { getCallId, multicallLinked } from '@Utils/Contract/multiContract';
import {
  generateApprovalSignature,
  generateBuyTradeSignature,
} from '../utils/generateTradeSignature';
import { getExpiry } from '../Views/AccordionTable/Common';
import { useApprvalAmount } from './useApprovalAmount';
import { getConfig } from '../utils/getConfig';
import { timeToMins } from '../utils/timeToMins';
import { knowTillAtom } from '@Views/TradePage/Hooks/useIsMerketOpen';
import { getUserError } from '../utils/getUserError';
import { BuyUSDCLink } from '../Views/BuyTrade/BuyUsdcLink';
import { getSingatureCached } from '../cache';
import { viemMulticall } from '@Utils/multicall';
import { signTypedData } from '@wagmi/core';
import { PublicClient } from 'viem';
import secureLocalStorage from 'react-secure-storage';

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

export const getApprovalRequestLocalKey = (address: string | undefined) =>
  `approvalRequest:${address}`;

export const useBuyTradeActions = (userInput: string) => {
  const { activeChain } = useActiveChain();
  const [settings] = useAtom(tradeSettingsAtom);
  const setPriceCache = useSetAtom(queuets2priceAtom);
  const approvalExpanded = useApprvalAmount();
  const referralData = useReferralCode();
  const { switchPool, poolDetails } = useSwitchPool();
  const readcallData = useBuyTradeData();
  const decimals = poolDetails?.decimals;

  const balance = divide(readcallData?.balance, decimals as number) as string;
  const tokenName = poolDetails?.token;

  const tokenAddress = poolDetails?.tokenAddress;
  const { data: allSettlementFees } = useSettlementFee();
  const [expiration] = useAtom(timeSelectorAtom);
  const provider = usePublicClient({ chainId: activeChain.id });
  const { highestTierNFT } = useHighestTierNFT({ userOnly: true });
  const setIsApproveModalOpen = useSetAtom(approveModalAtom);
  const { state, dispatch } = useGlobal();
  const { activeMarket: activeAsset } = useActiveMarket();

  const { address } = useAccount();

  const configData = getConfig(activeChain.id);
  const { writeCall: approve } = useWriteCall(tokenAddress as string, ERC20ABI);
  const [loading, setLoading] = useState<number | { is_up: boolean } | null>(
    null
  );

  const toastify = useToast();
  const knowTill = useAtomValue(knowTillAtom);
  const option_contract = switchPool?.optionContract;
  const { oneCtPk, oneCTWallet } = useOneCTWallet();
  const localStoreApprovalRequest = secureLocalStorage.getItem(
    getApprovalRequestLocalKey(address)
  );

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
      if (noBalance) {
        return toastify({
          type: 'error',
          msg:
            "You don't have enough " + tokenName + ' to make this transaction',
          id: 'binaryBuy',
        });
      }
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

      // const confirmationModal = {
      //   content: (
      //     <div className="nowrap flex">
      //       Position opened for&nbsp;
      //       <div className={`${customTrade.is_up ? 'green' : 'red'} mr5`}>
      //         {pairName}&nbsp; {customTrade.is_up ? 'Up' : 'Down'}
      //       </div>
      //     </div>
      //   ),
      // };
      try {
        let settelmentFee = allSettlementFees[activeAsset.tv_id];
        let currentTimestamp = Date.now();
        let currentUTCTimestamp = Math.round(currentTimestamp / 1000);
        // const oneCTWallet = new ethers.Wallet(
        //   oneCtPk!,
        //   provider as ethers.providers.StaticJsonRpcProvider
        // );
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
          activeChain.id,
          configData.router
        );
        const user_signature = await getSingatureCached(oneCTWallet);

        const apiParams = {
          signature_timestamp: currentUTCTimestamp,
          strike: baseArgs[ArgIndex.Strike],
          period: baseArgs[ArgIndex.Period],
          target_contract: baseArgs[ArgIndex.TargetContract],
          partial_signature: signatures[0],
          full_signature: signatures[1],
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
        };
        console.log('apiParams', apiParams);

        const resp: { data: TradeType } = await axios.post(
          baseUrl + 'trade/create/',
          {
            create_params: apiParams,
            approval_params: localStoreApprovalRequest ?? {},
          },
          {
            params: {
              environment: activeChain.id,
              token: tokenName,
              user_address: baseArgs[ArgIndex.UserAddress],
              user_signature,
            },
          }
        );

        if (resp.data && !resp.detail) {
          secureLocalStorage.removeItem(getApprovalRequestLocalKey(address));
        }

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
            configData.multicall
          ).then((lockedAmount: string[]) => {
            console.log(`useBuyTradeActions-lockedAmount: `, lockedAmount);

            setPriceCache((t) => ({
              ...t,
              [activeAsset.tv_id + baseArgs[ArgIndex.Size]]: lockedAmount[0][0],
            }));
          });
          const queuedPrice = await getCachedPrice({
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
      } catch (e: any) {
        toastify({
          id: 'trade/create error',
          type: 'error',
          msg: e.message,
        });
      } finally {
        setLoading(null);
      }

      // } catch (e) {
      //   con
      // }
    }
  };

  const handleApproveClick = async (
    ammount = '100000000000000000000000000'
  ) => {
    if (state.txnLoading > 1) {
      toastify({
        id: 'dddafsd3',
        type: 'error',
        msg: 'Please confirm your previous pending transactions.',
      });
      return true;
    }
    if (
      approvalExpanded?.nonce == undefined ||
      approvalExpanded.nonce == null
    ) {
      toastify({
        id: 'dddad3',
        type: 'error',
        msg: 'Fetching metadata.',
      });
      return true;
    }
    // dispatch({ type: 'SET_TXN_LOADING', payload: 2 });
    setLoading(1);
    if (ammount !== '0' && ammount !== '100000000000000000000000000') {
      ammount = toFixed(add(ammount, multiply(ammount, '0.1')), 0);
    }
    //  fetch nonce 7min
    // sign data : 1hr
    // call api :15
    const deadline = (Math.round(Date.now() / 1000) + 84600).toString();
    try {
      const [_, RSV] = await generateApprovalSignature(
        approvalExpanded?.nonce,
        ammount,
        address!,
        tokenAddress,
        configData.router,
        deadline,
        activeChain.id,
        signTypedData
      );
      // const user_signature = await getSingatureCached(oneCTWallet);
      const apiSignature = {
        // user: address,
        // nonce: +approvalExpanded?.nonce,
        allowance: ammount,
        deadline: +deadline,
        v: parseInt(RSV.v, 16),
        r: RSV.r,
        s: RSV.s,
        // user_signature,
        // environment: activeChain.id,
        // state: 'PENDING',
        // token: tokenName,
      };
      // const resp = await axios.post(baseUrl + 'approve/', null, {
      //   params: apiSignature,
      // });
      secureLocalStorage.setItem(
        getApprovalRequestLocalKey(address),
        apiSignature
      );

      setLoading(null);
      setIsApproveModalOpen(false);

      toastify({ type: 'success', msg: 'Approved Successfully.', id: '10231' });
    } catch (e) {
      setLoading(null);

      toastify({ type: 'error', msg: 'Something went wrong.', id: '10231' });
    }
  };
  const revokeApproveClick = async () => {
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
    approve(
      (p) => {
        if (p.payload) {
          setIsApproveModalOpen(false);
        }
        setLoading(null);
      },
      'approve',
      [configData.router, '0']
    );
  };

  return {
    handleApproveClick,
    revokeApproveClick,
    buyHandler,
    loading,
  };
};

export let expiryPriceCache: { [key: string]: number } = {};
export const getCachedPrice = async (query: any): Promise<number> => {
  const id = query.pair + ':' + query.timestamp;
  if (!(id in expiryPriceCache)) {
    const priceResponse = await axios.post(pricePublisherBaseUrl, [query]);
    const priceObject = priceResponse?.data[0]?.price;
    if (!priceObject) return getCachedPrice(query);
    expiryPriceCache[id] = priceObject;
  }
  return expiryPriceCache[id];
};

export const getPriceCacheId = (trade: TradeType) =>
  trade.market.token0 + trade.market.token1 + ':' + getExpiry(trade);
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
  provider: PublicClient,
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
  const res = await viemMulticall(calls, provider, 'hellowthere');
  console.log(`useBuyTradeActions-res: `, res);
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
