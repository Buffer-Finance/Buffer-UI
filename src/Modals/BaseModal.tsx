import styled from '@emotion/styled';
import { Dialog } from '@mui/material';
import { ReactNode } from 'react';

export const SlippageModalStyles = styled.div`
  background-color: var(--dropdown-hover);
  gap: 1.4rem;
  padding: 3rem;
  padding-bottom: 2rem;
  position: relative;
  width: fit-content;
  margin: auto;

  & * {
    font-family: 'Relative Pro' !important;
  }

  .close {
    position: absolute;
    right: 4rem;
    top: 2px;

    color: var(--text-1);
    background-color: var(--bg-14);
    border-radius: 50%;
  }
  .custom-br {
    border-radius: 2rem;
    width: 12rem;
  }
`;

const ModalBase = ({
  open,
  onClose,
  className,
  rootClass,
  children,
}: {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  className?: string;
  rootClass?: string;
}) => {
  return (
    <Dialog PaperProps={{ className: rootClass }} open={open} onClose={onClose}>
      <SlippageModalStyles className={'text-1  w-full ' + className}>
        {children}
      </SlippageModalStyles>
    </Dialog>
  );
};

export { ModalBase };
