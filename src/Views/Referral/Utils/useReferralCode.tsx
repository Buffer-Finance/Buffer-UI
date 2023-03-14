import { useAtomValue } from 'jotai';
import { referralCodeAtom } from '@Views/BinaryOptions';
import { Chain, useAccount } from 'wagmi';
import { useRefereeCode } from '../Hooks/useUserReferralData';
import ReferralABI from '../Config/ReferralABI.json';
import { useActiveChain } from '@Hooks/useActiveChain';
import { multicallv2 } from '@Utils/Contract/multiContract';
import { useReadCall } from '@Utils/useReadCall';
import { isZero } from './isZero';

export const useReferralCode = (activeChain: Chain) => {
  // return ["hello", "hello", "hello"];
  const { address } = useAccount();
  const referrerInLocalStorage = useAtomValue(referralCodeAtom);
  const { data } = useRefereeCode(activeChain);
  const { configContracts } = useActiveChain();
  const contracts =
    referrerInLocalStorage && address
      ? [
          {
            address: configContracts.referral_storage,
            abi: ReferralABI,
            name: 'codeOwner',
            params: [referrerInLocalStorage],
          },
        ]
      : [];
  const { data: isCodeAvailable } = useReadCall({
    contracts,
    swrKey: 'useRefferalCode',
  });
  const isZeroAdds = isZero(isCodeAvailable?.[0]);

  const verifiedLocalCode = isCodeAvailable?.length
    ? isZeroAdds
      ? ''
      : referrerInLocalStorage
    : '';
  return [
    data?.[0][0],
    verifiedLocalCode,
    data?.[0][0] || verifiedLocalCode || '',
  ];
};
