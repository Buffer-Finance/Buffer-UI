import { useAtom } from 'jotai';
import { useCallback, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { activeMarketIdAtom } from '../atoms';

export const useUpdateActiveMarket = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [activeMarketId, setActiveMarketId] = useAtom(activeMarketIdAtom);
  const id = params.id;
  const market = params.market?.replace('-', '');

  useEffect(() => {
    if (activeMarketId === undefined && market) {
      setActiveMarketId(market);
    }
  }, []);

  useEffect(() => {
    if (market && activeMarketId !== undefined && activeMarketId !== market) {
      navigate(`/no-loss/${id}/${activeMarketId}`);
    }
  }, [activeMarketId]);

  const setActiveMarket = useCallback(
    (newMarketPairName: string) => {
      const tvId = newMarketPairName.replace('-', '');
      if (market && tvId === market) return;
      setActiveMarketId(tvId);
      navigate(`/no-loss/${id}/${newMarketPairName}`);
    },
    [market, id]
  );

  return { setActiveMarket };
};
