import { atom, useSetAtom } from 'jotai';
import { SVGProps, useEffect, useState } from 'react';
import { useOneCTWallet } from './useOneCTWallet';
import { useQTinfo } from '@Views/BinaryOptions';
import Joyride from 'react-joyride';
const userOnectAcknowledgementString = 'user-know-about-1ct';
const OneCTButton: React.FC<any> = ({}) => {
  const setModal = useSetAtom(isOneCTModalOpenAtom);
  const qtInfo = useQTinfo();
  const { disableOneCt, registeredOneCT } = useOneCTWallet();
  const [run, setRun] = useState(false);
  useEffect(() => {
    let a = localStorage.getItem(userOnectAcknowledgementString);
    if (a) return;
    setRun(true);
  }, []);
  const steps = [
    {
      target: '#onect-enable-btn',
      content: 'You can activate 1 Click Trading from here!',
      disableBeacon: true,
    },
  ];

  const handleJoyrideCallback = (data) => {
    if (data.lifecycle == 'complete') {
      localStorage.setItem(userOnectAcknowledgementString, 'true');
    }
  };
  return (
    <>
      {run && (
        <Joyride
          continuous
          steps={steps}
          run={run}
          locale={{
            last: 'Got it!',
          }}
          styles={{
            options: {
              arrowColor: '#1d2027',
              zIndex: 10000,
              backgroundColor: '#1d2027',
              textColor: 'var(--text-1)',
            },
            buttonNext: {
              backgroundColor: 'var(--bg-signature)',
              borderRadius: 4,
              color: '#fff',
            },
          }}
          callback={handleJoyrideCallback}
        />
      )}
      <span
        className="bg-[#232334]  flex items-center  w-[30px] justify-center rounded-sm hover:brightness-125 active:brightness-75"
        id="onect-enable-btn"
      >
        {registeredOneCT ? (
          <span
            title="Blazingly Fast 1 Click Trading enabled. Click to disable"
            onClick={disableOneCt}
          >
            <LightningIconSquare />
          </span>
        ) : (
          <button
            onClick={() => setModal((m) => !m)}
            className="bg-[#232334]  flex items-center  w-[30px] justify-center rounded-sm hover:brightness-125 active:brightness-75"
          >
            <LightningIcon className=" scale-105 " />
          </button>
        )}
      </span>
    </>
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
export const LightningIconSquare = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={28}
    height={28}
    fill="none"
    className=" brightness-125 glowing-animation"
    {...props}
  >
    <rect width={28} height={28} fill="#FFE200" rx={3} />
    <path
      fill="#232334"
      d="M17.918 7.394a1 1 0 0 0-1.578-1.147l-7.998 7A1.001 1.001 0 0 0 9.002 15h3.483l-2.403 5.606a1 1 0 0 0 1.578 1.147l7.998-7a1 1 0 0 0 .278-1.103 1.002 1.002 0 0 0-.937-.647h-3.484l2.403-5.609Z"
    />
  </svg>
);
