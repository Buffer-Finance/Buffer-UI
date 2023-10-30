import { getCallId } from '@Utils/Contract/multiContract';
import { HHMMToSeconds } from '@Views/TradePage/utils';
import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';
import { Chain } from 'viem';
import TournamentLeaderboardABI from './ABIs/TournamentLeaderboard.json';
import TournamentManagerABI from './ABIs/TournamentManager.json';
import TournamentReaderABI from './ABIs/TournamentReader.json';
import { defaultSelectedTime } from './config';
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
      connectedWalletAddress: string | undefined;
      isViewOnlyMode: boolean;
    }
  | undefined
>(undefined);

export const nolossmarketsAtom = atom<InoLossMarket[] | undefined>(undefined);
export const activeMarketIdAtom = atom<string | undefined>(undefined);
export const activeMarketDataAtom = atom<InoLossMarket | undefined>((get) => {
  const markets = get(nolossmarketsAtom);
  const activeMarketId = get(activeMarketIdAtom);
  if (markets === undefined || activeMarketId === undefined) return undefined;
  return markets.find((market) => market.asset === activeMarketId);
});

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

    const rewardPoolCalls = tournamentIds.map((tournamentId) => {
      return {
        address: config.manager,
        abi: TournamentManagerABI,
        name: 'tournamentRewardPools',
        params: [tournamentId],
        id: `${config.manager}tournamentRewardPools${tournamentId}`,
      };
    });
    readcalls.push(...rewardPoolCalls);

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
      const rewardPoolsIds = tournamentIds.map((tournamentId) =>
        getCallId(config.manager, 'tournamentRewardPools', [tournamentId])
      );
      const rewardPools = rewardPoolsIds.map((id) => readcallResponse[id]?.[0]);
      response.result = {
        tournamentData: readcallResponse[tournamentDataId][0].map(
          (data: ItournamentData, index: number) => {
            return {
              ...data,
              id: tournaments[index].id,
              state: tournaments[index].state,
              rewardPool: rewardPools[index],
            };
          }
        ),
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

export const activeTournamentDataReadOnlyAtom = atom((get) => {
  const allTournamentsData = get(allTournamentsDataReadOnlyAtom);
  const activeTournamentId = get(activeTournamentIdAtom);

  if (allTournamentsData === undefined || activeTournamentId === undefined)
    return undefined;
  const activeTournamentData = allTournamentsData?.find(
    (tournament) => tournament.id === activeTournamentId
  );
  return {
    data: activeTournamentData,
    id: activeTournamentId,
  };
});

export const activeMyAllTabAtom = atom<string>('my');
export const tournamentStateTabAtom = atom<string>('live');

export const filteredTournamentsDataReadOnlyAtom = atom((get) => {
  const allTournamentsData = get(allTournamentsDataReadOnlyAtom);
  const activeMyAllTab = get(activeMyAllTabAtom);
  const tournamentStateTab = get(tournamentStateTabAtom);

  if (allTournamentsData === undefined) return undefined;

  const filteredTournamentsData = allTournamentsData.filter((tournament) => {
    if (activeMyAllTab === 'my') {
      return false;
    } else {
      return true;
    }
  });

  return filteredTournamentsData.filter((tournament) => {
    if (tournamentStateTab === 'live') {
      return tournament.state === 'Live';
    } else if (tournamentStateTab === 'upcoming') {
      return tournament.state === 'Upcoming';
    } else {
      return tournament.state === 'Completed';
    }
  });
});

export const isTableShownAtom = atom<boolean>(false);
export const chartNumberAtom = atomWithStorage('chartNumber', 1);

//buy trade atoms
export const noLossTimeSelectorAtom = atomWithStorage(
  'noLossTimeSelectorAtomV1',
  {
    HHMM: defaultSelectedTime,
    seconds: HHMMToSeconds(defaultSelectedTime),
  }
);

export const setnoLossTimeSelectorAtom = atom(
  null,
  (get, set, update: string) => {
    set(noLossTimeSelectorAtom, {
      HHMM: update,
      seconds: HHMMToSeconds(update),
    });
  }
);

export const noLossTradeSizeAtom = atomWithStorage('noLossTradeSizeAtom', '5');
