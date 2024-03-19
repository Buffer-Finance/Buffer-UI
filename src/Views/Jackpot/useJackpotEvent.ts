import { useAccount, useContractEvent } from 'wagmi';
import JackootABI from '@ABIs/JackpotABI.json';
import RouterABI from '@ABIs/ABI/routerABI.json';
import { createPublicClient, http } from 'viem';
import { arbitrumSepolia } from 'src/Config/wagmiClient/getConfigChains';
import { useJackpotManager } from 'src/atoms/JackpotState';

import { mainnet } from 'viem/chains';
import { useEffect } from 'react';

export const publicClient = createPublicClient({
  chain: arbitrumSepolia,
  transport: http(),
});
const unwatch = publicClient.watchContractEvent({
  address: '0x65024158941e15283a376F69E40dED61F522cb51',
  abi: JackootABI,
  eventName: 'JackpotTriggered',
  onLogs: (logs) => {
    console.log('jackpotdeb-internal', logs);
  },
});

const useJackpotEvent = () => {
  const jackpotManager = useJackpotManager();
  const user = useAccount();

  useEffect(() => {
    console.log('jackpotdeb-listening');

    const unwatch = publicClient.watchContractEvent({
      address: '0x65024158941e15283a376F69E40dED61F522cb51',
      abi: JackootABI,
      eventName: 'JackpotTriggered',
      onLogs: (logs) => {
        if (!user.address) return;
        try {
          const logArgs = logs[0].args;
          const jp = {
            option_id: +logArgs.optionId.toString(),
            target_contract: logArgs.optionContract,
            jackpot_amount: logArgs.jackpotWinAmount.toString(),
            router: logArgs.router,
            user_address: logArgs.userAddress,
            trade_size: logArgs.amount.toString(),
          };
          console.log('jackpotdeb-jp', jp);
          if (user.address?.toLowerCase() == logArgs.userAddress.toLowerCase())
            jackpotManager.addJackpot(jp);
        } catch (e) {
          console.log('jackpotdeb-error', e);
        }
      },
    });
    return () => {
      console.log('jackpotdeb-cleaning');

      unwatch();
    };
  }, [user, jackpotManager.addJackpot]);
  return null;
};

export { useJackpotEvent };
