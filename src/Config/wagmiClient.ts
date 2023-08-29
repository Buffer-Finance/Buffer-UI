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
import { MockConnector } from 'wagmi/connectors/mock';
import { ParticleNetwork } from '@particle-network/auth';
import { particleWallet } from '@particle-network/rainbowkit-ext';

import { connectorsForWallets } from '@rainbow-me/rainbowkit';
import { getHashUrlQueryParam } from '@Utils/getHashUrlQueryParam';
import { inIframe } from '@Utils/isInIframe';
import { createPublicClient, createWalletClient, http, custom } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
export const urlSettings = getHashUrlQueryParam(window.location.href);
export const particle = new ParticleNetwork({
  projectId: import.meta.env.VITE_PARTICLE_PROJECT_ID,
  clientKey: import.meta.env.VITE_PARTICLE_CLIENT_KEY,
  appId: import.meta.env.VITE_pARTICLE_APP_ID,
});

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
const supportedChains = getSupportedChains();
export const getChains = () => supportedChains;

const particleWallets = [
  particleWallet({ chains: supportedChains, authType: 'google' }),
  particleWallet({ chains: supportedChains, authType: 'facebook' }),
  particleWallet({ chains: supportedChains, authType: 'apple' }),
  particleWallet({ chains: supportedChains }),
];
const getWallets = (chains: Chain[]) => {
  const bothSupported = [
    {
      groupName: 'Recommended',
      wallets: [
        ...particleWallets,
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
const isTestEnv = import.meta.env.VITE_MODE == 'test';
const testClient = createPublicClient({
  transport: http('http://localhost:8545'),
  chain: arbitrumGoerli, //TODO  - run hardhat chain on this network.
});
const mockConnector = [
  new MockConnector({
    chains: [arbitrum, arbitrumGoerli],
    options: {
      flags: {
        isAuthorized: true,
      },
      walletClient: createWalletClient({
        transport: custom(testClient),
        chain: arbitrumGoerli,
        account: privateKeyToAccount(
          '0x2bb545e93a2b27557e40b54f39def6a190fa3ce56b34bcfc80d8709cf60fe0a2' //TODO - substitute it with hardhat account pk
        ),
      }),
    },
  }),
];

const { chains, publicClient } = configureChains(supportedChains, [
  publicProvider(),
]);
const connectors = isTestEnv
  ? mockConnector
  : connectorsForWallets(getWallets(chains));
console.log(`isTestEnv: `, isTestEnv);
export { chains };
const wagmiClient = createConfig({
  autoConnect: inIframe() ? false : true,
  connectors,
  publicClient,
});

export default wagmiClient;
