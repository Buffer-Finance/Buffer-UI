import {
  ConnectButton,
  RainbowKitProvider,
  darkTheme,
  getDefaultConfig,
} from '@rainbow-me/rainbowkit';
import '@rainbow-me/rainbowkit/styles.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

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
import { WagmiProvider } from 'wagmi';
import App from './App';
import ContextProvider from './contexts';
import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en.json';

TimeAgo.addDefaultLocale(en);
TimeAgo.addLocale(en);
const queryClient = new QueryClient();

const ErrorComponenet = () => {
  return (
    <div className="flex flex-col justify-center items-center text-1 text-f20 bg-1 w-full h-[100vh]  ">
      Oops, something went wrong! Don't panic – we're on it.{' '}
      <BlueBtn
        className="bg-blue  !w-fit px-4 rounded-md  mt-4 font-[500]"
        onClick={(e) => {
          window.localStorage.clear();
          window.location.reload();
        }}
      >
        {' '}
        <span className="flex items-center">
          Refresh{' '}
          <img className="w-[22px] h-[22px] ml-2" src="/RefreshIcon.svg" />
        </span>
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

import { inject } from '@vercel/analytics';
import { BlueBtn } from '@Views/Common/V2-Button';
import { arbitrum, arbitrumSepolia } from 'viem/chains';
inject();
if (typeof Node === 'function' && Node.prototype) {
  const originalRemoveChild = Node.prototype.removeChild;
  Node.prototype.removeChild = function (child) {
    if (child.parentNode !== this) {
      if (console) {
        console.log(
          'Cannot remove a child from a different parent',
          child,
          this
        );
      }
      return child;
    }
    return originalRemoveChild.apply(this, arguments);
  };

  const originalInsertBefore = Node.prototype.insertBefore;
  Node.prototype.insertBefore = function (newNode, referenceNode) {
    if (referenceNode && referenceNode.parentNode !== this) {
      if (console) {
        console.log(
          'Cannot insert before a reference node from a different parent',
          referenceNode,
          this
        );
      }
      return newNode;
    }
    return originalInsertBefore.apply(this, arguments);
  };
}
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
const config = getDefaultConfig({
  appName: 'My RainbowKit App',
  projectId: 'YOUR_PROJECT_ID',
  chains: [
    process.env.ENV?.toLowerCase() == 'testnet' ? arbitrumSepolia : arbitrum,
  ],
  ssr: false, // If your dApp uses server side rendering (SSR)
});
ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <Sentry.ErrorBoundary fallback={<ErrorComponenet />}>
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider theme={darkTheme()}>
          <HashRouter>
            <SWRConfig value={options}>
              <JotaiProvider>
                <ContextProvider>
                  {/* <ConnectButton /> */}
                  <App />
                </ContextProvider>
              </JotaiProvider>
            </SWRConfig>
          </HashRouter>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  </Sentry.ErrorBoundary>
);
