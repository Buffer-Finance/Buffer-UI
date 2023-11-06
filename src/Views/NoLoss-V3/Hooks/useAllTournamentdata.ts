import { getCallId } from '@Utils/Contract/multiContract';
import { useCall2Data } from '@Utils/useReadCall';
import { useAtomValue, useSetAtom } from 'jotai';
import { useEffect, useState } from 'react';
import TournamentReaderABI from '../ABIs/TournamentReader.json';
import {
  activeChainAtom,
  allTournamentDataAtom,
  tournamentIdsAtom,
  userAtom,
  userTournamentsBooleanAtom,
} from '../atoms';
import { getNoLossV3Config } from '../helpers/getNolossV3Config';
import { ItournamentData } from '../types';

export const useAllTournamentData = () => {
  const activeChain = useAtomValue(activeChainAtom);
  const user = useAtomValue(userAtom);
  const tournaments = useAtomValue(tournamentIdsAtom);
  const setAllTournamentData = useSetAtom(allTournamentDataAtom);
  const setUsetTournamentBooleans = useSetAtom(userTournamentsBooleanAtom);

  const [nextId, setNextId] = useState(0);
  let readcalls = [];
  useEffect(() => {
    const timer = setInterval(() => {
      setNextId(0);
    }, 10000);
    return () => clearInterval(timer);
  }, []);
  //make an array of numbers from nextId to nextId + 4

  if (activeChain !== undefined && tournaments !== undefined) {
    const length =
      tournaments.length - nextId < 4 ? tournaments.length - nextId : 4;
    const ids = Array.from({ length: length }, (_, index) => nextId + index);
    const config = getNoLossV3Config(activeChain.id);
    readcalls.push({
      address: config.tournament_reader,
      abi: TournamentReaderABI,
      name: 'bulkFetchTournaments',
      params: [ids],
      id: getCallId(config.tournament_reader, 'bulkFetchTournaments', [ids]),
    });
    if (user && user.userAddress !== undefined) {
      readcalls.push({
        address: config.tournament_reader,
        abi: TournamentReaderABI,
        name: 'bulkFetchUserTournaments',
        params: [user.userAddress, ids],
        id: getCallId(config.tournament_reader, 'bulkFetchUserTournaments', [
          user.userAddress,
          ids,
        ]),
      });
    }
  }

  try {
    const { data, error } = useCall2Data(
      readcalls as any,
      'bulkFetchTournaments'
      //   {
      //   contracts: readcalls as any,
      // }
    );
    if (error) {
      throw error;
    }
    const allTournamentId = getCallId(
      readcalls[0].address,
      readcalls[0].name,
      readcalls[0].params
    );
    const userTournamentId = getCallId(
      readcalls[1].address,
      readcalls[1].name,
      readcalls[1].params
    );

    if (data[allTournamentId] !== undefined) {
      setAllTournamentData((prvData) => {
        return {
          ...prvData,
          [nextId]: data[allTournamentId]?.[0] as ItournamentData[] | undefined,
        };
      });
      if (nextId + 4 < (tournaments?.length || 0)) setNextId(nextId + 4);
    }

    if (data[userTournamentId] !== undefined) {
      setUsetTournamentBooleans((prvData) => {
        return {
          ...prvData,
          [nextId]: data[userTournamentId]?.[0] as
            | [boolean[], boolean[]]
            | undefined,
        };
      });
    }

    // if (data !== undefined) {
    //   data.forEach((response, index) => {
    //     if (index === 0) {
    //       setAllTournamentData((prvData) => {
    //         return {
    //           ...prvData,
    //           [nextId]: response.result as ItournamentData[] | undefined,
    //         };
    //       });
    //     }
    //     if (index === 1) {
    //       console.log(response.result, 'response');
    //       setUsetTournamentBooleans((prvData) => {
    //         return {
    //           ...prvData,
    //           [nextId]: response.result as [boolean[], boolean[]] | undefined,
    //         };
    //       });
    //     }
    //   });
    //   if (nextId + 4 < (tournaments?.length || 0)) setNextId(nextId + 4);
    // }
  } catch (e) {
    console.log(e);
  }
};
