import { Display } from '@Views/Common/Tooltips/Display';

export const CurrentPriceLine = ({
  precision,
  currentPrice,
}: {
  currentPrice: string | number;
  precision: number;
}) => {
  return (
    <div className="border-dashed border-[1px] border-[#A3E3FF] w-full relative my-5">
      <div className="rounded-lg border-[1px] border-[#A3E3FF] py-1 px-5 text-buffer-blue font-bold text-f12 bg-[#181A20] w-fit absolute -top-4 right-[0px] left-[0px] m-auto">
        <Display data={currentPrice} precision={precision} disable />
      </div>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="8"
        height="19"
        viewBox="0 0 8 19"
        fill="none"
        className="absolute right-1 -top-[9px]"
      >
        <path
          d="M4.33436 0.246267C4.41364 0.128577 4.58685 0.128576 4.66612 0.246267L7.32136 4.18827C7.41084 4.32111 7.31565 4.5 7.15548 4.5H1.84501C1.68484 4.5 1.58965 4.32111 1.67913 4.18827L4.33436 0.246267Z"
          fill="#D9D9D9"
        />
        <path
          d="M4.66406 17.7522C4.58584 17.8706 4.41263 17.8721 4.33231 17.7551L1.64195 13.837C1.55129 13.705 1.64487 13.5253 1.80504 13.5238L7.11529 13.4764C7.27546 13.4749 7.37224 13.653 7.28395 13.7866L4.66406 17.7522Z"
          fill="#D9D9D9"
        />
      </svg>
    </div>
  );
};
