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
  selectedPriceAtom,
  readCallDataAtom,
} from '@Views/AboveBelow/atoms';
import { marketTypeAB } from '@Views/AboveBelow/types';
import { ConnectionRequired } from '@Views/Common/Navbar/AccountDropdown';
import { BlueBtn, BufferButton } from '@Views/Common/V2-Button';
import { isOneCTModalOpenAtom } from '@Views/OneCT/OneCTButton';
import { useOneCTWallet } from '@Views/OneCT/useOneCTWallet';
import { useReferralCode } from '@Views/Referral/Utils/useReferralCode';
import { useApprvalAmount } from '@Views/ABTradePage/Hooks/useApprovalAmount';
import { tradeSettingsAtom } from '@Views/ABTradePage/atoms';
import { getSingatureCached } from '@Views/ABTradePage/cache';
import { aboveBelowBaseUrl } from '@Views/ABTradePage/config';
import { TradeType } from '@Views/ABTradePage/type';
import { generateApprovalSignatureWrapper } from '@Views/ABTradePage/utils/generateApprovalSignatureWrapper';
import { generateTradeSignature } from '@Views/ABTradePage/utils/generateTradeSignature';
import { getConfig } from '@Views/ABTradePage/utils/getConfig';
import { Skeleton } from '@mui/material';
import { Chain, signTypedData } from '@wagmi/core';
import axios from 'axios';
import { useAtomValue, useSetAtom } from 'jotai';
import { useState } from 'react';
import { KeyedMutator } from 'swr';
import { PrivateKeyAccount } from 'viem';
import { useAccount } from 'wagmi';
import { strikePrices } from '@Views/AboveBelow/Hooks/useLimitedStrikeArrays';
import { useCurrentPrice } from '@Views/ABTradePage/Hooks/useCurrentPrice';
import { useIV } from '@Views/AboveBelow/Hooks/useIV';
import { getPlatformError, getTradeSizeError } from './TradeSize';
import { getSlippageError } from '@Views/ABTradePage/Views/Settings/TradeSettings/Slippage/SlippageError';
import { getAddress } from 'viem';
import { solidityKeccak256 } from 'ethers/lib/utils';

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
        product_id: productNames['AB'].product_id,
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
      Approve
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
  const [loading, setLoading] = useState<'buy' | 'approve' | 'None'>('None');
  const amount = useAtomValue(tradeSizeAtom);
  const selectedTimestamp = useAtomValue(selectedExpiry);
  const settings = useAtomValue(tradeSettingsAtom);
  const { address } = useAccount();
  const referralData = useReferralCode();
  const { data: productNames } = useProductName();
  const { data: ivs } = useIV();
  const token = activeMarket.poolInfo.token.toUpperCase();
  const decimals = activeMarket.poolInfo.decimals;
  const readCallData = useAtomValue(readCallDataAtom);

  const maxPermissibleContracts = readCallData?.maxPermissibleContracts;

  const selectedPrice = useAtomValue(selectedPriceAtom);

  // const { data: maxTrades } = useMaxTrade({
  //   activeMarket,
  //   expiry: selectedTimestamp,
  // });

  const { currentPrice } = useCurrentPrice({
    token0: activeMarket?.token0,
    token1: activeMarket?.token1,
  });

  if (selectedPrice === undefined)
    return (
      <ConnectionRequired>
        <BlueBtn onClick={() => {}} isDisabled={true}>
          Select a Strike Price
        </BlueBtn>
      </ConnectionRequired>
    );
  const priceObj = selectedPrice[activeMarket.tv_id];
  if (!priceObj)
    return (
      <ConnectionRequired>
        <BlueBtn onClick={() => {}} isDisabled={true}>
          Select a Strike Price
        </BlueBtn>
      </ConnectionRequired>
    );
  const price = priceObj.price;

  // const maxPermissibleMarket =
  //   readCallData.maxPermissibleContracts[
  //     getAddress(activeMarket.address) + price
  //   ];

  // if (maxPermissibleMarket === undefined)
  //   return (
  //     <ConnectionRequired>
  //       <BlueBtn onClick={() => {}} isDisabled={true} isLoading>
  //         Fetching data...
  //       </BlueBtn>
  //     </ConnectionRequired>
  //   );

  // const maxPermissibleContracts = maxPermissibleMarket.maxPermissibleContracts;
  // if (maxPermissibleContracts === undefined) {
  //   return (
  //     <ConnectionRequired>
  //       <BlueBtn onClick={() => {}} isDisabled={true}>
  //         Max Trade Size not found
  //       </BlueBtn>
  //     </ConnectionRequired>
  //   );
  // }
  const buyHandler = async (is_up: boolean) => {
    try {
      if (!amount || amount === '0')
        throw new Error('Please enter a valid amount');
      if (!selectedTimestamp) throw new Error('Please select expiry date');
      if (!selectedPrice) throw new Error('Please select strike price');
      if (!readCallData) throw new Error('Error fetching data');
      if (!activeMarket) throw new Error('active market not found');
      if (!currentPrice) throw new Error('current price not found');
      const strikes = strikePrices;
      const activeAssetStrikes = strikes[activeMarket.tv_id];
      if (!activeAssetStrikes)
        throw new Error('active asset strikes not found');
      const iv = ivs?.[activeMarket.tv_id];
      if (iv === undefined) throw new Error('iv not found');
      const slippageError = getSlippageError(settings.slippageTolerance);
      if (slippageError !== null) throw new Error(slippageError);
      const priceObj = selectedPrice[activeMarket.tv_id];
      if (!priceObj) throw new Error('price obj not found');
      const price = priceObj.price;
      let strikePriceObject = activeAssetStrikes.increasingPriceArray.find(
        (obj) => obj.strike.toString() == priceObj.price
      );
      if (!strikePriceObject) {
        strikePriceObject = activeAssetStrikes.decreasingPriceArray.find(
          (obj) => obj.strike.toString() == priceObj.price
        );
      }
      if (!strikePriceObject) throw new Error('Please select a strike price');
      const totalFee = priceObj.isAbove
        ? strikePriceObject.totalFeeAbove
        : strikePriceObject.totalFeeBelow;
      if (!totalFee) throw new Error('total fee not found');
      const expiration = Math.floor(selectedTimestamp / 1000);

      const balance =
        divide(readCallData.balances[token], decimals) ?? ('0' as string);

      // const maxTradeSize = multiply(
      //   divide(maxPermissibleContracts as string, decimals) as string,
      //   totalFee.toString()
      // );
      const marketHash = solidityKeccak256(
        ['uint256', 'uint256'],
        [toFixed(multiply(price.toString(), 8), 0), expiration]
      );
      const maxTradeSize =
        maxPermissibleContracts &&
        maxPermissibleContracts[
          `${getAddress(activeMarket?.address)}${marketHash}${priceObj.isAbove}`
        ]
          ? toFixed(
              divide(
                maxPermissibleContracts[
                  `${getAddress(activeMarket?.address)}${marketHash}${
                    priceObj.isAbove
                  }`
                ].maxPermissibleContracts,
                activeMarket?.poolInfo.decimals
              ),
              2
            ) * totalFee
          : undefined;

      const tradeSizeError = getTradeSizeError(
        // toFixed(totalFee.toString(), 2),
        maxTradeSize,
        balance,
        amount
      );
      if (!!tradeSizeError) throw new Error(tradeSizeError);
      const platformFeeError = getPlatformError({
        platfromFee: divide(
          activeMarket.config.platformFee,
          activeMarket.poolInfo.decimals
        ) as string,
        tradeSize: amount || '0',
        balance,
      });
      if (!!platformFeeError) throw new Error(platformFeeError);
      const maxFeePerContracts =
        totalFee + (settings.slippageTolerance / 100) * totalFee;
      setLoading('buy');
      // await writeCall(() => {}, 'initiateTrade', [
      //   [
      //     activeMarket.address,
      //     settings.partialFill,
      //     referralData[2],
      //     priceObj.isAbove,
      //     toFixed(multiply(amount, decimals), 0),
      //     toFixed(multiply(price, 8), 0),
      //     expiration,
      //     toFixed(multiply(maxFeePerContracts.toString(), decimals), 0),
      //   ],
      // ]);
      let currentTimestamp = Date.now();
      let currentUTCTimestamp = Math.round(currentTimestamp / 1000);

      const signature = await generateTradeSignature(
        address,
        expiration,
        toFixed(multiply(amount, decimals), 0),
        toFixed(multiply(maxFeePerContracts.toString(), decimals), 0),
        activeMarket.address,
        toFixed(multiply(price, 8), 0),
        settings.partialFill,
        referralData[2],
        currentUTCTimestamp,
        priceObj.isAbove,
        activeChainId,
        routerContract,
        oneCtPk
      );
      console.log({ signature });

      let apiParams = {
        signature_timestamp: currentUTCTimestamp,
        signature: signature,
        expiration,
        target_contract: activeMarket.address,
        user_address: address,
        total_fee: toFixed(multiply(amount, decimals), 0),
        strike: toFixed(multiply(price, 8), 0),
        max_fee_per_contract: toFixed(
          multiply(maxFeePerContracts.toString(), decimals),
          0
        ),
        allow_partial_fill: settings.partialFill,
        referral_code: referralData[2],
        is_above: priceObj.isAbove,
        environment: activeChainId.toString(),
        token: activeMarket.poolInfo.token,
        product_id: productNames['AB'].product_id,
        asset_pair: activeMarket.token0 + activeMarket.token1,
      };
      console.log({ apiParams });

      const trailingUrl = 'create/';

      const resp: { data: TradeType } = await axios.post(
        aboveBelowBaseUrl + trailingUrl,
        apiParams,
        { params: { environment: activeChainId } }
      );
      const content = (
        <div className="flex flex-col gap-y-2 text-f12 ">
          <div className="nowrap font-[600]">Trade order placed</div>
          <div className="flex items-center">
            {activeMarket.token0 + '-' + activeMarket.token1}&nbsp;&nbsp;
            <span className="!text-3">to go</span>&nbsp;&nbsp;
            {priceObj.isAbove ? (
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
              {toFixed(amount, 2)}&nbsp;
              {activeMarket.poolInfo.token}
            </span>
          </div>
        </div>
      );
      toastify({
        price,
        type: 'success',
        timings: 20,
        body: null,
        msg: content,
      });
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
