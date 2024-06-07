import { Alert, Snackbar } from '@mui/material';
import { atom, useAtom, useAtomValue } from 'jotai';
import { atomWithStorage } from 'jotai/utils';
import { useEffect } from 'react';
import {
  Link,
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
  useSearchParams,
} from 'react-router-dom';
import { Suspense, lazy } from 'react';
import USDCMono from '/USDCMonochrome.svg';
import ARBMono from '/ARBMonochrome.svg';
import { v4 } from 'uuid';

export const CHART_TVID = v4().substring(0, 6);

import { Warning } from '@Views/Common/Notification/warning';
import TnCModal from '@Views/Common/TnCModal';
// import { TradePage } from '@Views/TradePage';

import Background from './AppStyles';
import { Navbar } from './Views/Common/Navbar';

import { useToast } from '@Contexts/Toast';
import { useUserAccount } from '@Hooks/useUserAccount';
import { atomWithLocalStorage } from '@Utils/atomWithLocalStorage';
import { useGraphStatus } from '@Utils/useGraphStatus';
import { TradesShutter } from '@Views/Common/MobileShutter/MobileShutter';
import { OpenOcean } from '@Views/Common/OpenOceanWidget';
import SideBar from '@Views/Common/Sidebar';
import { OneCTModal } from '@Views/OneCT/OneCTModal';
import { OnboardingAnimation } from '@Views/TradePage/Components/OnboardingAnimation';
import { defaultMarket } from '@Views/TradePage/config';
import { i18n } from '@lingui/core';
import { I18nProvider } from '@lingui/react';
import { isTestnet } from 'config';
import { useMedia } from 'react-use';
import { useAutoConnect } from './Config/useAutoConnectSafe';
import { urlSettings } from './Config/wagmiClient';
import { activeMarketFromStorageAtom } from './globalStore';
import { PageLoader } from './PageLoader';
import { useRecentWinners } from '@Hooks/useRecentWinners';
import { useAccount } from 'wagmi';
import LeaderBoardOutlet from '@Views/V2-Leaderboard';
import AllTime from '@Views/V2-Leaderboard/Components/AllTime';
import Leagues from '@Views/V2-Leaderboard/Leagues';
import Incentivised from '@Views/V2-Leaderboard/Incentivised';
import { Galxe } from '@Views/V2-Leaderboard/Galxe';
import { Launch } from '@mui/icons-material';
import { usePriceRetriable } from '@Hooks/usePrice';

import TradePage from '@Views/TradePage';
import AdminConfig from '@Views/AdminConfigs/AdminConfig';
import AllTrades from '@Views/AllTrades';
import ContractList from '@Views/ContractList';
import DashboardV2 from '@Views/DashboardV2';
import IbfrFaucet from '@Views/Faucet';
import ProfilePage from '@Views/Profile';
import ReferralPage from '@Views/Referral';
import Test from '@Views/Test';
import TradeLog_sm from '@Views/TradePage/Components/MobileView/TradeLog_sm';

import Jackpot from '@Views/Jackpot';
import AboveBelow from '@Views/AboveBelow';
import RewardsPage from '@Views/Rewards';
import LpRewardsPage from '@Views/LpRewards';
import MemoExternalLinkSVG from './SVG/ExternalLinkSVG';

export const referralCodeAtom = atomWithStorage('referral-code5', '');
export const snackAtom = atom<{
  message: null | React.ReactNode;
  severity?: 'success' | 'warning' | 'info' | 'error';
}>({
  message: null,
});
export const isAutorizedAtom = atomWithStorage('authorized user or not', false);

const isNoLoss = import.meta.env.VITE_APP_TYPE == 'NoLoss';
export const pendingQueueIds = new Set();
export const pendingQueueIdsAB = new Set();
(function () {
  const r = document.querySelector<HTMLElement>(':root');
  for (let color in urlSettings) {
    if (color.includes('-')) {
      r!.style.setProperty(`--${color}`, '#' + urlSettings[color]);
    }
  }
})();

const Redirect = ({ url }: { url: string }) => {
  useEffect(() => {
    window.location.href = url;
  }, [url]);

  return <h5 className="p-4 m-auto text-f20">Redirecting...</h5>;
};

