import { useToast } from '@Contexts/Toast';
import { useUserAccount } from '@Hooks/useUserAccount';
import { useAtom } from 'jotai';
import { useContext } from 'react';
import { gt } from '@Utils/NumString/stringArithmatics';
import { BlueBtn } from '@Views/Common/V2-Button';
import { useNetwork } from 'wagmi';
import { EarnContext } from '..';
import { CONTRACTS } from '../Config/Address';
import { earnAtom, readEarnData } from '../earnAtom';
import { useEarnWriteCalls } from '../Hooks/useEarnWriteCalls';
import { ConnectionRequired } from '@Views/Common/Navbar/AccountDropdown';
import { useActiveChain } from '@Hooks/useActiveChain';

export const btnClasses = '!w-fit px-4 rounded-sm !h-7';

export function EarnButtons({ cardNum }: { cardNum: number }) {
  const { address: account } = useUserAccount();
  const [state, setPageState] = useAtom(earnAtom);
  const { activeChain } = useActiveChain();
  const [pageState] = useAtom(readEarnData);
  const { chain } = useNetwork();
  const { withdraw } = useEarnWriteCalls(
    'Vester',
    cardNum === 4 ? 'BFR' : 'BLP'
  );
  const toastify = useToast();

  const showToast = (msg = 'Not enough balance') => {
    return toastify({ type: 'error', id: '007', msg });
  };

  if (!account || activeChain.id !== chain?.id)
    return (
      <div className={btnClasses}>
        <ConnectionRequired>
          <></>
        </ConnectionRequired>
      </div>
    );
  switch (cardNum) {
    case 0:

    case 3:
      const wallet_value =
        cardNum === 0
          ? pageState.earn.ibfr.user.wallet_balance.token_value
          : pageState.earn.esBfr.user.wallet_balance.token_value;
      const staked_value =
        cardNum === 0
          ? pageState.earn.ibfr.user.staked.token_value
          : pageState.earn.esBfr.user.staked.token_value;
      return (
        <div className="flex gap-5">
          {cardNum === 0 && (
            <BlueBtn
              onClick={() =>
                window.open(
                  'https://app.uniswap.org/#/tokens/arbitrum/0x1a5b0aaf478bf1fda7b934c76e7692d722982a6d',
                  '_blank'
                )
              }
              className={btnClasses}
            >
              Buy BFR
            </BlueBtn>
          )}
          <BlueBtn
            onClick={() =>
              // wallet_value === "0"
              //   ? showToast(`Not Enough ${cardNum === 0 ? "BFR" : "esBFR"}.`)
              //   :
              setPageState({
                ...state,
                activeModal: cardNum === 3 ? 'esBFRstake' : 'iBFRstake',
                isModalOpen: true,
              })
            }
            className={btnClasses}
          >
            Stake
          </BlueBtn>
          <BlueBtn
            onClick={() =>
              // staked_value === "0"
              // ? showToast(
              //     `You have not staked any ${
              //       cardNum === 0 ? "BFR" : "esBFR"
              //     }.`
              //   )
              // :
              setPageState({
                ...state,
                activeModal: cardNum === 3 ? 'esBFRunstake' : 'iBFRunstake',
                isModalOpen: true,
              })
            }
            className={btnClasses}
          >
            Unstake
          </BlueBtn>
        </div>
      );
    case 1:
      const isRewardAvailable = gt(pageState.earn.total_rewards.total, '0');
      return (
        <div className="flex gap-5">
          <BlueBtn
            onClick={
              () =>
                // isRewardAvailable
                //   ?
                setPageState({
                  ...state,
                  activeModal: 'compound',
                  isModalOpen: true,
                })
              // :
              // showToast("You don't have any rewards yet.")
            }
            className={btnClasses}
          >
            Compound
          </BlueBtn>
          <BlueBtn
            onClick={
              () =>
                // isRewardAvailable
                //   ?
                setPageState({
                  ...state,
                  activeModal: 'claim',
                  isModalOpen: true,
                })
              // : showToast("You don't have any rewards yet.")
            }
            className={btnClasses}
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
              // pageState.earn.usdc.wallet_balance === "0"
              //   ? showToast(`Not enough USDC.`)
              //   :
              setPageState({ ...state, activeModal: 'buy', isModalOpen: true })
            }
            className={btnClasses}
          >
            Add Funds
          </BlueBtn>
          <BlueBtn
            onClick={() =>
              // pageState.earn.blp.user.staked.token_value === "0"
              //   ? showToast("You don't have any BLP.")
              //   :
              setPageState({ ...state, activeModal: 'sell', isModalOpen: true })
            }
            className={btnClasses}
          >
            Withdraw Funds
          </BlueBtn>
        </div>
      );
    case 4:
    case 5:
    case 6:
      let activeModalname = '';
      let shouldWithdraw = false;
      if (cardNum === 4) {
        activeModalname = 'iBFRdeposit';
        shouldWithdraw = pageState.vest.ibfr.vesting_status.vested !== '0';
      } else if (cardNum === 5) {
        activeModalname = 'BLPdeposit';
        shouldWithdraw = pageState.vest.blp.vesting_status.vested !== '0';
      } else if (cardNum === 6) {
        activeModalname = 'ARBBLPdeposit';
        shouldWithdraw = pageState.vest.arbblp.vesting_status.vested !== '0';
      }

      return (
        <div className="flex gap-5">
          <BlueBtn
            onClick={() =>
              setPageState({
                ...state,
                activeModal: activeModalname,
                isModalOpen: true,
              })
            }
            className={btnClasses}
          >
            Deposit
          </BlueBtn>
          <BlueBtn
            onClick={() =>
              shouldWithdraw
                ? withdraw()
                : showToast('You have not deposited any tokens.')
            }
            className={btnClasses}
          >
            Withdraw
          </BlueBtn>
        </div>
      );
    case 7:
      return (
        <div className="flex gap-5">
          <BlueBtn
            onClick={() =>
              // pageState.earn.usdc.wallet_balance === "0"
              //   ? showToast(`Not enough USDC.`)
              //   :
              setPageState({
                ...state,
                activeModal: 'buyARB',
                isModalOpen: true,
              })
            }
            className={btnClasses}
          >
            Add Funds
          </BlueBtn>
          <BlueBtn
            onClick={() =>
              // pageState.earn.blp.user.staked.token_value === "0"
              //   ? showToast("You don't have any BLP.")
              //   :
              setPageState({
                ...state,
                activeModal: 'sellARB',
                isModalOpen: true,
              })
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
