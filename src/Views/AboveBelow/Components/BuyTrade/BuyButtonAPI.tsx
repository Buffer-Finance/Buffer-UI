import { useGlobal } from '@Contexts/Global';
import { useToast } from '@Contexts/Toast';
import { useActiveChain } from '@Hooks/useActiveChain';
import { useUserAccount } from '@Hooks/useUserAccount';
import DownIcon from '@SVG/Elements/DownIcon';
import UpIcon from '@SVG/Elements/UpIcon';
import { toFixed } from '@Utils/NumString';
import {
  add,
  divide,
  gt,
  lt,
  multiply,
} from '@Utils/NumString/stringArithmatics';
import { useMaxTrade } from '@Views/AboveBelow/Hooks/useMaxTrade';
import { useProductName } from '@Views/AboveBelow/Hooks/useProductName';
import {
  selectedExpiry,
  selectedPoolActiveMarketAtom,
  tradeSizeAtom,
} from '@Views/AboveBelow/atoms';
import { marketTypeAB } from '@Views/AboveBelow/types';
import { ConnectionRequired } from '@Views/Common/Navbar/AccountDropdown';
import { BlueBtn, BufferButton } from '@Views/Common/V2-Button';
import { isOneCTModalOpenAtom } from '@Views/OneCT/OneCTButton';
import { useOneCTWallet } from '@Views/OneCT/useOneCTWallet';
import { useReferralCode } from '@Views/Referral/Utils/useReferralCode';
import { useApprvalAmount } from '@Views/TradePage/Hooks/useApprovalAmount';
import { tradeSettingsAtom } from '@Views/TradePage/atoms';
import { getSingatureCached } from '@Views/TradePage/cache';
import { aboveBelowBaseUrl } from '@Views/TradePage/config';
import { TradeType } from '@Views/TradePage/type';
import { generateApprovalSignatureWrapper } from '@Views/TradePage/utils/generateApprovalSignatureWrapper';
import { generateTradeSignature } from '@Views/TradePage/utils/generateTradeSignature';
import { getConfig } from '@Views/TradePage/utils/getConfig';
import { Skeleton } from '@mui/material';
import { Chain, signTypedData } from '@wagmi/core';
import axios from 'axios';
import { useAtomValue, useSetAtom } from 'jotai';
import { useState } from 'react';
import { KeyedMutator } from 'swr';
import { PrivateKeyAccount } from 'viem';
import { useAccount } from 'wagmi';

export const BuyButton = () => {
  const { viewOnlyMode } = useUserAccount();
  const { activeChain } = useActiveChain();
  const { registeredOneCT, oneCTWallet, oneCtPk } = useOneCTWallet();
  const setOneCTModal = useSetAtom(isOneCTModalOpenAtom);
  const activeMarket = useAtomValue(selectedPoolActiveMarketAtom);

  if (viewOnlyMode)
    return (
      <BlueBtn isDisabled onClick={() => {}}>
        View Only Mode
      </BlueBtn>
    );

  if (!registeredOneCT || !oneCtPk)
    return (
      <ConnectionRequired>
        <BlueBtn onClick={() => setOneCTModal(true)}>
          <span>Activate Account</span>
        </BlueBtn>
      </ConnectionRequired>
    );

  if (activeMarket === undefined)
    return (
      <ConnectionRequired>
        <BlueBtn onClick={() => {}} isDisabled={true}>
          Select a Market
        </BlueBtn>
      </ConnectionRequired>
    );

  return (
    <BuyButtonAPI
      activeMarket={activeMarket}
      oneCtWallet={oneCTWallet}
      activeChain={activeChain}
      oneCtPk={oneCtPk}
    />
  );
};

export const BuyButtonAPI: React.FC<{
  activeMarket: marketTypeAB;
  oneCtWallet: PrivateKeyAccount | null;
  activeChain: Chain;
  oneCtPk: string;
}> = ({ activeMarket, activeChain, oneCtWallet, oneCtPk }) => {
  const amount = useAtomValue(tradeSizeAtom);
  const { data: approvalExpanded, mutate: updateApprovalData } =
    useApprvalAmount();
  const config = getConfig(activeChain.id);

  const token = activeMarket.poolInfo.token.toUpperCase();
  const decimals = activeMarket.poolInfo.decimals;

  if (approvalExpanded === undefined)
    return <Skeleton className="!h-[36px] full-width sr lc !transform-none" />;

  const allowance = approvalExpanded.allowance
    ? (divide(approvalExpanded?.allowance, decimals) as string)
    : '0';
  if (allowance === undefined || allowance === null)
    return (
      <ConnectionRequired>
        <BlueBtn onClick={() => {}} isDisabled={true}>
          Allowance not found
        </BlueBtn>
      </ConnectionRequired>
    );

  if (lt(allowance, amount || '0')) {
    return (
      <Approve
        approvalExpanded={approvalExpanded}
        updateApprovalData={updateApprovalData}
        tokenName={token}
        activeChainId={activeChain.id}
        oneCtWallet={oneCtWallet}
        permitName={activeMarket.poolInfo.permitName}
        routerAddress={config.router}
        tokenAddress={activeMarket.poolInfo.tokenAddress}
      />
    );
  }

  return (
    <Buy
      activeMarket={activeMarket}
      oneCtPk={oneCtPk}
      activeChainId={activeChain.id}
      routerContract={config.router}
    />
  );
};
const defaultApprovalAmount =
  '115792089237316195423570985008687907853269984665640564039457584007913129639935';

