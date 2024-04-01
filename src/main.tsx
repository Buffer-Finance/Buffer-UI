import { RainbowKitProvider, darkTheme } from '@rainbow-me/rainbowkit';
import '@rainbow-me/rainbowkit/styles.css';
import * as Sentry from '@sentry/react';
import '@szhsin/react-menu/dist/index.css';
import '@szhsin/react-menu/dist/theme-dark.css';
import '@szhsin/react-menu/dist/transitions/slide.css';
import axios from 'axios';
import { Provider as JotaiProvider } from 'jotai';
import ReactDOM from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import { SWRConfig } from 'swr';
import 'viem/window';
import { WagmiConfig } from 'wagmi';
import App from './App';
import wagmiClient, { chains } from './Config/wagmiClient';
import ContextProvider from './contexts';

const ErrorComponenet = () => {
  window.location.reload(); // reload the page
  return <></>;
};

const options = {
  fetcher: (url: string) =>
    axios.get('https://api-v2.buffer.finance/' + url).then((res) => res.data),
  refreshInterval: 1000,
};

import { inject } from '@vercel/analytics';
import ReloadErrorBoundary from './ReloadErrorBoundry';
inject();

if (import.meta.env.VITE_MODE === 'production') {
  Sentry.init({
    dsn: import.meta.env.VITE_SENTRY_DSN,

    // This sets the sample rate to be 10%. You may want this to be 100% while
    // in development and sample at a lower rate in production
    replaysSessionSampleRate: 0.1,

    // If the entire session is not sampled, use the below sample rate to sample
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

console.log(wagmiClient, 'wagmiClient');

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <Sentry.ErrorBoundary fallback={<ErrorComponenet />}>
    <WagmiConfig config={wagmiClient}>
      <RainbowKitProvider chains={chains} theme={darkTheme()}>
        <ReloadErrorBoundary>
          <HashRouter>
            <SWRConfig value={options}>
              <JotaiProvider>
                <ContextProvider>
                  <App />
                </ContextProvider>
              </JotaiProvider>
            </SWRConfig>
          </HashRouter>
        </ReloadErrorBoundary>
      </RainbowKitProvider>
    </WagmiConfig>
  </Sentry.ErrorBoundary>
);
