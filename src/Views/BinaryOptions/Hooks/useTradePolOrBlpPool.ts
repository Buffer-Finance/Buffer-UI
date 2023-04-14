import { useAtomValue } from 'jotai';
import { useQTinfo } from '..';
import { useActivePoolObj } from '../PGDrawer/PoolDropDown';
import { ammountAtom } from '../PGDrawer';
import { useMemo } from 'react';

export const useTradePolOrBlpPool = () => {
  const { activePair } = useQTinfo();
  const { activePoolObj } = useActivePoolObj();
  const userInput = useAtomValue(ammountAtom);

  const polOrBlpPoolDiffValue = useMemo(() => {
    let response = {
      min_amount: activePoolObj.token.min_amount,
      option_contract: activePoolObj.options_contracts,
    };

    const polExists = activePair.pools.filter((pool) => pool.token.is_pol);
    const pol = polExists
      ? polExists.find(
          (pool) => pool.token.name.split('_')[0] === activePoolObj.token.name
        )
      : null;

    if (polExists.length > 0 && pol) {
      response.min_amount = pol.token.min_amount;
      if (
        userInput &&
        userInput !== '' &&
        userInput < activePoolObj.token.min_amount
      ) {
        response.option_contract = pol.options_contracts;
      }
    }
    console.log(`[augexp]response: `, response);
    return response;
  }, [activePair, activePoolObj, userInput]);

  return polOrBlpPoolDiffValue;
};
