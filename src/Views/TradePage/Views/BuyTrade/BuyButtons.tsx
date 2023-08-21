import DownIcon from '@SVG/Elements/DownIcon';
import UpIcon from '@SVG/Elements/UpIcon';
import { lt, multiply } from '@Utils/NumString/stringArithmatics';
import { ConnectionRequired } from '@Views/Common/Navbar/AccountDropdown';
import { BlueBtn, GreenBtn, RedBtn } from '@Views/Common/V2-Button';
import { isOneCTModalOpenAtom } from '@Views/OneCT/OneCTButton';
import { useOneCTWallet } from '@Views/OneCT/useOneCTWallet';
import { useActiveMarket } from '@Views/TradePage/Hooks/useActiveMarket';
import { useBuyTradeActions } from '@Views/TradePage/Hooks/useBuyTradeActions';
import { useIsMarketOpen } from '@Views/TradePage/Hooks/useIsMarketOpen';
import { useLimitOrdersExpiry } from '@Views/TradePage/Hooks/useLimitOrdersExpiry';
import { useSwitchPool } from '@Views/TradePage/Hooks/useSwitchPool';
import {
  approveModalAtom,
  limitOrderStrikeAtom,
  tradeTypeAtom,
} from '@Views/TradePage/atoms';
import { Skeleton } from '@mui/material';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { useAccount } from 'wagmi';
import { ApproveModal } from '../ApproveModal';

export const BuyButtons = ({
  allowance,
  activeAssetPrice,
  amount,
  isApprovalLocked,
}: {
  allowance: string;
  activeAssetPrice: string;
  amount: string;
  isApprovalLocked: boolean | undefined;
}) => {
  const { registeredOneCT } = useOneCTWallet();
  const { address: account } = useAccount();
  const { poolDetails } = useSwitchPool();
  const { openConnectModal } = useConnectModal();
  const [isApproveModalOpen, setIsApproveModalOpen] = useAtom(approveModalAtom);
  const { handleApproveClick, buyHandler, loading, revokeApproveClick } =
    useBuyTradeActions(amount);
  const expiry = useLimitOrdersExpiry();
  const { activeMarket } = useActiveMarket();
  const { switchPool } = useSwitchPool();

  const setOneCTModal = useSetAtom(isOneCTModalOpenAtom);

  const tradeType = useAtomValue(tradeTypeAtom);
  const limitStrike = useAtomValue(limitOrderStrikeAtom);

  const buyTrade = (isUp?: boolean) => {
    if (!account) return openConnectModal?.();
    if (lt(allowance || '0', amount.toString() || '0'))
      return setIsApproveModalOpen(true);
    let strike = activeAssetPrice;
    let limitOrderExpiry = '0';
    if (tradeType == 'Limit' && limitStrike) {
      limitOrderExpiry = expiry ?? '0';
      // console.log(`BuyButtons-limitOrderExpiry: `, limitOrderExpiry);
      strike = limitStrike;
    }
    buyHandler({
      is_up: isUp ? true : false,
      strike,
      limitOrderExpiry: Number(limitOrderExpiry),
    });
  };
  const { isMarketOpen: isAssetActive, isForex } = useIsMarketOpen(
    activeMarket,
    switchPool?.pool
  );

  if (!poolDetails) return <>Error: Pool not found</>;

  return (
    <>
      <ApproveModal
        token={poolDetails.token}
        clickHandler={(isChecked) => {
          handleApproveClick(
            !isChecked ? multiply(amount, poolDetails.decimals) : undefined
          );
        }}
        isOpen={isApproveModalOpen}
        closeModal={() => setIsApproveModalOpen(false)}
        loading={loading as number}
      />
      <ConnectionRequired>
        <span>
          {allowance == null || !activeAssetPrice ? (
            <Skeleton className="h4 full-width sr lc mb3" />
          ) : !isAssetActive ? (
            <BlueBtn
              className="text-f13 text-1 text-center"
              isDisabled={true}
              onClick={() => {}}
            >
              Trading is halted for this asset
            </BlueBtn>
          ) : !registeredOneCT ? (
            <BlueBtn onClick={() => setOneCTModal(true)}>
              Activate Account
            </BlueBtn>
          ) : lt(allowance, amount.toString() || '0') ? (
            <BlueBtn
              onClick={() => {
                account ? setIsApproveModalOpen(true) : openConnectModal?.();
              }}
            >
              Approve
            </BlueBtn>
          ) : (
            <>
              <div className="flex gap-2">
                <GreenBtn
                  onClick={() => buyTrade(true)}
                  isDisabled={isForex && !isAssetActive}
                  isLoading={
                    !!loading &&
                    typeof loading !== 'number' &&
                    loading?.is_up === true
                  }
                  test-id="last-up-btn"
                  className=" text-1 bg-green hover:text-1"
                >
                  <>
                    <UpIcon className="mr-[6px] scale-150" />
                    Up
                  </>
                </GreenBtn>
                <RedBtn
                  isDisabled={isForex && !isAssetActive}
                  isLoading={
                    !!loading &&
                    typeof loading !== 'number' &&
                    loading?.is_up === false
                  }
                  className=" text-1 bg-red "
                  onClick={() => buyTrade(false)}
                >
                  <>
                    <DownIcon className="mr-[6px] scale-150" />
                    Down
                  </>
                </RedBtn>
              </div>
              {!isApprovalLocked && (
                <div
                  className="approve-btn-styles text-f12 text-3 hover:text-1 hover:brightness-125 transition-all duration-150 w-fit mx-auto sm:text-f13 mt-3"
                  role={'button'}
                  onClick={() =>
                    !account ? openConnectModal?.() : revokeApproveClick()
                  }
                >
                  Revoke Approval
                </div>
              )}
            </>
          )}
        </span>
      </ConnectionRequired>{' '}
    </>
  );
};
