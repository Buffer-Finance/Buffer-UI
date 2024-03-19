import { useContractEvent } from 'wagmi';
import JackootABI from '@ABIs/JackpotABI.json';
import RouterABI from '@ABIs/ABI/routerABI.json';
import { createPublicClient, http } from 'viem';
import { arbitrumSepolia } from 'src/Config/wagmiClient/getConfigChains';
let cache = {};

// export const publicClient = createPublicClient({
//   chain: arbitrumSepolia,
//   transport: http(),
// });
// const unwatch = publicClient.watchContractEvent({
//   address: '0x0511b76254e86A4E6c94a86725CdfF0E7A8B4326',
//   abi: RouterABI,
//   onLogs: (logs) => console.log('log happended', logs),
// });

const useJackpotEvent = () => {
  console.log('jackpotdeb-listening');
  useContractEvent({
    address: '0x65024158941e15283a376F69E40dED61F522cb51',
    abi: JackootABI,
    eventName: 'JackpotTriggered',
    listener(logs) {
      try {
        console.log('jackpotdeb-JackpotTriggered', logs);
      } catch (e) {
        console.log('you are right');
      }
    },
    chainId: 421614,
  });
  return null;
};

export { useJackpotEvent };
