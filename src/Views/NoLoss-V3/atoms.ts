import { atom } from 'jotai';
import { ItournamentId } from './types';

export const tournamentIdsAtom = atom<ItournamentId[] | undefined>(undefined);
