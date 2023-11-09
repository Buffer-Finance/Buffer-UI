import { ZEROADDRESS } from '@Views/NoLoss-V3/config';
import { atom } from 'jotai';

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
  creator: `0x${string}`;
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
