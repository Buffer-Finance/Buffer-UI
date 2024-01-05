import { useGlobal } from '@Contexts/Global';
import { useToast } from '@Contexts/Toast';
import { useActiveChain } from '@Hooks/useActiveChain';
import { useUserAccount } from '@Hooks/useUserAccount';
import YellowWarning from '@SVG/Elements/YellowWarning';
import { toFixed } from '@Utils/NumString';
import { divide } from '@Utils/NumString/stringArithmatics';
import BufferInput from '@Views/Common/BufferInput';
import BufferTransitionedTab from '@Views/Common/BufferTransitionedTab';
import Header from '@Views/Common/Header';
import { ConnectionRequired } from '@Views/Common/Navbar/AccountDropdown';
import { HeadTitle } from '@Views/Common/TitleHead';
import { Display } from '@Views/Common/Tooltips/Display';
import HorizontalTransition from '@Views/Common/Transitions/Horizontal';
import { BlueBtn } from '@Views/Common/V2-Button';
import { usePoolNames } from '@Views/DashboardV2/hooks/usePoolNames';
import {
  tooltipKeyClasses,
  tooltipValueClasses,
} from '@Views/Earn/Components/VestCards';
import PlainCard from '@Views/Referral/Components/PlainCard';
import { ReferralCodeModal } from '@Views/Referral/Components/ReferralModal';
import { useReferralWriteCall } from '@Views/Referral/Hooks/useReferralWriteCalls';
import { useDecimalsByAsset } from '@Views/TradePage/Hooks/useDecimalsByAsset';
import { TableAligner } from '@Views/V2-Leaderboard/Components/TableAligner';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import { useAtom } from 'jotai';
import { ReactNode, useEffect, useMemo, useState } from 'react';
import { Affilate } from './Components/Affilate';
import { DataCard } from './Components/DataCard';
import { useCodeOwner } from './Hooks/useCodeOwner';
import { useRefferalTab } from './Hooks/useReferralTab';
import { useUserReferralStats } from './Hooks/useUserReferralStats';
import { isNullAdds } from './Utils/isNullAds';
import { useReferralCode } from './Utils/useReferralCode';
import { ReferralContextProvider, showCodeModalAtom } from './referralAtom';

interface IReferral {}

// status 1 - go ahead
// status 2 - NA
// status 3 - loading
export interface IReferralStat {
  totalTradesReferred: string;
  totalVolumeOfReferredTrades: string;
  totalRebateEarned: string;
  totalTradingVolume: string;
  totalDiscountAvailed: string;
  [key: string]: string;
}
export const ReferralPage = () => {
  const { activeChain } = useActiveChain();
  return (
    <ReferralContextProvider value={{ activeChain }}>
      <main className="w-full overflow-x-hidden sm:px-3 sm:pb-5">
        <HeadTitle title={'Buffer Finance | Referral'} />
        <Referral />
      </main>
    </ReferralContextProvider>
  );
};

