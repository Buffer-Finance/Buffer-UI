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

import wagmiClient, { chains } from './Config/wagmiClient';
import ContextProvider from './contexts';
import { SWRConfig } from 'swr';
import { Provider as JotaiProvider } from 'jotai';
import { RainbowKitProvider, darkTheme } from '@rainbow-me/rainbowkit';

const options = {
  fetcher: (url: string) =>
    axios.get('https://api-v2.buffer.finance/' + url).then((res) => res.data),
  refreshInterval: 1000,
};
import { inject } from '@vercel/analytics';
inject();
ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <WagmiConfig client={wagmiClient}>
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
);
