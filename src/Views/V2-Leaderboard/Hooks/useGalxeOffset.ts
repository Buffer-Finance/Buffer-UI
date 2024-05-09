import { useSearchParams } from 'react-router-dom';

export const useGalxeWeekOffset = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const week = searchParams.get('week');

  function setOffset(day: string) {
    setSearchParams({ week: day });
  }

  return { offset: week, setOffset };
};
