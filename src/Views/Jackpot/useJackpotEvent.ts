import { useAccount, useContractEvent, usePublicClient } from 'wagmi';
import JackootABI from '@ABIs/JackpotABI.json';
import RouterABI from '@ABIs/ABI/routerABI.json';
import { createPublicClient, http } from 'viem';
import { arbitrumSepolia } from 'src/Config/wagmiClient/getConfigChains';
import { useJackpotManager } from 'src/atoms/JackpotState';

import { mainnet } from 'viem/chains';
import { useEffect } from 'react';
import { JackpotAdds } from '@Views/TradePage/config';

export const publicClient = createPublicClient({
  chain: arbitrumSepolia,
  transport: http(),
});

const useJackpotEvent = () => {
  const jackpotManager = useJackpotManager();
  const user = useAccount();
  const publicClient2 = usePublicClient();

  useEffect(() => {
    console.log('jackpotdeb-listening');
    // console.log(`publicClient2: `, publicClient2);

    const unwatch = publicClient.watchContractEvent({
      address: JackpotAdds,
      abi: JackootABI,
      eventName: 'JackpotTriggered',
      onLogs: (logs) => {
        console.log('jackpotdeb-triggered-1', logs, user?.address);
        try {
          if (!user?.address) return;
          const logArgs = logs[0].args;
          // if (logArgs.jackpotWinAmount == 0n) return;
          const jp = {
            option_id: +logArgs.optionId.toString(),
            target_contract: logArgs.optionContract,
            jackpot_amount: logArgs.jackpotWinAmount.toString(),
            router: logArgs.router,
            user_address: logArgs.userAddress,
            trade_size: logArgs.amount.toString(),
          };
          console.log('jackpotdeb-triggered-1.5', logs, user?.address);

          if (
            user.address?.toLowerCase() == logArgs.userAddress.toLowerCase()
          ) {
            console.log('jackpotdeb-triggered-2', jp);

            jackpotManager.addJackpot(jp);
          }
        } catch (e) {
          console.log('jackpotdeb-error', e);
        }
      },
    });
    return () => {
      console.log('jackpotdeb-cleaning');

      unwatch();
    };
  }, [user, publicClient2, jackpotManager.addJackpot]);
  return null;
};

export { useJackpotEvent };
