import { atom } from 'jotai';

export const FromStateAtom = atom<{
  currentFormStep: number;
  completedSteps: number[] | null;
}>({
  currentFormStep: 0,
  completedSteps: [],
});

export const TournamentMetaDataAtom = atom<{
  name: string;
  startTime: number;
  closeTime: number;
  ticketCost: string;
  playTokenMintAmount: string;
  buyInToken: string;
  rewardToken: string;
}>({
  name: '',
  startTime: 0,
  closeTime: 0,
  ticketCost: '',
  playTokenMintAmount: '',

  buyInToken: '',
  rewardToken: '',
});

export const TournamentConditionsAtom = atom<{
  maxBuyinsPerWallet: string;
  minParticipants: string;
  maxParticipants: string;
  guaranteedWinningAmount: string;
  startPriceMoney: string;
  rakePercent: string;
}>({
  maxBuyinsPerWallet: '',
  minParticipants: '',
  maxParticipants: '',
  guaranteedWinningAmount: '',
  startPriceMoney: '',
  rakePercent: '',
});

export const LeaderboardRulesAtom = atom<{
  totalWinners: string;
  rewardPercentages: string[];
}>({
  totalWinners: '',
  rewardPercentages: [],
});
