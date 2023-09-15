import { useSafeAppsSDK } from '@safe-global/safe-apps-react-sdk';
import { useAtomValue } from 'jotai';
import { useCallback } from 'react';
import { safeTxnsAtom } from './AdminConfig';

export const SendToSafe = () => {
  const txnBatch = useAtomValue(safeTxnsAtom);

  const { sdk, safe } = useSafeAppsSDK();

  const submitTx = useCallback(async () => {
    const txs = txnBatch.map((txn) => ({
      to: txn.to,
      value: txn.value,
      data: txn.data,
    }));
    console.log(txs);
    try {
      const { safeTxHash } = await sdk.txs.send({
        txs,
      });
      console.log({ safeTxHash });
      //   const safeTx = await sdk.txs.getBySafeTxHash(safeTxHash);
      //   console.log({ safeTx });
    } catch (e) {
      console.error(e);
    }
  }, [safe, sdk, txnBatch]);
  return <button onClick={submitTx}>Send Txns To Safe</button>;
};
