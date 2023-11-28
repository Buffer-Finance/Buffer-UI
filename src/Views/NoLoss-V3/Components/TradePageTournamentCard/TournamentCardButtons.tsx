import {
  SessionValidationModuleAddress,
  setSessionSigner,
  useSmartWallet,
} from '@Hooks/AA/useSmartWallet';
import { useWriteCall } from '@Hooks/useWriteCall';
import { getCallId } from '@Utils/Contract/multiContract';
import { divide } from '@Utils/NumString/stringArithmatics';
import { ConnectionRequired } from '@Views/Common/Navbar/AccountDropdown';
import { Display } from '@Views/Common/Tooltips/Display';
import { BufferButton } from '@Views/Common/V2-Button';
import { activeChainAtom, userAtom } from '@Views/NoLoss-V3/atoms';
import { getNoLossV3Config } from '@Views/NoLoss-V3/helpers/getNolossV3Config';
import { ItournamentData } from '@Views/NoLoss-V3/types';
import {
  IHybridPaymaster,
  PaymasterMode,
  SponsorUserOperationDto,
} from '@biconomy/paymaster';
import {
  DEFAULT_SESSION_KEY_MANAGER_MODULE,
  SessionKeyManagerModule,
} from '@biconomy/modules';
import { Skeleton } from '@mui/material';
import { ethers } from 'ethers';
import { defaultAbiCoder } from 'ethers/lib/utils';
import { useAtomValue } from 'jotai';
import { useEffect, useState } from 'react';
import { encodeFunctionData } from 'viem';
import { erc20ABI } from 'wagmi';
import TournamentLeaderboardABI from '../../ABIs/TournamentLeaderboard.json';
import TournamentManagerABI from '../../ABIs/TournamentManager.json';
export const tournamentButtonStyles =
  '!text-f14 flex items-center gap-x-2 !h-fit py-2 bg-blue b1200:px-2';

