import { useToast } from '@Contexts/Toast';
import { useActiveChain } from '@Hooks/useActiveChain';
import { useWriteCall } from '@Hooks/useWriteCall';
import { BlueBtn } from '@Views/Common/V2-Button';
import CircuitBreakerABI from '@Views/TradePage/ABIs/CircuitBreakerABI.json';
import { getConfig } from '@Views/TradePage/utils/getConfig';
import { useAtomValue, useSetAtom } from 'jotai';
import { useState } from 'react';
import { poolAPRsAtom, thresholdsAtom, txnSuccessAtom } from './atoms';

export const InitializeBtn: React.FC<{}> = ({}) => {
  const { activeChain } = useActiveChain();
  const config = getConfig(activeChain.id);
  const { writeCall } = useWriteCall(config.cb, CircuitBreakerABI);
  const toastify = useToast();
  const [loading, setLoading] = useState(false);
  const thresholds = useAtomValue(thresholdsAtom);
  const poolAprs = useAtomValue(poolAPRsAtom);
  const setTxnStatus = useSetAtom(txnSuccessAtom);

  async function handleInitialize() {
    try {
      await writeCall(() => {}, 'initialize', [[], poolAprs, thresholds]);
      setTxnStatus(true);
    } catch (e) {
      toastify({
        type: 'error',
        msg: 'Error initializing Circuit Breaker ' + (e as Error).message,
        id: 'error-init-cb',
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <BlueBtn
      onClick={handleInitialize}
      className="!text-f16 !w-fit px-5 py-3"
      isLoading={loading}
      isDisabled={loading}
    >
      Initialize
    </BlueBtn>
  );
};
