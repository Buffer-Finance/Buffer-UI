import { useGlobal } from '@Contexts/Global';
import { useToast } from '@Contexts/Toast';
import { ReactNode } from 'react';
import {
  ContractFunctionExecutionError,
  SimulateContractParameters,
  getAddress,
} from 'viem';
import {
  useAccount,
  useContractWrite,
  usePublicClient,
  useWalletClient,
} from 'wagmi';
import { useActiveChain } from './useActiveChain';

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
export function useWriteCall() {
  const { dispatch } = useGlobal();
  const toastify = useToast();
  const { simulateContract } = usePublicClient();
  const { data: walletClient } = useWalletClient();
  const { address } = useAccount();
  const { activeChain } = useActiveChain();
  const { data, error, isLoading, status, writeAsync } = useContractWrite({});
  const blockExplorer = activeChain?.blockExplorers?.default?.url;

  const write = async (
    contractAddress: string,
    abi: any[],
    callBack: (a?: any) => void,
    methodName: string,
    methodArgs: any[] = [],
    overrides: { value?: string } = {},
    customToast: ICustomToast | null = null,
    confirmationModal: IConfirmationModal | null = null
  ) => {
    if (!address) {
      return toastify({ type: 'error', msg: 'Please connect your wallet!' });
    }
    dispatch({ type: 'SET_TXN_LOADING', payload: 1 });
    toastify({
      id: contractAddress,
      msg: 'Transaction confirmation in progress...',
      type: 'info',
      inf: 1,
    });

    let transformedArgs: SimulateContractParameters = {
      abi,
      account: address,
      address: getAddress(contractAddress),

      args: methodArgs,
      functionName: methodName,
    };
    if (overrides?.value) {
      transformedArgs['value'] = overrides.value;
    }

    if (!walletClient)
      return console.warn(
        'walletClient is undefined in useWalletService...',
        walletClient
      );

    try {
      const { request, result } = await simulateContract(transformedArgs);
      console.log(`useWriteCall-request: `, request);
      const { hash } = await writeAsync(request);
      toastify({
        id: contractAddress,
        msg: customToast ? customToast.content : 'Transaction successful!',
        type: 'success',
        hash: `${blockExplorer}/tx/${hash}`,
        body: customToast ? customToast.body : null,
        confirmationModal: confirmationModal,
        timings: 100,
      });
      callBack({ res: data });
      dispatch({ type: 'SET_TXN_LOADING', payload: 0 });

      return hash;
    } catch (ex: unknown) {
      dispatch({ type: 'SET_TXN_LOADING', payload: 0 });
      const shortMessage = (
        ex as ContractFunctionExecutionError
      ).shortMessage.split('the following reason:')[1];

      callBack();
      toastify({
        id: contractAddress,
        duration: 200000,
        msg: (
          <span>
            Oops! There is some error!
            <br />
            <span className="!text-3">
              {shortMessage ||
                (ex as ContractFunctionExecutionError).shortMessage}
            </span>
          </span>
        ),
        type: 'error',
      });
      // console.warn(ex);
    }
  };

  return { writeCall: write };
}

/*


 write({ abi: usdcABI, account: address, address: usdc_address, functionName: 'claim', value: parseEther('0.0001') } as SimulateContractParameters)

*/
