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
import { Chain } from 'viem';

const projectId = import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID;

export const getWallets = (chains: Chain[]) => {
  const bothSupported = [
    {
      groupName: 'Recommended',
      wallets: [
        metaMaskWallet({ chains, projectId }),
        coinbaseWallet({ chains, appName: 'Buffer Finance' }),
        walletConnectWallet({ chains, projectId }),
        safeWallet({
          chains,
          allowedDomains: [/gnosis-safe.io$/, /app.safe.global$/],
          debug: false,
        }),
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
            injectedWallet({ chains }),
          ],
        },
        {
          groupName: 'Others',
          wallets: [
            tahoWallet({ chains }),
            rainbowWallet({ chains, projectId }),
            imTokenWallet({ chains, projectId }),
            ledgerWallet({ chains, projectId }),
            omniWallet({ chains, projectId }),
            braveWallet({ chains }),
            // argentWallet({ chains }),
          ],
        },
      ];
};
