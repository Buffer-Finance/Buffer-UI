import { configureChains, createClient, Chain } from 'wagmi';
import { arbitrum, arbitrumGoerli, polygon, polygonMumbai } from 'wagmi/chains';
import { publicProvider } from 'wagmi/providers/public';
import {
  trustWallet,
  injectedWallet,
  rainbowWallet,
  braveWallet,
  metaMaskWallet,
  coinbaseWallet,
  walletConnectWallet,
  imTokenWallet,
  ledgerWallet,
  omniWallet,
} from '@rainbow-me/rainbowkit/wallets';
import { connectorsForWallets } from '@rainbow-me/rainbowkit';
import { getHashUrlQueryParam } from '@Utils/getHashUrlQueryParam';
import { safeWallet } from './SafeWallet';
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
export const getChains = () => SupprtedChains;

const getWallets = (chains: Chain[]) => {
  const w = safeWallet({ chains });
  console.log(`safew: `, w.iconUrl());
  const consolelog = async () => {};
  const bothSupported = [
    {
      groupName: 'Recommended',
      wallets: [
        metaMaskWallet({ chains }),
        safeWallet({ chains }),

        coinbaseWallet({ chains, appName: 'Buffer Finance' }),
      ],
    },
  ];
  return import.meta.env.VITE_ENV.toLowerCase() == 'testnet'
    ? [...bothSupported]
    : [
        {
          groupName: bothSupported[0].groupName,
          wallets: [safeWallet({ chains })],
        },
      ];
};

const { chains, provider } = configureChains(getChains(), [publicProvider()]);
const connectors = connectorsForWallets(getWallets(chains));
export { chains };
const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
});

export default wagmiClient;
