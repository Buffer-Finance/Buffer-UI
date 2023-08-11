import { Chain, useContractReads } from 'wagmi';
import getDeepCopy from '@Utils/getDeepCopy';
import { convertBNtoString } from '@Utils/useReadCall';
import ReferralABI from '../Config/ReferralABI.json';
import { useUserAccount } from '@Hooks/useUserAccount';
import { getConfig } from '@Views/TradePage/utils/getConfig';

export function useUserCode(activeChain: Chain) {
  const activeChainID = activeChain.id;
  const { address: account } = useUserAccount();
  const configContracts = getConfig(activeChainID);
  const referralAddress = configContracts.referral_storage;

  const calls = referralAddress
    ? [
        {
          address: referralAddress,
          abi: ReferralABI,
          functionName: 'userCode',
          args: [account],
          chainId: activeChainID,
        },
      ]
    : [];

  const { data } = useContractReads({
    contracts: calls as any,
    watch: true,
    select: (d) => d.map((signle) => signle.result?.toString() || null),
  });

  let response: { affiliateCode: null | string } = { affiliateCode: null };

  if (data && data?.[0]) {
    const convertedData = getDeepCopy(data);
    convertBNtoString(convertedData);
    response = { affiliateCode: convertedData[0] };
  }
  return response;
}
