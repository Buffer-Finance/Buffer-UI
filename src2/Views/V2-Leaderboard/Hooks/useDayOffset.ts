import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';

export const useDayOffset = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const day = useMemo(() => searchParams.get('day'), [searchParams]);

  function setOffset(day: string) {
    setSearchParams({ day });
  }

  return { offset: day, setOffset };
};
