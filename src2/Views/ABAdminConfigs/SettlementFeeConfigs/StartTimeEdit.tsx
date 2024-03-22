import { useAtom } from 'jotai';
import { useEffect } from 'react';
import { StartTimeAtom } from './store';
import { useAdminMarketConstants } from './useAdminMarketConstants';

export const StartTimeEdit = () => {
  const [startTime, setStartTime] = useAtom(StartTimeAtom);
  const { data } = useAdminMarketConstants();

  useEffect(() => {
    if (data === undefined) return;
    setStartTime(data.start_time);
  }, []);

  if (data === undefined || startTime === null) return <></>;

  return (
    <div className="my-4 text-f12 flex gap-4 items-center">
      <div>start_time : </div>

      <input
        type="datetime-local"
        className="rounded-md p-2 bg-2"
        onChange={(e) => {
          setStartTime(new Date(e.target.value).getTime() / 1000);
        }}
        value={new Date(startTime * 1000).toISOString().slice(0, 16)}
      />
    </div>
  );
};
