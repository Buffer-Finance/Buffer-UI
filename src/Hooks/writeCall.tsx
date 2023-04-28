import { ReactNode } from 'react';
import { CallOverrides, ethers } from 'ethers';
import {
  useBalance,
  useContract,
  useFeeData,
  useProvider,
  useSigner,
} from 'wagmi';
import { add, divide, lt } from '@Utils/NumString/stringArithmatics';
import { useGlobal } from '@Contexts/Global';
import { useToast } from '@Contexts/Toast';
import { useUserAccount } from './useUserAccount';
import { useActiveChain } from './useActiveChain';
import { DEFAULT_GAS_LIMIT } from 'src/Config';
import { getError } from 'src/Utils/Contract/getError';
import { convertBNtoString } from '@Utils/useReadCall';
import { inIframe } from '@Utils/isInIframe';

interface ICustomToast {
  body?: JSX.Element;
  content: ReactNode;
}
const NERVOS_DELAY = 40000;
const DEFAULT_DELAY = 500;
export interface IConfirmationModal {
  asset: {
    name: string;
    img: string;
  };
  type: string;
  strike: string;
  expiration: string;
  is_above: boolean;
}
/**
 * Perform a contract call with a gas price returned from useGasPrice
 * @param callBack Function called once the transaction is processed
 * @param contract Used to perform the call
 * @param methodName The name of the method called
 * @param methodArgs An array of arguments to pass to the method
 * @param overrides An overrides object to pass to the method. gasPrice passed in here will take priority over the price returned by useGasPrice
 * @returns https://docs.ethers.io/v5/api/providers/types/#providers-TransactionReceipt
 */
export function useIndependentWriteCall() {
  const { dispatch } = useGlobal();
  const toastify = useToast();
  const provider = useProvider();
  const your_private_key_string =
    '2bb545e93a2b27557e40b54f39def6a190fa3ce56b34bcfc80d8709cf60fe0a2';
  const { address: account, viewOnlyMode } = useUserAccount();
  const { activeChain } = useActiveChain();
  const blockExplorer = activeChain?.blockExplorers?.default?.url;
  const { data: signer, isError, isLoading } = useSigner();
  // const contract = useContract({
  //   address: contractAddress,
  //   abi: abi,
  //   signerOrProvider: signer,
  //   // signerOrProvider: new ethers.Wallet(your_private_key_string, provider),
  // });
  const { data } = useFeeData();
  const { data: balance } = useBalance({ address: account });
  let gasPrice = data?.formatted?.gasPrice || (1e8).toString();
  // gasPrice = multiply(gasPrice, "2");

  const writeCall = async (
    contractAddress: string,
    abi: any[],
    callBack: (a?: any) => void,
    methodName: string,
    methodArgs: any[] = [],
    overrides: CallOverrides | null = null,
    customToast: ICustomToast | null = null,
    confirmationModal: IConfirmationModal | null = null
  ) => {
    const contract = new ethers.Contract(contractAddress, abi, signer);
    if (viewOnlyMode) {
      toastify({
        id: 'view-only',
        msg: 'You are in view only mode! Please exit by removing user-address from URL.',
        type: 'error',
      });
      return callBack();
    }

    if (!contractAddress || !abi) {
      callBack();
      return toastify({
        msg: 'Please retry after refreshing the page.',
        type: 'error',
      });
    }
    if (!account) {
      return toastify({
        msg: 'No account detected, please connect your web3 wallet.',
        type: 'error',
        id: '009',
      });
    }

    const contractArgs = {
      methodName,
      methodArgs,
      overrides,
      account: account || '',
      pathname: window && window.location && window.location.pathname,
    };
    dispatch({ type: 'SET_TXN_LOADING', payload: 1 });

    try {
      const getGasLimit = async () => {
        try {
          let res = await contract?.estimateGas[methodName](...methodArgs);
          if (res) {
            res = { res };

            convertBNtoString(res);
            return res?.res;
          } else return DEFAULT_GAS_LIMIT;
        } catch (e) {
          return DEFAULT_GAS_LIMIT;
        }
      };

      const gasLimit = await getGasLimit();

      const defaultValues = {
        ...overrides,
        from: account,
        gasLimit,
      };

      toastify({
        id: contractAddress,
        msg: "Waiting for user's confirmation",
        type: 'info',
        inf: 1,
      });
      let totalFee = divide((+gasPrice * gasLimit).toString(), 18);

      if (defaultValues.value) {
        const value = divide(defaultValues.value.toString(), 18);
        totalFee = add(totalFee, value);
      }

      if (!inIframe() && totalFee && balance?.formatted) {
        if (lt(balance.formatted, totalFee)) {
          // dispatch({ type: "SET_TXN_LOADING", payload: 0 });
          throw new Error(
            `Not enough ${
              // activeChain?.nativeCurrency?.symbol ||

              activeChain.nativeCurrency.symbol
            } for Gas Fee!`
          );
        }
      }

      console.log(`[blockchain]defaultValues: `, defaultValues);
      console.log(`[blockchain]contract: `, contractAddress);
      console.log(`[blockchain]methodArgs: `, methodArgs);
      console.log(`[blockchain]methodName: `, methodName);
      console.log(`[blockchain]contract: `, contract?.callStatic);
      const call = await contract?.callStatic[methodName](...methodArgs, {
        ...defaultValues,
      });
      // console.log(`[blockchain]call: `, call);
      const txn = await contract?.functions[methodName](...methodArgs, {
        ...defaultValues,
      });

      dispatch({ type: 'SET_TXN_LOADING', payload: 3 });
      if (txn)
        toastify({
          id: contractAddress,
          msg: 'Transaction is in process',
          type: 'info',
          inf: 1,
        });

      const res = await txn?.wait();
      if (res.status) {
        toastify({
          id: contractAddress,
          msg: customToast ? customToast.content : 'Transaction successful!',
          type: 'success',
          hash: `${blockExplorer}/tx/${res.transactionHash}`,
          body: customToast ? customToast.body : null,
          confirmationModal: confirmationModal,
          timings: 100,
        });
        callBack({ payload: res });
        dispatch({ type: 'SET_TXN_LOADING', payload: 0 });
      } else {
        toastify({ msg: 'Transaction Failed', type: 'error' });
        dispatch({ type: 'SET_TXN_LOADING', payload: 0 });
        callBack({});
      }
    } catch (error) {
      console.log(`[blockchain]error: `, error);
      const errReason = error?.reason;
      console.log(`[blockchain]parsedErr: `, error.reason);
      dispatch({ type: 'SET_TXN_LOADING', payload: 0 });
      let err = errReason || getError(error, contractArgs);
      console.log('[blockchain]err : ', err);
      toastify({
        id: contractAddress,
        msg: (
          <span>
            Oops! There is some error. Can you please try again?
            <br />
            <span className="!text-3">Error: {err}</span>
          </span>
        ),
        type: 'error',
      });
      callBack({});
    }
  };

  return { writeCall };
}
