import { atom, useAtom } from 'jotai';
import { SomethingWentWrongModal } from './SomethingWentWrong';
import { Modals } from '.';

export const errorModalAtom = atom(false);
export const ErrorModal = () => {
  const [isModalOpen, setIsModalOpen] = useAtom(errorModalAtom);
  return (
    <Modals
      isModalOpen={isModalOpen}
      closeModalFunction={() => {
        setIsModalOpen(false);
      }}
      activeModalNumberFrom0={0}
      modalsArray={[<SomethingWentWrongModal />]}
    />
  );
};
