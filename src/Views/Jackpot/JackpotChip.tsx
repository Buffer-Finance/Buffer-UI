import { Display } from '@Views/Common/Tooltips/Display';

const JackpotChip: React.FC<{ jackpote18: string; className?: string }> = ({
  className,
  jackpote18,
}) => {
  const isJackpotDisabled = jackpote18 ? +jackpote18 == 0 : true;
  if (isJackpotDisabled) return null;
  return (
    <div
      className={[
        'flex items-center bg-[#282b39] px-2 py-[1px] w-fit sm:text-f10 sm:py-[2px]  text-f13 text-[#C3C2D4] font-[500] gap-2 rounded-[6px]',
        className,
      ].join(' ')}
    >
      <img
        className={[
          'w-[17px] h-[14px] min-w-[17px] min-h-[14px] max-w-[17px] max-h-[14px]',
          isJackpotDisabled ? 'opacity-30' : '',
        ].join(' ')}
        src="/JV.png"
      />
      <Display
        data={jackpote18 / 10 ** 18}
        className="!justify-start"
        unit={'ARB'}
      />
    </div>
  );
};

export { JackpotChip };
