import { useAtomValue, useSetAtom } from 'jotai';
import { showOnboardingAnimationAtom } from '../atoms';
import { Dialog } from '@mui/material';
import { useEffect } from 'react';
import BufferAnimation from '@SVG/BufferAnimation';
import styled from '@emotion/styled';
const duration = 2500;
// 37
const OnboardingAnimation: React.FC<any> = ({}) => {
  const isOpen = useAtomValue(showOnboardingAnimationAtom);

  return (
    <Dialog
      sx={{
        '& .MuiDialog-container': {
          backgroundColor: '#1c1c28',
          backdropFilter: 'blur(0px)',
        },
        '& .MuiDialog-paper': {
          boxShadow: 'none',
        },
      }}
      classes={{ paper: 'custom-paper-class' }}
      open={isOpen}
      onClose={console.log}
    >
      {isOpen ? <ModalChild /> : null}
    </Dialog>
  );
};

export { OnboardingAnimation };

const ModalChild = () => {
  const setIsOpen = useSetAtom(showOnboardingAnimationAtom);
  useEffect(() => {
    setTimeout(() => {
      setIsOpen(false);
    }, duration);
  });

  return (
    <div className="flex w-[100vw] b1200:gap-y-[1.5vh] h-[100vh] overflow-hidden items-center  justify-center gap-x-[37px] b1200:gap-x-[1.5vw] mt-[-3vh] b800:flex-col">
      <div className="text-1 font-[700] ">
        <div className="text-[22px]  b1200:text-[20px] sm:!text-[15px]">
          Welcome to
        </div>
        <div className="text-[37px] b1200:text-[35px] sm:!text-[27px] mt-[-11px]">
          Buffer
        </div>
      </div>
      <div className="loader  sm:!w-[17vw] b1200:w-[10vw]">
        <BufferAnimation />
      </div>
    </div>
  );
};
