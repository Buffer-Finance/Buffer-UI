import { useActiveChain } from '@Hooks/useActiveChain';
import { useUserCode } from '@Views/Referral/Hooks/useUserCode';
import { affilateCode2ReferralLink } from '@Views/Referral/Utils/affiliateCode2RederralLink';
import { useHostName } from '@Views/TradePage/Hooks/useHostName';
import { QRCodeSVG } from 'qrcode.react';

export const ReferralCode = () => {
  const { hostname } = useHostName();
  const { activeChain } = useActiveChain();
  const { affiliateCode } = useUserCode(activeChain);

  const isCodeSet = !!affiliateCode;
  const baseURL = `https://${hostname}/#/`;
  const sharableLink = isCodeSet
    ? affilateCode2ReferralLink(affiliateCode)
    : baseURL;

  return (
    <div className="flex flex-col justify-center items-center font-medium">
      {isCodeSet ? (
        <div className="text-[10px]  mb-2">Referral Code</div>
      ) : (
        <div className="text-[12px]  mb-2">Start Trading</div>
      )}
      <div className="p-2 bg-[#FFFFFF]">
        <QRCodeSVG value={sharableLink} size={60} />
      </div>
      {isCodeSet ? (
        <div className="text-[12px] mt-2">
          {affiliateCode.slice(0, 7)}
          {affiliateCode.length > 7 ? '...' : ''}
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};
