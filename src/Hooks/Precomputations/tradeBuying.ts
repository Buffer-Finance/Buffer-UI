import { SmartAccount, useSmartAccount } from '@Hooks/AA/useSmartAccount';
import useSWR from 'swr';
import RouterABI from '../../Views/NoLoss-V3/ABIs/NoLossRouter.json';
import { encodeFunctionData } from 'viem';
import { PaymasterMode } from '@biconomy/paymaster';
const useTradeBuyingOps = (args: any[], to: string) => {
  const { smartAccount } = useSmartAccount();
  return useSWR(smartAccount, {
    fetcher: async (smartAccount: SmartAccount) => {
      const txns = {
        to,
        data: encodeFunctionData({
          abi: RouterABI,
          functionName: 'initiateTrade',
          args,
        }),
      };
      const userOps = await smartAccount.library.buildUserOp([txns], {
        mode: PaymasterMode.SPONSORED,
      });
      console.log(`arg: `, userOps);
      return userOps;
    },

    refreshInterval: 2000,
  });
};

export { useTradeBuyingOps };
