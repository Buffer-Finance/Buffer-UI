import { useAtomValue } from 'jotai';
import { useAccount } from 'wagmi';
import { useRefereeCode } from '../Hooks/useUserReferralData';
import ReferralABI from '../Config/ReferralABI.json';
import { useCall2Data, useReadCall } from '@Utils/useReadCall';
import { isZero } from './isZero';
import { useMemo } from 'react';
import { zeroAddress } from 'viem';
import { useActiveChain } from '@Hooks/useActiveChain';
import { getConfig } from '@Views/TradePage/utils/getConfig';
import { referralCodeAtom } from 'src/App';
import { getCallId } from '@Utils/Contract/multiContract';

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
  const { data: codewners } = useCall2Data(
    contracts,
    'useReferralcode-' + address
  );
  console.log(`useReferralCode-contracts: `, contracts);
  let isCodeAvailable = null;
  if (contracts.length && codewners) {
    isCodeAvailable =
      codewners[getCallId(contracts?.[0]?.address, 'codeOwner')];
  }
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
