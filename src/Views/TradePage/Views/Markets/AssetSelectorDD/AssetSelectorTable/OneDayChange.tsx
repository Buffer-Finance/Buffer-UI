import { gte } from '@Utils/NumString/stringArithmatics';

export const OneDayChange: React.FC<{
  oneDayChange: string;
  className?: string;
  svgClassName?: string;
}> = ({ oneDayChange, className = '', svgClassName = '' }) => {
  // if(Number.isNaN(isUp))

  console.log(`OneDayChange-oneDayChange: `, oneDayChange);
  const isUp = '12';
  return (
    <div
      className={`${className} text-f10 flex gap-1 items-center font-normal w-max ${
        isUp ? 'green' : 'red'
      }  `}
    >
      {isUp ? (
        <svg
          width="6"
          height="4"
          viewBox="0 0 6 4"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={svgClassName}
        >
          <path
            d="M2.76469 0.106432C2.71431 0.0390448 2.63918 0 2.5599 0C2.48061 0 2.40548 0.0390448 2.35511 0.106432L0.0511994 3.4875C-0.00697763 3.57287 -0.0163356 3.6871 0.027027 3.78255C0.0703896 3.87801 0.159029 3.9383 0.255991 3.9383H4.8638C4.96077 3.9383 5.04941 3.87801 5.09277 3.78255C5.13613 3.6871 5.12677 3.57287 5.0686 3.4875L2.76469 0.106432Z"
            fill="#3FB68B"
          />
        </svg>
      ) : (
        <svg
          width="6"
          height="4"
          viewBox="0 0 6 4"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`${svgClassName} rotate-180`}
        >
          <path
            d="M2.76469 0.106432C2.71431 0.0390448 2.63918 0 2.5599 0C2.48061 0 2.40548 0.0390448 2.35511 0.106432L0.0511994 3.4875C-0.00697763 3.57287 -0.0163356 3.6871 0.027027 3.78255C0.0703896 3.87801 0.159029 3.9383 0.255991 3.9383H4.8638C4.96077 3.9383 5.04941 3.87801 5.09277 3.78255C5.13613 3.6871 5.12677 3.57287 5.0686 3.4875L2.76469 0.106432Z"
            fill="#FF5353"
          />
        </svg>
      )}
      {oneDayChange.replace('-', '')}%
    </div>
  );
};
