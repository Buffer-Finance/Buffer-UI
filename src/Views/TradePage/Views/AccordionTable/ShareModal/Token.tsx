import { getAssetImageUrl } from '@Views/TradePage/utils/getAssetImageUrl';

export const Token = ({
  tokenName,
  className,
}: {
  tokenName: string;
  className?: string;
}) => {
  return (
    <div className={`${className} text-f16 flex items-center justify-center`}>
      <img
        src={getAssetImageUrl(tokenName)}
        className="w-[22px] h-[22px] mr-2 "
      />{' '}
      ${tokenName}
    </div>
  );
};

export const TokenWOName = ({
  tokenName,
  className,
}: {
  tokenName: string;
  className?: string;
}) => {
  return (
    <div className={`${className} text-f16 flex items-center justify-center`}>
      <img
        src={getAssetImageUrl(tokenName)}
        className="w-[24px] h-[24px] mr-2 "
      />{' '}
    </div>
  );
};
