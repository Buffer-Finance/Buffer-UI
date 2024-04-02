import axios from 'axios';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, HashRouter } from 'react-router-dom';
import { WagmiConfig } from 'wagmi';
import App from './App';
import '@rainbow-me/rainbowkit/styles.css';
import '@szhsin/react-menu/dist/index.css';
import '@szhsin/react-menu/dist/theme-dark.css';
import '@szhsin/react-menu/dist/transitions/slide.css';
import 'viem/window';
import * as Sentry from '@sentry/react';
import wagmiClient, { chains } from './Config/wagmiClient';
import ContextProvider from './contexts';
import { SWRConfig } from 'swr';
import { Provider as JotaiProvider } from 'jotai';
import { RainbowKitProvider, darkTheme } from '@rainbow-me/rainbowkit';

const ErrorComponenet = () => {
  return (
    <div className="flex flex-col justify-center items-center text-1 text-f20 bg-1 w-full h-[100vh]  ">
      Something went wrong.
      <BlueBtn
        className="bg-blue !w-fit px-4 rounded-md  mt-4 font-[500]"
        onClick={(e) => {
          window.localStorage.clear();
          window.location.reload();
        }}
      >
        {' '}
        Fix it
      </BlueBtn>
    </div>
  );
};

BigInt.prototype['toJSON'] = function () {
  return this.toString();
};

const options = {
  fetcher: (url: string) =>
    axios.get('https://api-v2.buffer.finance/' + url).then((res) => res.data),
  refreshInterval: 1000,
};

if (import.meta.env.VITE_MODE === 'production') {
  Sentry.init({
    dsn: 'https://02220025d0c3c9aca0de248301539c57@o993009.ingest.us.sentry.io/4507016260550656"',

    // This sets the sample rate to be 10%. You may want this to be 100% while
    // in development and sample at a lower rate in production
    replaysSessionSampleRate: 0.1,
    tracesSampleRate: 1.0,
    // If the entire session is not sampled, use the below sample rate to sample
    // sessions when an error occurs.
    replaysOnErrorSampleRate: 1.0,

    integrations: [
      new Sentry.Replay({
        // Additional SDK configuration goes in here, for example:
        maskAllText: false,
        blockAllMedia: false,
      }),
    ],
  });
}

import { inject } from '@vercel/analytics';
import { BlueBtn } from '@Views/Common/V2-Button';
inject();

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <Sentry.ErrorBoundary fallback={<ErrorComponenet />}>
    <WagmiConfig config={wagmiClient}>
      <RainbowKitProvider chains={chains} theme={darkTheme()}>
        <HashRouter>
          <SWRConfig value={options}>
            <JotaiProvider>
              <ContextProvider>
                <App />
              </ContextProvider>
            </JotaiProvider>
          </SWRConfig>
        </HashRouter>
      </RainbowKitProvider>
    </WagmiConfig>
  </Sentry.ErrorBoundary>
);
