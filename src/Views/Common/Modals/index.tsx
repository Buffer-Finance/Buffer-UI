import { CloseOutlined } from '@mui/icons-material';
import { Dialog, IconButton } from '@mui/material';
import { NoModalFonud } from './No ModalFound';

export const Modals = ({
  isModalOpen,
  closeModalFunction,
  modalsArray,
  activeModalNumberFrom0,
}: {
  isModalOpen: boolean;
  closeModalFunction: () => void;
  activeModalNumberFrom0: number;
  modalsArray: JSX.Element[];
}) => {
  return (
    <Dialog open={isModalOpen} onClose={closeModalFunction}>
      <div className="text-1 bg-2 p-6 rounded-md relative">
        <IconButton
          className="!absolute text-1 top-[20px] right-[20px]"
          onClick={closeModalFunction}
        >
          <CloseOutlined />
        </IconButton>

        {modalsArray[activeModalNumberFrom0] || <NoModalFonud />}
      </div>
    </Dialog>
  );
};
