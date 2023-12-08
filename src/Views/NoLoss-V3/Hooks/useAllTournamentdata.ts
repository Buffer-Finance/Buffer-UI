import { getCallId } from '@Utils/Contract/multiContract';
import { useCall2Data } from '@Utils/useReadCall';
import { useAtomValue, useSetAtom } from 'jotai';
import { useEffect } from 'react';
import TournamentReaderABI from '../ABIs/TournamentReader.json';
import {
  activeChainAtom,
  allTournamentDataAtom,
  tournamentIdsAtom,
  userAtom,
} from '../atoms';
import { getNoLossV3Config } from '../helpers/getNolossV3Config';
import { ItournamentId } from '../types';
function groupArrayElements(arr: any[], chunkSize: number) {
  const result = [];
  for (let i = 0; i < arr.length; i += chunkSize) {
    result.push(arr.slice(i, i + chunkSize));
  }
  return result;
}
export const useAllTournamentData = () => {
  const activeChain = useAtomValue(activeChainAtom);
  const user = useAtomValue(userAtom);
  const tournamentsIds = useAtomValue(tournamentIdsAtom);
  const setTournaments = useSetAtom(allTournamentDataAtom);

  let readcalls = [];

  //make an array of numbers from nextId to nextId + 4

  if (activeChain !== undefined && tournamentsIds !== undefined) {
    const config = getNoLossV3Config(activeChain.id);

    const groupedTournamentsIds: ItournamentId[][] = groupArrayElements(
      tournamentsIds,
      4
    );

    readcalls.push(
      ...groupedTournamentsIds.map((group) => {
        const ids = group.map((tournament) => tournament.id);
        return {
          address: config.tournament_reader,
          abi: TournamentReaderABI,
          name: 'bulkFetchTournaments',
          params: [ids],
          id: getCallId(config.tournament_reader, 'bulkFetchTournaments', [
            ids,
          ]),
        };
      })
    );

    if (user && user.userAddress !== undefined && user.mainEOA !== undefined) {
      readcalls.push(
        ...groupedTournamentsIds
          .map((group) => {
            const ids = group.map((tournament) => tournament.id);
            return [
              {
                address: config.tournament_reader,
                abi: TournamentReaderABI,
                name: 'bulkFetchUserTournaments',
                params: [user.userAddress, ids],
                id: getCallId(
                  config.tournament_reader,
                  'bulkFetchUserTournaments',
                  [ids]
                ),
              },
              {
                address: config.tournament_reader,
                abi: TournamentReaderABI,
                name: 'bulkFetchUserTournaments',
                params: [user.mainEOA, ids],
                id: getCallId(config.tournament_reader, 'hasUserParticipated', [
                  ids,
                ]),
              },
            ];
          })
          .flat()
      );
    }
  }

  try {
    const { data, error } = useCall2Data(
      readcalls as any,
      'bulkFetchTournaments'
    );
    if (error) {
      throw error;
    }

    useEffect(() => {
      if (!data) return;
      Object.entries(data).forEach(([key, value]) => {
        if (key.includes('bulkFetchTournaments')) {
          if (value[0] !== undefined) {
            const tournamentIds = key
              .split('bulkFetchTournaments')[1]
              .split(',');
            tournamentIds.forEach((tournamentId, index) => {
              setTournaments((prvData) => {
                return { ...prvData, [tournamentId]: value[0][index] };
              });
            });
          }
        } else {
          const userTournamentDataKey = 'bulkFetchUserTournaments';
          const userEligibilityKey = 'hasUserParticipated';
          if (
            key.includes(userTournamentDataKey) ||
            key.includes(userEligibilityKey)
          ) {
            if (value[0] !== undefined) {
              const tournamentIdskey =
                key.split(userTournamentDataKey)[1] ??
                key.split(userEligibilityKey)[1];
              const tournamentIds = tournamentIdskey.split(',');
              tournamentIds.forEach((tournamentId, index) => {
                if (key.includes(userEligibilityKey)) {
                  setTournaments((prvData) => {
                    return {
                      ...prvData,
                      [tournamentId]: {
                        ...prvData[tournamentId],
                        isUserEligible: value[0].hasUserParticipated[index],
                      },
                    };
                  });
                  return;
                }
                setTournaments((prvData) => {
                  return {
                    ...prvData,
                    [tournamentId]: {
                      ...prvData[tournamentId],
                      hasUserClaimed: value[0].hasUserClaimed[index],
                      isUserEligible: value[0].hasUserParticipated[index],
                      userBoughtTickets: value[0].userTicketCount[index],
                      userReward: value[0].userReward[index],
                    },
                  };
                });
              });
            }
          }
        }
      });
    }, [data]);
  } catch (e) {
    console.log(e);
  }
};
