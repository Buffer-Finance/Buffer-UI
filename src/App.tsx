import { Alert, Snackbar } from '@mui/material';
import { atom, useAtom, useAtomValue } from 'jotai';
import { atomWithStorage } from 'jotai/utils';
import { useEffect } from 'react';
import {
  Navigate,
  Route,
  Routes,
  useNavigate,
  useSearchParams,
} from 'react-router-dom';
import { Suspense, lazy } from 'react';

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
import { PlatformTradesTab } from '@Views/TradePage/PlatformTradesTab';
import { usePlatformEvent } from '@Hooks/usePlatformEvent';
const TradePage = lazy(() => import('@Views/TradePage'));

const AdminConfig = lazy(() => import('@Views/AdminConfigs/AdminConfig'));
const AllTrades = lazy(() => import('@Views/AllTrades'));
const ContractList = lazy(() => import('@Views/ContractList'));
const DashboardV2 = lazy(() => import('@Views/DashboardV2'));
const IbfrFaucet = lazy(() => import('@Views/Faucet'));
const ProfilePage = lazy(() => import('@Views/Profile'));
const ReferralPage = lazy(() => import('@Views/Referral'));
const Test = lazy(() => import('@Views/Test'));
const TradeLog_sm = lazy(
  () => import('@Views/TradePage/Components/MobileView/TradeLog_sm')
);
const LeaderBoardOutlet = lazy(() => import('@Views/V2-Leaderboard'));
const Incentivised = lazy(() => import('@Views/V2-Leaderboard/Incentivised'));
const Weekly = lazy(() => import('@Views/V2-Leaderboard/Weekly'));
const Jackpot = lazy(() => import('@Views/Jackpot'));
const AboveBelow = lazy(() => import('@Views/AboveBelow'));

export const referralCodeAtom = atomWithStorage('referral-code5', '');
export const snackAtom = atom<{
  message: null | React.ReactNode;
  severity?: 'success' | 'warning' | 'info' | 'error';
}>({
  message: null,
});
export const isAutorizedAtom = atomWithStorage('authorized user or not', false);

const isNoLoss = import.meta.env.VITE_APP_TYPE == 'NoLoss';

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
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="trades" element={<AllTrades />} />
          <Route path="/faucet" element={<IbfrFaucet />} />
          <Route path="/test" element={<Test />} />
          <Route path="/ab/:market" element={<AboveBelow />} />
          <Route path="/history" element={<TradeLog_sm />} />
          <Route path="/admin" element={<AdminConfig />} />

          <Route
            path="/ref/:refcode"
            element={<div>Processing your referral request...</div>}
          ></Route>
          {/* <Route path="/admin/create-pair" element={<CreatePair />}></Route> */}
          <Route path="/earn" element={<Redirect url={earnUrl} />} />

          <Route path="/dashboard" element={<DashboardV2 />}>
            <Route path=":chain" element={<DashboardV2 />} />
          </Route>
          <Route path="/referral" element={<ReferralPage />} />
          <Route path="/jackpot" element={<Jackpot />} />
          <Route path="/profile" element={<ProfilePage />}>
            <Route path=":chain" element={<ProfilePage />} />
          </Route>
          <Route path="/binary/:market" element={<TradePage />} />
          <Route
            path="/*"
            element={
              <Navigate
                to={'/binary/' + (activeMarketFromStorage || defaultMarket)}
              />
            }
          />
          <Route path="contracts" element={<ContractList />} />
          <Route path="/leaderboard" element={<LeaderBoardOutlet />}>
            <Route path="daily" element={<Incentivised />}>
              <Route path=":chain" element={<Incentivised />} />
            </Route>
            <Route path="weekly" element={<Weekly />}>
              <Route path=":chain" element={<Weekly />} />
            </Route>
          </Route>
        </Routes>
      </Suspense>
    </div>
  );
};

async function activateLocale(locale: string) {
  const { messages } = await import(`./locales/${locale}/messages.ts`);
  i18n.load(locale, messages);
  i18n.activate(locale);
}
activateLocale('en');
const mobileWarningAtom = atomWithLocalStorage('warnign-suer', false);

function App() {
  useAutoConnect();
  const [snack, setSnack] = useAtom(snackAtom);
  const [mobileWarningClosed, setWarningCloseOnMobile] =
    useAtom(mobileWarningAtom);

  const graphStatus = useGraphStatus();
  const isMobile = useMedia('(max-width:1200px)');
  // return ;
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
          {!urlSettings?.hide &&
            (isMobile && mobileWarningClosed ? false : true) && (
              <Warning
                body={
                  <div className="text-center b800:text-start">
                    🚀 Buffer v2.5 is live on&nbsp;
                    <a href="https://app.buffer.finance/" target="_blank">
                      <span className="underline underline-offset-2">
                        Mainnet
                      </span>
                    </a>
                    &nbsp; | 📜 Learn more about v2.5&nbsp;
                    <a
                      href="https://mirror.xyz/0xc730FbdFEb3e9dF76008A19962963cA4A2bd8de2/9v1ATLZoGXbzjLZWQVesWKMwHB4R7yI8XNQfVsyB21o"
                      target="_blank"
                    >
                      <span className="underline underline-offset-2">here</span>
                    </a>
                    &nbsp; | ✨ To trade with $BFR as collateral visit the&nbsp;
                    <a
                      href="https://classic.app.buffer.finance/"
                      target="_blank"
                    >
                      <span className="underline underline-offset-2">
                        classic version
                      </span>
                    </a>
                  </div>
                }
                closeWarning={() => {
                  setWarningCloseOnMobile(true);
                }}
                shouldAllowClose={true}
                state={!mobileWarningClosed}
                className="disclaimer"
              />
            )}
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
