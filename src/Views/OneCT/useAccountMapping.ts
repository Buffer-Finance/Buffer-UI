import { useUserAccount } from '@Hooks/useUserAccount';
import { useCall2Data } from '@Utils/useReadCall';
import { getCallId } from '@Utils/Contract/multiContract';
import SignerManagerABI from '@Views/OneCT/signerManagerABI.json';
import { uesOneCtActiveChain } from './useOneCTWallet';
import { getConfig } from '@Views/TradePage/utils/getConfig';

const useAccountMapping = () => {
  const { activeChain } = uesOneCtActiveChain();
  const { address } = useUserAccount();
  const configData = getConfig(activeChain.id);

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
