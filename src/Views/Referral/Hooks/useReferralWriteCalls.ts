import { useWriteCall } from '@Hooks/useWriteCall';
import ReferralABI from '../Config/ReferralABI.json';
import { useActiveChain } from '@Hooks/useActiveChain';
import { getConfig } from '@Views/ABTradePage/utils/getConfig';

type methodName = 'registerCode' | 'setTraderReferralCodeByUser';

export const useReferralWriteCall = () => {
  const { activeChain } = useActiveChain();
  const configContracts = getConfig(activeChain.id);
  const { writeCall } = useWriteCall(
    configContracts.referral_storage,
    ReferralABI
  );

  function callBack(res: any): void {
    console.log(res);
  }

  function writeTXN(code: string, method: methodName): void {
    writeCall(callBack, method, [code]);
  }

  return { writeTXN };
};
