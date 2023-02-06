import { Skeleton } from '@mui/material';

import { useGlobal } from '@Contexts/Global';
import { useAtom } from 'jotai';
import React, { ReactNode, useMemo, useState } from 'react';
import { getRes, postRes } from '@Utils/apis/api';
import useConnectionDrawer from '@Hooks/Utilities/useOpenConnectionDrawer';
import getContract from '@Utils/Contract/getContract';
import {  useConnectModal} from '@rainbow-me/rainbowkit'

import { getDisplayDate } from '@Utils/Dates/displayDateTime';
import { toFixed } from '@Utils/NumString';
import { gt } from '@Utils/NumString/stringArithmatics';
import BufferInput from '@Views/Common/BufferInput';
import ToggleButton from '@Views/Common/BufferToggleButton';
import ButtonLoader from '@Views/Common/ButtonLoader/ButtonLoader';
import { PrimaryActionBtn } from '@Views/Common/Buttons';
import BlueChip from '@Views/Common/Chips';
import { Display } from '@Views/Common/Tooltips/Display';
import { BetType, isDrawerOpen, Modal, SelectedBet } from '../../store';
import { Background } from './style';
import { IBinaryBet, useAllBets } from '../../Tables/OrderBookTable';
import Link from 'react-router-dom';
import EnterIcon from 'src/SVG/buttons/enter';
import { QuickTradeExpiry } from '../../PGDrawer';
import getNodeUrl from '@Utils/Contract/getNodeUrl';
import { memoize } from '@Utils/memoize';
import { useAccount } from 'wagmi';
import { useUserAccount } from '@Hooks/useUserAccount';

interface IContractArgs {
  contract: string;
  abi: any[];
}

interface IStatsApiParams {
  amount: string;
  contract_address: string;
  environment: string;
  strike: string;
  is_yes: boolean;
  is_above: boolean;
  expiry: number;
}
interface IBinaryStat {
  max_loss: number;
  max_payout: number;
  implied_probability: number;
  odds: number;
  expiry: number;
  premium: number;
  settlement_fee: number;
  size: number;
  token_price: number;
  total_fee: number;
  token_balance: number;
}

const fetchContract = async (token, environment) => {
  const [res, err] = await getRes('binary/contracts/', {
    params: {
      token,
      environment,
      contract_type: 'BINARY_OPTIONS',
    },
  });
  if (err) return;

  return res.options;
};
const fetchContractMemoized = memoize(fetchContract);

