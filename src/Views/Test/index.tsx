import { priceAtom, usePrice, usePriceRetriable } from '@Hooks/usePrice';
import { CustomHookUseMemoTest } from './CustomHookUseMemoTest';
import { useAtomValue } from 'jotai';
import { queuets2priceAtom } from '@Views/TradePage/atoms';

export const Test = () => {
  // return <CustomHookUseMemoTest />;
  const price = useAtomValue(priceAtom);
  const activeAssetStream = (price as any)['BTCUSD'];

  usePriceRetriable();

  return <div>{JSON.stringify(activeAssetStream)}</div>;
};
