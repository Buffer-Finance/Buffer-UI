import { useAtomValue } from 'jotai';
import { readCallDataAtom } from '../atoms';

export const useIsInCreationWindow = () => {
  const result = useAtomValue(readCallDataAtom);

  let response: {
    forex: boolean | undefined;
    commodity: boolean | undefined;
    crypto: true;
  } = {
    forex: undefined,
    commodity: undefined,
    crypto: true,
  };
  if (result !== undefined) {
    response['forex'] = result.isInCreationWindow.Forex;
    response['commodity'] = result.isInCreationWindow.Commodity;
    response['crypto'] = true;
  }
  return response;
};
