import { Dialog } from '@mui/material';
import { SlippageModalStyles } from '@Views/BinaryOptions/Components/SlippageModal';
import { ReactNode } from 'react';

const ModalBase = ({
  open,
  onClose,
  className,
  children,
}: {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  className?: string;
}) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <SlippageModalStyles className={'text-1  max-w-[520px]  ' + className}>
        {children}
      </SlippageModalStyles>
    </Dialog>
  );
};

export { ModalBase };
