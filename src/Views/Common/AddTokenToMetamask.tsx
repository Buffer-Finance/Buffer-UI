import { useToast } from '@Contexts/Toast';
import { useAccount } from 'wagmi';

export const AddTokenToMetamask = ({
  tokenAddress,
  tokenSymbol,
  tokenDecimals,
  tokenImage,
}: {
  tokenAddress: string;
  tokenSymbol: string;
  tokenDecimals: number;
  tokenImage: string;
}) => {
  const { address: account } = useAccount();
  const toastify = useToast();

  async function addToken() {
    if (!account) return;
    try {
      if (!window?.ethereum) return;

      // Add the token to MetaMask
      const tokenAdded = await window.ethereum.request({
        method: 'wallet_watchAsset',
        params: {
          type: 'ERC20',
          options: {
            address: tokenAddress,
            symbol: tokenSymbol,
            decimals: tokenDecimals,
            image: tokenImage,
          },
        },
      });

      if (tokenAdded) {
        toastify({
          type: 'success',
          msg: `${tokenSymbol} token added to MetaMask!`,
          id: 'addToken',
        });
      } else {
        throw new Error(`Failed to add ${tokenSymbol} token to MetaMask`);
      }
    } catch (e) {
      toastify({
        type: 'error',
        msg: `Failed to add ${tokenSymbol} token to MetaMask` + e,
        id: 'addToken',
      });
    }
  }

  return (
    <button onClick={addToken} className="max-w-[20px] mt-1">
      <img src="https://s2.coinmarketcap.com/static/cloud/img/metamask.png?_=30fdd43" />
    </button>
  );
};
