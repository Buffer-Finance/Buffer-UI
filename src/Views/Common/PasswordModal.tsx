import { ColumnGap } from '@Views/TradePage/Components/Column';
import styled from '@emotion/styled';
import { RowBetween, RowGap } from '@Views/TradePage/Components/Row';

import { useEffect, useMemo, useState } from 'react';
import {
  BuyTradeHeadText,
  EditTextValueText,
  SettingsComponentHeader,
} from '@Views/TradePage/Components/TextWrapper';
import { ModalBase } from 'src/Modals/BaseModal';
import { useAtom } from 'jotai';
import { isAutorizedAtom } from 'src/App';
import { useToast } from '@Contexts/Toast';
import { LightningIcon } from '@Views/OneCT/OneCTButton';
import { BlueBtn } from './V2-Button';
import Discord from '@Public/Social/discord';
const password = 'BuffellowsGo!';
export const PasswordModal: React.FC<{}> = ({}) => {
  const [isAuth, setIsAuth] = useAtom(isAutorizedAtom);
  const toastify = useToast();

  const [ip, setip] = useState('');
  const handleSubmit = () => {
    if (ip === password) {
      setIsAuth(true);
      toastify({
        msg: 'Congrats! You are in. Please note that some features might be broken.',
        type: 'success',
        id: '123',
      });
    } else {
      toastify({ msg: 'Wrong Password', type: 'error', id: '123' });
    }
  };
  return (
    <ModalBase
      open={!isAuth}
      className="!p-[0px]"
      onClose={() => {
        toastify({
          msg: 'You have to enter the password to access the app.',
          type: 'error',
          id: 'ddaaa',
        });
      }}
    >
      <EditModalBackground>
        <RowGap gap="6px" className="mb-3">
          <div className="flex items-center text-1 text-f22 gap-x-[12px]">
            {' '}
            <LightningIcon /> Welcome!
          </div>
        </RowGap>
        <div className="flex flex-col  gap-y-2">
          <div className="text-[#C3C2D4] text-f18">
            Only open for our beta testers
          </div>
          <input
            type="text"
            className=" my-2  outline-none password-border bg-[#1C1C28] text-f14 p-4 rounded-[5px] w-full text-1            "
            value={ip}
            onChange={(e) => setip(e.target.value)}
            placeholder="Enter the password!"
          />
          <div className="text-[#C3C2D4] text-f14">
            You can check our discord to become beta user
          </div>
          <div className="flex items-center mt-2">
            <BlueBtn
              className="!w-fit px-3 !h-[25px] !mr- "
              onClick={handleSubmit}
            >
              Submit
            </BlueBtn>
            <a
              className="unset"
              target="_blank"
              href={'https://discord.com/invite/Hj4QF92Kdc'}
            >
              <div className="flex   items-center underline text-[#C3C2D4] text-f16 cursor-pointer ml-[7px]">
                <Discord /> Discord link
              </div>
            </a>
          </div>
        </div>
      </EditModalBackground>
    </ModalBase>
  );
};

const EditModalBackground = styled.div`
  background: linear-gradient(0deg, #232334, #232334),
    linear-gradient(0deg, #3a3b46, #3a3b46);
  border: 1px solid #3a3b46;
  box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.5);
  border-radius: 10px;
  padding: 16px 16px 12px;
  font-size: 12px;
  height: fit-content;
  width: fit-content;

  .data {
    padding: 4px;
  }
`;
