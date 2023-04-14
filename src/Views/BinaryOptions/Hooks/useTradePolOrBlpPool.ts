import { useQTinfo } from '..';
import { useActivePoolObj } from '../PGDrawer/PoolDropDown';

export const useTradePolOrBlpPool = () => {
  const { activePair } = useQTinfo();
  const { activePoolObj } = useActivePoolObj();
  let response = {
    min_amount: activePoolObj.token.min_amount,
    option_contract: activePoolObj.options_contracts,
  };
  const polExists = activePair.pools.find((pool) =>
    pool.token.name.toLowerCase().includes('pol')
  );
  if (polExists)
    response = {
      min_amount: polExists.token.min_amount,
      option_contract: polExists.options_contracts,
    };
  return response;
};
