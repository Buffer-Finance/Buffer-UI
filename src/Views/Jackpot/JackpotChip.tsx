import { Display } from '@Views/Common/Tooltips/Display';
import { Link } from 'react-router-dom';

const JackpotChip: React.FC<{ jackpote18: string; className?: string }> = ({
  className,
  jackpote18,
}) => {
  // const jackpote18 = '10000000000000000000';
  const isJackpotDisabled = jackpote18 ? +jackpote18 == 0 : true;
  if (isJackpotDisabled) return null;
  return (
    <Link onClick={(e) => e.stopPropagation()} to={'/Jackpot'}>
      <div
        className={[
          'flex items-center bg-[#282b39] px-2  py-[1px] w-fit sm:text-f10 sm:py-[2px]  text-f12 text-[#C3C2D4] font-[500] gap-2 rounded-[6px]',
          className,
        ].join(' ')}
      >
        <img
          className={[
            'w-[16px] h-[13.5px] min-w-[16px] min-h-[13.5px] max-w-[16px] max-h-[13.5px]',
            isJackpotDisabled ? 'opacity-30' : '',
          ].join(' ')}
          src="/JV.png"
        />
        <Display
          data={jackpote18 / 10 ** 18}
          className="!justify-start hover:underline font-[500]"
          unit={'ARB'}
        />
      </div>
    </Link>
  );
};

export { JackpotChip };
