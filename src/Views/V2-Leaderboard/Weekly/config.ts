export type weeklyTournamentConfigType = {
  startTimestamp: number;
  endDay: number | undefined;
  winnersNFT: number;
  losersNFT: number;
  contestRules: string;
  rewardFixedAmount: string;
  poolPercent: string;
  minTradesToQualifyPNL: number;
  minTradesToQualifyWinrate: number;
  winrateStartWeek: number | undefined;
  minVolumeToQualifyWinrate: string | undefined;
  winrateNFT: number;
};

export const weeklyTournamentConfig: {
  [key: number]: weeklyTournamentConfigType;
} = {
  421613: {
    startTimestamp: 1676908800000,
    winnersNFT: 3,
    losersNFT: 4,
    winrateNFT: 3,
    endDay: undefined,
    contestRules:
      'https://zinc-atlasaurus-c98.notion.site/Buffer-Weekly-Trading-Competitions-LIVE-f1b9720e6f5042fbbbb7ec67d7b35a52',
    rewardFixedAmount: '1000',
    poolPercent: '5',
    winrateStartWeek: 2,
    minTradesToQualifyPNL: 5,
    minTradesToQualifyWinrate: 5,
    minVolumeToQualifyWinrate: '100000000',
  },
  42161: {
    startTimestamp: 1676908800000,
    winnersNFT: 3,
    losersNFT: 4,
    winrateNFT: 3,
    endDay: undefined,
    contestRules:
      'https://zinc-atlasaurus-c98.notion.site/Buffer-Weekly-Trading-Competitions-LIVE-f1b9720e6f5042fbbbb7ec67d7b35a52',
    rewardFixedAmount: '1000',
    poolPercent: '5',
    winrateStartWeek: 2,
    minTradesToQualifyPNL: 3,
    minTradesToQualifyWinrate: 5,
    minVolumeToQualifyWinrate: '100000000',
  },
  80001: {
    startTimestamp: 1678896000000,
    winnersNFT: 0,
    losersNFT: 0,
    winrateNFT: 0,
    endDay: undefined,
    contestRules:
      'https://futuristic-vertebra-e74.notion.site/Buffer-Weekly-Trading-Competitions-Polygon-c94c85f7739148f7816fb5a20c894c27',
    rewardFixedAmount: '0',
    poolPercent: '0',
    winrateStartWeek: 1,
    minTradesToQualifyPNL: 5,
    minTradesToQualifyWinrate: 5,
    minVolumeToQualifyWinrate: '100000000',
  },
  137: {
    startTimestamp: 1678723200000,
    winnersNFT: 0,
    losersNFT: 0,
    winrateNFT: 0,
    endDay: undefined,
    contestRules:
      'https://futuristic-vertebra-e74.notion.site/Buffer-Weekly-Trading-Competitions-Polygon-c94c85f7739148f7816fb5a20c894c27',
    rewardFixedAmount: '100',
    poolPercent: '5',
    winrateStartWeek: 1,
    minTradesToQualifyPNL: 3,
    minTradesToQualifyWinrate: 5,
    minVolumeToQualifyWinrate: '100000000',
  },
};
