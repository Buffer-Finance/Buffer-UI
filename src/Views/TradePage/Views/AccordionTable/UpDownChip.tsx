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
      className={`px-2 h-[22px] text-f12 flex gap-1 items-center rounded-[5px] font-medium  ml-2 bg-1 brightness-125 w-max ${
        isUp ? 'green' : 'red'
      }  ${className}`}
    >
      {shouldShowImage &&
        (isUp ? (
          <UpTriangle className={`scale-[0.70] mt-1`} />
        ) : (
          <DOwnTriangle className={`mt-1 scale-[0.70]`} />
        ))}
      {isUp ? upText : downText}
    </div>
  );
};
