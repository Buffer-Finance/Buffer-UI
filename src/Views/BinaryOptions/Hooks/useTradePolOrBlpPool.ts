import { useAtomValue } from 'jotai';
import { useQTinfo } from '..';
import { useActivePoolObj } from '../PGDrawer/PoolDropDown';
import { ammountAtom } from '../PGDrawer';

export const useTradePolOrBlpPool = () => {
  const { activePair } = useQTinfo();
  const { activePoolObj } = useActivePoolObj();
  const userInput = useAtomValue(ammountAtom);

  let response = {
    min_amount: activePoolObj.token.min_amount,
    option_contract: activePoolObj.options_contracts,
  };

  const polExists = activePair.pools.find((pool) => pool.token.is_pol);

  if (polExists) {
    response.min_amount = polExists.token.min_amount;
    if (
      userInput &&
      userInput !== '' &&
      userInput < activePoolObj.token.min_amount
    ) {
      response.option_contract = polExists.options_contracts;
    }
  }
  console.log(response, 'response');
  return response;
};
