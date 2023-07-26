import { useAtomValue } from 'jotai';
import { referralCodeAtom } from '@Views/BinaryOptions';
import { useAccount } from 'wagmi';
import { useRefereeCode } from '../Hooks/useUserReferralData';
import ReferralABI from '../Config/ReferralABI.json';
import { useReadCall } from '@Utils/useReadCall';
import { isZero } from './isZero';
import { useMemo } from 'react';
import { zeroAddress } from 'viem';
import { useActiveChain } from '@Hooks/useActiveChain';
import { getConfig } from '@Views/TradePage/utils/getConfig';

export const useReferralCode = () => {
  const { address } = useAccount();
  const referrerInLocalStorage = useAtomValue(referralCodeAtom);
  const { data } = useRefereeCode();
  const { activeChain } = useActiveChain();
  const configContracts = getConfig(activeChain.id);

  const referralCode = useMemo(() => {
    if (data?.[0][0]) return data?.[0][0];
    if (referrerInLocalStorage) return referrerInLocalStorage;
    return '';
  }, [referrerInLocalStorage, address, data]);

  const contracts =
    referralCode && address
      ? [
          {
            address: configContracts.referral_storage,
            abi: ReferralABI,
            name: 'codeOwner',
            params: [referralCode],
          },
        ]
      : [];
  const { data: isCodeAvailable } = useReadCall({
    contracts,
    swrKey: 'useRefferalCode',
  });
  const isZeroAdds = isCodeAvailable && isZero(isCodeAvailable[0]);

  const verifiedLocalCode = isCodeAvailable?.length
    ? isZeroAdds
      ? ''
      : referrerInLocalStorage
    : '';
  // console.log(data, isZeroAdds, zeroAddress, 'dataUseReferralCode');
  return [
    data?.[0][0],
    verifiedLocalCode,
    data?.[0][0] || verifiedLocalCode || '',
    !isCodeAvailable ? zeroAddress : isCodeAvailable[0][0],
  ];
};
