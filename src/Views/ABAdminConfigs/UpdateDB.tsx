import { useToast } from '@Contexts/Toast';
import { useActiveChain } from '@Hooks/useActiveChain';
import { getSignatureFromAddress } from '@Views/TradePage/cache';
import { baseUrl } from '@Views/TradePage/config';
import axios from 'axios';
import { useAccount } from 'wagmi';

export const UpdateDB = () => {
  const { address } = useAccount();
  const toastify = useToast();
  const { activeChain } = useActiveChain();

  async function handleGraphQl() {
    try {
      if (!address) throw new Error('No address found');
      if (!activeChain) throw new Error('No chain found');

      const api_signature = await getSignatureFromAddress(activeChain, address);

      if (api_signature === null || api_signature === undefined)
        throw new Error('Error generating signature');

      const res = await axios.post(
        baseUrl + 'admin/update/satsuma_db_name/',
        null,
        {
          params: {
            environment: activeChain.id,
            api_signature,
          },
        }
      );

      toastify({
        msg: 'Successfully updated DB',
        type: 'success',
        id: 'success-updating-db',
      });
    } catch (e) {
      toastify({
        msg: 'Error in updating db. ' + (e as Error).message,
        type: 'error',
        id: 'error-updating-db',
      });
    }
  }

  async function handleUpdateDB() {
    try {
      if (!address) throw new Error('No address found');
      if (!activeChain) throw new Error('No chain found');

      const api_signature = await getSignatureFromAddress(activeChain, address);

      if (api_signature === null || api_signature === undefined)
        throw new Error('Error generating signature');

      const res = await axios.post(
        baseUrl + 'admin/update/graph_config/',
        null,
        {
          params: {
            environment: activeChain.id,
            api_signature,
          },
        }
      );

      toastify({
        msg: 'Successfully updated graphql table',
        type: 'success',
        id: 'success-updating-graphql',
      });
    } catch (e) {
      toastify({
        msg: 'Error in updating graphql. ' + (e as Error).message,
        type: 'error',
        id: 'error-updating-graphql',
      });
    }
  }

  return (
    <div className="text-f14 px-[20px]">
      <div className="flex gap-3 items-center">
        <div>Asset Deployment</div>
        <button
          className="bg-3 text-white rounded-sm px-4 py-2 text-f12"
          onClick={handleUpdateDB}
        >
          Update
        </button>
      </div>
      <div className="flex gap-3 items-center mt-3">
        <div>GrahQl Deployment</div>
        <button
          className="bg-3 text-white rounded-sm px-4 py-2 text-f12"
          onClick={handleGraphQl}
        >
          Update
        </button>
      </div>
    </div>
  );
};
