import { useToast } from '@Contexts/Toast';
import { useWriteCall } from '@Hooks/useWriteCall';
import { BlueBtn } from '@Views/Common/V2-Button';
import { activeChainAtom, tournaments } from '@Views/NoLoss-V3/atoms';
import { getNoLossV3Config } from '@Views/NoLoss-V3/helpers/getNolossV3Config';
import { useAtomValue } from 'jotai';
import { useMemo, useState } from 'react';
import TournamentManagerABI from '../../ABIs/TournamentManager.json';
import { AdminTournamentCard } from './Form/Card';

export const Start = () => {
  // const [tournamentId, setTournamentId] = useState('');
  const { writeCall } = useWriteCall();
  const toastify = useToast();
  const [loading, setLoading] = useState<string | undefined>(undefined);
  const activeChain = useAtomValue(activeChainAtom);

  const allTournaments = useAtomValue(tournaments);

  const filteredTournaments = useMemo(() => {
    if (allTournaments == undefined) return null;
    if (allTournaments.length === 0) return [];
    return allTournaments.filter(
      (tournament) =>
        tournament.tournamentMeta.isVerified === true &&
        tournament.state.toLowerCase() === 'upcoming' &&
        tournament.tournamentMeta.tradingStarted === false
    );
  }, [allTournaments]);

  async function handleStart(tournamentId: string) {
    try {
      if (tournamentId === '') throw new Error('Please enter tournament id');
      if (isNaN(Number(tournamentId)))
        throw new Error('Please enter valid tournament id');
      if (activeChain === undefined) throw new Error('No active chain');
      const config = getNoLossV3Config(activeChain.id);
      setLoading(tournamentId);
      const params = [Number(tournamentId)];
      await writeCall(
        config.manager,
        TournamentManagerABI,
        () => {},
        'startTournament',
        params
      );
    } catch (e) {
      toastify({ type: 'error', msg: (e as Error).message });
    } finally {
      setLoading(undefined);
    }
  }
  if (filteredTournaments == undefined)
    return <div className="text-f15 text-1 mt-5 m-auto w-fit">Loading</div>;
  if (filteredTournaments.length === 0)
    return (
      <div className="text-f15 text-1 mt-5 m-auto w-fit">
        No tournaments to start.
      </div>
    );

  return (
    <div className="flex flex-wrap gap-4 text-f14 p-4">
      {filteredTournaments.map((tournament) => (
        <AdminTournamentCard
          isMobile={false}
          tournament={tournament}
          key={tournament.id + tournament.tournamentMeta.name}
          button={
            <BlueBtn
              onClick={() => handleStart(tournament.id)}
              isLoading={loading === tournament.id}
              isDisabled={loading === tournament.id}
              className="mt-4 !text-f14 !px-3 !py-1 !h-[30px]"
            >
              Start
            </BlueBtn>
          }
        />
      ))}
      {/* <LabelWrapper
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
        onClick={handleStart}
        isLoading={loading}
        isDisabled={loading}
        className="!w-fit !text-f14 !px-3 !py-1 !h-fit"
      >
        Start
      </BlueBtn> */}
    </div>
  );
};
