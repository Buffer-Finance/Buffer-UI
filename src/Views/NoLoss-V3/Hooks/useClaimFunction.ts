import { useWriteCall } from '@Hooks/useWriteCall';
import { useAtomValue } from 'jotai';
import { useCallback, useState } from 'react';
import TournamentLeaderboardABI from '../ABIs/TournamentLeaderboard.json';
import { activeChainAtom } from '../atoms';
import { getNoLossV3Config } from '../helpers/getNolossV3Config';

export const useClaimFunction = () => {
  const [btnLoading, setBtnLoading] = useState(false);
  const { writeCall } = useWriteCall();
  const activeChain = useAtomValue(activeChainAtom);

  const handleClaim = useCallback(
    async (tournamentId: string) => {
      try {
        if (activeChain === undefined) throw new Error('ActiveChain not Found');
        const config = getNoLossV3Config(activeChain.id);
        setBtnLoading(true);
        await writeCall(
          config.leaderboard,
          TournamentLeaderboardABI,
          (response) => {
            setBtnLoading(false);
            console.log(response);
          },
          'claimReward',
          [tournamentId]
        );
      } catch (e) {
        console.log(e);
      } finally {
        setBtnLoading(false);
      }
    },
    [activeChain, writeCall]
  );

  return { handleClaim, btnLoading };
};
