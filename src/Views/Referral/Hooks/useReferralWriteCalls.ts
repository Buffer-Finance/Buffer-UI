import { useWriteCall } from '@Hooks/useWriteCall';
import { useContext } from 'react';
import { getContract } from '../Config/Address';
import ReferralABI from '../Config/ReferralABI.json';
import { ReferralContext } from '../referralAtom';

type methodName = 'registerCode' | 'setTraderReferralCodeByUser';

export const useReferralWriteCall = () => {
  const { activeChain } = useContext(ReferralContext);
  const referralAddress = getContract(activeChain.id, 'referral');
  const { writeCall } = useWriteCall(referralAddress, ReferralABI);

  function callBack(res): void {
    console.log(res);
  }

  function writeTXN(code: string, method: methodName): void {
    writeCall(callBack, method, [code]);
  }

  return { writeTXN };
};
