import { useToast } from '@Contexts/Toast';
import { useUserAccount } from '@Hooks/useUserAccount';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { BlueBtn } from '@Views/Common/V2-Button';
import { useNetwork } from 'wagmi';
import { earnAtom, readEarnData } from '../earnAtom';
import { useEarnWriteCalls } from '../Hooks/useEarnWriteCalls';
import { ConnectionRequired } from '@Views/Common/Navbar/AccountDropdown';
import { useActiveChain } from '@Hooks/useActiveChain';
import { isOceanSwapOpenAtom } from '@Views/Common/OpenOceanWidget';
import { useState } from 'react';

export const btnClasses = '!w-fit px-4 rounded-sm !h-7';

export function EarnButtons({ cardNum }: { cardNum: number }) {
  const { address: account } = useUserAccount();
  const [state, setPageState] = useAtom(earnAtom);
  const { activeChain } = useActiveChain();
  const { chain } = useNetwork();
  const { claim } = useEarnWriteCalls();
  const [isClaimLoading, setIsClaimLoading] = useState(false);

  if (!account || activeChain.id !== chain?.id)
    return (
      <div className={btnClasses}>
        <ConnectionRequired>
          <></>
        </ConnectionRequired>
      </div>
    );
  switch (cardNum) {
    case 1:
    case 8:
      return (
        <div className="flex gap-5">
          <BlueBtn
            onClick={() => {
              setIsClaimLoading(true);
              claim(() => {
                setIsClaimLoading(false);
              });
            }}
            className={btnClasses}
            isLoading={isClaimLoading}
            isDisabled={isClaimLoading}
          >
            Claim
          </BlueBtn>
        </div>
      );
    case 2:
      return (
        <div className="flex gap-5">
          <BlueBtn
            onClick={() =>
              setPageState({ ...state, activeModal: 'buy', isModalOpen: true })
            }
            className={btnClasses}
          >
            Add Funds
          </BlueBtn>
          <BlueBtn
            onClick={() =>
              setPageState({ ...state, activeModal: 'sell', isModalOpen: true })
            }
            className={btnClasses}
          >
            Withdraw Funds
          </BlueBtn>
        </div>
      );

    default:
      return (
        <div className={btnClasses}>
          <ConnectionRequired>
            <></>
          </ConnectionRequired>
        </div>
      );
  }
}
