import { useToast } from '@Contexts/Toast';
import { useActiveChain } from '@Hooks/useActiveChain';
import { useUserAccount } from '@Hooks/useUserAccount';
import { getSignatureFromAddress } from '@Views/TradePage/cache';
import { baseUrl } from '@Views/TradePage/config';
import axios from 'axios';
import { useAtomValue } from 'jotai';
import { useAccount } from 'wagmi';
import { AddMarket } from './AddMarket';
import { Market } from './Market';
import { StartTimeEdit } from './StartTimeEdit';
import { SettlementFeesChangedConfigAtom, StartTimeAtom } from './store';
import { IMarketConstant } from './types';
import { useAdminMarketConstants } from './useAdminMarketConstants';

export const SettlementFeeConfigs: React.FC<any> = ({}) => {
  const { data, error, mutate } = useAdminMarketConstants();
  const editedValues = useAtomValue(SettlementFeesChangedConfigAtom);
  const { activeChain } = useActiveChain();
  const toastify = useToast();
  const { address } = useAccount();
  const { address: userAddress } = useUserAccount();
  const startTime = useAtomValue(StartTimeAtom);

  async function submitConfig() {
    try {
      if (data === undefined) throw new Error('No data found');
      if (!activeChain) throw new Error('Chain not found');
      if (!address) throw new Error('Wallet not connected.');
      if (editedValues === null && startTime === data.start_time)
        throw new Error('No changes made');

      let api_signature = null;
      if (userAddress === address)
        api_signature = await getSignatureFromAddress(activeChain, address);

      if (api_signature === null) throw new Error('Error generating signature');

      const updatedConfig = data.markets;
      if (editedValues !== null) {
        Object.entries(editedValues).map(([marketName, changedData]) => {
          Object.entries(changedData).map(([key, value]) => {
            if (updatedConfig[marketName] === undefined)
              updatedConfig[marketName] = {} as IMarketConstant;
            updatedConfig[marketName][key as keyof IMarketConstant] = value;
          });
        });
      }

      const res = await axios.post(
        baseUrl + 'admin/update/market_constants/',
        updatedConfig,
        {
          params: {
            environment: activeChain.id,
            api_signature,
            start_time: startTime,
          },
        }
      );

      await mutate();
      console.log(res, 'res');
      toastify({
        msg: 'Market updated successfully',
        type: 'success',
        id: 'market-updated',
      });
    } catch (e) {
      toastify({
        msg: 'Error in updating market. ' + (e as Error).message,
        type: 'error',
        id: 'error-updating-market',
      });
    }
  }

  if (data === undefined) return <div>Fetching Markets...</div>;
  if (error) return <div>Error Fetching Markets</div>;

  return (
    <div className="mx-[20px]">
      <AddMarket />
      <StartTimeEdit />
      <div className="flex flex-col gap-4  mt-4">
        {Object.entries(data.markets).map(([name, market]) => (
          <Market market={market} name={name} />
        ))}
      </div>
      <button
        onClick={submitConfig}
        className="text-f14 mt-4 px-3 py-2 rounded bg-3"
      >
        Submit
      </button>
    </div>
  );
};
