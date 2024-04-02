import { Routes, Route } from 'react-router-dom';
import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';
import { Navbar } from './Views/Common/Navbar';
import { Warning } from '@Views/Common/Notification/warning';
import TnCModal from '@Views/Common/TnCModal';
import Background from './AppStyles';
import { urlSettings } from './Config/wagmiClient';
import { useAutoConnect } from './Config/useAutoConnectSafe';
import { I18nProvider } from '@lingui/react';
import { i18n } from '@lingui/core';
import { Earn } from '@Views/Earn';
import SideBar from '@Views/Common/Sidebar';
import { ShareIcon } from '@Views/Common/Navbar/AccountDropdown';
import { Test } from './test';

// export const referralCodeAtom = atomWithStorage('referral-code5', '');

// const isNoLoss = import.meta.env.VITE_APP_TYPE == 'NoLoss';
// import { Earn } from '@Views/Earn';

// (function () {
//   const r = document.querySelector<HTMLElement>(':root');
//   for (let color in urlSettings) {
//     if (color.includes('-')) {
//       r!.style.setProperty(`--${color}`, '#' + urlSettings[color]);
//     }
//   }
// })();

const AppRoutes = () => {
  // const activeMarketFromStorage = useAtomValue(activeMarketFromStorageAtom);
  // console.log(`App-activeMarketFromStorage: `, activeMarketFromStorage);
  // const [searchParam] = useSearchParams();
  // const [ref, setRef] = useAtom(referralCodeAtom);
  // const toastify = useToast();
  // const navigate = useNavigate();
  // useEffect(() => {
  //   // console.log(`App-ref: `, ref);
  //   let referralCode = searchParam.get('ref');

  //   if (!referralCode) {
  //     let code = '';
  //     const codes = window.location.href.split('/');

  //     for (let i = 0; i < codes.length; i++) {
  //       if (codes[i] == 'ref') {
  //         code = codes?.[i + 1];
  //       }
  //     }
  //     if (code) referralCode = code;
  //   }

  //   if (referralCode) {
  //     if (ref !== referralCode) {
  //       setRef(referralCode);
  //       toastify({
  //         type: 'success',
  //         msg: 'Referral Link  "' + referralCode + '" is applied successfully!',
  //         id: 23132,
  //       });
  //     }
  //     navigate('/binary/ETH-USD');
  //   }
  // }, [searchParam]);
  return (
    <div className="relative root w-[100vw]">
      {/* <OpenOcean /> */}
      {/* <OnboardingAnimation /> */}
      <Routes>
        <Route path="/test" element={<Test />} />
        {/* <Route path="/faucet" element={<IbfrFaucet />} />
        <Route path="/admin" element={<AdminConfig />}></Route>
        <Route path="/ref/:refcode" element={<div>Hello</div>}></Route> */}
        {/* <Route path="/admin/create-pair" element={<CreatePair />}></Route> */}
        <Route path="/*" element={<Earn />} />
        {/* <Route path="/dashboard" element={<DashboardV2 />}>
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
        /> */}
        {/* <Route path="/leaderboard" element={<LeaderBoardOutlet />}> */}
        {/* <Route path="daily" element={<Incentivised />}>
            <Route path=":chain" element={<Incentivised />} />
          </Route>
          <Route path="weekly" element={<Weekly />}>
            <Route path=":chain" element={<Weekly />} />
          </Route> */}
        {/* <Route
            path="trades"
            element={
              <LeaderBoard>
                <AllTradesPage />
              </LeaderBoard>
            }
          /> */}
        {/* </Route> */}
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
  // const [snack, setSnack] = useAtom(snackAtom);
  // const graphStatus = useGraphStatus();
  return (
    <>
      {/* <PasswordModal /> */}
      <I18nProvider i18n={i18n}>
        <Background>
          {/* {graphStatus && (
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
          )} */}
          <Navbar />
          <AppRoutes />
          {/* <Snackbar
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
          </Snackbar> */}
          {!urlSettings?.hide && (
            <Warning
              body={
                <div>
                  Buffer{' '}
                  <a href="https://app.buffer.finance/" target="_blank">
                    <span className="underline underline-offset-2">V2.5 </span>
                  </a>
                  is live on Mainnet.{' '}
                  {/* <a href="https://app.buffer.finance/" target="_blank">
                    <span className="underline underline-offset-2">
                      Learn More
                    </span>{' '}
                    <ShareIcon className=" scale-[0.65] w-fit inline" />
                  </a> */}
                </div>
              }
              closeWarning={() => {}}
              shouldAllowClose={false}
              state={true}
              className="disclaimer sm:hidden"
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
