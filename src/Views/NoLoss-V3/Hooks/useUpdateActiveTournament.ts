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
  const market = params.market;

  useEffect(() => {
    if (activeTournamentId === undefined && id) {
      setActiveTournamentId(+id);
    }
  }, []);

  //   useEffect(() => {
  //     if (id && activeTournamentId !== undefined && activeTournamentId !== +id) {
  //       navigate(`/tournament/${activeTournamentId}/${market}`);
  //     }
  //   }, [activeTournamentId]);

  const setActiveTournament = useCallback(
    (newId: number) => {
      if (id && newId === +id) return;
      setActiveTournamentId(newId);
      navigate(`/no-loss/${newId}/${market}`);
    },
    [market, id]
  );

  return { setActiveTournament };
};
