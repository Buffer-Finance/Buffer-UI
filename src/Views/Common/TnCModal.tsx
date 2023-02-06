import { Dialog } from '@mui/material';
import { atomWithLocalStorage } from '@Views/BinaryOptions/Components/SlippageModal';
import { useAtom } from 'jotai';
import { useState, useEffect, ReactNode } from 'react';
import styles from 'Styles/TnCModal.module.scss';
import { SecondaryActionBtn } from './Buttons';

interface ITnCModal {
  className?: string;
  children?: ReactNode;
}
// 44
// 51

// 54
const TNCOFFSET = 7 * 24 * 60 * 60 * 1000;
const TermsConditionAtom = atomWithLocalStorage('tncv1', {
  lastSaved: Date.now() - TNCOFFSET,
});
const TnCModal: React.FC<ITnCModal> = ({ className, children }) => {
  const [tnc, setTnc] = useAtom(TermsConditionAtom);

  return (
    <Dialog
      classes={{ paper: 'disclaimer-width' }}
      open={tnc.lastSaved + TNCOFFSET < Date.now()}
    >
      <div className="bg-3 ">
        <div className=" text-2 text-f16 p-5 d ">
          <div className="text-1 text-f20">
            By using Buffer Finance dApp, I agree to the following Important
            Disclaimer
          </div>
          <br /> I am lawfully permitted to access this site and use the Buffer
          dApp under the laws of the jurisdiction where I reside and am located.
          <br /> <br /> I will not use the Buffer dApp while located within any
          prohibited jurisdictions.
          {/* <br /> <br /> Buffer dApp (V2) is in Mainnet Beta with trusted admin
          controls. I understand the risks associated with using Buffer dApp. */}
          <br />
          <br />
          <SecondaryActionBtn
            onClick={() => {
              setTnc({
                lastSaved: Date.now(),
              });
            }}
            className="w-full "
          >
            Agree and Continue
          </SecondaryActionBtn>
        </div>
      </div>
    </Dialog>
  );
};

export default TnCModal;
