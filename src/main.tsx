import { RainbowKitProvider, darkTheme } from '@rainbow-me/rainbowkit';
import '@rainbow-me/rainbowkit/styles.css';
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
  return (
    <div className="grid items-center text-1 text-f20">
      Something went wrong.
    </div>
  );
};

const options = {
  fetcher: (url: string) =>
    axios.get('https://api-v2.buffer.finance/' + url).then((res) => res.data),
  refreshInterval: 1000,
};

import { inject } from '@vercel/analytics';
inject();
console.log('wagmiCLient', wagmiClient);
ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
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
);