const AppRoutes = () => {
  const activeMarketFromStorage = useAtomValue(activeMarketFromStorageAtom);
  const [searchParam] = useSearchParams();
  const [ref, setRef] = useAtom(referralCodeAtom);
  const toastify = useToast();
  const navigate = useNavigate();
  const account = useAccount();
  const earnUrl = isTestnet
    ? 'https://testnet-buffer-finance-git-v2-earn-production-bufferfinance.vercel.app/'
    : 'https://earn.buffer.finance/';

  useEffect(() => {
    let referralCode = searchParam.get('ref');

    if (!referralCode) {
      let code = '';
      const codes = window.location.href.split('/');

      for (let i = 0; i < codes.length; i++) {
        if (codes[i] == 'ref') {
          code = codes?.[i + 1];
        }
      }
      if (code) referralCode = code;
    }

    if (referralCode) {
      if (ref !== referralCode) {
        setRef(referralCode);
        toastify({
          type: 'success',
          msg: 'Referral Link  "' + referralCode + '" is applied successfully!',
          id: 23132,
        });
      }
      navigate('/binary/ETH-USD');
    }
  }, [searchParam]);
  return (
    <div className="relative root w-[100vw] pb-[5px] ">
      <TradesShutter />
      <OpenOcean />

      <OnboardingAnimation />
      <OneCTModal />
      <Routes>
        <Route
          path="lp-rewards"
          element={
            <Suspense fallback={<PageLoader />}>
              <LpRewardsPage />
            </Suspense>
          }
        />
        <Route
          path="trades"
          element={
            <Suspense fallback={<PageLoader />}>
              <AllTrades />
            </Suspense>
          }
        />
        <Route
          path="/faucet"
          element={
            <Suspense fallback={<PageLoader />}>
              <IbfrFaucet />
            </Suspense>
          }
        />
        <Route
          path="/test"
          element={
            <Suspense fallback={<PageLoader />}>
              <Test />
            </Suspense>
          }
        />
        <Route
          path="/ab/:market"
          element={
            <Suspense fallback={<PageLoader />}>
              <AboveBelow />
            </Suspense>
          }
        />
        <Route
          path="/history"
          element={
            <Suspense fallback={<PageLoader />}>
              <TradeLog_sm />
            </Suspense>
          }
        />
        <Route
          path="/admin"
          element={
            <Suspense fallback={<PageLoader />}>
              <AdminConfig />
            </Suspense>
          }
        />

        <Route
          path="/ref/:refcode"
          element={<div>Processing your referral request...</div>}
        ></Route>
        {/* <Route path="/admin/create-pair" element={<CreatePair />}></Route> */}
        <Route
          path="/earn"
          element={
            <Suspense fallback={<PageLoader />}>
              <Redirect url={earnUrl} />
            </Suspense>
          }
        />

        <Route
          path="/dashboard"
          element={
            <Suspense fallback={<PageLoader />}>
              <DashboardV2 />
            </Suspense>
          }
        >
          <Route
            path=":chain"
            element={
              <Suspense fallback={<PageLoader />}>
                <DashboardV2 />
              </Suspense>
            }
          />
        </Route>
        <Route
          path="/referral"
          element={
            <Suspense fallback={<PageLoader />}>
              <ReferralPage />
            </Suspense>
          }
        />
        <Route
          path="/jackpot"
          element={
            <Suspense fallback={<PageLoader />}>
              <Jackpot />
            </Suspense>
          }
        />
        <Route
          path="/profile"
          element={
            <Suspense fallback={<PageLoader />}>
              <ProfilePage />
            </Suspense>
          }
        >
          <Route
            path=":chain"
            element={
              <Suspense fallback={<PageLoader />}>
                <ProfilePage />
              </Suspense>
            }
          />
        </Route>
        <Route
          path="/binary/:market"
          element={
            <Suspense fallback={<PageLoader />}>
              <TradePage />
            </Suspense>
          }
        />
        <Route
          path="/*"
          element={
            <Navigate
              to={'/binary/' + (activeMarketFromStorage || defaultMarket)}
            />
          }
        />
        <Route
          path="contracts"
          element={
            <Suspense fallback={<PageLoader />}>
              <ContractList />
            </Suspense>
          }
        />

        <Route
          path="/rewards"
          element={
            <Suspense fallback={<PageLoader />}>
              <RewardsPage />
            </Suspense>
          }
        />
        <Route path="/leaderboard" element={<LeaderBoardOutlet />}>
          <Route path="leagues" element={<LeaderBoardOutlet />}>
            <Route path=":league" element={<Leagues />}>
              <Route path=":chain" element={<Leagues />} />
            </Route>
          </Route>
          {/* <Route path="metrics" element={<LeaderBoardOutlet />}>
            <Route path="all-time" element={<AllTime />}>
              <Route path=":chain" element={<AllTime />} />
            </Route>
          </Route> */}

          <Route path="daily" element={<Incentivised />}>
            <Route path=":chain" element={<Incentivised />} />
          </Route>
          {/* 
          <Route path="galxe" element={<Galxe />}>
            <Route path=":chain" element={<Galxe />} />
          </Route> */}
        </Route>
      </Routes>
    </div>
  );
};

