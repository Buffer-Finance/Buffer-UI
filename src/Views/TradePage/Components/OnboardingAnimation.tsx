import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { showOnboardingAnimationAtom } from '../atoms';
import { Dialog } from '@mui/material';
import { useEffect, SVGProps } from 'react';
import BufferLogo from '@Assets/Elements/BufferLogo';
import BufferAnimation from '@SVG/BufferAnimation';

const duration = 5000;
// 37
const OnboardingAnimation: React.FC<any> = ({}) => {
  const isOpen = useAtomValue(showOnboardingAnimationAtom);

  return (
    <Dialog
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
    <div className="flex w-[100vw] h-[100vh] overflow-hidden items-center  justify-center gap-x-[150px] mr-[-80px]">
      <div className="text-1 font-[700]">
        <div className="text-[85px]">Welcome to</div>
        <div className="text-[150px] mt-[-44px]">Buffer</div>
      </div>
      <div className="loader">
        <BufferAnimation />
      </div>
    </div>
  );
};
