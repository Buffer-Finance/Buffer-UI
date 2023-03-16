import { useGlobal } from '@Contexts/Global';
import { useToast } from '@Contexts/Toast';
import { useAtom } from 'jotai';
import { useState, useEffect, ReactNode, useMemo } from 'react';
import { useCodeOwner } from './Hooks/useCodeOwner';
import BufferInput from '@Views/Common/BufferInput';
import BufferTransitionedTab from '@Views/Common/BufferTransitionedTab';
import Header from '@Views/Common/Header';
import HorizontalTransition from '@Views/Common/Transitions/Horizontal';
import Drawer from '@Views/Common/V2-Drawer';
import PlainCard from '@Views/Referral/Components/PlainCard';
import { ReferralCodeModal } from '@Views/Referral/Components/ReferralModal';
import { useReferralWriteCall } from '@Views/Referral/Hooks/useReferralWriteCalls';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import { ReferralContextProvider, showCodeModalAtom } from './referralAtom';
import ReferralABI from './Config/ReferralABI.json';
import { isNullAdds } from './Utils/isNullAds';
import { Display } from '@Views/Common/Tooltips/Display';
import { useReferralCode } from './Utils/useReferralCode';
import YellowWarning from '@SVG/Elements/YellowWarning';
import { BlueBtn } from '@Views/Common/V2-Button';
import { useUserCode } from './Hooks/useUserCode';
import { Chain, useContractReads } from 'wagmi';
import { ContentCopy } from '@mui/icons-material';
import { useCopyToClipboard } from 'react-use';
import { getContract } from './Config/Address';
import getDeepCopy from '@Utils/getDeepCopy';
import { convertBNtoString } from '@Utils/useReadCall';
import useSWR from 'swr';
import axios from 'axios';
import { divide } from '@Utils/NumString/stringArithmatics';
import { Tooltip } from '@mui/material';
import { useUserAccount } from '@Hooks/useUserAccount';
import { HeadTitle } from '@Views/Common/TitleHead';
import { useActiveChain } from '@Hooks/useActiveChain';
import { snackAtom } from 'src/App';
import { useSearchParams } from 'react-router-dom';

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
}
export const ReferralPage = () => {
  const { activeChain } = useActiveChain();
  return (
    <ReferralContextProvider value={{ activeChain }}>
      <main className="w-full overflow-x-hidden sm:px-3 sm:pb-5">
        <HeadTitle title={'Buffer Finance | Referral'} />
        <Referral />
      </main>

      <Drawer open={false} className="sm:hidden tb:hidden">
        <></>
      </Drawer>
    </ReferralContextProvider>
  );
};

const useUserAffilateCode = (activeChain: Chain) => {
  const { address } = useUserAccount();
  const referralAddress = getContract();

  const calls = referralAddress
    ? [
        {
          address: referralAddress,
          abi: ReferralABI,
          functionName: 'traderReferralCodes',
          args: [address],
          chainId: activeChain.id,
        },
      ]
    : [];

  const { data } = useContractReads({
    contracts: calls,
    watch: true,
  });

  if (data && data?.[0]) {
    const convertedData = getDeepCopy(data?.[0]);
    convertBNtoString(convertedData);
  }
  return data;
};

export const useRefferalTab = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const tab = useMemo(() => searchParams.get('tab'), [searchParams]);

  function setTab(tab: string) {
    setSearchParams({ tab });
  }

  return { tab, setTab };
};

