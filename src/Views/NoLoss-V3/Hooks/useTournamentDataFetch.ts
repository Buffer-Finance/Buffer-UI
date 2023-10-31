import { useToast } from '@Contexts/Toast';
import { useCall2Data } from '@Utils/useReadCall';
import { useAtomValue, useSetAtom } from 'jotai';
import {
  noLossReadCallsReadOnlyAtom,
  noLossReadcallResponseReadOnlyAtom,
  tournamentBasedReadCallsReadOnlyAtom,
} from '../atoms';

export const useTournamentDataFetch = () => {
  const tournamentReadCalls = useAtomValue(noLossReadCallsReadOnlyAtom);
  const tournamentResponseBasedReadCalls = useAtomValue(
    tournamentBasedReadCallsReadOnlyAtom
  );
  const setResponse = useSetAtom(noLossReadcallResponseReadOnlyAtom);
  const toastify = useToast();
  // console.log(
  //   'tournamentReadCalls',
  //   tournamentReadCalls,
  //   tournamentResponseBasedReadCalls
  // );

  try {
    let calls = null;
    if (tournamentReadCalls.calls !== null) {
      calls = tournamentReadCalls.calls;
      if (
        tournamentResponseBasedReadCalls.calls !== null &&
        calls.length <
          tournamentResponseBasedReadCalls.calls.length +
            tournamentReadCalls.calls.length
      )
        calls.push(...tournamentResponseBasedReadCalls.calls);
    }
    // filter out the calls with duplicate ids
    calls = calls?.filter(
      (call, index, self) => self.findIndex((c) => c.id === call.id) === index
    );
    const { data, error } = useCall2Data(calls, 'tournamentData');
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
