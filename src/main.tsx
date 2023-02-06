import axios from 'axios';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import { WagmiConfig } from 'wagmi';
import App from './App';
import '@rainbow-me/rainbowkit/styles.css'

import wagmiClient, { chains } from './Config/wagmiClient';
import ContextProvider from './contexts';
import { SWRConfig } from 'swr';
import { Provider as JotaiProvider } from 'jotai';
import { RainbowKitProvider,darkTheme } from '@rainbow-me/rainbowkit';

const options = {
  fetcher: (url: string) =>
    axios.get('https://api-v2.buffer.finance/' + url).then((res) => res.data),
  refreshInterval: 1000,
};
import { inject } from '@vercel/analytics';
inject();
ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider chains={chains} theme={darkTheme()}>
        <HashRouter>
          <SWRConfig value={options}>
            <ContextProvider>
              <JotaiProvider>
                <App />
              </JotaiProvider>
            </ContextProvider>
          </SWRConfig>
        </HashRouter>
      </RainbowKitProvider>
    </WagmiConfig>
  </React.StrictMode>
);
