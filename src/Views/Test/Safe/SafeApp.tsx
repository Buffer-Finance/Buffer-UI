import { generateTransactionData } from '@Views/AdminConfigs/helpers';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useSafeAppsSDK } from '@safe-global/safe-apps-react-sdk';
import { useCallback } from 'react';
import counterABI from './TestABis/counter.json';
import messageABI from './TestABis/message.json';

const SafeApp = () => {
  const { sdk, safe } = useSafeAppsSDK();

  const submitTx = useCallback(async () => {
    const random = Math.random().toFixed(3);

    try {
      const { safeTxHash } = await sdk.txs.send({
        txs: [
          {
            to: '0x9ebC361a753Ab4e265fC77cD88940e3f39c5c67B',
            value: '0',
            data: generateTransactionData(
              '0x9ebC361a753Ab4e265fC77cD88940e3f39c5c67B',
              counterABI,
              'update',
              [5]
            ),
          },
          {
            to: '0x611D11d216B8cA76B3eab3A2f62D8706d8d1e865',
            value: '0',
            data: generateTransactionData(
              '0x611D11d216B8cA76B3eab3A2f62D8706d8d1e865',
              messageABI,
              'updateMessage',
              ['Hey dddd' + random]
            ),
          },
        ],
      });
      console.log({ safeTxHash });
      const safeTx = await sdk.txs.getBySafeTxHash(safeTxHash);
      console.log({ safeTx });
    } catch (e) {
      console.error(e);
    }
  }, [safe, sdk]);

  return (
    <div>
      <ConnectButton />
      {safe.safeAddress}
      <button onClick={submitTx}>Click to send a test transaction</button>
    </div>
  );
};

export { SafeApp };
