import { atom, useAtom } from 'jotai';
import { ModalBase } from 'src/Modals/BaseModal';
export const acrossBridgeAtom = atom(false);
const AcrossBridgeModal: React.FC<any> = ({}) => {
  const [open, setOpen] = useAtom(acrossBridgeAtom);
  return (
    <ModalBase open={open} onClose={() => setOpen(false)}>
      <AcrossBridgeModalBody />
    </ModalBase>
  );
};

export { AcrossBridgeModal };
export const AcrossBridgeModalBody = () => {
  return <div>hello</div>;
};
