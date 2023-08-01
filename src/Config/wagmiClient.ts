import { configureChains, Chain, createConfig } from 'wagmi';
import { arbitrum, arbitrumGoerli, polygon, polygonMumbai } from 'wagmi/chains';
import { publicProvider } from 'wagmi/providers/public';
import {
  trustWallet,
  injectedWallet,
  rainbowWallet,
  braveWallet,
  metaMaskWallet,
  coinbaseWallet,
  // walletConnectConnector,
  walletConnectWallet,
  imTokenWallet,
  ledgerWallet,
  omniWallet,
  safeWallet,
  tahoWallet,
} from '@rainbow-me/rainbowkit/wallets';
const projectId = import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID;
console.log(`projectId: `, projectId);

import { connectorsForWallets } from '@rainbow-me/rainbowkit';
import { getHashUrlQueryParam } from '@Utils/getHashUrlQueryParam';
import { inIframe } from '@Utils/isInIframe';
export const urlSettings = getHashUrlQueryParam(window.location.href);

function getSupportedChains() {
  const isTestnet = import.meta.env.VITE_ENV.toLowerCase() == 'testnet';
  switch (urlSettings?.chain) {
    case 'arbitrum':
      return isTestnet ? [arbitrumGoerli, polygonMumbai] : [arbitrum, polygon];
    case 'polygon':
      return isTestnet ? [polygonMumbai, arbitrumGoerli] : [polygon, arbitrum];
    default:
      return isTestnet ? [arbitrumGoerli, polygonMumbai] : [arbitrum, polygon];
  }
}
const SupprtedChains = getSupportedChains();
console.log(`SupprtedChains: `, SupprtedChains);

export const getChains = () => SupprtedChains;

const getWallets = (chains: Chain[]) => {
  const bothSupported = [
    {
      groupName: 'Recommended',
      wallets: [
        metaMaskWallet({ chains, projectId }),
        coinbaseWallet({ chains, appName: 'Buffer Finance', projectId }),
      ],
    },
  ];
  return import.meta.env.VITE_ENV.toLowerCase() == 'testnet'
    ? [...bothSupported]
    : [
        {
          groupName: bothSupported[0].groupName,
          wallets: [
            ...bothSupported[0].wallets,
            trustWallet({ chains, projectId }),
            injectedWallet({ chains, projectId }),
            walletConnectWallet({ chains, projectId }),
            safeWallet({ chains, projectId }),
          ],
        },
        {
          groupName: 'Others',
          wallets: [
            tahoWallet({ chains, projectId }),
            rainbowWallet({ chains, projectId }),
            imTokenWallet({ chains, projectId }),
            ledgerWallet({ chains, projectId }),
            omniWallet({ chains, projectId }),
            braveWallet({ chains, projectId }),
            // argentWallet({ chains }),
          ],
        },
      ];
};

const { chains, publicClient } = configureChains(getChains(), [
  publicProvider(),
]);
const connectors = connectorsForWallets(getWallets(chains));
export { chains };
const wagmiClient = createConfig({
  autoConnect: inIframe() ? false : true,
  connectors,
  publicClient,
});

export default wagmiClient;
