import { useEffect } from 'react';
import {
  Routes,
  Route,
  Navigate,
  useSearchParams,
  useNavigate,
} from 'react-router-dom';
import { Alert, Snackbar } from '@mui/material';
import { atom, useAtom, useAtomValue } from 'jotai';
import { atomWithStorage } from 'jotai/utils';

import { TradePage } from '@Views/TradePage';
import { Navbar } from './Views/Common/Navbar';
import { Warning } from '@Views/Common/Notification/warning';
import TnCModal from '@Views/Common/TnCModal';
import { PasswordModal } from '@Views/Common/PasswordModal';
import Background from './AppStyles';

import { useGraphStatus } from '@Utils/useGraphStatus';
import { useToast } from '@Contexts/Toast';
import { urlSettings } from './Config/wagmiClient';
import { OpenOcean } from '@Views/Common/OpenOceanWidget';
import { useAutoConnect } from './Config/useAutoConnectSafe';
import { I18nProvider } from '@lingui/react';
import { i18n } from '@lingui/core';
import { OnboardingAnimation } from '@Views/TradePage/Components/OnboardingAnimation';

export const referralCodeAtom = atomWithStorage('referral-code5', '');

const isNoLoss = import.meta.env.VITE_APP_TYPE == 'NoLoss';
import { defaultMarket } from '@Views/TradePage/config';
import { activeMarketFromStorageAtom } from './globalStore';
import IbfrFaucet from '@Views/Faucet';
import { Earn } from '@Views/Earn';
import { ReferralPage } from '@Views/Referral';
import { DashboardV2 } from '@Views/DashboardV2';
import { ProfilePage } from '@Views/Profile';
import { AdminConfig } from '@Views/AdminConfigs/AdminConfig';
import { LeaderBoardOutlet } from '@Views/V2-Leaderboard';
import { Incentivised } from '@Views/V2-Leaderboard/Incentivised';
import { Weekly } from '@Views/V2-Leaderboard/Weekly';
import { Test } from './test';
import SideBar from '@Views/Common/Sidebar';
import { TradeLog_sm } from '@Views/TradePage/Components/MobileView/TradeLog_sm';
import ShutterProvider, {
  TradesShutter,
} from '@Views/Common/MobileShutter/MobileShutter';
import { ShareIcon } from '@Views/Common/Navbar/AccountDropdown';
import { isTestnet } from 'config';
import { BoostModal } from '@Views/TradePage/Components/BoostModal';

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
      <BoostModal />
      <OpenOcean />
      <OnboardingAnimation />
      <Routes>
        <Route path="/faucet" element={<IbfrFaucet />} />
        <Route path="/test" element={<Test />} />
        <Route path="/history" element={<TradeLog_sm />} />
        <Route path="/admin" element={<AdminConfig />}></Route>
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
        <Route path="/leaderboard" element={<LeaderBoardOutlet />}>
          <Route path="daily" element={<Incentivised />}>
            <Route path=":chain" element={<Incentivised />} />
          </Route>
          <Route path="weekly" element={<Weekly />}>
            <Route path=":chain" element={<Weekly />} />
          </Route>
          {/* <Route
            path="trades"
            element={
              <LeaderBoard>
                <AllTradesPage />
              </LeaderBoard>
            }
          /> */}
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
export const snackAtom = atom<{
  message: null | React.ReactNode;
  severity?: 'success' | 'warning' | 'info' | 'error';
}>({
  message: null,
});

export const isAutorizedAtom = atomWithStorage('authorized user or not', false);
function App() {
  useAutoConnect();
  const [snack, setSnack] = useAtom(snackAtom);
  const graphStatus = useGraphStatus();
  return (
    <>
      {/* <PasswordModal /> */}
      <I18nProvider i18n={i18n}>
        <Background>
          {graphStatus && (
            <Warning
              body={
                <>
                  We are facing some issues with the theGraph API. Trading
                  experience on the platform may be hindered temporarily.
                </>
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
          {!urlSettings?.hide && (
            <Warning
              body={
                <div>
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
                  <a href="https://classic.app.buffer.finance/" target="_blank">
                    <span className="underline underline-offset-2">
                      classic version
                    </span>
                  </a>
                </div>
              }
              closeWarning={() => {}}
              shouldAllowClose={false}
              state={true}
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

export default App;
