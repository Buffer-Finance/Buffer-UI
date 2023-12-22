import { weeklyTournamentConfigType } from '../Weekly/config';

export const leagueConfig: {
  [key: number]: { startTimestamp: number };
} = {
  421613: {
    startTimestamp: 1701878400000,
  },
  42161: {
    startTimestamp: 1701878400000,
  },
};
const MAX_NUBER_OF_TRADES = '10000000';
const MAX_NUBER_OF_VOLUME = '1000000000000000';
export interface leaguesConfig
  extends Omit<weeklyTournamentConfigType, 'startTimestamp'> {
  minVolumeToqualifyPNL: string;
  maxTradesToqualifyPNL: string;
  maxVolumeToqualifyPNL: string;
}

export const diamondTournamentConfig: {
  [key: number]: leaguesConfig;
} = {
  421613: {
    winnersNFT: 0,
    losersNFT: 0,
    winrateNFT: 0,
    endDay: undefined,
    contestRules:
      ' https://zinc-atlasaurus-c98.notion.site/Buffer-Arbitrum-Weekly-Trading-Competitions-LIVE-f1b9720e6f5042fbbbb7ec67d7b35a52',
    rewardFixedAmount: '0',
    poolPercent: '0',
    winrateStartWeek: undefined,
    minTradesToQualifyPNL: 50,
    minTradesToQualifyWinrate: 50,
    minVolumeToQualifyWinrate: '10000000000',
    minVolumeToqualifyPNL: '10000000000',
    maxTradesToqualifyPNL: MAX_NUBER_OF_TRADES,
    maxVolumeToqualifyPNL: MAX_NUBER_OF_VOLUME,
  },
  42161: {
    winnersNFT: 0,
    losersNFT: 0,
    winrateNFT: 0,
    endDay: undefined,
    contestRules:
      ' https://zinc-atlasaurus-c98.notion.site/Buffer-Arbitrum-Weekly-Trading-Competitions-LIVE-f1b9720e6f5042fbbbb7ec67d7b35a52',
    rewardFixedAmount: '1000',
    poolPercent: '5',
    winrateStartWeek: undefined,
    minTradesToQualifyPNL: 50,
    minTradesToQualifyWinrate: 50,
    minVolumeToQualifyWinrate: '10000000000',
    minVolumeToqualifyPNL: '10000000000',
    maxTradesToqualifyPNL: MAX_NUBER_OF_TRADES,
    maxVolumeToqualifyPNL: MAX_NUBER_OF_VOLUME,
  },
};

export const platinumTournamentConfig: {
  [key: number]: leaguesConfig;
} = {
  421613: {
    winnersNFT: 0,
    losersNFT: 0,
    winrateNFT: 0,
    endDay: undefined,
    contestRules:
      ' https://zinc-atlasaurus-c98.notion.site/Buffer-Arbitrum-Weekly-Trading-Competitions-LIVE-f1b9720e6f5042fbbbb7ec67d7b35a52',
    rewardFixedAmount: '0',
    poolPercent: '0',
    winrateStartWeek: undefined,
    minTradesToQualifyPNL: 30,
    minVolumeToqualifyPNL: '5000000000',
    minTradesToQualifyWinrate: 30,
    minVolumeToQualifyWinrate: '5000000000',
    maxTradesToqualifyPNL: '50',
    maxVolumeToqualifyPNL: '10000000000',
  },
  42161: {
    winnersNFT: 0,
    losersNFT: 0,
    winrateNFT: 0,
    endDay: undefined,
    contestRules:
      ' https://zinc-atlasaurus-c98.notion.site/Buffer-Arbitrum-Weekly-Trading-Competitions-LIVE-f1b9720e6f5042fbbbb7ec67d7b35a52',
    rewardFixedAmount: '1000',
    poolPercent: '5',
    winrateStartWeek: undefined,
    minTradesToQualifyPNL: 30,
    minVolumeToqualifyPNL: '5000000000',
    minTradesToQualifyWinrate: 30,
    minVolumeToQualifyWinrate: '5000000000',
    maxTradesToqualifyPNL: '50',
    maxVolumeToqualifyPNL: '10000000000',
  },
};

export const goldTournamentConfig: {
  [key: number]: leaguesConfig;
} = {
  421613: {
    winnersNFT: 0,
    losersNFT: 0,
    winrateNFT: 0,
    endDay: undefined,
    contestRules:
      ' https://zinc-atlasaurus-c98.notion.site/Buffer-Arbitrum-Weekly-Trading-Competitions-LIVE-f1b9720e6f5042fbbbb7ec67d7b35a52',
    rewardFixedAmount: '0',
    poolPercent: '0',
    winrateStartWeek: undefined,
    minTradesToQualifyPNL: 20,
    minTradesToQualifyWinrate: 20,
    minVolumeToQualifyWinrate: '1000000000',
    minVolumeToqualifyPNL: '1000000000',
    maxTradesToqualifyPNL: '30',
    maxVolumeToqualifyPNL: '5000000000',
  },
  42161: {
    winnersNFT: 0,
    losersNFT: 0,
    winrateNFT: 0,
    endDay: undefined,
    contestRules:
      ' https://zinc-atlasaurus-c98.notion.site/Buffer-Arbitrum-Weekly-Trading-Competitions-LIVE-f1b9720e6f5042fbbbb7ec67d7b35a52',
    rewardFixedAmount: '1000',
    poolPercent: '5',
    winrateStartWeek: undefined,
    minTradesToQualifyPNL: 20,
    minTradesToQualifyWinrate: 20,
    minVolumeToQualifyWinrate: '1000000000',
    minVolumeToqualifyPNL: '1000000000',
    maxTradesToqualifyPNL: '30',
    maxVolumeToqualifyPNL: '5000000000',
  },
};

export const silverTournamentConfig: {
  [key: number]: leaguesConfig;
} = {
  421613: {
    winnersNFT: 0,
    losersNFT: 0,
    winrateNFT: 0,
    endDay: undefined,
    contestRules:
      ' https://zinc-atlasaurus-c98.notion.site/Buffer-Arbitrum-Weekly-Trading-Competitions-LIVE-f1b9720e6f5042fbbbb7ec67d7b35a52',
    rewardFixedAmount: '0',
    poolPercent: '0',
    winrateStartWeek: undefined,
    minTradesToQualifyPNL: 10,
    minVolumeToqualifyPNL: '500000000',
    minTradesToQualifyWinrate: 10,
    minVolumeToQualifyWinrate: '500000000',
    maxTradesToqualifyPNL: '20',
    maxVolumeToqualifyPNL: '1000000000',
  },
  42161: {
    winnersNFT: 0,
    losersNFT: 0,
    winrateNFT: 0,
    endDay: undefined,
    contestRules:
      ' https://zinc-atlasaurus-c98.notion.site/Buffer-Arbitrum-Weekly-Trading-Competitions-LIVE-f1b9720e6f5042fbbbb7ec67d7b35a52',
    rewardFixedAmount: '1000',
    poolPercent: '5',
    winrateStartWeek: undefined,
    minTradesToQualifyPNL: 10,
    minVolumeToqualifyPNL: '500000000',
    minTradesToQualifyWinrate: 10,
    minVolumeToQualifyWinrate: '500000000',
    maxTradesToqualifyPNL: '20',
    maxVolumeToqualifyPNL: '1000000000',
  },
};
