import { useContractEvent } from 'wagmi';
import JackootABI from '@ABIs/JackpotABI.json';
const useJackpotEvent = () => {
  console.log('jackpotdeb-listening');
  useContractEvent({
    address: '0x65024158941e15283a376F69E40dED61F522cb51',
    abi: JackootABI,
    eventName: 'JackpotTriggered',
    listener(log) {
      console.log('jackpotdeb-JackpotTriggered', log);
    },
  });
  return null;
};

export { useJackpotEvent };
