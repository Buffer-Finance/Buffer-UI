import { DOwnTriangle } from '@Public/ComponentSVGS/DownTriangle';
import { UpTriangle } from '@Public/ComponentSVGS/UpTriangle';

export const UpDownChip: React.FC<{
  isUp: boolean;
  className?: string;
  shouldShowImage?: boolean;
  upText?: string;
  downText?: string;
}> = ({
  isUp,
  className = '',
  shouldShowImage = true,
  upText = 'Up',
  downText = 'Down',
}) => {
  return (
    <div
      className={`px-2 h-[22px] text-f12 sm:text-f10 sm:pl-1 sm:pr-2 sm:h-[17px] flex gap-1 sm:gap-[0px] items-center rounded-[5px] font-medium  ml-2 bg-1 brightness-125 w-max ${
        isUp ? 'green' : 'red'
      }  ${className}`}
    >
      {shouldShowImage &&
        (isUp ? (
          <UpTriangle className={`scale-[0.70] mt-1 sm:scale-50`} />
        ) : (
          <DOwnTriangle
            className={`mt-1 scale-[0.70] sm:scale-50 sm:mt-[0px]`}
          />
        ))}
      {isUp ? upText : downText}
    </div>
  );
};
