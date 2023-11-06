import { useAtomValue, useSetAtom } from 'jotai';
import { useEffect, useState } from 'react';
import { useContractRead } from 'wagmi';
import TournamentLeaderboardABI from '../ABIs/TournamentLeaderboard.json';
import {
  activeChainAtom,
  activeTournamentIdAtom,
  allLeaderboardDataAtom,
} from '../atoms';
import { getNoLossV3Config } from '../helpers/getNolossV3Config';
import { LeaderboardData } from '../types';

export const useLeaderboardData = () => {
  const activeChain = useAtomValue(activeChainAtom);
  const activeTournamentId = useAtomValue(activeTournamentIdAtom);
  const [nextRankId, setNextRankId] = useState(
    '0x0000000000000000000000000000000000000000000000000000000000000000'
  );
  const setAllleaderboardData = useSetAtom(allLeaderboardDataAtom);
  let readcall = {};
  useEffect(() => {
    const timer = setInterval(() => {
      setNextRankId(
        '0x0000000000000000000000000000000000000000000000000000000000000000'
      );
    }, 30000);
    return () => clearInterval(timer);
  }, []);
  if (activeChain !== undefined && activeTournamentId !== undefined) {
    const config = getNoLossV3Config(activeChain.id);
    readcall = {
      address: config.leaderboard,
      abi: TournamentLeaderboardABI,
      functionName: 'getTournamentLeaderboard',
      args: [activeTournamentId, nextRankId, 10],
    };
  }
  try {
    const { data: leaderboardData, error } = useContractRead<
      unknown[],
      string,
      LeaderboardData[]
    >(readcall);
    if (error) {
      throw error;
    }
    if (leaderboardData !== undefined) {
      setAllleaderboardData((prvData) => {
        return { ...prvData, [nextRankId]: leaderboardData };
      });
      const nextId = leaderboardData[9].stats.next;
      if (
        nextId !==
        '0x0000000000000000000000000000000000000000000000000000000000000000'
      )
        setNextRankId(leaderboardData[9].stats.next);
    }
  } catch (e) {
    console.log(e);
  }
};
