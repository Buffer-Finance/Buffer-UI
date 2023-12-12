import {
  SmartAccount,
  getSessionParams,
  useSmartAccount,
} from '@Hooks/AA/useSmartAccount';
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
      const sessionParams = await getSessionParams(smartAccount);
      if (!sessionParams) return null;
      console.log(`sessionParams: `, sessionParams);
      console.log(
        `smartAccount: `,
        smartAccount.library.activeValidationModule
      );
      try {
        const userOps = await smartAccount.library.buildUserOp([txns], {
          paymasterServiceData: {
            mode: PaymasterMode.SPONSORED,
          },
          skipBundlerGasEstimation: true,
          ...sessionParams,
        });
        console.log(`arg: `, userOps);
        return userOps;
      } catch (error) {
        error && console.error(error);
      }
      return null;
    },

    refreshInterval: 2000,
  });
};

export { useTradeBuyingOps };
