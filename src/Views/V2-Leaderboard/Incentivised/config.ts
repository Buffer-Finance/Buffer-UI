import { weeklyTournamentConfigType } from '../Weekly/config';

export const DailyTournamentConfig: {
  [key: number]: weeklyTournamentConfigType;
} = {
  421613: {
    startTimestamp: 1675958400000,
    winnersNFT: 0,
    losersNFT: 1,
    endDay: 9,
    contestRules:
      'https://buffer-finance.medium.com/trading-in-bear-market-buffer-daily-trading-competitions-f4f487c5ddd9',
    rewardFixedAmount: '0',
    poolPercent: '5',
    minTradesToQualifyPNL: 5,
  },
  42161: {
    startTimestamp: 1675958400000,
    winnersNFT: 0,
    losersNFT: 1,
    endDay: 12,
    contestRules:
      'https://buffer-finance.medium.com/trading-in-bear-market-buffer-daily-trading-competitions-f4f487c5ddd9',
    rewardFixedAmount: '0',
    poolPercent: '5',
    minTradesToQualifyPNL: 3,
  },
  80001: {
    startTimestamp: 1679328000000,
    winnersNFT: 0,
    losersNFT: 0,
    endDay: undefined,
    contestRules:
      'https://futuristic-vertebra-e74.notion.site/Buffer-Weekly-Trading-Competitions-Polygon-c94c85f7739148f7816fb5a20c894c27',
    rewardFixedAmount: '0',
    poolPercent: '0',
    minTradesToQualifyPNL: 5,
  },
  137: {
    startTimestamp: 1679328000000,
    winnersNFT: 0,
    losersNFT: 0,
    endDay: undefined,
    contestRules:
      'https://futuristic-vertebra-e74.notion.site/Buffer-Weekly-Trading-Competitions-Polygon-c94c85f7739148f7816fb5a20c894c27',
    rewardFixedAmount: '0',
    poolPercent: '0',
    minTradesToQualifyPNL: 3,
  },
};
