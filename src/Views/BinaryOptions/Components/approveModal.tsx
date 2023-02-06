import styled from '@emotion/styled';
import { CloseOutlined } from '@mui/icons-material';
import { Dialog, IconButton } from '@mui/material';
import { useGlobal } from '@Contexts/Global';
import React, { useState } from 'react';
import BufferCheckbox from '@Views/Common/BufferCheckbox';
import ButtonLoader from '@Views/Common/ButtonLoader/ButtonLoader';
import { PrimaryBtn, SecondaryBtn } from '@Views/Common/Buttons';
import { BlueBtn } from '@Views/Common/V2-Button';
import { useQTinfo } from '..';

const ApproveModalStyles = styled.div`
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

interface IApproveModal {
  token: string;
  clickHandler: (isChecked: boolean) => void;
  closeModal: () => void;
  isOpen: boolean;
  loading: number;
}
export const ApproveModal: React.FC<IApproveModal> = ({
  token,
  clickHandler,
  closeModal,
  isOpen,
  loading,
}) => {
  // const { state } = useGlobal();
  const qtInfo = useQTinfo();

  const [loadingState, setLoadingState] = useState(0);
  const [isChecked, setIsChecked] = useState(true);
  if (!isOpen) return <></>;
  return (
    <Dialog open={isOpen} onClose={closeModal}>
      <ApproveModalStyles className="flexc-center">
        <IconButton className="close" onClick={closeModal}>
          <CloseOutlined />
        </IconButton>
        <div className="text-f16 fw5 text-1">Approve {token}</div>
        <div className="text-f14 fw5 text-2 flex-center text-center">
          Allow Buffer to spend your {token} on{' '}
          {qtInfo.activeChain.name.split(' ')[0].toUpperCase()}
        </div>
        <div className='w-full text-f13 text-2 text-center'>
          <span className='text-1 font-semibold'>Trading UX Disclaimer : </span>
          Please note that there may be a delay between trade placement and <br className='sm:hidden' /> 
          order execution, but the timestamp and price are taken at the time<br className='sm:hidden' />
          when the transaction is signed from your wallet for a fair and <br className='sm:hidden' />
          accurate trading experience.
        </div>
        <div
          className="flex text-1 pointer"
          onClick={() => setIsChecked((prvState) => !prvState)}
        >
          <BufferCheckbox checked={isChecked} onCheckChange={console.log} />
          <div className="text-f14 fw5 ml5">Approve All</div>
        </div>
        <div className="flex items-center content-center nowrap full-width">
          <BlueBtn
            isLoading={loading && loading === 1 && loadingState === 1}
            onClick={() => {
              setLoadingState(1);
              clickHandler(isChecked);
            }}
            className="w-1/2"
          >
            Approve
          </BlueBtn>
          {/* <SecondaryBtn
            className="mt5 half-width"
            onClick={() => {
              setLoadingState(2);
              clickHandler(false);
            }}
          >
            {loading && loading === 1 && loadingState === 2 ? (
              <ButtonLoader className="btn-loader full-width" />
            ) : (
              <> Approve This Txn</>
            )}
          </SecondaryBtn> */}
        </div>
      </ApproveModalStyles>
    </Dialog>
  );
};

export const IbfrModal: React.FC<IApproveModal> = ({
  token,
  clickHandler,
  closeModal,
  isOpen,
  loading,
}) => {
  const { state } = useGlobal();
  const [loadingState, setLoadingState] = useState(0);
  // const [isChecked, setIsChecked] = useState(false);
  if (!isOpen) return <></>;
  return (
    <Dialog open={isOpen} onClose={closeModal}>
      <ApproveModalStyles className="flexc-center">
        <IconButton className="close" onClick={closeModal}>
          <CloseOutlined />
        </IconButton>
        <div className="f24 fw5 text-1">Approve {token}</div>
        <div className="f16 fw5 text-6 flex-center text-center">
          Allow Buffer to spend your {token} on{' '}
          {state.settings.activeChain?.name}
        </div>
        {/* <div className="flex text-1">
        <BufferCheckbox
          checked={isChecked}
          onCheckChange={() => setIsChecked((prvState) => !prvState)}
        />
        <div className="f16 fw5 ml5">Approve All</div>
      </div> */}
        <div className="flex nowrap full-width">
          <PrimaryBtn
            className="mt5 half-width mr-3"
            onClick={() => {
              if (loading && loading === 1 && loadingState === 1) {
                return;
              }
              setLoadingState(1);
              clickHandler(true);
            }}
          >
            {loading && loading === 1 && loadingState === 1 ? (
              <ButtonLoader className="btn-loader full-width" />
            ) : (
              <> Approve All Txns</>
            )}
          </PrimaryBtn>
          <SecondaryBtn
            className="mt5 half-width"
            onClick={() => {
              if (loading && loading === 1 && loadingState === 2) {
                return;
              }
              setLoadingState(2);
              clickHandler(false);
            }}
          >
            {loading && loading === 1 && loadingState === 2 ? (
              <ButtonLoader className="btn-loader full-width" />
            ) : (
              <> Approve This Txn</>
            )}
          </SecondaryBtn>
        </div>
      </ApproveModalStyles>
    </Dialog>
  );
};
