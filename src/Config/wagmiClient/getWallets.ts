import {
  braveWallet,
  coinbaseWallet,
  imTokenWallet,
  injectedWallet,
  ledgerWallet,
  metaMaskWallet,
  omniWallet,
  rainbowWallet,
  safeWallet,
  tahoWallet,
  trustWallet,
  // walletConnectConnector,
  walletConnectWallet,
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
            walletConnectWallet({ chains, projectId }),
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
