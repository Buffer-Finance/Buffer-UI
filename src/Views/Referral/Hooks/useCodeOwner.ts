import { useEffect, useMemo, useState } from 'react';
import ReferralABI from '@Views/Referral/Config/ReferralABI.json';
import useDebouncedEffect from '@Hooks/Utilities/useDeboncedEffect';
import { usePublicClient } from 'wagmi';
import { contractRead } from '@Utils/useReadCall';
import { useActiveChain } from '@Hooks/useActiveChain';
import { getConfig } from '@Views/ABTradePage/utils/getConfig';
import { getContract } from 'viem';

import { createPublicClient, http } from 'viem';
import { mainnet } from 'viem/chains';

export function useCodeOwner(code: string) {
  const [owner, setOwner] = useState(null);
  const { activeChain } = useActiveChain();
  const provider = usePublicClient({ chainId: activeChain.id });
  const configContracts = getConfig(activeChain.id);
  const referralAddress = configContracts.referral_storage;
  const publicClient = useMemo(() => {
    return createPublicClient({
      chain: activeChain,
      transport: http(),
    });
  }, [activeChain]);
  const referralContract = getContract({
    address: referralAddress,
    abi: ReferralABI,
    signerOrProvider: provider,
  });

  const updateOwner = async () => {
    if (!code) return;
    const tempOwner = await publicClient.readContract({
      address: referralAddress,
      abi: ReferralABI,
      functionName: 'codeOwner',
      args: [code],
    });
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
