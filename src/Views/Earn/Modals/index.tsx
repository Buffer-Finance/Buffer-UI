import { CloseOutlined } from '@mui/icons-material';
import { Dialog, IconButton } from '@mui/material';
import { useAtom } from 'jotai';
import USDCABI from '../Config/Abis/Token.json';
import { earnAtom, readEarnData } from '../earnAtom';
import { Buy } from './buy';
import { Compound } from './compound';
import { DepositModal } from './deposit';
import { Sell } from './sell';
import { StakeModal } from './stake';
import iBFRABI from '../Config/Abis/BFR.json';
import { CONTRACTS } from '../Config/Address';
import { Claim } from './claim';
import { useActiveChain } from '@Hooks/useActiveChain';
import {
  useEarnWriteCalls,
  useGetApprovalAmount,
} from '../Hooks/useEarnWriteCalls';

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
  const { activeChain } = useActiveChain();

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
      const { buyBLP, validations } = useEarnWriteCalls('Router');
      const { approve } = useGetApprovalAmount(
        USDCABI,
        CONTRACTS[activeChain.id].USDC,
        CONTRACTS[activeChain.id].BLP
      );

      return (
        <Buy
          allowance={pageData.earn?.usdc.allowance}
          walletBalance={pageData.earn?.usdc.wallet_balance}
          buyCall={buyBLP}
          validatinosFn={validations}
          approveFn={approve}
          blpToTokenPrice={pageData.earn?.blp.blpToUsdc}
          tokenToBlpPrice={pageData.earn.blp.usdcToBlp}
          blpTokenName={'BLP'}
          tokenXName={'USDC'}
        />
      );
    case 'buyARB':
      const { buyARBBLP, validations: validationsARB } =
        useEarnWriteCalls('Router');
      const { approve: approveARB } = useGetApprovalAmount(
        USDCABI,
        CONTRACTS[activeChain.id].ARB,
        CONTRACTS[activeChain.id].BLP2
      );

      return (
        <Buy
          allowance={pageData.earn?.arb.allowance}
          walletBalance={pageData.earn?.arb.wallet_balance}
          buyCall={buyARBBLP}
          validatinosFn={validationsARB}
          approveFn={approveARB}
          blpToTokenPrice={pageData.earn?.arbblp.blpToUsdc}
          tokenToBlpPrice={pageData.earn?.arbblp.usdcToBlp}
          blpTokenName={'ARBBLP'}
          tokenXName={'ARB'}
        />
      );

    case 'sell':
      const { sellBLP, validations: sellValidations } =
        useEarnWriteCalls('Router');
      return (
        <Sell
          blpTokenName={'BLP'}
          tokenXName={'USDC'}
          sellCall={sellBLP}
          blpToTokenPrice={pageData.earn?.blp.blpToUsdc}
          tokenToBlpPrice={pageData.earn?.blp.usdcToBlp}
          validatinosFn={sellValidations}
          max={pageData.earn?.blp.max_unstakeable}
          blpPrice={pageData.earn.blp.price}
        />
      );
    case 'sellARB':
      const { sellARBBLP, validations: sellARBValidations } =
        useEarnWriteCalls('Router');
      return (
        <Sell
          blpTokenName={'ARBBLP'}
          tokenXName={'ARB'}
          sellCall={sellARBBLP}
          blpToTokenPrice={pageData.earn?.arbblp.blpToUsdc}
          tokenToBlpPrice={pageData.earn?.arbblp.usdcToBlp}
          validatinosFn={sellARBValidations}
          max={pageData.earn?.arbblp.max_unstakeable}
          blpPrice={pageData.earn?.arbblp.price}
        />
      );

    case 'compound':
      return <Compound />;

    case 'claim':
      return <Claim />;

    case 'iBFRdeposit':
      const { deposit, validations: BFRVesetValidatinos } = useEarnWriteCalls(
        'Vester',
        'BFR'
      );
      return (
        <DepositModal
          head="BFR Vault"
          type="ibfr"
          depositFn={deposit}
          validatinosFn={BFRVesetValidatinos}
        />
      );

    case 'BLPdeposit':
      const { deposit: BLPDeposit, validations: BLPVesetValidatinos } =
        useEarnWriteCalls('Vester', 'BLP');
      return (
        <DepositModal
          head="BLP Vault"
          type="blp"
          depositFn={BLPDeposit}
          validatinosFn={BLPVesetValidatinos}
        />
      );
    case 'ARBBLPdeposit':
      const { deposit2, validations: ARBBLPVesetValidatinos } =
        useEarnWriteCalls('Vester', 'BLP');
      return (
        <DepositModal
          head="ARBBLP Vault"
          type="arbblp"
          depositFn={deposit2}
          validatinosFn={ARBBLPVesetValidatinos}
        />
      );

    default:
      return <div></div>;
  }
}
