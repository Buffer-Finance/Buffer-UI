import { useToast } from '@Contexts/Toast';
import { useWriteCall } from '@Hooks/useWriteCall';
import { BlueBtn } from '@Views/Common/V2-Button';
import { activeChainAtom } from '@Views/NoLoss-V3/atoms';
import { getNoLossV3Config } from '@Views/NoLoss-V3/helpers/getNolossV3Config';
import { useAtomValue } from 'jotai';
import { useState } from 'react';
import TournamentManagerABI from '../../ABIs/TournamentManager.json';
import { InputField } from './Form/Common/InputField';
import { LabelWrapper } from './Form/Common/LabelWrapper';

export const Verify = () => {
  const [tournamentId, setTournamentId] = useState('');
  const { writeCall } = useWriteCall();
  const toastify = useToast();
  const [loading, setLoading] = useState(false);
  const activeChain = useAtomValue(activeChainAtom);

  async function handleVerify() {
    try {
      if (tournamentId === '') throw new Error('Please enter tournament id');
      if (isNaN(Number(tournamentId)))
        throw new Error('Please enter valid tournament id');
      if (activeChain === undefined) throw new Error('No active chain');
      const config = getNoLossV3Config(activeChain.id);
      setLoading(true);
      const params = [Number(tournamentId)];
      await writeCall(
        config.manager,
        TournamentManagerABI,
        () => {},
        'verifyTournament',
        params
      );
    } catch (e) {
      toastify({ type: 'error', msg: (e as Error).message });
    } finally {
      setLoading(false);
    }
  }
  return (
    <div className="flex flex-col gap-4 text-f14 p-4">
      <LabelWrapper
        label="TournamentId (Number)"
        input={
          <InputField
            value={tournamentId}
            placeholder="TournamentId"
            onChange={(event) => {
              setTournamentId(event.target.value);
            }}
          />
        }
      />
      <BlueBtn
        onClick={handleVerify}
        isLoading={loading}
        isDisabled={loading}
        className="!w-fit !text-f14 !px-3 !py-1 !h-fit"
      >
        Verify
      </BlueBtn>
    </div>
  );
};
