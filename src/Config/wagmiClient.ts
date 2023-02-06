import { configureChains, createClient, Chain } from 'wagmi';
import { arbitrum, arbitrumGoerli } from 'wagmi/chains';
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
  argentWallet,
} from '@rainbow-me/rainbowkit/wallets';
import { connectorsForWallets } from '@rainbow-me/rainbowkit';

export const getChains = () =>
  import.meta.env.VITE_ENV.toLowerCase() == 'testnet'
    ? [arbitrumGoerli]
    : [arbitrum];

const getWallets = (chains: Chain[]) => {
  const bothSupported = [
    {
      groupName: 'Recommended',
      wallets: [
        metaMaskWallet({ chains }),
        coinbaseWallet({ chains, appName: 'Buffer Finance' }),
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
            trustWallet({ chains }),
            injectedWallet({ chains }),
            walletConnectWallet({ chains }),
          ],
        },
        {
          groupName: 'Others',
          wallets: [
            rainbowWallet({ chains }),
            imTokenWallet({ chains }),
            ledgerWallet({ chains }),
            omniWallet({ chains }),
            braveWallet({ chains }),
            // argentWallet({ chains }),
          ],
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
