import { ModalBase } from 'src/Modals/BaseModal';
import { isUserEducatedAtom } from '../atoms';
import { atom, useAtomValue, useSetAtom } from 'jotai';
import { BlueBtn } from '@Views/Common/V2-Button';
import { isTestnet } from 'config';
import { LightningIcon } from '@Views/OneCT/OneCTButton';
const openChainSwitchingTutorialAtom = atom(false);
const ChainSwitchingModal: React.FC<{
  openConnectModal: () => void;
}> = ({ openConnectModal }) => {
  const open = useAtomValue(openChainSwitchingTutorialAtom);
  const setOpen = useSetAtom(openChainSwitchingTutorialAtom);
  const setIsUserEducated = useSetAtom(isUserEducatedAtom);
  return (
    <ModalBase onClose={() => setOpen(false)} open={open}>
      <div className="text-f12 mb-4 ">
        <LightningIcon className="inline" /> To ensure smooth performance please
        make sure that your wallet is connected to{' '}
        <span className="inline-flex items-center bg-4 translate-y-[4px] ">
          <img
            className="h-[18px] w-[18px] mr-[6px] sm:mr-[0px] rounded-full"
            src={`https://res.cloudinary.com/dtuuhbeqt/image/upload/w_50,h_50,c_fill,r_max/Assets/${'arb'}.png`}
          />
          {isTestnet ? 'Arbitrum Seploia' : 'Arbitrum One'}{' '}
        </span>
      </div>
      <BlueBtn
        className="!w-fit px-3 !h-[25px] !bg-blue"
        onClick={() => {
          setIsUserEducated((o) => {
            return { ...o, mobileChainSwitchingIssue: true };
          });
          openConnectModal();
          setOpen(false);
        }}
      >
        Confirm
      </BlueBtn>
    </ModalBase>
  );
};
export const useChainTutorial = () => {
  const setOpenChainTutorial = useSetAtom(openChainSwitchingTutorialAtom);
  const isUserEducated = useAtomValue(isUserEducatedAtom);
  const openTutorial = () => {
    setOpenChainTutorial(true);
  };
  return { openTutorial, isUserEducated };
};

export { ChainSwitchingModal };
