import DownIcon from '@SVG/Elements/DownIcon';
import UpIcon from '@SVG/Elements/UpIcon';
import { lt, multiply } from '@Utils/NumString/stringArithmatics';
import { ApproveModal } from '@Views/BinaryOptions/Components/approveModal';
import { approveModalAtom } from '@Views/BinaryOptions/PGDrawer';
import { ConnectionRequired } from '@Views/Common/Navbar/AccountDropdown';
import { BlueBtn, GreenBtn, RedBtn } from '@Views/Common/V2-Button';
import { useSwitchPool } from '@Views/TradePage/Hooks/useSwitchPool';
import { useV3BinaryActions } from '@Views/V3App/Utils/useV3BinaryActions';
import { Skeleton } from '@mui/material';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import { useAtom } from 'jotai';
import { useAccount } from 'wagmi';

export const BuyButtons = ({
  allowance,
  activeAssetPrice,
  amount,
  isAssetActive,
  isForex,
  isMarketOpen,
}: {
  isForex: boolean;
  isMarketOpen: boolean;
  allowance: string;
  activeAssetPrice: string;
  amount: string;
  isAssetActive: boolean;
}) => {
  const { address: account } = useAccount();
  const { poolDetails } = useSwitchPool();
  const { openConnectModal } = useConnectModal();
  const [isApproveModalOpen, setIsApproveModalOpen] = useAtom(approveModalAtom);
  const { handleApproveClick, buyHandler, loading } =
    useV3BinaryActions(amount);

  const UpHandler = () => {
    if (!account) return openConnectModal?.();
    if (lt(allowance || '0', amount.toString() || '0'))
      return setIsApproveModalOpen(true);
    buyHandler({ is_up: true });
  };

  const DownHandler = () => {
    if (!account) return openConnectModal?.();
    if (lt(allowance || '0', amount.toString() || '0'))
      return setIsApproveModalOpen(true);
    buyHandler({ is_up: false });
  };

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
          ) : lt(allowance, amount.toString() || '0') ? (
            <BlueBtn
              onClick={() => {
                account ? setIsApproveModalOpen(true) : openConnectModal?.();
              }}
            >
              Approve
            </BlueBtn>
          ) : !isAssetActive ? (
            <BlueBtn
              className="text-f13 text-1 text-center"
              isDisabled={true}
              onClick={() => {}}
            >
              Trading is halted for this asset
            </BlueBtn>
          ) : (
            <>
              <div className="sm:flex sm:gap-2">
                <GreenBtn
                  onClick={UpHandler}
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
                  onClick={DownHandler}
                >
                  <>
                    <DownIcon className="mr-[6px] scale-150" />
                    Down
                  </>
                </RedBtn>
              </div>
              <div
                className="approve-btn-styles text-3 hover:text-1 hover:brightness-125 transition-all duration-150 w-fit mx-auto sm:text-f13"
                role={'button'}
                onClick={() =>
                  !account ? openConnectModal?.() : handleApproveClick('0')
                }
              >
                Revoke Approval
              </div>
            </>
          )}
        </span>
      </ConnectionRequired>{' '}
    </>
  );
};
