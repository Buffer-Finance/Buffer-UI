import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';

export const useDayOffset = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const day = useMemo(() => searchParams.get('offset'), [searchParams]);

  function setOffset(day: string) {
    setSearchParams({ offset: day });
  }

  return { offset: day, setOffset };
};
