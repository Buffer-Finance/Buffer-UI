import { atom, useSetAtom } from 'jotai';
import { SVGProps } from 'react';

const OneCTButton: React.FC<any> = ({}) => {
  const setModal = useSetAtom(isOneCTModalOpenAtom);
  return (
    <button
      onClick={() => setModal((m) => !m)}
      className="bg-[#232334]  flex items-center  w-[30px] justify-center rounded-sm hover:brightness-125 active:brightness-75"
    >
      <LightningIcon className=" scale-105 " />
    </button>
  );
};

export { OneCTButton };

export const LightningIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={12}
    height={16}
    fill="none"
    {...props}
  >
    <path
      fill="#FFE200"
      d="M9.918 1.394A1 1 0 0 0 8.34.247l-7.998 7A1.001 1.001 0 0 0 1.002 9h3.483l-2.403 5.606a1 1 0 0 0 1.578 1.147l7.998-7a1 1 0 0 0 .278-1.103A1.002 1.002 0 0 0 11 7.003H7.515l2.403-5.609Z"
    />
  </svg>
);

export const isOneCTModalOpenAtom = atom<boolean>(false);