async function activateLocale(locale: string) {
  const { messages } = await import(`./locales/${locale}/messages.ts`);
  i18n.load(locale, messages);
  i18n.activate(locale);
}
activateLocale('en');
const mobileWarningAtom = atomWithLocalStorage('warnign-user-v3', false);
const contents = {
  'lp-rewards': (
    <a
      className="flex items-baseline"
      href="https://mirror.xyz/0xc730FbdFEb3e9dF76008A19962963cA4A2bd8de2/ao87r3b-1Apd_3SAknXX-rHlhspngxCvscaX5vk4JCI"
      target="_blank"
    >
      LP Yield Boost Rewards Are Live - 26, 900 $ARB distributed over 13 Weeks.
      Learn More.&nbsp; <MemoExternalLinkSVG />
    </a>
  ),
  default: (
    <a
      className="flex items-baseline cursor-pointer"
      href="https://mirror.xyz/0xc730FbdFEb3e9dF76008A19962963cA4A2bd8de2/ao87r3b-1Apd_3SAknXX-rHlhspngxCvscaX5vk4JCI"
      target="_blank"
    >
      Trade to Earn 💰13 weeks, 5 leagues competing for the ultimate prize
      ✨19,724 ARB ✨ Learn More&nbsp; <MemoExternalLinkSVG />
    </a>
  ),
  leaderboard: (
    <Link className="flex items-baseline" to={'/'}>
      The 1st Buffer Trading League Competition Arbitrum season with prize pool
      of 19,274 ARB. Participate Now
    </Link>
  ),
};
function App() {
  useAutoConnect();
  // useRecentWinners();
  const [snack, setSnack] = useAtom(snackAtom);
  const [mobileWarningClosed, setWarningCloseOnMobile] =
    useAtom(mobileWarningAtom);

  const graphStatus = useGraphStatus();
  const location = useLocation();
  console.log(`App-location: `, location);
  const isMobile = useMedia('(max-width:1200px)');
  // return ;
  const filteredContent = Object.keys(contents).filter((key: any) => {
    if (location.pathname.toLocaleLowerCase().includes(key.toLowerCase())) {
      return true;
    }
  });
  let bannerCotent = contents['default'];
  if (filteredContent.length) {
    bannerCotent = contents[filteredContent[0]];
  }

  return (
    <>
      {/* <PasswordModal /> */}
      <I18nProvider i18n={i18n}>
        <Background>
          <ViewOnlyModeTradePageWarning />
          {graphStatus && (
            <Warning
              body={
                <div className="text-center">
                  We are facing some issues with the theGraph API. Trading
                  experience on the platform may be hindered temporarily.
                </div>
              }
              closeWarning={() => {}}
              shouldAllowClose={false}
              state={graphStatus.error}
              className="disclaimer !bg-[#f3cf34] !text-[black] !text-f16 !p-2 !text-semibold hover:!brightness-100"
            />
          )}
          <Navbar />
          <AppRoutes />
          <Snackbar
            open={snack.message ? true : false}
            autoHideDuration={3500}
            onClose={() => setSnack({ message: null })}
            action={null}
            anchorOrigin={{ horizontal: 'center', vertical: 'top' }}
          >
            <Alert
              onClose={() => setSnack({ message: null })}
              severity={snack.severity || 'info'}
              sx={{ width: '100%' }}
            >
              {snack.message}
            </Alert>
          </Snackbar>
          {
            <Warning
              body={
                <div className="w-fit flex items-center m-auto">
                  {/*<span className="bg-[#232334] text-[#10D2FF] text-f11 leading-[16px] px-3 rounded-[6px] font-semibold mr-3">
                    New
              </span>*/}

                  <span className="text-f14 font-extrabold  text-[white] leading-[21px] sm:text-[11px] sm:leading-[12px]">
                    {bannerCotent}
                  </span>
                </div>
              }
              closeWarning={() => {
                setWarningCloseOnMobile(true);
              }}
              shouldAllowClose={false}
              state={!mobileWarningClosed}
              className="disclaimer !bg-[#10D2FF] !text-[#232334]"
            />
          }
          <TnCModal />
          <SideBar />
        </Background>
      </I18nProvider>
    </>
  );
}

const AB = () => <div>AB Component</div>;
export default App;

const ViewOnlyModeTradePageWarning = () => {
  const { viewOnlyMode, address } = useUserAccount();
  const navigate = useNavigate();
  if (!window?.location?.href) return <></>;
  const url = window.location.href.split('#/')[1];
  if (!url) return <></>;
  const pagename = url.split('/')[0].toLowerCase();
  const isBinaryPage = pagename == 'binary';
  if (!isBinaryPage) return <></>;
  const activeAsset = url.split('/')[1].toUpperCase();
  return (
    <Warning
      body={
        <div className="text-center">
          You are watching the trades for {address}.&nbsp;
          <button
            onClick={() => {
              navigate('/binary/' + activeAsset);
            }}
            className="underline underline-offset-4"
          >
            Go back to regular trading.
          </button>
        </div>
      }
      closeWarning={() => {}}
      shouldAllowClose={false}
      state={viewOnlyMode && isBinaryPage}
      className="disclaimer !bg-[#f3cf34] !text-[black] !text-f16 !p-2 !text-semibold hover:!brightness-100 sm:!text-f14"
    />
  );
};
export const MonoChromeMapper = {
  USDC: USDCMono,
  ARB: ARBMono,
};
