import { useEffect, useState } from 'react';
import ReferralABI from '@Views/Referral/Config/ReferralABI.json';
import useDebouncedEffect from '@Hooks/Utilities/useDeboncedEffect';
import { useContract, useProvider } from 'wagmi';
import { contractRead } from '@Utils/useReadCall';
import { useActiveChain } from '@Hooks/useActiveChain';
import { getConfig } from '@Views/TradePage/utils/getConfig';

export function useCodeOwner(code: string) {
  const [owner, setOwner] = useState(null);
  const { activeChain } = useActiveChain();
  const provider = useProvider({ chainId: activeChain.id });
  const configContracts = getConfig(activeChain.id);
  const referralAddress = configContracts.referral_storage;

  const referralContract = useContract({
    address: referralAddress,
    abi: ReferralABI,
    signerOrProvider: provider,
  });

  const updateOwner = async () => {
    if (!code) return;
    const tempOwner = await contractRead(referralContract, 'codeOwner', [code]);
    setOwner(tempOwner);
  };
  useDebouncedEffect(
    () => {
      updateOwner();
    },
    300,
    [code]
  );
  // const updateOwnerDebounced = throttle(updateOwner, 500);
  useEffect(() => {
    setOwner(null);
  }, [code]);
  return owner;
}
