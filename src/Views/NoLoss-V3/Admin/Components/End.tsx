import { useToast } from '@Contexts/Toast';
import { useWriteCall } from '@Hooks/useWriteCall';
import { BlueBtn } from '@Views/Common/V2-Button';
import { activeChainAtom, tournaments } from '@Views/NoLoss-V3/atoms';
import { getNoLossV3Config } from '@Views/NoLoss-V3/helpers/getNolossV3Config';
import { useAtomValue } from 'jotai';
import { useMemo, useState } from 'react';
import TournamentManagerABI from '../../ABIs/TournamentManager.json';
import { AdminTournamentCard } from './Form/Card';

export const End = () => {
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
        tournament.state.toLowerCase() === 'live' &&
        tournament.tournamentMeta.isClosed === false &&
        +tournament.tournamentMeta.close < Math.floor(Date.now() / 1000)
    );
  }, [allTournaments]);

  async function handleEnd(tournamentId: string) {
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
        'endTournament',
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
        No tournaments to end.
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
              onClick={() => handleEnd(tournament.id)}
              isLoading={loading === tournament.id}
              isDisabled={loading === tournament.id}
              className="mt-4 !text-f14 !px-3 !py-1 !h-[30px]"
            >
              End
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
        onClick={handleEnd}
        isLoading={loading}
        isDisabled={loading}
        className="!w-fit !text-f14 !px-3 !py-1 !h-fit"
      >
        End
      </BlueBtn> */}
    </div>
  );
};
