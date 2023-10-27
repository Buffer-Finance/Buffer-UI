import { atom } from 'jotai';
import { InoLossMarket, ItournamentId } from './types';

export const tournamentIdsAtom = atom<ItournamentId[] | undefined>(undefined);

export const nolossmarketsAtom = atom<InoLossMarket[] | undefined>(undefined);
