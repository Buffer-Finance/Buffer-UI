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
    <div className="loader">
      <div className="container1">
        <div className="container_1">
          <BufferAnimation />
        </div>
      </div>
    </div>
  );
};
