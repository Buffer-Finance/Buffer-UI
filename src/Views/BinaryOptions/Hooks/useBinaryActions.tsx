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
      toastify({
        id,
        msg: 'Transaction confirmation in progress...',
        type: 'info',
        inf: 1,
      });
      const instantTradingApiUrl =
        'https://app.buffer.finance/api/v1/instant-trading';
      let currentTimestamp = Date.now();
      let currentUTCTimestamp = Math.round(
        (currentTimestamp + new Date().getTimezoneOffset() * 60 * 1000) / 1000
      );

      // const msg = [address, ...args, currentUTCTimestamp];
      const msg = [
        '0xFbEA9559AE33214a080c03c68EcF1D3AF0f58A7D',
        5000000,
        900,
        true,
        '0xf7EE46d45Da17A12734685dB4E238d35af8E6e0C',
        110026400,
        50,
        true,
        'test',
        10,
        1683601318,
      ];
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
      const hashedMessage = ethers.utils.soliditySha256(argTypes, msg);
      console.log(`useBinaryActions-msg: `, msg);
      console.log(`useBinaryActions-hashedMessage: `, hashedMessage);
      const signature = await signer!.signMessage(hashedMessage);
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
        trade: TradeQuery,
        pair: activeAsset.tv_id,
        user_address: address,
        user_signature: signature,
        signature_timestamp: currentUTCTimestamp,
        env: binary.activeChain.id,
      };
      console.log(`useBinaryActions-reqBody: `, reqBody);
      // dispatch({ type: 'SET_TXN_LOADING', payload: 1 });

      try {
        await sleep(2000);
        const txHash = 'fsadfasd';
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
