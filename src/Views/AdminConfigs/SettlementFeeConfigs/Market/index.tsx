import { useToast } from '@Contexts/Toast';
import { useActiveChain } from '@Hooks/useActiveChain';
import { useUserAccount } from '@Hooks/useUserAccount';
import { useOneCTWallet } from '@Views/OneCT/useOneCTWallet';
import { getSignatureFromAddress } from '@Views/TradePage/cache';
import { baseUrl } from '@Views/TradePage/config';
import axios from 'axios';
import { useAccount } from 'wagmi';
import { IMarketConstant } from '../types';
import { useAdminMarketConstants } from '../useAdminMarketConstants';
import { EditField } from './EditField';

export const Market: React.FC<{ market: IMarketConstant; name: string }> = ({
  market,
  name,
}) => {
  const { activeChain } = useActiveChain();
  const { address } = useAccount();
  const { address: userAddress } = useUserAccount();
  const { oneCTWallet } = useOneCTWallet();
  const toastify = useToast();
  const { mutate } = useAdminMarketConstants();

  async function deleteMarket() {
    try {
      if (!address) throw new Error('Wallet not connected.');
      if (!oneCTWallet) throw new Error('One CT Wallet not found');

      let api_signature = null;
      if (userAddress === address)
        api_signature = await getSignatureFromAddress(activeChain, address);

      if (api_signature === null) throw new Error('Error generating signature');

      const res = await axios.post(
        baseUrl + 'admin/remove/market_constant_pair/',
        [name],
        {
          params: {
            environment: activeChain.id,
            api_signature,
          },
        }
      );
      await mutate();
      console.log(res, 'res');
      toastify({
        msg: 'Market deleted successfully',
        type: 'success',
        id: 'market-deleted',
      });
    } catch (e) {
      toastify({
        msg: 'Error in deleting market. ' + (e as Error).message,
        type: 'error',
        id: 'error-deleting-market',
      });
    }
  }

  return (
    <div className="text-f12">
      <div className="flex items-center gap-3">
        <div className="text-f14">{name}</div>
        <button className="px-2 py-1 rounded-sm bg-3" onClick={deleteMarket}>
          Delete Market
        </button>
      </div>

      {Object.entries(market).map(([key, value]) => (
        <div className="flex items-center gap-2 mb-2">
          <div className="w-[100px]">{key}</div>&nbsp;:&nbsp;
          <EditField
            defaultValue={value}
            keyValue={key}
            market={name}
            key={market + key}
          />
        </div>
      ))}
    </div>
  );
};
