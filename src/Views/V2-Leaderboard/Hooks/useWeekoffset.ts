import { useSearchParams } from 'react-router-dom';

export const useWeekOffset = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const week = searchParams.get('offset');

  function setOffset(day: string) {
    setSearchParams({ offset: day });
  }

  return { offset: week, setOffset };
};
