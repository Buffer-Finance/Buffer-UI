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
    <div className="flex w-[100vw] h-[100vh] overflow-hidden items-center  justify-center gap-x-[150px]">
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

const BufferLogoBig = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={157}
    height={157}
    fill="none"
    {...props}
  >
    <path
      fill="#3772FF"
      d="M78.412 156.895c43.294 0 78.391-35.122 78.391-78.448C156.803 35.122 121.706 0 78.412 0 35.117 0 .02 35.122.02 78.447c0 43.326 35.097 78.448 78.392 78.448Z"
    />
    <path
      fill="#fff"
      d="M43.527 65.114H64.89c-2.31-3.397-4.344-6.5-6.53-9.494-.325-.45-1.355-.523-2.06-.527-5.956-.042-11.91.041-17.862-.087-.926-.019-2.102-.697-2.692-1.44-1.645-2.081-3.048-4.364-4.756-6.876.943-.073 1.58-.17 2.216-.17 9.163-.009 18.325.028 27.483-.037 1.474-.009 2.331.468 3.155 1.697 5.27 7.857 10.62 15.664 16.116 23.737.522-.646.968-1.114 1.325-1.641 5.035-7.38 10.027-14.784 15.117-22.124.521-.752 1.598-1.568 2.428-1.577 9.619-.11 19.236-.069 28.855-.06.354 0 .706.097 1.421.198-1.864 2.755-3.505 5.3-5.306 7.724-.338.459-1.329.6-2.015.605-5.956.046-11.91.069-17.866-.004-1.374-.019-2.212.385-2.959 1.572-1.733 2.764-3.633 5.423-5.721 8.504h21.332c-2.032 3.012-3.705 5.611-5.543 8.091-.338.454-1.342.573-2.042.578-5.648.05-11.302.114-16.946-.005-1.95-.041-3.174.481-4.279 2.191-2.5 3.883-2.573 3.787 0 7.45 2.503 3.557 4.971 7.142 7.358 10.782 4.275 6.519 3.95 15.014-.723 21.024-4.792 6.165-12.809 8.627-20.097 6.17-7.285-2.457-12.31-9.274-12.36-17.031-.028-3.818 1.058-7.362 3.28-10.543 2.887-4.13 5.654-8.344 8.558-12.46.828-1.174.696-1.958.06-3.237-1.746-3.507-4.23-4.754-8.188-4.415-4.772.409-9.61.175-14.42.037-.939-.027-2.14-.66-2.727-1.407-1.67-2.127-3.1-4.46-4.975-7.225Zm36.86 22.412c-.413.312-.637.408-.752.578-2.589 3.773-5.254 7.495-7.718 11.35-2.396 3.741-1.612 8.647 1.648 11.709 3.244 3.044 8.063 3.42 11.806.912 3.587-2.402 5.488-7.252 3.509-11.048-2.438-4.68-5.608-8.98-8.493-13.5Z"
    />
  </svg>
);
