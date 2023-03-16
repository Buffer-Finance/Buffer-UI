import {
  contestRulesType,
  endTimestampObj,
  startTimestampObj,
} from '../Weekly/config';

export const startTimestamp: startTimestampObj = {
  421613: 1675958400000,
  42161: 1675958400000,
  80001: 1675958400000,
  137: 1675958400000,
};
export const endDay: endTimestampObj = {
  421613: 9,
  42161: 12,
};
export const winnersNFT: startTimestampObj = {
  421613: 0,
  42161: 0,
  80001: 0,
  137: 0,
};
export const losersNFT: startTimestampObj = {
  421613: 1,
  42161: 1,
  80001: 0,
  137: 0,
};

export const contestRules: contestRulesType = {
  421613:
    'https://buffer-finance.medium.com/trading-in-bear-market-buffer-daily-trading-competitions-f4f487c5ddd9',
  42161:
    'https://buffer-finance.medium.com/trading-in-bear-market-buffer-daily-trading-competitions-f4f487c5ddd9',
  80001: '',
  137: '',
};

export const rewardFixedAmount: contestRulesType = {
  421613: '0',
  42161: '0',
  80001: '0',
  137: '0',
};

export const poolPercent: contestRulesType = {
  421613: '5',
  42161: '5',
  80001: '5',
  137: '5',
};
