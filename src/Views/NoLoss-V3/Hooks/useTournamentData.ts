import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { useEffect } from 'react';
import { useContractRead } from 'wagmi';
import TournamentLeaderboardABI from '../ABIs/TournamentLeaderboard.json';
import {
  activeChainAtom,
  activeTournamentIdAtom,
  allLeaderboardDataAtom,
  nextRankIdAtom,
} from '../atoms';
import { getNoLossV3Config } from '../helpers/getNolossV3Config';
import { LeaderboardData } from '../types';

export const useTournamentData = () => {
  const activeChain = useAtomValue(activeChainAtom);
  const activeTournamentId = useAtomValue(activeTournamentIdAtom);
  const [nextRankId, setNextRankId] = useAtom(nextRankIdAtom);
  const setAllleaderboardData = useSetAtom(allLeaderboardDataAtom);
  let readcall = {};
  useEffect(() => {
    // set nextRankId to 0x0000000000000000000000000000000000000000000000000000000000000000 after 30 seconds
    const timer = setTimeout(() => {
      setNextRankId(
        '0x0000000000000000000000000000000000000000000000000000000000000000'
      );
    }, 30000);
    return () => clearTimeout(timer);
  }, []);
  if (activeChain !== undefined && activeTournamentId !== undefined) {
    const config = getNoLossV3Config(activeChain.id);
    readcall = {
      address: config.leaderboard,
      abi: TournamentLeaderboardABI,
      functionName: 'getTournamentLeaderboard',
      args: [activeTournamentId, nextRankId, 2],
      cacheTime: 10_000,
    };
  }
  try {
    const { data: leaderboardData, error } = useContractRead<
      unknown[],
      string,
      LeaderboardData[]
    >(readcall);
    // console.log(leaderboardData, 'leaderboardData');
    if (error) {
      throw error;
    }
    if (leaderboardData !== undefined) {
      setAllleaderboardData((prvData) => {
        return { [nextRankId]: leaderboardData };
      });
      const nextId = leaderboardData[0].stats.next;
      if (
        nextId !==
        '0x0000000000000000000000000000000000000000000000000000000000000000'
      )
        setNextRankId(leaderboardData[1].stats.next);
    }
  } catch (e) {
    console.log(e);
  }
};
