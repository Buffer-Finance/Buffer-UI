import { useAtom } from 'jotai';
import { useCallback, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { activeTournamentIdAtom } from '../atoms';

export const useUpdateActiveTournament = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [activeTournamentId, setActiveTournamentId] = useAtom(
    activeTournamentIdAtom
  );
  const id = params.id;
  let market = params.market;

  useEffect(() => {
    if (activeTournamentId === undefined && id) {
      setActiveTournamentId(id);
    }
    if (id && activeTournamentId != undefined && activeTournamentId != id) {
      setActiveTournamentId(id);
    }
  }, [id, activeTournamentId]);

  const setActiveTournament = useCallback(
    (newId: string) => {
      if (id && newId == id) return;
      setActiveTournamentId(newId);
      if (market === undefined) market = 'BTC-USD';
      navigate(`/no-loss/${newId}/${market}`);
    },
    [market, id]
  );

  return { setActiveTournament };
};
