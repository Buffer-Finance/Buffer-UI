export type startTimestampObj = { [key: number]: number };
export type endTimestampObj = { [key: number]: number };
export type contestRulesType = { [key: number]: string };

export const startTimestamp: startTimestampObj = {
  421613: 1676908800000,
  42161: 1676908800000,
  80001: 1676908800000,
  137: 1676908800000,
};

export const winnersNFT: startTimestampObj = {
  421613: 3,
  42161: 3,
  80001: 0,
  137: 0,
};

export const losersNFT: startTimestampObj = {
  421613: 4,
  42161: 4,
  80001: 0,
  137: 0,
};

export const endDay: endTimestampObj = {};

export const contestRules: contestRulesType = {
  421613:
    'https://zinc-atlasaurus-c98.notion.site/Buffer-Weekly-Trading-Competitions-LIVE-f1b9720e6f5042fbbbb7ec67d7b35a52',
  42161:
    'https://zinc-atlasaurus-c98.notion.site/Buffer-Weekly-Trading-Competitions-LIVE-f1b9720e6f5042fbbbb7ec67d7b35a52',
  80001: '',
  137: '',
};
