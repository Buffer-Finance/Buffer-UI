import { getCallId } from '@Utils/Contract/multiContract';
import { useCall2Data } from '@Utils/useReadCall';
import { useAtomValue, useSetAtom } from 'jotai';
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

    if (user && user.userAddress !== undefined) {
      readcalls.push(
        ...groupedTournamentsIds.map((group) => {
          const ids = group.map((tournament) => tournament.id);
          return {
            address: config.tournament_reader,
            abi: TournamentReaderABI,
            name: 'bulkFetchUserTournaments',
            params: [user.mainEOA, ids],
            id: getCallId(
              config.tournament_reader,
              'bulkFetchUserTournaments',
              [ids]
            ),
          };
        })
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

    if (!data) return;

    Object.entries(data).forEach(([key, value]) => {
      if (key.includes('bulkFetchTournaments')) {
        if (value[0] !== undefined) {
          const tournamentIds = key.split('bulkFetchTournaments')[1].split(',');
          tournamentIds.forEach((tournamentId, index) => {
            setTournaments((prvData) => {
              return { ...prvData, [tournamentId]: value[0][index] };
            });
          });
        }
      } else if (key.includes('bulkFetchUserTournaments')) {
        if (value[0] !== undefined) {
          const tournamentIds = key
            .split('bulkFetchUserTournaments')[1]
            .split(',');
          tournamentIds.forEach((tournamentId, index) => {
            setTournaments((prvData) => {
              return {
                ...prvData,
                [tournamentId]: {
                  ...prvData[tournamentId],
                  hasUserClaimed: value[0].hasUserClaimed[index],
                  isUserEligible: value[0].hasUserParticipated[index],
                  userBoughtTickets: value[0].userTicketCount[index],
                },
              };
            });
          });
        }
      }
    });
  } catch (e) {
    console.log(e);
  }
};
