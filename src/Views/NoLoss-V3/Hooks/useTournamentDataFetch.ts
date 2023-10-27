import { useToast } from '@Contexts/Toast';
import { useCall2Data } from '@Utils/useReadCall';
import { useAtomValue, useSetAtom } from 'jotai';
import {
  noLossReadCallsReadOnlyAtom,
  noLossReadcallResponseReadOnlyAtom,
} from '../atoms';

export const useTournamentDataFetch = () => {
  const tournamentReadCalls = useAtomValue(noLossReadCallsReadOnlyAtom);
  const setResponse = useSetAtom(noLossReadcallResponseReadOnlyAtom);
  const toastify = useToast();
  console.log('tournamentReadCalls', tournamentReadCalls);

  try {
    const { data, error } = useCall2Data(
      tournamentReadCalls.calls,
      'tournamentData'
    );
    if (error) {
      throw error;
    }
    setResponse(data);
  } catch (e) {
    toastify({
      type: 'error',
      msg: (e as Error).message,
      id: 'tournamentReadcallDataError',
    });
  }
};
