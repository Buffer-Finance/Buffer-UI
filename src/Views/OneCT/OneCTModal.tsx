import { useAtomValue, useSetAtom } from 'jotai';
import { ModalBase } from 'src/Modals/BaseModal';
import { LightningIcon, isOneCTModalOpenAtom } from './OneCTButton';
import { useEffect } from 'react';
import { useOneCTWallet } from './useOneCTWallet';
import { CloseOutlined } from '@mui/icons-material';
import { BlueBtn } from '@Views/Common/V2-Button';

const OneCTModal: React.FC<any> = ({}) => {
  const isModalOpen = useAtomValue(isOneCTModalOpenAtom);
  const setModal = useSetAtom(isOneCTModalOpenAtom);
  const { loadOrCreate } = useOneCTWallet();
  // useEffect(() => {
  //   if (isModalOpen) loadOrCreate();
  // }, [isModalOpen]);
  return (
    <ModalBase open={isModalOpen} onClose={() => setModal((m) => false)}>
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <LightningIcon className=" scale-110" />
          <h3 className="font-[500] text-f20  ml-[20px]">One Click Trading</h3>
        </div>
        <button
          className="p-3 text-1 rounded-full bg-2"
          onClick={() => setModal((m) => false)}
        >
          <CloseOutlined className="!scale-125" />
        </button>
      </div>

      <div className="flex-col mt-[25px] ">
        <Card>
          <>
            <div className="text-3 text-f14 font-[500]">Create 1CT Account</div>
            <BlueBtn className=" !w-fit px-[15px]" onClick={console.log}>
              Create
            </BlueBtn>
          </>
        </Card>
        <Card>
          <>
            <div className="text-3 text-f14 font-[500]">Hello I am link</div>
            <BlueBtn className=" !w-fit px-[15px]" onClick={console.log}>
              Hello
            </BlueBtn>
          </>
        </Card>
        <Card>
          <>
            <div className="text-3 text-f14 font-[500]">Hello I am link</div>
            <BlueBtn className=" !w-fit px-[15px]" onClick={console.log}>
              Hello
            </BlueBtn>
          </>
        </Card>
      </div>
    </ModalBase>
  );
};

export { OneCTModal };

const Card = ({ children }: { children: JSX.Element }) => (
  <div className="bg-1 w-[360px] p-[20px] flex items-center justify-between rounded-[10px] mt-[12px]">
    {children}
  </div>
);
