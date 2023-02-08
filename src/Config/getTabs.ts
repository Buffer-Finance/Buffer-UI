import { SVGProps } from 'react';

export interface ITab {
  to: string;
  name: string;
  subTabs: any;
  isExternalLink: boolean;
  Img?: (props: SVGProps<SVGSVGElement>) => JSX.Element;
}

export const getTabs = () => {
  if (import.meta.env.VITE_ENV === 'MAINNET') {
    return [
      {
        to: `/binary/ETH-USD`,
        name: 'Trade',
        subTabs: [],
        isExternalLink: false,
      },
      {
        to: `/earn`,
        name: 'Earn',
        subTabs: [],
        isExternalLink: false,
      },
      {
        to: `/dashboard`,
        name: 'Dashboard',
        subTabs: [],
        isExternalLink: false,
      },

      {
        to: `https://testnet.buffer.finance/`,
        name: 'Practice Trading',
        subTabs: [],
        isExternalLink: true,
      },

      {
        to: `/referral`,
        name: 'Referral',
        subTabs: [],
        isExternalLink: false,
      },
      {
        to: `https://optopi.buffer.finance/ARBITRUM`,
        name: 'NFT',
        subTabs: [],
        isExternalLink: true,
      },

      {
        to: `/leaderboard/incentivised`,
        name: 'Competitions',
        subTabs: [],
        isExternalLink: false,
      },
      // {
      //   to: `https://app-v0.buffer.finance/vesting`,
      //   name: 'Vesting',
      //   subTabs: [],
      //   isExternalLink: true,
      // },
      // {
      //   to: `https://app-v1.buffer.finance/`,
      //   name: 'Old App',
      //   subTabs: [],
      //   isExternalLink: true,
      // },
    ];
  } else
    return [
      {
        to: `/binary/ETH-USD`,
        name: 'Trade',
        subTabs: [],
        isExternalLink: false,
      },
      {
        to: `/faucet`,
        name: 'Faucet',
        subTabs: [],
        isExternalLink: false,
      },
      {
        to: `/leaderboard/incentivised`,
        name: 'Competitions',
        subTabs: [],
        isExternalLink: false,
      },
      {
        to: `https://optopi.buffer.finance/ARBITRUM`,
        name: 'NFT',
        subTabs: [],
        isExternalLink: true,
      },
      {
        to: `/earn`,
        name: 'Earn',
        subTabs: [],
        isExternalLink: false,
      },
      {
        to: `/dashboard`,
        name: 'Dashboard',
        subTabs: [],
        isExternalLink: false,
      },
      {
        to: `/referral`,
        name: 'Referral',
        subTabs: [],
        isExternalLink: false,
      },
    ];
};
