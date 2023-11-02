import { useAtomValue, useSetAtom } from 'jotai';
import { useEffect, useState } from 'react';
import { useContractReads } from 'wagmi';
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
    const timer = setTimeout(() => {
      setNextId(0);
    }, 30000);
    return () => clearTimeout(timer);
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
      functionName: 'bulkFetchTournaments',
      args: [ids],
      cacheTime: 5000,
    });
    if (user && user.userAddress !== undefined) {
      readcalls.push({
        address: config.tournament_reader,
        abi: TournamentReaderABI,
        functionName: 'bulkFetchUserTournaments',
        args: [user.userAddress, ids],
        cacheTime: 5000,
      });
    }
  }

  try {
    const { data, error } = useContractReads({
      contracts: readcalls,
    });
    if (error) {
      throw error;
    }
    if (data !== undefined) {
      data.forEach((response, index) => {
        if (index === 0) {
          setAllTournamentData((prvData) => {
            return {
              ...prvData,
              [nextId]: response.result as ItournamentData[] | undefined,
            };
          });
        }
        if (index === 1) {
          setUsetTournamentBooleans((prvData) => {
            return {
              ...prvData,
              [nextId]: response.result as boolean[] | undefined,
            };
          });
        }
      });
      if (nextId + 4 < (tournaments?.length || 0)) setNextId(nextId + 4);
    }
  } catch (e) {
    console.log(e);
  }
};
