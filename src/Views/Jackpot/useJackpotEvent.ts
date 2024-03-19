import { useContractEvent } from 'wagmi';
import JackootABI from '@ABIs/JackpotABI.json';
import RouterABI from '@ABIs/ABI/routerABI.json';
import { createPublicClient, http } from 'viem';
import { arbitrumSepolia } from 'src/Config/wagmiClient/getConfigChains';
import { useJackpotManager } from 'src/atoms/JackpotState';
const useJackpotEvent = () => {
  console.log('jackpotdeb-listening');
  const jackpotManager = useJackpotManager();
  useContractEvent({
    address: '0x65024158941e15283a376F69E40dED61F522cb51',
    abi: JackootABI,
    eventName: 'JackpotTriggered',
    listener(logs) {
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

        jackpotManager.addJackpot(jp);
      } catch (e) {
        console.log('jackpotdeb-error', e);
      }
    },
    chainId: 421614,
  });
  return null;
};

export { useJackpotEvent };