const Approve: React.FC<{
  approvalExpanded: {
    allowance: number;
    nonce: number;
    is_locked: boolean;
  };
  updateApprovalData: KeyedMutator<{
    allowance: number;
    nonce: number;
    is_locked: boolean;
  }>;
  tokenName: string;
  activeChainId: number;
  routerAddress: string;
  tokenAddress: string;
  permitName: string;
  oneCtWallet: PrivateKeyAccount | null;
}> = ({
  approvalExpanded,
  updateApprovalData,
  tokenName,
  activeChainId,
  routerAddress,
  tokenAddress,
  permitName,
  oneCtWallet,
}) => {
  const [loading, setLoading] = useState<number | null>(null);
  const toastify = useToast();
  const { state } = useGlobal();
  const { address } = useAccount();
  const { data: productNames } = useProductName();

  const handleApproveClick = async (amount = defaultApprovalAmount) => {
    if (state.txnLoading > 1) {
      toastify({
        id: 'dddafsd3',
        type: 'error',
        msg: 'Please confirm your previous pending transactions.',
      });
      return true;
    }
    if (address === undefined)
      return toastify({
        id: 'dddafsd3',
        type: 'error',
        msg: 'Please connect your wallet.',
      });

    const deadline = (Math.round(Date.now() / 1000) + 86400).toString();
    setLoading(1);
    if (amount !== '0' && amount !== defaultApprovalAmount) {
      amount = toFixed(add(amount, multiply(amount, '0.1')), 0);
    }

    try {
      const { nonce, res } = await generateApprovalSignatureWrapper(
        approvalExpanded.nonce,
        amount,
        address,
        tokenAddress,
        routerAddress,
        deadline,
        activeChainId,
        signTypedData,
        permitName
      );
      const updatedApproval = await updateApprovalData();

      if (nonce !== updatedApproval?.nonce) {
        return toastify({
          id: 'nonce changed in db',
          type: 'error',
          msg: 'Please sign again.',
        });
      }
      if (productNames === undefined)
        return toastify({
          id: '10231',
          type: 'error',
          msg: 'Product name not found.',
        });
      const [_, RSV] = res;
      const user_signature = await getSingatureCached(oneCtWallet);
      const apiSignature = {
        user: address,
        nonce: +approvalExpanded?.nonce,
        allowance: amount,
        deadline: +deadline,
        v: parseInt(RSV.v, 16),
        r: RSV.r,
        s: RSV.s,
        user_signature,
        environment: activeChainId,
        product_id: productNames['UP_DOWN'],
        state: 'PENDING',
        token: tokenName,
      };
      await axios.post(aboveBelowBaseUrl + 'approve/', null, {
        params: apiSignature,
      });
      setLoading(null);

      toastify({
        type: 'success',
        msg: amount === '0' ? 'Approval Revoked' : 'Approved Successfully.',
        id: '10231',
      });
    } catch (e) {
      setLoading(null);

      toastify({ type: 'error', msg: 'Something went wrong.', id: '10231' });
    }
  };
  return (
    <BlueBtn
      onClick={() => handleApproveClick()}
      isLoading={loading !== null}
      isDisabled={loading !== null}
    >
      Approveee
    </BlueBtn>
  );
};

const Buy: React.FC<{
  activeMarket: marketTypeAB;
  oneCtPk: string;
  activeChainId: number;
  routerContract: string;
}> = ({ activeMarket, oneCtPk, activeChainId, routerContract }) => {
  const toastify = useToast();
  const [loading, setLoading] = useState<'Up' | 'Down' | 'None'>('None');
  const amount = useAtomValue(tradeSizeAtom);
  const selectedTimestamp = useAtomValue(selectedExpiry);
  const settings = useAtomValue(tradeSettingsAtom);
  const { address } = useAccount();
  const referralData = useReferralCode();
  const { data: productNames } = useProductName();
  // const { data: maxTrades } = useMaxTrade({
  //   activeMarket,
  //   expiry: selectedTimestamp,
  // });

  const buyHandler = async (is_up: boolean) => {
    try {
      setLoading(is_up ? 'Up' : 'Down');
      let currentTimestamp = Date.now();
      let currentUTCTimestamp = Math.round(currentTimestamp / 1000);
      const signature = await  generateTradeSignature(
        address,
        expiration,
        contracts
        toFixed(multiply(maxFeePerContracts.toString(), decimals), 0),        activeMarket.address,
        toFixed(multiply(price, 8), 0),
        settings.partialFill,
        referralData[2],
        currentUTCTimestamp,
        is_above,
        activeChainId,
        routerContract,
        oneCtPk
      )
     
      
      let apiParams = {
        signature_timestamp: currentUTCTimestamp
    signature: signature,
    expiration,
    target_contract: activeMarket.address,
    user_address: address,
    contracts: '',
    strike: '',
    max_fee_per_contract: '',
    allow_partial_fill: settings.partialFill,
    referral_code: referralData[2],
    is_above,
    environment: activeChainId.toString(),
    token: activeMarket.poolInfo.token,
    product_id: productNames['UP_DOWN'],
    asset_pair: activeMarket.token0 + activeMarket.token1,


      };

      const trailingUrl = 'create/';

      const resp: { data: TradeType } = await axios.post(
        upDOwnV3BaseUrl + trailingUrl,
        apiParams,
        { params: { environment: activeChainId } }
      );
      setLoading('None');
    } catch (e: any) {
      toastify({
        id: 'trade/create error',
        type: 'error',
        msg: e.message,
      });
      setLoading('None');
    }
  };

  return (
    <ConnectionRequired>
      <BlueBtn
        onClick={() => buyHandler(true)}
        isLoading={loading === 'buy'}
        isDisabled={loading !== 'None'}
      >
        Buy
      </BlueBtn>
    </ConnectionRequired>
  );
};
