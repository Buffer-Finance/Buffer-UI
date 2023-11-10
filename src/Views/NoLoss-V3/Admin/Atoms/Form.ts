import { ZEROADDRESS } from '@Views/NoLoss-V3/config';
import { atom } from 'jotai';

export const FromStateAtom = atom<{ currentFormStep: number }>({
  currentFormStep: 2,
});

export const TournamentMetaDataAtom = atom<{
  name: string;
  startTime: number;
  closeTime: number;
  ticketCost: string;
  playTokenMintAmount: string;
  isClosed: boolean;
  isVerified: boolean;
  hasTradingStarted: boolean;
  shouldRefundTickets: boolean;
  tournamentType: number;
  buyInToken: string;
  rewardToken: string;
  creator: string;
}>({
  name: '',
  startTime: 0,
  closeTime: 0,
  ticketCost: '',
  playTokenMintAmount: '',
  isClosed: false,
  isVerified: false,
  hasTradingStarted: false,
  shouldRefundTickets: false,
  tournamentType: 0,
  buyInToken: '',
  rewardToken: '',
  creator: ZEROADDRESS,
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
  rankFirst: '0x0000000000000000000000000000000000000000000000000000000000000000';
  rankLast: '0x0000000000000000000000000000000000000000000000000000000000000000';
  totalBuyins: string;
  rakeCollected: string;
  totalWinners: string;
  rewardPercentages: string[];
}>({
  rankFirst:
    '0x0000000000000000000000000000000000000000000000000000000000000000',
  rankLast:
    '0x0000000000000000000000000000000000000000000000000000000000000000',
  totalBuyins: '',
  rakeCollected: '',
  totalWinners: '',
  rewardPercentages: [],
});
