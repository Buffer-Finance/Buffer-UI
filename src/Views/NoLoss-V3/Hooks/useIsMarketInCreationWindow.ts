import { useAtomValue } from 'jotai';
import { noLossReadCallsReadOnlyAtom } from '../atoms';

export const useIsMarketInCreationWindow = () => {
  const { result } = useAtomValue(noLossReadCallsReadOnlyAtom);

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
  }
  return response;
};
