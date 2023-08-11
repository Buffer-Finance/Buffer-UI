import { ReactNode } from 'react';
import { CallOverrides, ethers } from 'ethers';
import {
  useBalance,
  useContract,
  useFeeData,
  usePublicClient,
  useWalletClient,
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
  const provider = usePublicClient();
  const your_private_key_string =
    '2bb545e93a2b27557e40b54f39def6a190fa3ce56b34bcfc80d8709cf60fe0a2';
  const { address: account, viewOnlyMode } = useUserAccount();
  const { activeChain } = useActiveChain();
  const blockExplorer = activeChain?.blockExplorers?.default?.url;
  const { data: signer, isError, isLoading } = useWalletClient();

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
    alert(
      'We upgrade write calls to use viem instead of wagmi, please inform developers about this'
    );
  };

  return { writeCall };
}
