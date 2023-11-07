import { getCallId } from '@Utils/Contract/multiContract';
import { add } from '@Utils/NumString/stringArithmatics';
import { HHMMToSeconds } from '@Views/TradePage/utils';
import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';
import { Chain, getAddress } from 'viem';
import { erc20ABI } from 'wagmi';
import TournamentManagerABI from './ABIs/TournamentManager.json';
import TournamentReaderABI from './ABIs/TournamentReader.json';
import { defaultSelectedTime } from './config';
import { getNoLossV3Config } from './helpers/getNolossV3Config';
import {
  InoLossMarket,
  IreadCall,
  ItournamentData,
  ItournamentId,
  ItournamentStats,
  IuserTournamentData,
  LeaderboardData,
  accordianTableType,
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

export const tournamentBasedReadCallsReadOnlyAtom = atom((get) => {
  const tournamentsData = get(tournaments);
  const activeChain = get(activeChainAtom);
  const user = get(userAtom);

  const response: {
    calls: IreadCall[] | null;
    result:
      | {
          buyInTokenToManagerAllowance:
            | {
                id: string;
                allowance: string | undefined;
              }[]
            | undefined;
        }
      | undefined;
  } = { calls: null, result: undefined };

  if (!tournamentsData || !activeChain || !user) return response;
  if (user.userAddress === undefined) return response;
  const config = getNoLossV3Config(activeChain.id);

  const filteredTournamentsData: ItournamentData[] = [];
  tournamentsData.forEach((tournament) => {
    if (
      tournament.state.toLowerCase() !== 'closed' &&
      tournament.state.toLowerCase() !== 'created' &&
      !filteredTournamentsData.find(
        (filteredTournament) =>
          filteredTournament.tournamentMeta.buyinToken ===
          tournament.tournamentMeta.buyinToken
      )
    )
      filteredTournamentsData.push(tournament);
  });

  response.calls = filteredTournamentsData.map((tournament) => {
    return {
      address: tournament.tournamentMeta.buyinToken,
      abi: erc20ABI,
      name: 'allowance',
      params: [user.userAddress, config.manager],
      id: getCallId(tournament.tournamentMeta.buyinToken, 'allowance', [
        user.userAddress,
        config.manager,
      ]),
    };
  });

  const readcallResponse = get(noLossReadcallResponseReadOnlyAtom);

  if (
    readcallResponse !== undefined &&
    tournamentsData !== undefined &&
    activeChain !== undefined &&
    user !== undefined &&
    response.calls !== null
  ) {
    const buyInTokenToManagerAllowanceIds = tournamentsData.map((tournament) =>
      getCallId(tournament.tournamentMeta.buyinToken, 'allowance', [
        user.userAddress,
        config.manager,
      ])
    );

    response.result = {
      buyInTokenToManagerAllowance: buyInTokenToManagerAllowanceIds.map(
        (id) => {
          return { allowance: readcallResponse[id]?.[0], id };
        }
      ),
    };
  }

  return response;
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
          isTradingApproved: boolean | undefined;
          activeTournamentBalance: string | undefined;
          activeTournamentLeaderboardStats: ItournamentStats | undefined;
        }
      | undefined;
  } = { calls: null, result: undefined };

  if (tournaments === undefined || activeChain === undefined)
    response.calls = null;
  else {
    const config = getNoLossV3Config(activeChain.id);

    const readcalls: IreadCall[] = [];

    if (user !== undefined && user.userAddress !== undefined) {
      readcalls.push({
        address: config.manager,
        abi: TournamentManagerABI,
        name: 'isApprovedForAll',
        params: [user.userAddress, config.router],
        id: getCallId(config.manager, 'isApprovedForAll', [
          user.userAddress,
          config.router,
        ]),
      });
      if (activeTournamentId !== undefined) {
        readcalls.push(
          ...[
            {
              address: config.manager,
              abi: TournamentManagerABI,
              name: 'balanceOf',
              params: [user.userAddress, activeTournamentId],
              id: getCallId(config.manager, 'balanceOf'),
            },
            {
              address: config.tournament_reader,
              abi: TournamentReaderABI,
              name: 'leaderboard',
              params: [activeTournamentId],
              id: getCallId(config.tournament_reader, 'leaderboard'),
            },
          ]
        );
      }
    }
    response.calls = readcalls;

    const readcallResponse = get(noLossReadcallResponseReadOnlyAtom);
    if (readcallResponse !== undefined) {
      const activeTournamentBalanceId = getCallId(config.manager, 'balanceOf');
      const activeTournamentLeaderboardStatsId = getCallId(
        config.tournament_reader,
        'leaderboard'
      );
      response.result = {
        activeTournamentBalance:
          readcallResponse[activeTournamentBalanceId]?.[0],
        activeTournamentLeaderboardStats:
          readcallResponse[activeTournamentLeaderboardStatsId]?.[0],
        isTradingApproved: undefined,
      };

      if (user !== undefined && user.userAddress !== undefined) {
        const isTradingApprovedId = getCallId(
          config.manager,
          'isApprovedForAll',
          [user.userAddress, config.router]
        );
        response.result = {
          ...response.result,
          isTradingApproved: readcallResponse[isTradingApprovedId]?.[0],
        };
      }
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
  const result = get(tournaments);
  return undefined;
});

export const activeTournamentDataReadOnlyAtom = atom((get) => {
  const allTournamentsData = get(tournaments);
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

export const activeMyAllTabAtom = atom<'my' | 'all'>('my');
export const tournamentStateTabAtom = atom<string>('live');

export const filteredTournamentsDataReadOnlyAtom = atom((get) => {
  const allTournamentsData = get(tournaments);
  const activeMyAllTab = get(activeMyAllTabAtom);
  const tournamentStateTab = get(tournamentStateTabAtom);

  if (allTournamentsData === undefined) return undefined;

  const filteredTournamentsData = allTournamentsData.filter((tournament) => {
    if (activeMyAllTab === 'my') {
      return tournament.isUserEligible;
    } else {
      return true;
    }
  });

  return filteredTournamentsData.filter((tournament) => {
    // if (
    //   +tournament.tournamentMeta.close <
    //     Math.floor(new Date().getTime() / 1000) &&
    //   tournament.state.toLowerCase() !== 'closed'
    // )
    //   return false;
    if (tournamentStateTab.toLowerCase() === 'live') {
      return tournament.state.toLowerCase() === 'live';
    } else if (tournamentStateTab.toLowerCase() === 'upcoming') {
      return tournament.state.toLowerCase() === 'upcoming';
    } else {
      return tournament.state.toLowerCase() === 'closed';
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

// asset selection atoms
export const noLossActiveCategoyAtom = atom<string>('all');
export const noLossSearchBarAtom = atom<string>('');

export const filteredMarketsSelectAtom = atom((get) => {
  const markets = get(nolossmarketsAtom);
  const activeCategory = get(noLossActiveCategoyAtom);
  const searchBar = get(noLossSearchBarAtom);
  const favouriteMarkets = get(noLossFavouriteMarketsAtom);

  if (markets === undefined) return undefined;

  const filteredMarkets = markets.filter((market) => {
    if (activeCategory === 'all') {
      return true;
    } else if (activeCategory === 'favourites') {
      return favouriteMarkets.includes(market.chartData.tv_id);
    } else {
      return (
        market.chartData.category.toLowerCase() === activeCategory.toLowerCase()
      );
    }
  });

  return filteredMarkets.filter((market) => {
    if (searchBar === '') {
      return true;
    } else {
      return market.asset.toLowerCase().includes(searchBar.toLowerCase());
    }
  });
});

export const noLossFavouriteMarketsAtom = atomWithStorage<string[]>(
  'noLossFavouriteMarkets',
  []
);

// tables atoms
export const accordianTableTypeAtom = atom<accordianTableType>('leaderboard');

//leaderbaord table atoms
const leaderboardActivePageAtom = atom<number>(1);
export const leaderboardActivePgaeIdAtom = atom<string>(
  '0x0000000000000000000000000000000000000000000000000000000000000000'
);
export const leaderboardPaginationAtom = atom(
  (get) => {
    const leaderboardStatsLength =
      get(noLossReadCallsReadOnlyAtom).result?.activeTournamentLeaderboardStats
        ?.userCount ?? '0';
    const activePage = get(leaderboardActivePageAtom);
    const pageSize = 10;
    const totalPages = Math.ceil(+leaderboardStatsLength / pageSize);
    return {
      totalPages,
      activePage,
    };
  },
  (_, set, update: number) => {
    set(leaderboardActivePageAtom, update);
  }
);

export const allLeaderboardDataAtom = atom<
  undefined | { [nextId: string]: LeaderboardData[] }
>(undefined);

export const userLeaderboardDataAtom = atom<
  | undefined
  | { data: LeaderboardData | undefined | undefined; rank: number | null }
>((get) => {
  const leaderboardData = get(allLeaderboardDataAtom);
  const user = get(userAtom);
  if (leaderboardData === undefined || user === undefined) return undefined;
  if (user.userAddress === undefined) return undefined;
  let userData = undefined;
  let rank = null;
  Object.values(leaderboardData).forEach((leaderboardArray, index) => {
    const userDataIndex = leaderboardArray.findIndex((leaderboardData) => {
      return (
        getAddress(leaderboardData.stats.user) === getAddress(user.userAddress!)
      );
    });
    if (userDataIndex !== -1) userData = leaderboardArray[userDataIndex];

    if (userDataIndex !== -1) {
      rank = index * 10 + userDataIndex + 1;
    }
  });
  return { data: userData, rank };
});

export const allTournamentDataAtom = atom<
  undefined | { [nextId: number]: ItournamentData[] | undefined }
>(undefined);
export const userTournamentsBooleanAtom = atom<
  undefined | { [nextId: number]: IuserTournamentData | undefined }
>(undefined);

export const tournaments = atom<ItournamentData[] | undefined>((get) => {
  const allTournamentsData = get(allTournamentDataAtom);
  const allBooleans = get(userTournamentsBooleanAtom);
  const states = get(tournamentIdsAtom);

  if (allTournamentsData === undefined || states === undefined)
    return undefined;
  return Object.entries(allTournamentsData)
    .map(([nextId, tournametsbatch]) => {
      if (tournametsbatch === undefined) return;
      return tournametsbatch.map((tournament, index) => {
        const id = parseInt(add(nextId, index.toString()));
        const isUserEligible =
          allBooleans?.[+nextId]?.hasUserParticipated?.[index];
        const hasUserClaimed = allBooleans?.[+nextId]?.hasUserClaimed?.[index];
        const userBoughtTickets =
          allBooleans?.[+nextId]?.userTicketCount?.[index];
        return {
          ...tournament,
          id,
          isUserEligible,
          state: states.find((state) => +state.id === id)?.state,
          hasUserClaimed,
          userBoughtTickets,
        };
      });
    })
    .flat()
    .filter((tournament) => tournament !== undefined) as ItournamentData[];
});

export const WinningPirzeModalAtom = atom<null | ItournamentData>(null);
