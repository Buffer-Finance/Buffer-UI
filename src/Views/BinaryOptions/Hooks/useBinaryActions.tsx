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
import { activeAssetStateAtom, useQTinfo } from '..';
import { useWriteCall } from '@Hooks/useWriteCall';
import { useReferralCode } from '@Views/Referral/Utils/useReferralCode';
import { useActivePoolObj } from '../PGDrawer/PoolDropDown';
import { useHighestTierNFT } from '@Hooks/useNFTGraph';
import { priceAtom } from '@Hooks/usePrice';
import { knowTillAtom } from '../../TradePage/Hooks/useIsMerketOpen';
import { getDisplayDate, getDisplayTime } from '@Utils/Dates/displayDateTime';
import { useTradePolOrBlpPool } from './useTradePolOrBlpPool';
import { isTestnet } from 'config';
import axios from 'axios';
import { useAccount, useContractEvent, useProvider, useSigner } from 'wagmi';
import { useActiveChain } from '@Hooks/useActiveChain';
import { ethers } from 'ethers';
import { multicallv2 } from '@Utils/Contract/multiContract';
import { arrayify, hashMessage, hexlify } from 'ethers/lib/utils.js';
import { is1CTEnabled, useOneCTWallet } from '@Views/OneCT/useOneCTWallet';
import secureLocalStorage from 'react-secure-storage';
import { binaryOptionsAtom } from '../PGDrawer/CustomOption';

export const useBinaryActions = (userInput, isYes, isQuickTrade = false) => {
  const binary = useQTinfo();
  const [settings] = useAtom(slippageAtom);
  const { configContracts } = useActiveChain();
  const referralData = useReferralCode(binary.activeChain);
  const activeAssetState = useActiveAssetState(userInput, referralData);
  const [balance, allowance, _, currStats] = activeAssetState;
  const [expiration] = useAtom(binaryOptionsAtom);
  const res = activeAssetState?.[activeAssetState?.length - 1];
  // useOneCTWallet();
  const provider = useProvider({ chainId: binary.activeChain.id });

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
  useContractEvent({
    address: configContracts.router,
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
  const { option_contract, min_amount: minTradeAmount } =
    useTradePolOrBlpPool();

  const cb = (a) => {
    setLoading(null);
  };
  const pk = secureLocalStorage.getItem('one-ct-wallet-pk' + address);

  const registeredOneCT = res ? is1CTEnabled(res, pk, provider) : false;
  const { data: signer } = useSigner({ chainId: binary.activeChain.id });

  const buyHandler = async (customTrade?: { is_up: boolean }) => {
    console.log(`useBinaryActions-signature: `, signer);
    const signature = signer?.signMessage('Sign to verify user address');
    console.log(`useBinaryActions-signature: `, signature);
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

// Check if it's a weekday (Mon-Fri) and within trading hours
// | [ ] [ ] [ ]   ||  [ ]|[ ] [ ]     open will be next%7 first arr[0]
//   [|] [ ] [ ]                       open will be arr[1]

// 0 : 17:00 22::00_23:00 23:59
// 1 : 00:00 22::00_23:00 23:59
// ..
// 5 : 00:00 17:00 __
// sat off
