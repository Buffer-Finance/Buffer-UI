import { useToast } from '@Contexts/Toast';
import { useUserAccount } from '@Hooks/useUserAccount';
import useOpenConnectionDrawer from '@Hooks/Utilities/useOpenConnectionDrawer';
import { useAtom } from 'jotai';
import { useContext } from 'react';
import { gt } from '@Utils/NumString/stringArithmatics';
import { BlueBtn } from '@Views/Common/V2-Button';
import { useNetwork } from 'wagmi';
import { EarnContext } from '..';
import { CONTRACTS } from '../Config/Address';
import { earnAtom, readEarnData } from '../earnAtom';
import { useEarnWriteCalls } from '../Hooks/useEarnWriteCalls';
export const btnClasses = '!w-fit px-4 rounded-sm !h-7';

import {  useConnectModal} from '@rainbow-me/rainbowkit'
export function EarnButtons({ cardNum }) {
  const { address: account } = useUserAccount();
  const [state, setPageState] = useAtom(earnAtom);
  const { activeChain } = useContext(EarnContext);
  const [pageState] = useAtom(readEarnData);
  const { openConnectModal } = useConnectModal();

  const { chain } = useNetwork();
  const { openWalletDrawer } = useOpenConnectionDrawer();
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
      <BlueBtn onClick={openConnectModal} className={btnClasses}>
        Connect Wallet
      </BlueBtn>
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
      const wallet_balance =
        pageState.earn.esBfr.user.wallet_balance.token_value;

      const shouldWithdraw =
        cardNum === 4
          ? pageState.vest.ibfr.vesting_status.vested !== '0'
          : pageState.vest.blp.vesting_status.vested !== '0';
      return (
        <div className="flex gap-5">
          <BlueBtn
            onClick={() =>
              // wallet_balance === "0"
              //   ? showToast(`Not enough esBFR.`)
              //   :
              setPageState({
                ...state,
                activeModal: cardNum === 4 ? 'iBFRdeposit' : 'BLPdeposit',
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
                ? withdraw(
                    cardNum === 4
                      ? CONTRACTS[activeChain?.id].BfrVester
                      : CONTRACTS[activeChain?.id].BlpVester
                  )
                : showToast('You have not deposited any tokens.')
            }
            className={btnClasses}
          >
            Withdraw
          </BlueBtn>
        </div>
      );
    default:
      return (
        <BlueBtn onClick={openConnectModal} className={btnClasses}>
          Connect Wallet
        </BlueBtn>
      );
  }
}