export const tabs = ['Use a Referral', 'Create your Referral'];
const Referral: React.FC<IReferral> = ({}) => {
  const { configContracts } = useActiveChain();
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
  const usdcDecimals = configContracts.tokens['USDC'].decimals;

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

  let DataBoxArr = [];
  let affiliateBoxArr = [];

  if (!shouldConnectWallet) {
    if (activeTab === tabs[0]) {
      DataBoxArr = data && [
        {
          header: 'Total Trading Volume',
          desc: (
            <Display
              data={divide(data.totalTradingVolume, usdcDecimals)}
              unit={'USDC'}
            />
          ),
        },
        {
          header: 'Total Discount',
          desc: (
            <Display
              data={divide(data.totalDiscountAvailed, usdcDecimals)}
              unit={'USDC'}
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
      ];
    }
    affiliateBoxArr = data && [
      {
        header: 'Total Trading Volume',
        desc: (
          <Display
            data={divide(data.totalVolumeOfReferredTrades, usdcDecimals)}
            unit={'USDC'}
          />
        ),
      },
      {
        header: 'Total Referred trades',
        desc: data?.totalTradesReferred,
      },
      {
        header: 'Total Rebate Earned',
        desc: (
          <Display
            data={divide(data.totalRebateEarned, usdcDecimals)}
            unit={'USDC'}
          />
        ),
      },
    ];
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
    <BlueBtn
      className="w-full !h-[36px] !mt-4"
      onClick={shouldConnectWallet ? openConnectModal : shareHandler}
      isDisabled={state.txnLoading > 1}
      isLoading={state.txnLoading === 1}
    >
      {shouldConnectWallet
        ? 'Connect Wallet'
        : checking
        ? 'Checking...'
        : btnText}
    </BlueBtn>
  );
  useEffect(() => {
    document.title = 'Buffer | Referrals';
  }, []);

  return (
    <>
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
          <span className="mb-2 block">
            {' '}
            Get fee discounts and earn rebates.
          </span>
          <span className=" block text-[#c0b8b8]">
            {' '}
            Note that referral codes are case sensitive and that your code must
            be <br className="sm:hidden" /> created on both Arbitrum as well as
            Polygon to earn rebates on both networks.{' '}
          </span>
          <br className="sm:hidden" />
          {/* For more information, please read the
          <Header.Link
            link={
              "https://app.slack.com/client/TLS7ZNBBP/C02LVG11QBT/thread/C020XKKUT9D-1662701403.671479"
            }
          >
            Buffer referral system
          </Header.Link> */}
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
                  className="bg-5 ip-border "
                  placeholder="Enter your code"
                  // unit={<img className="" src="/EditIcon.svg"></img>}
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
          shouldConnectWallet={shouldConnectWallet}
        />
      </HorizontalTransition>
    </>
  );
};

const DataCard = ({ header, desc }) => {
  return (
    <PlainCard.Container className="w-fit m-[0] py-5 !px-7">
      <PlainCard.Header className="capitalize">{header}</PlainCard.Header>
      <PlainCard.Description className="text-center text-buffer-blue text-f22">
        {desc}
      </PlainCard.Description>
    </PlainCard.Container>
  );
};

const Affilate = ({
  affiliateBoxArr,
  shouldConnectWallet,
  inputValue,
  setInput,
  btn,
}) => {
  const { activeChain } = useActiveChain();
  const { affiliateCode } = useUserCode(activeChain);
  const isCodeSet = !!affiliateCode;
  const [snack, setSnack] = useAtom(snackAtom);
  const { hostname } = window.location;
  const [state, copyToClipboard] = useCopyToClipboard();
  const [open, setOpen] = useState(false);
  const link = `https://${hostname}/#/refer/${affiliateCode}/`;
  console.log(`link: `, link);
  const copyLink = () => {
    try {
      copyToClipboard(link);
      setOpen(true);
    } catch (err) {
      setOpen(false);
    }
  };

  useEffect(() => {
    if (open) {
      setTimeout(() => {
        setOpen(false);
      }, 4000);
    }
  }, [open]);
  return (
    <>
      <div className="flex justify-center gap-4 mt-6 sm:flex-wrap">
        {isCodeSet &&
          affiliateBoxArr?.map((singleData, index) => (
            <DataCard
              desc={singleData.desc}
              header={singleData.header}
              key={index}
            />
          ))}
      </div>

      <PlainCard.Container className="w-[440px] mt-6 nsm:py-6 tb:px-8 m-auto sm:mt-4">
        <PlainCard.Header>
          {isCodeSet ? 'Copy your Referral Link' : 'Share your Referral Code'}
        </PlainCard.Header>
        {!isCodeSet && (
          <PlainCard.Description className="mb-3">
            Looks like you dont have any referral to share. Create one now and
            start earning.
          </PlainCard.Description>
        )}
        <BufferInput
          value={isCodeSet ? affiliateCode : inputValue}
          isDisabled={isCodeSet}
          bgClass={'!pr-[6px]'}
          unit={
            isCodeSet ? (
              <Tooltip
                open={open}
                onClose={() => {
                  setOpen(false);
                }}
                title="Copied"
                placement="top"
                disableFocusListener
                disableHoverListener
                disableTouchListener
                classes={{
                  tooltip: 'tooltip',
                  arrow: 'arrow',
                }}
              >
                <button onClick={copyLink} className="bg-blue p-3 rounded">
                  <ContentCopy />
                </button>
              </Tooltip>
            ) : (
              <></>
            )
          }
          onChange={setInput}
          className="bg-5 ip-border "
          placeholder="Enter your code"
        />
        {!isCodeSet && btn}
      </PlainCard.Container>
    </>
  );
};

export const useUserReferralStats = () => {
  const { address } = useUserAccount();
  const { configContracts } = useActiveChain();
  return useSWR(`${address}-stats`, {
    fetcher: async () => {
      const response = await axios.post(configContracts.graph.MAIN, {
        query: `{
            referralDatas (where: { id: "${address}"} ) {
              totalTradesReferred
              totalVolumeOfReferredTrades
              totalRebateEarned
              totalTradingVolume
              totalDiscountAvailed
            }
          }
          `,
      });
      return (
        response.data?.data?.referralDatas?.[0] || {
          totalTradesReferred: '0',
          totalVolumeOfReferredTrades: '0',
          totalRebateEarned: '0',
          totalTradingVolume: '0',
          totalDiscountAvailed: '0',
        }
      );
    },
    refreshInterval: 400,
  });
};
