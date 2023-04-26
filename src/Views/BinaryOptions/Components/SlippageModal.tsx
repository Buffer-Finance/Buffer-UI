import styled from '@emotion/styled';
import { CloseOutlined } from '@mui/icons-material';
import { Dialog, IconButton } from '@mui/material';
import { atom, useAtom, WritableAtom } from 'jotai';
import React, { useState } from 'react';
import InfoIcon from 'src/SVG/Elements/InfoIcon';
import { gt } from '@Utils/NumString/stringArithmatics';
import BufferSwitch from '@Views/Common/BufferSwitch';
import { SettingsIcon } from '../PGDrawer/SettingsIcon';
import { BlueBtn } from '@Views/Common/V2-Button';
import { mobileUpperBound } from '..';

export const SlippageModalStyles = styled.div`
  background-color: var(--dropdown-hover);
  gap: 1.4rem;
  padding: 3rem;
  padding-bottom: 2rem;
  position: relative;
  /* border-radius: 2rem; */
  width: 100%;
  /* position: fixed; */
  /* z-index: 2500; */
  /* top: 35rem; */
  /* transform: translateX(-5rem); */
  /* bottom:1rem; */
  /* bottom:0; */
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

interface ISlippageModal {
  clickHandler: (isChecked: boolean) => void;
  closeModal: () => void;
  isOpen: boolean;
  onResetLayout: () => void;
}

const defaults = [0.1, 0.5, 1.0];
const HeadStyles = ' flex flex-row items-center text-3 text-f14 ';
const MAX_SLIPPAGE = 5;
export const atomWithLocalStorage = <key, T>(
  key: string,
  initialValue: T
): WritableAtom<T, unknown, void> => {
  if (typeof window == 'undefined') return atom({ dummy: true });
  const getInitialValue = () => {
    const item = localStorage.getItem(key);
    if (item !== null) {
      return JSON.parse(item);
    }
    return initialValue;
  };
  const baseAtom = atom(getInitialValue());
  const derivedAtom = atom(
    (get) => get(baseAtom),
    (get, set, update) => {
      const nextValue =
        typeof update === 'function' ? update(get(baseAtom)) : update;
      set(baseAtom, nextValue);
      localStorage.setItem(key, JSON.stringify(nextValue));
    }
  );
  return derivedAtom;
};
export const slippageAtom = atomWithLocalStorage('slippage-settings', {
  slippage: 0.5,
  allowPartial: true,
});

export const SlippageModal: React.FC<ISlippageModal> = ({
  clickHandler,
  closeModal,
  isOpen,
  onResetLayout,
}) => {
  // const [isChecked, setIsChecked] = useState(false);
  if (!isOpen) return <></>;
  return (
    <Dialog open={isOpen} onClose={closeModal}>
      <SlippageModalStyles className="flexc-center sm:!items-start">
        <IconButton className="close" onClick={closeModal}>
          <CloseOutlined />
        </IconButton>
        <span className="flex text-f18 text-3 items-start w-full">
          <SettingsIcon className={'scale-[2] mr-5 origin-top'} />
          Settings
        </span>
        <SlippageModalChild />
        {window.innerWidth > mobileUpperBound && (
          <section className="flex flex-row justify-between items-center w-full mt-2">
            <div className={HeadStyles + ' h-fit'}>
              Reset Layout
              <InfoIcon
                sm
                className="ml-2"
                tooltip={`You can change app layouts of the app by dragging and dropping different sections.`}
              />
            </div>
            <BlueBtn onClick={onResetLayout} className="!w-fit !px-5">
              Reset
            </BlueBtn>
          </section>
        )}

        {/* <div className="flex text-1">
        <BufferCheckbox
          checked={isChecked}
          onCheckChange={() => setIsChecked((prvState) => !prvState)}
        />
        <div className="f16 fw5 ml5">Approve All</div>
      </div> */}
      </SlippageModalStyles>
    </Dialog>
  );
};

export const SlippageModalChild = () => {
  const [settings, setSettings] = useAtom(slippageAtom);
  const [err, setErr] = useState(false);
  return (
    <>
      {' '}
      <section>
        <div className={HeadStyles + 'mt-5'}>
          Slippage Tolerance{' '}
          <InfoIcon
            sm
            className="ml-2"
            tooltip={`Slippage tolerance is the %age of price fluctuation you can tolerate before your trade is opened`}
          />
        </div>
        <div className="flex flex-row  gap-x-5 text-f12  text-3 mt-3 items-center sm:flex-col sm:items-start">
          <div className="flex flex-row  gap-5 text-f12  text-3  items-center">
            {defaults.map((s) => (
              <div
                className={
                  (+settings.slippage == s
                    ? 'bg-blue text-1 font-semibold text-f14 py-[5px] px-[15px]'
                    : 'bg-[#1C1C28] px-5 py-[8px] ') +
                  ' border border-[#2A2A3A]  rounded-lg hover:border-[#00bbff42] cursor-pointer'
                }
                role="button"
                onClick={() => {
                  setSettings({ ...settings, slippage: s });
                }}
              >
                {s}%
              </div>
            ))}
          </div>
          <div className="relative sm:mt-3 flex flex-row gap-x-4 items-center">
            <input
              value={settings.slippage}
              type="number"
              max={MAX_SLIPPAGE}
              className={` border-2 border-[#2A2A3A] bg-[#222234] px-6 py-[6px] rounded-lg outline-none focus:border-[#00bbff42] w-[150px] text-f14 text-1`}
              onChange={(e) => {
                if (gt(e.target.value || '0', MAX_SLIPPAGE.toString())) {
                  setErr(true);
                  return;
                }
                setSettings({ ...settings, slippage: e.target.value });
                setErr(false);
              }}
            />
            {err && (
              <span className="absolute top-full left-[-20px] text-red whitespace-nowrap">
                Slippage rate must be less then {MAX_SLIPPAGE}%
              </span>
            )}
            %
          </div>
        </div>
      </section>
      <section className="flex flex-row justify-between items-center w-full mt-2">
        <div className={HeadStyles + ' h-fit'}>
          Partial Fill
          <InfoIcon
            sm
            className="ml-2"
            tooltip={`By enabling "Partial Fill" your trade will be partially filled rather than canceled in case of insufficient funds in the write pool.`}
          />
        </div>
        <BufferSwitch
          value={settings.allowPartial}
          onChange={() => {
            setSettings({
              ...settings,
              allowPartial: !settings.allowPartial,
            });
          }}
        />
      </section>
    </>
  );
};
