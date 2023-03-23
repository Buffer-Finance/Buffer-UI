import { Dialog } from '@mui/material';
import { SlippageModalStyles } from '@Views/BinaryOptions/Components/SlippageModal';
import { ReactNode } from 'react';

const ModalBase: React.FC<{
  open: boolean;
  onClose: () => void;
  children: JSX.Element;
}> = ({
  open,
  onClose,
  children,
}: {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
}) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <SlippageModalStyles className="text-1  max-w-[520px] text-center">
        {children}
      </SlippageModalStyles>
    </Dialog>
  );
};

export { ModalBase };
