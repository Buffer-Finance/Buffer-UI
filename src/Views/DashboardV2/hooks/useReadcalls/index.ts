import { useCall2Data } from '@Utils/useReadCall';
import {
  readCallsAtom,
  readResponseAtom,
  setReadCallsAtom,
} from '@Views/DashboardV2/atoms';
import { useAtomValue, useSetAtom } from 'jotai';
import { useEffect } from 'react';

export const useReadcalls = () => {
  const readcalls = useAtomValue(readCallsAtom);
  const setResponse = useSetAtom(readResponseAtom);
  const setCalls = useSetAtom(setReadCallsAtom);

  useEffect(() => {
    setCalls({ readcalls: [], isCleanup: true });
    return () => {
      setCalls({ readcalls: [], isCleanup: true });
    };
  }, []);
  const { data, error } = useCall2Data(readcalls, 'dashboardV2-readcalls');
  if (error) console.log(error);
  setResponse(data);
};
