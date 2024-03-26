import { useGlobal } from '@Contexts/Global';
import { useToast } from '@Contexts/Toast';
import { useUserAccount } from '@Hooks/useUserAccount';
import { gt } from '@Utils/NumString/stringArithmatics';
import { useCallback } from 'react';
import { useAccount } from 'wagmi';

const useWriteCallValidations = () => {
  const { state } = useGlobal();
  const { address: account } = useUserAccount();
  const toastify = useToast();
  const exitValidations = useCallback(() => {
    if (state.txnLoading === 2) {
      toastify({
        id: '2321123',
        type: 'error',
        msg: 'Please confirm your previous pending transactions.',
      });
      return true;
    }
    if (!account) {
      toastify({
        id: '2321123',
        type: 'error',
        msg: 'Please connect your wallet first.',
      });
      return true;
    }
  }, [state, account]);
  const amountValidations = useCallback(
    (amount) => {
      if (!amount || amount === '0' || amount === '') {
        toastify({
          type: 'error',
          msg: 'Please enter a positive number.',
          id: 'invalidNumber',
        });
        return true;
      }
    },
    [toastify]
  );
  const userBalanceValidations = useCallback(
    (amount, userBalance) => {
      if (gt(amount, userBalance)) {
        toastify({
          type: 'error',
          msg: 'Insufficient balance.',
          id: 'insufficientBalance',
        });
        return true;
      }
    },
    [toastify]
  );

  return { exitValidations, amountValidations, userBalanceValidations };
};

export default useWriteCallValidations;
