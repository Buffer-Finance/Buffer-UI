import { divide } from './NumString/stringArithmatics';
import { getContract } from '@Views/Migration/Address';
import { convertBNtoString } from './useReadCall';
import { useAccount, erc20ABI, useContractRead } from 'viem';
import { MigrationContext } from '@Views/Migration';
import { useContext } from 'react';
import { useUserAccount } from '@Hooks/useUserAccount';

export const useIbfrBalance = () => {
  const { address: account } = useUserAccount();
  const { activeChain } = useContext(MigrationContext);

  const ibfrAddress = getContract(activeChain?.id, 'ibfr');

  const TokenContract = {
    address: ibfrAddress,
    abi: erc20ABI,
  };

  let { data } = useContractRead({
    ...TokenContract,
    functionName: 'balanceOf',
    args: [account],
    watch: true,
  });
  if (data) {
    let copy = { data };
    convertBNtoString(copy);
    return divide(copy.data.toString(), 18);
  }
  return null;
};