export default function BuyModal() {
  // const [isyes] = useAtom(BetType);
  const [userInput, setUserInput] = useState('1');
  const [toggle] = useAtom(BetType);
  const [isyes, setIsyes] = useAtom(BetType);
  const { state } = useGlobal();
  const { address: account } = useUserAccount();

  const { handleApproveClick, buyHandler, loading, approvedAmm, currStats } =
    useBinaryActions(userInput, isyes);
  const selectedData = useSelectedBet();

  // useEffect(() => {
  //   setIsYes(toggle);
  // }, [toggle, selectedData]);

  const dataArr = selectedData && [
    {
      head: 'Implied Probability',
      desc: (
        <Display data={selectedData.implied_probability.toString()} unit="%" />
      ),
    },
    {
      head: 'Odds',
      desc: selectedData.odds + 'X',
    },

    {
      head: 'Expiration Date',
      desc: getDisplayDate(selectedData.expiration),
    },
  ];
  const openWalletModal = useConnectionDrawer();
  const [, setIsConnectionDrawerOpen] = useAtom(isDrawerOpen);

  const approveDisabled = gt(approvedAmm || '0', userInput || '0');
  const noBalance = gt(userInput || '0', state.user.balance || '0');
  const buyDisabled = gt(
    userInput || '0',
    selectedData?.max_amount.toString() || '0'
  );

  const { openConnectModal } = useConnectModal();



  if (!selectedData || !state.settings.activeAsset?.txn_tokens?.length)
    return (
      <Background>
        <Skeleton className="buyModalSkel lc"></Skeleton>
      </Background>
    );
  let btns = (
    <div className="btn-container">
      {' '}
      <PrimaryActionBtn
        disabled={approveDisabled || noBalance}
        className={`button ${(approveDisabled || noBalance) && 'disbale'}`}
        onClick={
          !approveDisabled || !noBalance
            ? () => handleApproveClick()
            : console.log
        }
        // approveDisabledd={true}
      >
        {loading === 1 ? <ButtonLoader className="btn-loader" /> : '1. Approve'}
      </PrimaryActionBtn>
      <PrimaryActionBtn
        disabled={!approveDisabled || buyDisabled || noBalance}
        className={`button ${
          (!approveDisabled || buyDisabled || noBalance) && 'disbale'
        }`}
        onClick={
          approveDisabled && !buyDisabled && !noBalance
            ? buyHandler
            : console.log
        }
      >
        {loading === 2 ? <ButtonLoader className="btn-loader" /> : '2. Buy'}
      </PrimaryActionBtn>
    </div>
  );

  if (
    approvedAmm === undefined ||
    approvedAmm == null ||
    state.user.balance === undefined ||
    state.user.balance === null
  ) {
    btns = (
      <div className="btn-container full-width">
        <Skeleton variant="rectangular" className="btn-skels lc"></Skeleton>
      </div>
    );
  }
  if (!account || !library) {
    btns = (
      <div className="btn-container connect-btn ml30">
        <PrimaryActionBtn className={`button full-width`} onClick={openConnectModal}>
          Connect Wallet
        </PrimaryActionBtn>
      </div>
    );
  }

  const token = state.settings.activeAsset.txn_tokens[0];

  return (
    <Background>
      <div className="flex-bw">
        <div className="flex-center">
          <div className="f20 smr">Buy</div>
          <BlueChip data={isyes ? 'No' : 'Yes'} className="f14 spr spl fw5" />
        </div>

        <ToggleButton
          onChange={() => {
            setIsyes(!isyes);
          }}
          value={isyes}
        />
      </div>
      <div className="border-div" />
      <div className="flex-bw">
        <div className="flex">
          <img
            src={state.settings.activeAsset.underlying_asset.img}
            alt="token"
            className="image-wrapper"
          />

          <HeroData
            head={`Buy ${state.settings.activeAsset?.underlying_asset.name.toUpperCase()}`}
            desc={
              <div className="flex items-c ">
                Close {selectedData.is_above ? 'above' : 'below'}&nbsp;
                <span className={`${selectedData.is_above ? 'green' : 'red'}`}>
                  <Display data={selectedData.strike} label="$" />
                </span>
              </div>
            }
            className={'items-start'}
          />
        </div>
        {/* <HeroData
          head={<div className="text-6"></div>}
          desc={""}
          className={"items-end"}
        /> */}
      </div>

      <div className="flex-bw xxlmt data-row">
        {dataArr ? (
          dataArr.map((data, idx) => (
            <DataBox head={data.head} desc={data.desc} key={idx} />
          ))
        ) : (
          <Skeleton className="ip_skel lc" variant="rectangular"></Skeleton>
        )}
      </div>
      <div className="flex items-center xsf xxlmt smb">
        <p className="f15">Bet Amount</p>
        {noBalance && (
          <div className="f14 mt5 red text-center">
            &nbsp;(You don't have enough iBFR)
          </div>
        )}
      </div>
      <BufferInput
        onChange={(newValue) => {
          setUserInput(newValue);
        }}
        value={userInput}
        placeholder="Enter Amount"
        unit={
          <button
            className="desc unset max-button"
            onClick={() => {
              setUserInput(toFixed(selectedData.max_amount.toString(), 0));
            }}
          >
            Max
          </button>
        }
        inputType="number"
        className="full-width xxxsmr bgColor"
        ipClass="bgColor"
        numericValidations={
          selectedData.max_amount && {
            max: {
              val: selectedData.max_amount + '',
              error: (
                <div className="flex">
                  Maximum Amount is :&nbsp;{' '}
                  <Display
                    data={selectedData.max_amount.toString()}
                    unit={token.name}
                  />
                </div>
              ),
            },
            min: {
              val: '1',
              error: gt(selectedData.max_amount.toString(), '1')
                ? 'Bet amount must be atleast 1 iBFR'
                : "Liquidity isn't available.",
            },
          }
        }
      />
      <div className="flex content-sbw items-center f12 text-6 full-width mt-[10px] ">
        <div className="fit-content flex light-blue-text ibfr-faucet-link">
          <Link
            href={`/[chain]/faucet`}
            as={`/${state.settings.activeChain.name}/faucet`}
          >
            <div className="link">
              <EnterIcon className="f12" />
              iBFR Faucet
            </div>
          </Link>
          {state.settings.activeChain.nativeAsset.faucet && (
            <a
              href={state.settings.activeChain.nativeAsset.faucet}
              target={'_blank'}
            >
              <div className="link ml10">
                <EnterIcon />
                {state.settings.activeChain.nativeAsset.name} Faucet
              </div>
            </a>
          )}
        </div>
        <p className="text-6">
          Max Amount{' '}
          <Display
            data={selectedData.max_amount.toString()}
            unit={state.settings.activeAsset.deposit_token}
            className="inline"
          />
        </p>
      </div>
      <div className="flex-bw mt15 items-center ">
        <div className="bottom-container">
          {currStats ? (
            <div className="dta">
              <DataBox
                head="Max Payout"
                className="mr30"
                desc={
                  <Display
                    data={currStats.max_payout.toString()}
                    unit={state.settings.activeAsset.deposit_token}
                  />
                }
              />
              <DataBox
                head="Max Loss"
                className="mr30"
                desc={
                  <Display
                    data={currStats.max_loss.toString()}
                    unit={state.settings.activeAsset.deposit_token}
                  />
                }
              />
            </div>
          ) : (
            <Skeleton
              variant="rectangular"
              className="btn-skelss lc mr22"
            ></Skeleton>
          )}
          {btns}
        </div>
      </div>
    </Background>
  );
}

const DataBox = ({
  head,
  desc,
  className,
}: {
  head: ReactNode;
  desc: ReactNode;
  className?: string;
}) => {
  return (
    <div className={`flexc-center ${className}`}>
      <p className="headd nowrap">{head}</p>
      <p className="descc nowrap">{desc}</p>
    </div>
  );
};

const HeroData = ({ head, desc, className }) => {
  return (
    <div className={`flexc-center ${className}`}>
      <p className={'hero-head'}>{head}</p>
      <p className="hero-desc">{desc}</p>
    </div>
  );
};

export const useSelectedBet = (isQuickTrade?: {}):
  | IBinaryBet
  | { expiration: number } => {
  const { state } = useGlobal();
  const [selectedBet] = useAtom(SelectedBet);
  const data = useAllBets();
  const [currentTime, setCurrentTime] = useAtom(QuickTradeExpiry);

  if (isQuickTrade) {
    return {
      expiration: currentTime,
    };
  }

  const selectedData = useMemo(() => {
    if (selectedBet == null || !data || !data.length) return null;
    if (selectedBet >= data.length || selectedBet < 0) return null;
    return data[selectedBet];
  }, [data, selectedBet]);

  return selectedData;
};
