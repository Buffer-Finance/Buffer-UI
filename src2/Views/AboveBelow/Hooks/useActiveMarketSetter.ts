import { useSetAtom } from 'jotai';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { urlMarketAtom } from '../atoms';

export const useActiveMarketSetter = () => {
  const params = useParams();
  const setActiveMarket = useSetAtom(urlMarketAtom);
  useEffect(() => {
    if (params?.market) {
      setActiveMarket(params.market);
    }
  }, [params]);
};
