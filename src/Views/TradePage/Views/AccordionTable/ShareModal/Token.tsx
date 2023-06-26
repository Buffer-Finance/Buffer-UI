import { getImageUrl } from '@Views/TradePage/utils';

export const Token = ({
  tokenName,
  className,
}: {
  tokenName: string;
  className?: string;
}) => {
  return (
    <div className={`${className} text-f16 flex items-center justify-center`}>
      <img src={getImageUrl(tokenName)} className="w-[22px] h-[22px] mr-2 " /> $
      {tokenName}
    </div>
  );
};
