import { getCallId } from '@Utils/Contract/multiContract';
import { useCall2Data } from '@Utils/useReadCall';
import { useAtomValue, useSetAtom } from 'jotai';
import { useEffect, useState } from 'react';
import TournamentLeaderboardABI from '../ABIs/TournamentLeaderboard.json';
import {
  activeChainAtom,
  activeTournamentIdAtom,
  allLeaderboardDataAtom,
} from '../atoms';
import { getNoLossV3Config } from '../helpers/getNolossV3Config';

export const useLeaderboardData = () => {
  const activeChain = useAtomValue(activeChainAtom);
  const activeTournamentId = useAtomValue(activeTournamentIdAtom);
  const [nextRankId, setNextRankId] = useState(
    '0x0000000000000000000000000000000000000000000000000000000000000000'
  );
  const setAllleaderboardData = useSetAtom(allLeaderboardDataAtom);
  let readcall = [];
  useEffect(() => {
    const timer = setInterval(() => {
      setNextRankId(
        '0x0000000000000000000000000000000000000000000000000000000000000000'
      );
    }, 1000);
    return () => clearInterval(timer);
  }, []);
  if (activeChain !== undefined && activeTournamentId !== undefined) {
    const config = getNoLossV3Config(activeChain.id);
    readcall.push({
      address: config.leaderboard,
      abi: TournamentLeaderboardABI,
      name: 'getTournamentLeaderboard',
      params: [activeTournamentId, nextRankId, 10],
      id: getCallId(config.leaderboard, 'getTournamentLeaderboard', [
        activeTournamentId,
        nextRankId,
        10,
      ]),
    });
  }
  try {
    const { data, error } = useCall2Data(
      readcall as any,
      `getTournamentLeaderboard-${activeTournamentId}}`
    );
    // useContractRead<
    //   unknown[],
    //   string,
    //   LeaderboardData[]
    // >(readcall);
    if (error) {
      throw error;
    }
    if (data !== undefined) {
      const id = readcall[0].id;
      const leaderboardData = data[id]?.[0];
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
