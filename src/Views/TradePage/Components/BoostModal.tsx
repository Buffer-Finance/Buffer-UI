import MemoBlueFire from '@SVG/Elements/BlueFire';
import { CloseOutlined, OpenInBrowser } from '@mui/icons-material';
import { ModalBase } from 'src/Modals/BaseModal';
import styled from '@emotion/styled';
import { useActivePoolObject } from '../Hooks/useActivePoolObject';
import { PoolRadio } from '../Views/Markets/AssetSelectorDD/PoolRadio';
import { useState } from 'react';
import { BlueBtn } from '@Views/Common/V2-Button';
import InfoIcon from '@SVG/Elements/InfoIcon';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { boostModalAtom } from '../atoms';
import { useMedia } from 'react-use';
import { useShutterHandlers } from '@Views/Common/MobileShutter/MobileShutter';

const BoostModal: React.FC<any> = ({}) => {
  const setIsModalOpen = useSetAtom(boostModalAtom);
  const { closeModal, isModalOpen } = useBoostBuyingUIHandlers();
  return (
    <ModalBase
      open={isModalOpen}
      onClose={closeModal}
      className="!bg-[#232334]"
    >
      <BoostBuyingUI />
    </ModalBase>
  );
};

export const useBoostBuyingUIHandlers = () => {
  const isMobile = useMedia('(max-width:1200px)');
  const setIsModalOpen = useSetAtom(boostModalAtom);
  const isModalOpen = useAtomValue(boostModalAtom);
  const { openBoosterShutter, closeShutter } = useShutterHandlers();
  const openModal = !isMobile
    ? () => {
        setIsModalOpen(true);
      }
    : () => {
        openBoosterShutter();
      };
  const closeModal = !isMobile
    ? () => {
        setIsModalOpen(false);
      }
    : () => {
        closeShutter();
      };

  return {
    openModal,
    isModalOpen,
    closeModal,
  };
};

export const BoostBuyingUI = () => {
  const { closeModal } = useBoostBuyingUIHandlers();
  const [ip, setip] = useState(1);
  const [selectedAsset, setselectedAsset] = useState('USDC');

  return (
    <div className="flex  flex-col gap-y-[14px] b1200:px-[10px] a1200:w-[340px]">
      <div className="flex items-center justify-between">
        <h2 className="flex items-center text-f22 font-[500] gap-x-[7px]">
          <MemoBlueFire className=" scale-110" /> Buy Boost
        </h2>
        <button
          className="p-3 sm:p-2 text-1 rounded-full bg-2"
          test-id="close-button"
          onClick={closeModal}
        >
          <CloseOutlined className="!scale-125 sm:!scale-100" />
        </button>
      </div>
      <p className="text-f14 text-gf  font-[500]">Trading Token</p>
      <div className="flex gap-x-[30px]">
        {['USDC', 'ARB']?.map((asset) => {
          return (
            <div className="flex items-center gap-x-[4px]" key={asset}>
              <RadioInput
                id={'boost-for-' + asset}
                type="radio"
                name="age"
                value={asset}
                checked={asset == selectedAsset}
                onChange={() => {
                  setselectedAsset(asset);
                }}
              />
              <label
                className="text-f14 font-[500]"
                htmlFor={'boost-for-' + asset}
              >
                {asset}
              </label>
            </div>
          );
        })}
      </div>
      <p className="text-f14 text-gf  font-[500]">No. of Boosts</p>
      <div className="h-full border-box  py-[1px]  w-full flex items-center justify-between  bg-[#282B39] rounded-[5px]">
        <div
          className="ml-3 text-f16 font-bold bg-[#232334] w-[29px] h-[29px] rounded-full text-center grid place-items-center"
          role="button"
          onClick={(e) => {
            e.stopPropagation();
            setip((i) => i - 1);
          }}
        >
          <span>-</span>
        </div>

        <span className="text-1 text-f13">{ip}</span>
        <div
          className="mr-3 text-f16 font-bold bg-[#232334] w-[29px] h-[29px] rounded-full text-center grid place-items-center"
          role="button"
          onClick={(e) => {
            e.stopPropagation();
            setip((i) => i + 1);
          }}
        >
          <span>+</span>
        </div>
      </div>
      <div className="flex justify-between font-[500]">
        <div>
          <div className="text-gf text-f12 mb-2">Valid For</div>
          <div className="text-f14">
            10 <span className="text-gf">Trades</span>
          </div>
        </div>
        <div>
          <div className="text-gf text-f12 mb-2">Boost</div>
          <div className="text-f14">+2%</div>
        </div>
        <div>
          <div className="text-gf text-f12 mb-2">Total Cost with ( )</div>
          <div className="bg-[#303044] pb-[10px] pt-[20px] px-5 rounded-lg relative overflow-hidden leading-[16px]">
            <div className="bg-[#5BE6B4] text-[black] text-f12 w-fit px-[6px] absolute top-[0px] left-[0px] rounded-br-lg">
              Offer
            </div>
            <div className="text-f18 font-bold">
              $10 <span className="text-gf">$20</span>
            </div>
          </div>
        </div>
      </div>
      <BlueBtn
        className="boost-button !text-[#232334] !text-f16 !font-bold !w-full"
        onClick={console.log}
      >
        Boost{' '}
      </BlueBtn>
      <div className="flex items-cetner justify-between">
        <div className="flex items-center underline text-gf text-f12 ">
          NFT Tier{' '}
          <InfoIcon
            className="mt-[3px] ml-2"
            tooltip="Hey Reviewer, remind me to update text!"
            sm
          />
        </div>
        <a href="https://optopi.buffer.finance" target="_blank">
          <div className="flex items-center underline text-gf text-f12 ">
            Mint NFT <OpenInBrowser className=" ml-2" />
          </div>
        </a>
      </div>
    </div>
  );
};

export const BoostDisplay: React.FC = () => {
  return <div> This is pay</div>;
};

export { BoostModal };

const RadioInput = styled.input`
  appearance: none;
  -webkit-appearance: none;
  width: 12px;
  height: 12px;
  border: 1px solid #c3c2d4;
  border-radius: 50%;
  padding: 0;
  position: relative;

  /* Unchecked state styles */
  background: transparent;

  /* Checked state styles */
  &:checked {
    background-color: transparent; /* Example color */
  }

  &:after {
    content: ''; /* Required for the pseudo-element */
    display: ${(props) =>
      props.checked ? 'block' : 'none'}; /* Show after for checked state */
    width: 8px; /* Adjust size */
    height: 8px; /* Adjust size */
    background-color: #a5ffdc; /* Color of the inner circle */
    border-radius: 50%;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    margin: auto;
  }
`;
