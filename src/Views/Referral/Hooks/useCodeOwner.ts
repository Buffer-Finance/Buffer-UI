import { useEffect, useState } from 'react';
import ReferralABI from '@Views/Referral/Config/ReferralABI.json';
import useDebouncedEffect from '@Hooks/Utilities/useDeboncedEffect';
import { usePublicClient } from 'wagmi';
import { contractRead } from '@Utils/useReadCall';
import { useActiveChain } from '@Hooks/useActiveChain';
import { getConfig } from '@Views/TradePage/utils/getConfig';
import { getContract } from 'viem';

export function useCodeOwner(code: string) {
  const [owner, setOwner] = useState(null);
  const { activeChain } = useActiveChain();
  const provider = usePublicClient({ chainId: activeChain.id });
  const configContracts = getConfig(activeChain.id);
  const referralAddress = configContracts.referral_storage;

  const referralContract = getContract({
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
