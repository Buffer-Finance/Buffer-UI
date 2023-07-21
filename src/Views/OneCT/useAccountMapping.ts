import { appConfig } from '@Views/TradePage/config';
import { useUserAccount } from '@Hooks/useUserAccount';
import { useCall2Data } from '@Utils/useReadCall';
import { getCallId } from '@Utils/Contract/multiContract';
import SignerManagerABI from '@Views/OneCT/signerManagerABI.json';
import { uesOneCtActiveChain } from './useOneCTWallet';

const useAccountMapping = () => {
  const { activeChain } = uesOneCtActiveChain();
  const { address } = useUserAccount();
  const configData =
    appConfig[activeChain.id as unknown as keyof typeof appConfig];

  const calls = address
    ? [
        {
          address: configData.signer_manager,
          abi: SignerManagerABI,
          name: 'accountMapping',
          params: [address],
        },
      ]
    : [];

  const { data } = useCall2Data(calls, address || '');
  return data?.[getCallId(configData.signer_manager, 'accountMapping')] || null;
};

export default useAccountMapping;
