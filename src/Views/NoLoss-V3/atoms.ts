import { getCallId } from '@Utils/Contract/multiContract';
import { atom } from 'jotai';
import { Chain } from 'viem';
import TournamentLeaderboardABI from './ABIs/TournamentLeaderboard.json';
import TournamentReaderABI from './ABIs/TournamentReader.json';
import { getNoLossV3Config } from './helpers/getNolossV3Config';
import {
  InoLossMarket,
  IreadCall,
  ItournamentData,
  ItournamentId,
} from './types';

export const tournamentIdsAtom = atom<ItournamentId[] | undefined>(undefined);
export const activeTournamentIdAtom = atom<number | undefined>(undefined);

//currently hooks that should be atoms
export const activeChainAtom = atom<Chain | undefined>(undefined);
export const userAtom = atom<
  | {
      userAddress: string | undefined;
      viewOnlyAddress: string | null;
      isViewOnlyMode: boolean;
    }
  | undefined
>(undefined);

export const nolossmarketsAtom = atom<InoLossMarket[] | undefined>(undefined);

export const noLossReadCallsReadOnlyAtom = atom((get) => {
  const tournaments = get(tournamentIdsAtom);
  const activeChain = get(activeChainAtom);
  const activeTournamentId = get(activeTournamentIdAtom);
  const user = get(userAtom);

  const response: {
    calls: IreadCall[] | null;
    result:
      | {
          tournamentData: ItournamentData[] | undefined;
          userRank: string | undefined;
        }
      | undefined;
  } = { calls: null, result: undefined };

  if (tournaments === undefined || activeChain === undefined)
    response.calls = null;
  else {
    const config = getNoLossV3Config(activeChain.id);

    const tournamentIds = tournaments.map((tournament) => +tournament.id);

    const readcalls: IreadCall[] = [
      {
        address: config.tournament_reader,
        abi: TournamentReaderABI,
        name: 'bulkFetchTournaments',
        params: [tournamentIds],
      },
    ];

    if (
      activeTournamentId !== undefined &&
      user !== undefined &&
      user.userAddress !== undefined
    ) {
      readcalls.push({
        address: config.leaderboard,
        abi: TournamentLeaderboardABI,
        name: 'userTournamentRank',
        params: [activeTournamentId, user.userAddress],
      });
    }
    response.calls = readcalls;

    const readcallResponse = get(noLossReadcallResponseReadOnlyAtom);
    if (readcallResponse !== undefined) {
      const tournamentDataId = getCallId(
        config.tournament_reader,
        'bulkFetchTournaments'
      );
      const userRankId = getCallId(config.leaderboard, 'userTournamentRank');

      response.result = {
        tournamentData: readcallResponse[tournamentDataId]?.[0],
        userRank: readcallResponse[userRankId]?.[0],
      };
    }
  }
  return response;
});

export const noLossReadcallResponseReadOnlyAtom = atom<
  | {
      [key: string]: any[];
    }
  | undefined
>(undefined);

export const allTournamentsDataReadOnlyAtom = atom((get) => {
  const { result } = get(noLossReadCallsReadOnlyAtom);
  return result?.tournamentData;
});