export const tabs = ['Use a Referral', 'Create your Referral'];
const Referral: React.FC<IReferral> = ({}) => {
  const [showCodeModal, setShowCodeModal] = useAtom(showCodeModalAtom);
  const { writeTXN } = useReferralWriteCall();
  const [activeTab, setActiveTab] = useState(tabs[0]);
  const [ip, setip] = useState('');
  const toastify = useToast();
  const owner = useCodeOwner(ip);
  const { state } = useGlobal();
  const referralCodes = useReferralCode();
  const { address: account } = useUserAccount();
  const { data }: { data?: IReferralStat } = useUserReferralStats();
  const { openConnectModal } = useConnectModal();
  const { setTab, tab } = useRefferalTab();
  const decimals = useDecimalsByAsset();
  const usdcDecimals = decimals['USDC'] || 6;
  const poolNames = usePoolNames();
  const tokens = useMemo(
    () => poolNames.filter((pool) => !pool.toLowerCase().includes('pol')),
    [poolNames]
  );
  const shouldConnectWallet = !account;

  useEffect(() => {
    setip('');
  }, [activeTab]);

  useEffect(() => {
    if (
      activeTab === tabs[0] &&
      referralCodes[1] &&
      !referralCodes[0] &&
      typeof referralCodes[1] === 'string'
    )
      setip(referralCodes[1]);
  }, [activeTab, account]);

  useEffect(() => {
    if (tab === null) {
      setTab(tabs[0]);
    }
    if (tab != activeTab && tab !== null) {
      setActiveTab(tab);
    }
  }, [tab, activeTab]);

  const closeModal = () => {
    setShowCodeModal(false);
  };

  let btnText: ReactNode =
    activeTab === tabs[1] ? <>Create</> : <>Activate Referral Code</>;
  let checking = false;
  if (ip && !owner) {
    checking = true;
  }
  let toastText = '';
  if (ip && owner) {
    // not available condition
    if (activeTab === tabs[0]) {
      // traders
      if (isNullAdds(owner)) {
        btnText = 'Not Available!';
        toastText = "This code doesn't belong to any affilate!";
      }
    }
    if (activeTab === tabs[1]) {
      // affliates
      if (!isNullAdds(owner)) {
        btnText = 'Not Available!';
        toastText = 'Code already taken!';
      }
    }
  }

  let DataBoxArr: { header: string; desc: JSX.Element }[] = [];
  let affiliateBoxArr: { header: string; desc: JSX.Element }[] = [];

  if (!shouldConnectWallet) {
    if (activeTab === tabs[0]) {
      DataBoxArr = data
        ? [
            {
              header: 'Total Trading Volume',
              desc: (
                <Display
                  data={divide(data.totalTradingVolume, usdcDecimals)}
                  unit={'USDC'}
                  className="!w-full"
                  content={
                    tokens.length > 1 && (
                      <TableAligner
                        keysName={tokens}
                        keyStyle={tooltipKeyClasses}
                        valueStyle={tooltipValueClasses}
                        values={tokens.map(
                          (token) =>
                            toFixed(
                              divide(
                                data[`totalTradingVolume${token}`],
                                decimals[token]
                              ) as string,
                              2
                            ) +
                            ' ' +
                            token
                        )}
                      />
                    )
                  }
                />
              ),
            },
            {
              header: 'Total Discount',
              desc: (
                <Display
                  data={divide(data.totalDiscountAvailed, usdcDecimals)}
                  unit={'USDC'}
                  className="!w-full"
                  content={
                    tokens.length > 1 && (
                      <TableAligner
                        keysName={tokens}
                        keyStyle={tooltipKeyClasses}
                        valueStyle={tooltipValueClasses}
                        values={tokens.map(
                          (token) =>
                            toFixed(
                              divide(
                                data[`totalDiscountAvailed${token}`],
                                decimals[token]
                              ) as string,
                              2
                            ) +
                            ' ' +
                            token
                        )}
                      />
                    )
                  }
                />
              ),
            },
            {
              header: 'Active Referral Code',
              desc: (
                <div className="flex justify-center items-center">
                  <span className="mb-1"> {referralCodes[2]}</span>

                  <button
                    className="ml-3"
                    onClick={() => {
                      setShowCodeModal(true);
                    }}
                  >
                    <img src="/EditIcon.svg" />
                  </button>
                </div>
              ),
            },
          ]
        : [];
    }
    affiliateBoxArr = data
      ? [
          {
            header: 'Total Trading Volume',
            desc: (
              <Display
                data={divide(data.totalVolumeOfReferredTrades, usdcDecimals)}
                unit={'USDC'}
                className="!w-full"
                content={
                  tokens.length > 1 && (
                    <TableAligner
                      keysName={tokens}
                      keyStyle={tooltipKeyClasses}
                      valueStyle={tooltipValueClasses}
                      values={tokens.map(
                        (token) =>
                          toFixed(
                            divide(
                              data[`totalVolumeOfReferredTrades${token}`],
                              decimals[token]
                            ) as string,
                            2
                          ) +
                          ' ' +
                          token
                      )}
                    />
                  )
                }
              />
            ),
          },
          {
            header: 'Total Referred trades',
            desc: (
              <Display
                data={data?.totalTradesReferred}
                className="!w-full"
                precision={0}
                content={
                  tokens.length > 1 && (
                    <TableAligner
                      keysName={tokens}
                      keyStyle={tooltipKeyClasses}
                      valueStyle={tooltipValueClasses}
                      values={tokens.map(
                        (token) => data[`totalTradesReferred${token}`]
                      )}
                    />
                  )
                }
              />
            ),
          },
          {
            header: 'Total Rebate Earned',
            desc: (
              <Display
                data={divide(data.totalRebateEarned, usdcDecimals)}
                unit={'USDC'}
                className="!w-full"
                content={
                  tokens.length > 1 && (
                    <TableAligner
                      keysName={tokens}
                      keyStyle={tooltipKeyClasses}
                      valueStyle={tooltipValueClasses}
                      values={tokens.map(
                        (token) =>
                          toFixed(
                            divide(
                              data[`totalRebateEarned${token}`],
                              decimals[token]
                            ) as string,
                            2
                          ) +
                          ' ' +
                          token
                      )}
                    />
                  )
                }
              />
            ),
          },
        ]
      : [];
  }

  const shareHandler = () => {
    if (toastText) {
      return toastify({
        type: 'error',
        msg: toastText,
        id: '09',
      });
    }

    if (checking) {
      return toastify({
        type: 'error',
        msg: 'Please wait until referral code processing is done.',
        id: '9',
      });
    }
    if (!ip || ip === '')
      return toastify({
        type: 'error',
        msg: 'Please Enter A Valid Code.',
        id: '009',
      });
    const code = ip;
    const methodName =
      tabs.indexOf(activeTab) === 1
        ? 'registerCode'
        : 'setTraderReferralCodeByUser';
    writeTXN(code, methodName);
    closeModal();
  };

  const btn = (
    <ConnectionRequired className="w-full !h-[36px] !mt-4">
      <BlueBtn
        className="w-full !h-[36px] !mt-4"
        onClick={
          shouldConnectWallet ? () => openConnectModal?.() : shareHandler
        }
        isDisabled={state.txnLoading > 1}
        isLoading={state.txnLoading === 1}
      >
        {shouldConnectWallet
          ? 'Connect Wallet'
          : checking
          ? 'Checking...'
          : btnText}
      </BlueBtn>
    </ConnectionRequired>
  );
  useEffect(() => {
    document.title = 'Buffer | Referrals';
  }, []);

  return (
    <>
      {/* <TokenDataNotIncludedWarning /> */}
      <ReferralCodeModal
        isOpen={showCodeModal}
        closeModal={closeModal}
        btn={btn}
        inputVal={ip}
        setInputVal={setip}
      />
      <Header.Container className="mt-6">
        <>
          <Header.Icon
            src={'/Referral/Referral.svg'}
            alt="referral image"
            className="!rounded-none"
          ></Header.Icon>
          Referral
        </>
        <Header.Description>
          <div className="mb-2 block text-[#c0b8b8]">
            {' '}
            Get fee discounts and earn rebates.
          </div>
          <div className=" block ">
            {' '}
            Note that referral codes are case sensitive and that your code must
            be <br className="sm:hidden" /> created on both Arbitrum as well as
            Polygon to earn rebates on both networks.{' '}
          </div>
          <br className="sm:hidden" />
        </Header.Description>
      </Header.Container>
      <BufferTransitionedTab.Container className="mt-7">
        {tabs.map((s) => (
          <BufferTransitionedTab.Tab
            key={s}
            onClick={() => {
              setActiveTab(s);
              setTab(s);
            }}
            active={activeTab === s}
          >
            {s}
          </BufferTransitionedTab.Tab>
        ))}
      </BufferTransitionedTab.Container>

      <HorizontalTransition value={tabs.indexOf(activeTab)}>
        <>
          <div className="flex justify-center gap-4 mt-6 sm:flex-wrap">
            {referralCodes[2] !== '' && account ? (
              DataBoxArr?.map((singleData, index) => (
                <DataCard
                  desc={singleData.desc}
                  header={singleData.header}
                  key={index}
                />
              ))
            ) : (
              <PlainCard.Container className="w-[440px] mt-6 nsm:py-6 tb:px-8">
                <PlainCard.Header>Avail Referral Discounts</PlainCard.Header>
                <PlainCard.Description className="mb-3">
                  Please input a referral code to benefit from fee discounts.
                </PlainCard.Description>
                <BufferInput
                  value={ip}
                  onChange={setip}
                  className=""
                  placeholder="Enter your code"
                ></BufferInput>
                {!referralCodes[0] && referralCodes[1] && (
                  <PlainCard.Description className="my-3 flex items-center gap-2">
                    <YellowWarning />
                    Activate your referral code.
                  </PlainCard.Description>
                )}{' '}
                {btn}
              </PlainCard.Container>
            )}
          </div>
        </>
        <Affilate
          affiliateBoxArr={affiliateBoxArr}
          btn={btn}
          inputValue={ip}
          setInput={setip}
        />
      </HorizontalTransition>
    </>
  );
};
