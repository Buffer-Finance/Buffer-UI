import { useToast } from '@Contexts/Toast';
import { useWriteCall } from '@Hooks/useWriteCall';
import { divide } from '@Utils/NumString/stringArithmatics';
import { Display } from '@Views/Common/Tooltips/Display';
import { BlueBtn } from '@Views/Common/V2-Button';
import { getLpConfig } from '@Views/LpRewards/config';
import { lockTxn, poolsType } from '@Views/LpRewards/types';
import { RowBetween } from '@Views/TradePage/Components/Row';
import styled from '@emotion/styled';
import { CloseOutlined } from '@mui/icons-material';
import { Dialog } from '@mui/material';
import { useState } from 'react';
import { Chain } from 'viem';
import NFTlockPoolABI from '../../abis/NftLockPool.json';
import { APRheading, APRvalue, AprDD } from '../AprDD';
import { convertLockPeriodToSeconds } from './Lock';

const ModalStyles = styled.div`
  background-color: #232334;
  padding: 24px;
  min-width: 350px;
`;

export const RenewLockModal: React.FC<{
  isOpen: boolean;
  closeModal: React.Dispatch<React.SetStateAction<boolean>>;
  activeChain: Chain;
  lockTxn: lockTxn;
  decimals: number;
  unit: string;
  isExtendModal: boolean;
  lockPeriod: {
    days: number;
    months: number;
  };
  setLockPeriod: React.Dispatch<
    React.SetStateAction<{
      days: number;
      months: number;
    }>
  >;
  activePool: poolsType;
}> = ({
  isOpen,
  closeModal,
  activeChain,
  lockTxn,
  decimals,
  unit,
  isExtendModal,
  lockPeriod,
  setLockPeriod,
  activePool,
}) => {
  const contracts = getLpConfig(activeChain.id);
  const { writeCall } = useWriteCall(contracts.nftLockPool, NFTlockPoolABI);
  const toastify = useToast();
  const [loading, setLoading] = useState(false);

  async function handleRenewLock() {
    try {
      setLoading(true);
      if (isExtendModal) {
        await writeCall(
          (returnObj) => {
            if (returnObj) {
              toastify({
                type: 'success',
                msg: 'Lock Extended Successfully',
                id: 'renew-lock',
              });
              closeModal(false);
            }
          },
          'lockPosition',
          [lockTxn.nftId, convertLockPeriodToSeconds(lockPeriod)]
        );
      } else {
        await writeCall(
          (returnObj) => {
            if (returnObj) {
              toastify({
                type: 'success',
                msg: 'Lock Renewed Successfully',
                id: 'renew-lock',
              });
              closeModal(false);
            }
          },
          'renewLockPosition',
          [lockTxn.nftId]
        );
      }
    } catch (e) {
      toastify({
        type: 'error',
        msg: (e as Error).message,
        id: 'renew-lock',
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={isOpen} onClose={closeModal}>
      <ModalStyles>
        <RowBetween>
          <span className="text-f18 text-[#C3C2D4] font-medium">
            ${isExtendModal ? 'Extend' : 'Renew'} Lock Period
          </span>
          <button
            className="p-3 text-1 rounded-full bg-2"
            onClick={() => closeModal(false)}
          >
            <CloseOutlined />
          </button>
        </RowBetween>
        <AprDD
          lockPeriod={lockPeriod}
          setLockPeriod={setLockPeriod}
          isDisabled={!isExtendModal}
          activeChain={activeChain}
          activePool={activePool}
        />
        <RowBetween className="my-4">
          <APRheading>Amount</APRheading>
          <APRvalue>
            <Display
              data={divide(lockTxn.amount, decimals)}
              precision={2}
              unit={unit}
            />
          </APRvalue>
        </RowBetween>
        <BlueBtn
          onClick={handleRenewLock}
          isDisabled={loading}
          isLoading={loading}
          className="!w-fit !h-fit !px-4 !py-2"
        >
          Renew
        </BlueBtn>
      </ModalStyles>
    </Dialog>
  );
};
