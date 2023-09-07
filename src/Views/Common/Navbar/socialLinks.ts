import Discord from '@Assets/Social/DD/discord';
import GitHub from '@Assets/Social/DD/github';
import Medium from '@Assets/Social/DD/medium';
import Telegram from '@Assets/Social/DD/telegram';
import Twitter from '@Assets/Social/DD/twitter';

export const social = [
  {
    Img: Twitter,
    to: 'https://twitter.com/Buffer_Finance',
    name: 'Twitter',
    subTabs: [],
    isExternalLink: true,
  },
  {
    Img: Discord,
    to: 'https://discord.com/invite/Hj4QF92Kdc',
    name: 'Discord',
    isExternalLink: true,
    subTabs: [],
  },
  {
    Img: Telegram,
    to: 'https://t.me/bufferfinance',
    name: 'Telegram',
    isExternalLink: true,
    subTabs: [],
  },
  {
    Img: Medium,
    to: 'https://buffer-finance.medium.com/',
    name: 'Medium',
    isExternalLink: true,
    subTabs: [],
  },
  {
    Img: GitHub,
    to: 'https://github.com/Buffer-Finance',
    name: 'GitHub',
    isExternalLink: true,
    subTabs: [],
  },
  // {
  //   Img: GitBook,
  //   to: 'https://docs.buffer.finance/readme',
  //   name: 'Docs',
  //   isExternalLink: true,
  //   subTabs: [],
  // },
];
