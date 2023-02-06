import { CloseOutlined } from '@mui/icons-material';
import { Dialog, IconButton } from '@mui/material';
import { useAtom } from 'jotai';
import React, { useContext } from 'react';
import { earnAtom, readEarnData } from '../earnAtom';
import { Buy } from './buy';
import { Compound } from './compound';
import { DepositModal } from './deposit';
import { Sell } from './sell';
import { StakeModal } from './stake';
import iBFRABI from '../Config/Abis/BFR.json';
import { CONTRACTS } from '../Config/Address';
import { Claim } from './claim';
import { EarnContext } from '..';

export const EarnModals = () => {
  const [pageState, setPageState] = useAtom(earnAtom);

  const closeModal = () =>
    setPageState({
      ...pageState,
      isModalOpen: false,
      activeModal: null,
    });
  return (
    <Dialog open={pageState.isModalOpen} onClose={closeModal}>
      <div className="text-1 bg-2 p-6 rounded-md relative">
        <IconButton
          className="!absolute text-1 top-[20px] right-[20px]"
          onClick={closeModal}
        >
          <CloseOutlined />
        </IconButton>
        {pageState.isModalOpen && <ModalChild />}
      </div>
    </Dialog>
  );
};

function ModalChild() {
  const [pageState] = useAtom(earnAtom);
  const [pageData] = useAtom(readEarnData);
  const { activeChain } = useContext(EarnContext);
  switch (pageState.activeModal) {
    case 'iBFRstake':
      return (
        <StakeModal
          max={pageData.earn?.ibfr.user.wallet_balance.token_value}
          head="Stake BFR"
          isStakeModal
          tokenContract={{
            abi: iBFRABI,
            contract: CONTRACTS[activeChain?.id].iBFR,
          }}
          unit="BFR"
          allowance={pageData.earn?.ibfr.user.allowance}
        />
      );

    case 'iBFRunstake':
      return (
        <StakeModal
          max={pageData.earn?.ibfr.max_unstakeable}
          head="Unstake BFR"
          isStakeModal={false}
          unit="BFR"
        />
      );

    case 'esBFRstake':
      return (
        <StakeModal
          max={pageData.earn?.esBfr.user.wallet_balance.token_value}
          head="Stake esBFR"
          isStakeModal
          tokenContract={{
            abi: iBFRABI,
            contract: CONTRACTS[activeChain?.id].ES_BFR,
          }}
          unit="esBFR"
          allowance={pageData.earn?.esBfr.user.allowance}
        />
      );

    case 'esBFRunstake':
      return (
        <StakeModal
          max={pageData.earn?.esBfr.max_unstakeable}
          head="Unstake esBFR"
          isStakeModal={false}
          unit="esBFR"
        />
      );

    case 'buy':
      return <Buy />;

    case 'sell':
      return <Sell />;

    case 'compound':
      return <Compound />;

    case 'claim':
      return <Claim />;

    case 'iBFRdeposit':
      return <DepositModal head="BFR Vault" type="ibfr" />;

    case 'BLPdeposit':
      return <DepositModal head="BLP Vault" type="blp" />;

    default:
      return <div></div>;
  }
}