export const TournamentCardButtons: React.FC<{
  tournament: ItournamentData;
  activeAllMyTab: 'my' | 'all';
  tournamentBasedData:
    | {
        buyInTokenToManagerAllowance:
          | {
              id: string;
              allowance: string | undefined;
            }[]
          | undefined;
        buyInTokenBalances:
          | {
              id: string;
              balance: string | undefined;
            }[]
          | undefined;
      }
    | undefined;
}> = ({ tournament, activeAllMyTab, tournamentBasedData }) => {
  const activeChain = useAtomValue(activeChainAtom);
  const user = useAtomValue(userAtom);
  const { smartWallet, smartWalletAddress } = useSmartWallet();
  const [btnLoading, setBtnLoading] = useState(false);

  const { writeCall } = useWriteCall();
  const [isSessionKeyModuleEnabled, setIsSessionKeyModuleEnabled] = useState<
    boolean | null
  >(null);
  // smartAccount.getAccountAddress();

  useEffect(() => {
    let checkSessionModuleEnabled = async () => {
      if (!smartWallet) {
        setIsSessionKeyModuleEnabled(false);
        return;
      }
      try {
        // ATTENTION, isModuleEnabled  - a very important function is not available on smartAccount
        console.log(
          'isSessionKeyModuleEnabled',
          await smartWallet.getAccountAddress()
        );
        const isEnabled = await smartWallet?.isModuleEnabled(
          DEFAULT_SESSION_KEY_MANAGER_MODULE
        );

        setIsSessionKeyModuleEnabled(isEnabled);
        return;
      } catch (err: any) {
        console.log('error whilegettingdefault ', err);
        setIsSessionKeyModuleEnabled(false);
        return;
      }
    };
    checkSessionModuleEnabled();
  }, [smartWallet]);
  if (user === undefined || user.userAddress === undefined)
    return (
      <ConnectionRequired className="!text-f14 h-fit bg-blue mt-4 py-2">
        <></>
      </ConnectionRequired>
    );
  if (tournamentBasedData === undefined)
    return (
      <Skeleton className="!h-[26px] full-width b1200:!w-[100px] sr lc !mt-4 !transform-none" />
    );
  if (!activeChain) return <></>;
  if (
    tournament.state.toLowerCase() !== 'closed' &&
    +tournament.tournamentMeta.close < Math.floor(Date.now() / 1000)
  ) {
    return <></>;
  }
  const config = getNoLossV3Config(activeChain.id);

  const allowanceId = getCallId(
    tournament.tournamentMeta.buyinToken,
    'allowance',
    [user.userAddress, config.manager]
  );
  const allowance = tournamentBasedData?.buyInTokenToManagerAllowance?.find(
    (allowanceObj) => allowanceObj.id === allowanceId
  )?.allowance;
  const ticketCost = divide(
    tournament.tournamentMeta.ticketCost,
    tournament.buyinTokenDecimals
  ) as string;

  if (allowance === undefined)
    return (
      <Skeleton className="!h-[26px] full-width b1200:!w-[100px] sr lc !mt-4 !transform-none" />
    );
  let secondButton = null;
  async function handleClaim() {
    setBtnLoading(true);
    await writeCall(
      config.leaderboard,
      TournamentLeaderboardABI,
      (response) => {
        setBtnLoading(false);
        console.log(response);
      },
      'claimReward',
      [tournament.id]
    );
  }

  if (tournament.state.toLowerCase() === 'closed' && activeAllMyTab === 'my') {
    const alreadClaimed = tournament.hasUserClaimed;

    secondButton = (
      <BufferButton
        onClick={handleClaim}
        isLoading={btnLoading}
        className={tournamentButtonStyles}
        isDisabled={tournament.hasUserClaimed === true}
      >
        {alreadClaimed ? 'Already Claimed' : 'Claim'}
      </BufferButton>
    );
  } else {
    const approveTournamentManager = async () => {
      if (!smartWallet) return;
      console.log(smartWallet);
      const allowanceTxn = {
        data: encodeFunctionData({
          abi: erc20ABI,
          functionName: 'approve',
          args: [
            config.manager,
            115792089237316195423570985008687907853269984665640564039457584007913129639935n,
          ],
        }),
        to: tournament.tournamentMeta.buyinToken,
      };
      const buyPlayTokensTxn = {
        data: encodeFunctionData({
          abi: TournamentManagerABI,
          functionName: 'buyTournamentTokens',
          args: [tournament.id],
        }),
        to: config.manager,
      };
      const approveForAllTxn = {
        data: encodeFunctionData({
          abi: TournamentManagerABI,
          functionName: 'setApprovalForAll',
          args: [config.router, true],
        }),
        to: config.manager,
      };
      async function createSessionTxnGiver() {
        if (!smartWallet || !smartWalletAddress) return [];
        // -----> setMerkle tree tx flow
        // create dapp side session key
        const sessionSigner = ethers.Wallet.createRandom();
        const sessionKeyEOA = await sessionSigner.getAddress();
        console.log('sessionKeyEOA', sessionKeyEOA);
        // BREWARE JUST FOR DEMO: update local storage with session key
        setSessionSigner(smartWalletAddress, sessionSigner.privateKey);
        console.log('setting-pk', sessionSigner.privateKey);
        // generate sessionModule
        const sessionModule = await SessionKeyManagerModule.create({
          moduleAddress: DEFAULT_SESSION_KEY_MANAGER_MODULE,
          smartAccountAddress: smartWalletAddress,
        });

        // cretae session key data
        const sessionKeyData = defaultAbiCoder.encode(
          ['address', 'address'],
          [
            sessionKeyEOA,
            SessionValidationModuleAddress, // erc20 token address
          ]
        );
        console.log(`1Session-sessionKeyData: `, sessionKeyData);

        const sessionTxData = await sessionModule.createSessionData([
          {
            validUntil: 0,
            validAfter: 0,
            sessionValidationModule: SessionValidationModuleAddress,
            sessionPublicKey: sessionKeyEOA,
            sessionKeyData: sessionKeyData,
          },
        ]);
        console.log('2sessionTxData', sessionTxData);

        // write a programe using wagmi hooks to send some erc20 tokens
        // tx to set session key
        const setSessiontrx = {
          to: DEFAULT_SESSION_KEY_MANAGER_MODULE, // session manager module address
          data: sessionTxData.data,
        };

        const transactionArray = [];

        // -----> enableModule session manager module
        if (!isSessionKeyModuleEnabled) {
          const enableModuleTrx = await smartWallet?.getEnableModuleData(
            DEFAULT_SESSION_KEY_MANAGER_MODULE
          );
          transactionArray.push(enableModuleTrx);
        }

        transactionArray.push(setSessiontrx);
        console.log(
          `TournamentCardButtons-transactionArray: `,
          transactionArray
        );
        return transactionArray;
      }
      const sessionCreationTxns = await createSessionTxnGiver();
      const transactions = [
        allowanceTxn,
        buyPlayTokensTxn,
        approveForAllTxn,
        ...sessionCreationTxns,
      ];
      const userOps = await smartWallet?.buildUserOp(transactions, {
        paymasterServiceData: {
          mode: PaymasterMode.SPONSORED,
        },
      });

      // let paymasterServiceData: SponsorUserOperationDto = {
      //   mode: PaymasterMode.SPONSORED,
      //   smartAccountInfo: {
      //     name: 'BICONOMY',
      //     version: '2.0.0',
      //   },
      // };
      // const biconomyPaymaster =
      //   smartWallet?.paymaster as IHybridPaymaster<SponsorUserOperationDto>;
      // const paymasterAndDataResponse =
      //   await biconomyPaymaster.getPaymasterAndData(
      //     userOps,
      //     paymasterServiceData
      //   );
      // console.log(`deb 1, TournamentCardButtons-transactions: `, transactions);
      // userOps.paymasterAndData = paymasterAndDataResponse.paymasterAndData;

      console.log(`deb 2, TournamentCardButtons-transactions: `, userOps);
      const userOpResponse = await smartWallet.sendUserOp(userOps);

      console.log(' deb 3 send-txnuserOpHash', userOpResponse);
      const { receipt } = await userOpResponse.wait(1);
      console.log(` deb 4  send-txn reciept: `, receipt);
    };

    const hasUserBoughtMaxTickets =
      tournament.userBoughtTickets >=
      tournament.tournamentConditions.maxBuyinsPerWallet;
    const maximumparticipantsReached =
      parseInt(tournament.tournamentLeaderboard.userCount) >=
      parseInt(tournament.tournamentConditions.maxParticipants);

    secondButton = (
      <>
        <BufferButton
          onClick={approveTournamentManager}
          isLoading={btnLoading}
          className={tournamentButtonStyles}
        >
          {maximumparticipantsReached ? (
            'Sold Out'
          ) : hasUserBoughtMaxTickets ? (
            'Max bought'
          ) : (
            <>
              {+tournament.userBoughtTickets > 0 ? 'Re-Buy' : 'Entry'}
              <Display
                data={ticketCost}
                unit={tournament.buyinTokenSymbol}
                precision={0}
              />
            </>
          )}
        </BufferButton>
      </>
    );
  }
  // else if (
  //   secondButton === null &&
  //   tournament.state.toLowerCase() !== 'closed'
  // ) {
  //   const buyPlayTokens = () => {
  //     setBtnLoading(true);
  //     writeCall(
  //       config.manager,
  //       TournamentManagerABI,
  //       (response) => {
  //         setBtnLoading(false);
  //         console.log(response);
  //       },
  //       'buyTournamentTokens',
  //       [tournament.id]
  //     );
  //   };
  // const hasUserBoughtMaxTickets =
  //   tournament.userBoughtTickets >=
  //   tournament.tournamentConditions.maxBuyinsPerWallet;
  // const maximumparticipantsReached =
  //   parseInt(tournament.tournamentLeaderboard.userCount) >=
  //   parseInt(tournament.tournamentConditions.maxParticipants);
  //   secondButton = (
  //     <BufferButton
  //       className={tournamentButtonStyles}
  //       onClick={buyPlayTokens}
  //       isLoading={btnLoading}
  //       isDisabled={hasUserBoughtMaxTickets || maximumparticipantsReached}
  //     >
  // {maximumparticipantsReached ? (
  //   'Sold Out'
  // ) : hasUserBoughtMaxTickets ? (
  //   'Max bought'
  // ) : (
  //   <>
  //     {+tournament.userBoughtTickets > 0 ? 'Re-Buy' : 'Entry'}
  //     <Display
  //       data={ticketCost}
  //       unit={tournament.buyinTokenSymbol}
  //       precision={0}
  //     />
  //   </>
  // )}
  //     </BufferButton>
  //   );
  // }

  return (
    <div className="flex b1200:flex-col items-center justify-center gap-[5px] mt-4">
      {/* <BufferButton
        className={tournamentButtonStyles}
        isDisabled={
          tournament.id === activeTournamentId ||
          tournament.state.toLowerCase() === 'upcoming'
        }
        onClick={() => {
          setActiveTournament(tournament.id);
        }}
      >
        <TradeIcon />
        Trade
      </BufferButton> */}
      {secondButton}
    </div>
  );
};
