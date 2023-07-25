import { useActiveChain } from '@Hooks/useActiveChain';
import DownIcon from '@SVG/Elements/DownIcon';
import UpIcon from '@SVG/Elements/UpIcon';
import { lt, multiply } from '@Utils/NumString/stringArithmatics';
import { ApproveModal } from '@Views/BinaryOptions/Components/approveModal';
import { approveModalAtom } from '@Views/BinaryOptions/PGDrawer';
import { ConnectionRequired } from '@Views/Common/Navbar/AccountDropdown';
import { BlueBtn, GreenBtn, RedBtn } from '@Views/Common/V2-Button';
import { isOneCTModalOpenAtom } from '@Views/OneCT/OneCTButton';
import { useOneCTWallet } from '@Views/OneCT/useOneCTWallet';
import { useActiveMarket } from '@Views/TradePage/Hooks/useActiveMarket';
import { useBuyTradeActions } from '@Views/TradePage/Hooks/useBuyTradeActions';
import { useIsMarketOpen } from '@Views/TradePage/Hooks/useIsMarketOpen';
import { useLimitOrdersExpiry } from '@Views/TradePage/Hooks/useLimitOrdersExpiry';
import { useSwitchPool } from '@Views/TradePage/Hooks/useSwitchPool';
import { limitOrderStrikeAtom, tradeTypeAtom } from '@Views/TradePage/atoms';
import { Skeleton } from '@mui/material';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { useAccount, useProvider } from 'wagmi';

export const BuyButtons = ({
  allowance,
  activeAssetPrice,
  amount,
  isForex,
  isMarketOpen,
}: {
  isForex: boolean;
  isMarketOpen: boolean;
  allowance: string;
  activeAssetPrice: string;
  amount: string;
}) => {
  const { registeredOneCT, oneCtPk } = useOneCTWallet();
  const { address: account } = useAccount();
  const { poolDetails } = useSwitchPool();
  const { openConnectModal } = useConnectModal();
  const [isApproveModalOpen, setIsApproveModalOpen] = useAtom(approveModalAtom);
  const { handleApproveClick, buyHandler, loading, revokeApproveClick } =
    useBuyTradeActions(amount);
  const expiry = useLimitOrdersExpiry();
  const { activeChain } = useActiveChain();
  const { activeMarket } = useActiveMarket();
  const { switchPool } = useSwitchPool();

  const provider = useProvider({ chainId: activeChain.id });
  const setOneCTModal = useSetAtom(isOneCTModalOpenAtom);

  const tradeType = useAtomValue(tradeTypeAtom);
  const limitStrike = useAtomValue(limitOrderStrikeAtom);
  const buyTrade = (isUp?: boolean) => {
    if (!account) return openConnectModal?.();
    if (lt(allowance || '0', amount.toString() || '0'))
      return setIsApproveModalOpen(true);
    let strike = activeAssetPrice;
    let limitOrderExpiry = 0;
    if (tradeType == 'Limit' && limitStrike) {
      limitOrderExpiry = expiry;
      console.log(`BuyButtons-limitOrderExpiry: `, limitOrderExpiry);
      strike = limitStrike;
    }
    buyHandler({
      is_up: isUp ? true : false,
      strike,
      limitOrderExpiry,
    });
  };
  const { isMarketOpen: isAssetActive } = useIsMarketOpen(
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
                  isDisabled={isForex && !isMarketOpen}
                  isLoading={
                    !!loading &&
                    typeof loading !== 'number' &&
                    loading?.is_up === true
                  }
                  className=" text-1 bg-green hover:text-1"
                >
                  <>
                    <UpIcon className="mr-[6px] scale-150" />
                    Up
                  </>
                </GreenBtn>
                <RedBtn
                  isDisabled={isForex && !isMarketOpen}
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
              {/* <div
                className="approve-btn-styles text-f12 text-3 hover:text-1 hover:brightness-125 transition-all duration-150 w-fit mx-auto sm:text-f13 mt-3"
                role={'button'}
                onClick={() =>
                  !account ? openConnectModal?.() : revokeApproveClick()
                }
              >
                Revoke Approval
              </div> */}
            </>
          )}
        </span>
      </ConnectionRequired>{' '}
    </>
  );
};
