import { useCall2Data } from '@Utils/useReadCall';
import { readCallsAtom, readResponseAtom } from '@Views/DashboardV2/atoms';
import { useAtomValue, useSetAtom } from 'jotai';

export const useReadcalls = () => {
  const readcalls = useAtomValue(readCallsAtom);
  const setResponse = useSetAtom(readResponseAtom);

  const { data, error } = useCall2Data(readcalls, 'dashboardV2-readcalls');
  if (error) console.log(error);
  setResponse(data);
};
