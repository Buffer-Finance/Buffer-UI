import { Navbar } from './Views/Common/Navbar';
import { Routes, Route, Link, Navigate } from 'react-router-dom';
import Drawer from '@Views/Common/V2-Drawer';
import IbfrFaucet from '@Views/Faucet';
import Background from './AppStyles';
import { Alert, Snackbar } from '@mui/material';
import { atom, useAtom } from 'jotai';
import { useEffect } from 'react';
import { useNetwork, useProvider, useSigner } from 'wagmi';
import { Warning } from '@Views/Common/Notification/warning';
import TnCModal from '@Views/Common/TnCModal';
import BinryMarkets from '@Views/BinaryOptions';
import { Incentivised } from '@Views/V2-Leaderboard/Incentivised';
import { Earn } from '@Views/Earn';
import { Dashboard } from '@Views/Dashboard';
import { ReferralPage } from '@Views/Referral';
import SideBar from '@Views/Common/Sidebar';
import { Test } from './Test';
import ConnectionDrawer from '@Views/Common/V2-Drawer/connectionDrawer';
import { useGraphStatus } from '@Utils/useGraphStatus';
import * as Sentry from "@sentry/react";
import { Integrations } from "@sentry/tracing";

if (import.meta.env.VITE_MODE === "production") {
  console.log(`import.meta.env.SENTRY_DSN: `,import.meta.env.VITE_SENTRY_DSN);
  Sentry.init({
    dsn: import.meta.env.VITE_SENTRY_DSN,
    integrations: [new Integrations.BrowserTracing()],
    tracesSampleRate: 0.5,
  });

}
function AppComponent() {
  return (
    <div className=" text-blue-1 font-bold">
      <div className="main">
        <ul>
          <Link to={'/faucet'}>Faucet</Link>
          <Link to={'/home'}>Home</Link>
        </ul>
      </div>
      <Drawer>
        <></>
      </Drawer>
    </div>
  );
}

const AppRoutes = () => {
  return (
    <div className="root w-[100vw]">
      <Routes>
        <Route path="/home" element={<AppComponent />} />
        <Route path="/faucet" element={<IbfrFaucet />} />
        <Route path="/test" element={<Test />} />
        <Route path="/binary/:market" element={<BinryMarkets />} />
        <Route path="/leaderboard/incentivised" element={<Incentivised />} />
        <Route path="/earn" element={<Earn />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/referral" element={<ReferralPage />} />
        <Route path="/*" element={<BinryMarkets />} />
      </Routes>
    </div>
  );
};

export const snackAtom = atom<{
  message: null | React.ReactNode;
  severity?: 'success' | 'warning' | 'info' | 'error';
}>({
  message: null,
});

function App() {
  const [snack, setSnack] = useAtom(snackAtom);
  const graphStatus = useGraphStatus();
  return (
    <Background>
      {graphStatus && <Warning
        body={<>We are facing some issues with the theGraph API. Trading experience on the platform may be hindered temporarily.</>}
        closeWarning={() => {}}
        shouldAllowClose={false}
        state={graphStatus.error}
        className="disclaimer !bg-[#f3cf34] !text-[black] !text-f16 !p-2 !text-semibold hover:!brightness-100"
      />}
      <Navbar />
      <AppRoutes />
      <Snackbar
        open={snack.message ? true : false}
        autoHideDuration={3500}
        onClose={() => setSnack({ message: null })}
        action={null}
      >
        <Alert
          onClose={() => setSnack({ message: null })}
          severity={snack.severity || 'info'}
          sx={{ width: '100%' }}
        >
          {snack.message}
        </Alert>
      </Snackbar>
      <Warning
        body={
          <>
            $BFR token 0x1A5B0aaF478bf1FDA7b934c76E7692D722982a6D has been
            listed on Uniswap V3 Arbitrum. Don't trade $iBFR token on
            PancakeSwap or Apeswap on BNB chain.
          </>
        }
        closeWarning={() => {}}
        shouldAllowClose={false}
        state={true}
        className="disclaimer"
      />
      <ConnectionDrawer className="open" />

      <TnCModal />
      <SideBar />
    </Background>
  );
}

export default App;
