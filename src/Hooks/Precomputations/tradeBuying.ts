import { useSmartAccount } from '@Hooks/AA/useSmartAccount';
import useSWR from 'swr';
import RouterABI from '../../Views/NoLoss-V3/ABIs/NoLossRouter.json';
import { encodeFunctionData } from 'viem';
const useTradeBuyingOps = (args: any[], to: string) => {
  const { smartAccount } = useSmartAccount();
  return useSWR(smartAccount, {
    fetcher: async (smartAccount) => {
      const txns = {
        to,
        data: encodeFunctionData({
          abi: RouterABI,
          functionName: 'initiateTrade',
          args,
        }),
      };
      console.log(`arg: `, txns);
    },
    refreshInterval: 2000,
  });
};

export { useTradeBuyingOps };
