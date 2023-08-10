import { Navbar } from './Views/Common/Navbar';
import {
  Routes,
  Route,
  Navigate,
  useSearchParams,
  useNavigate,
} from 'react-router-dom';
import IbfrFaucet from '@Views/Faucet';
import Background from './AppStyles';
import { Alert, Snackbar } from '@mui/material';
import { atom, useAtom, useAtomValue } from 'jotai';
import { Warning } from '@Views/Common/Notification/warning';
import TnCModal from '@Views/Common/TnCModal';
import {
  activeMarketFromStorageAtom,
  defaultMarket,
  referralCodeAtom,
} from '@Views/BinaryOptions';
import { Incentivised } from '@Views/V2-Leaderboard/Incentivised';
import { Earn } from '@Views/Earn';
import { ReferralPage } from '@Views/Referral';
import { atomWithStorage } from 'jotai/utils';

import SideBar from '@Views/Common/Sidebar';
import ConnectionDrawer from '@Views/Common/V2-Drawer/connectionDrawer';
import { useGraphStatus } from '@Utils/useGraphStatus';
import { Weekly } from '@Views/V2-Leaderboard/Weekly';
import { LeaderBoard, LeaderBoardOutlet } from '@Views/V2-Leaderboard';
import { ProfilePage } from '@Views/Profile';
import { useEffect } from 'react';
import { useToast } from '@Contexts/Toast';
import { AllTradesPage } from '@Views/AllTrades';
import { History } from '@Views/BinaryOptions/History';
import TestComponent from './TestComponent';
import { urlSettings } from './Config/wagmiClient';
import { MergedPage } from '@Views/AllTrades/allTradesMerged';
import { OpenOcean } from '@Views/Common/OpenOceanWidget';
import { TradingConfig } from '@Views/TradingConfig';
import { PythPoc } from '@Views/PythPoc';
import { useAutoConnect } from './Config/useAutoConnectSafe';
import { UsdcTransfer } from '@Hooks/UsdcTransfer';
import { AddMarket } from './AddMarket';
import { CreatePair } from './Admin/CreatePair';
import { NoLoss } from '@Views/NoLoss/NoLoss';
import { TradePage } from '@Views/TradePage';
import { I18nProvider } from '@lingui/react';
import { i18n } from '@lingui/core';
import { PasswordModal } from '@Views/Common/PasswordModal';
import { OnboardingAnimation } from '@Views/TradePage/Components/OnboardingAnimation';
import { ErrorPage } from './ErrorPage';
import { DashboardV2 } from '@Views/DashboardV2';

const isNoLoss = import.meta.env.VITE_APP_TYPE == 'NoLoss';
import { isTestnet } from 'config';
import { Signer } from './Signer';

(function () {
  const r = document.querySelector<HTMLElement>(':root');
  for (let color in urlSettings) {
    if (color.includes('-')) {
      r!.style.setProperty(`--${color}`, '#' + urlSettings[color]);
    }
  }
})();

// const ErrorPage: React.FC<any> = ({}) => {
//   const onClick = (e: React.MouseEvent<HTMLButtonElement>) => {
//     let arr = undefined;
//     arr.map((a) => a);
//   };
//   return (
//     <div className="flex flex-col">
//       I am the errro<button onClick={onClick}>Click me for error</button>
//     </div>
//   );
// };

const AppRoutes = () => {
  const activeMarketFromStorage = useAtomValue(activeMarketFromStorageAtom);
  const [searchParam] = useSearchParams();
  const [ref, setRef] = useAtom(referralCodeAtom);
  const toastify = useToast();
  const navigate = useNavigate();
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
    <div className="relative root w-[100vw]">
      <OpenOcean />
      <OnboardingAnimation />
      <Routes>
        <Route path="/faucet" element={<IbfrFaucet />} />
        <Route path="/signer" element={<Signer />} />
        <Route path="/error" element={<ErrorPage />} />
        <Route path="/transfer" element={<UsdcTransfer />} />
        <Route path="/test" element={<TestComponent />} />
        <Route path="/error" element={<ErrorPage />}></Route>
        <Route path="/pyth" element={<PythPoc />}></Route>
        <Route path="/admin" element={<TradingConfig />}></Route>
        <Route path="/admin/create-pair" element={<CreatePair />}></Route>
        <Route path="/addMarket" element={<AddMarket />} />
        <Route path="/test/:market" element={<TradePage />} />
        {/* <Route path="/referral" element={<ReferralPage />} /> */}
        {/* <Route path="/ref/:code" element={<div>Helo</div>} /> */}
        <Route path="/history" element={<History />} />
        {/* <Route path="/leaderboard" element={<LeaderBoardOutlet />}>
          <Route path="daily" element={<Incentivised />}>
            <Route path=":chain" element={<Incentivised />} />
          </Route>
          <Route path="weekly" element={<Weekly />}>
            <Route path=":chain" element={<Weekly />} />
          </Route>
          <Route
            path="trades"
            element={
              <LeaderBoard>
                <AllTradesPage />
              </LeaderBoard>
            }
          />
        </Route> */}
        <Route path="/earn" element={<Earn />} />
        <Route path="/dashboard" element={<DashboardV2 />}>
          <Route path=":chain" element={<DashboardV2 />} />
        </Route>
        <Route path="/referral" element={<ReferralPage />} />
        <Route path="/profile" element={<ProfilePage />}>
          <Route path=":chain" element={<ProfilePage />} />
        </Route>
        {/* <Route path="/trades/merged" element={<MergedPage />} /> */}
        <Route path="/trades" element={<AllTradesPage />} />
        <Route path="/binary/:market" element={<TradePage />} />
        <Route path="/no-loss/:market" element={<NoLoss />} />
        <Route path="/v2/:market" element={<TradePage />} />
        {/* referral link handling */}
        <Route
          path="/*"
          element={
            <Navigate
              to={'/binary/' + (activeMarketFromStorage || defaultMarket)}
            />
          }
        />
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
      <PasswordModal />
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
                <>
                  $BFR token{' '}
                  {/* <a
                  className=" cursor-pointer"
                  href="https://app.uniswap.org/#/tokens/arbitrum/0x1a5b0aaf478bf1fda7b934c76e7692d722982a6d"
                  target="_blank"
                >
                  &nbsp; */}
                  0x1A5B0aaF478bf1FDA7b934c76E7692D722982a6D &nbsp;
                  {/* </a>{' '} */}
                  has been listed on Uniswap V3 Arbitrum.
                </>
              }
              closeWarning={() => {}}
              shouldAllowClose={false}
              state={true}
              className="disclaimer sm:hidden"
            />
          )}
          <TnCModal />
        </Background>
      </I18nProvider>
    </>
  );
}

export default App;
