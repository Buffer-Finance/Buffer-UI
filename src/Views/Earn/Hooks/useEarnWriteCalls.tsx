import { useToast } from '@Contexts/Toast';
import { useWriteCall } from '@Hooks/useWriteCall';
import { multiply } from '@Utils/NumString/stringArithmatics';
import EarnRouterABI from '../Config/Abis/RewardRouterV2.json';
import VesterABI from '../Config/Abis/Vester.json';
import { useAtom } from 'jotai';
import { writeEarnAtom } from '../earnAtom';
import { toFixed } from '@Utils/NumString';
import { useActiveChain } from '@Hooks/useActiveChain';
import { getContract } from '../Config/Address';

export const useEarnWriteCalls = (
  contractType: 'Router' | 'Vester',
  vesterType?: 'BLP' | 'BFR'
) => {
  const { activeChain } = useActiveChain();
  const EarnRouterContract = getContract(activeChain?.id, 'RewardRouter');
  const routerContract = { contract: EarnRouterContract, abi: EarnRouterABI };
  const contract = routerContract;
  const { writeCall } = useWriteCall(contract.contract, contract.abi);
  const toastify = useToast();
  const [, setPageState] = useAtom(writeEarnAtom);

  function callBack(res) {
    if (res.payload)
      setPageState({
        isModalOpen: false,
        activeModal: null,
      });
  }
  function validations(amount) {
    if (!amount || amount === '0' || amount === '') {
      toastify({
        type: 'error',
        msg: 'Please enter a positive number.',
        id: 'invalidNumber',
      });
      return true;
    }
  }
  function stakeUnstakeiBFR(amount: string, methodName: string) {
    if (validations(amount)) return;
    writeCall(callBack, methodName, [toFixed(multiply(amount, 18), 0)]);
  }

  function buyBLP(amount: string) {
    if (validations(amount)) return;
    writeCall(callBack, 'mintAndStakeBlp', [
      toFixed(multiply(amount, 6), 0),
      0,
    ]);
  }

  function sellBLP(amount: string) {
    if (validations(amount)) return;
    writeCall(callBack, 'unstakeAndRedeemBlp', [
      toFixed(multiply(amount, 6), 0),
    ]);
  }
  function deposit(amount: string) {
    if (validations(amount)) return;
    writeCall(callBack, 'deposit', [toFixed(multiply(amount, 18), 0)]);
  }
  function deposit2(amount: string) {
    if (validations(amount)) return;
    Vester2(callBack, 'deposit', [toFixed(multiply(amount, 18), 0)]);
  }

  function withdraw() {
    // if(validations(amount)) return;
    writeCall(callBack, 'withdraw', []);
  }
  function withdraw2() {
    // if(validations(amount)) return;
    Vester2(callBack, 'withdraw', []);
  }

  function compound(
    shouldClaimiBFR,
    shouldStakeiBFR,
    shouldCLaimesBFR,
    shouldStakeesBFR,
    shouldStakeMultiplierPoints,
    shouldClaimWeth
  ) {
    writeCall(callBack, 'handleRewards', [
      shouldClaimiBFR || shouldStakeiBFR,
      shouldStakeiBFR,
      shouldCLaimesBFR || shouldStakeesBFR,
      shouldStakeesBFR,
      shouldStakeMultiplierPoints,
      shouldClaimWeth,
    ]);
  }

  function claim(
    shouldClaimiBFR,
    shouldCLaimesBFR,
    shouldClaimWeth,
    shouldConvertWeth
  ) {
    writeCall(callBack, 'handleRewards', [
      shouldClaimiBFR,
      false,
      shouldCLaimesBFR,
      false,
      false,
      shouldClaimWeth,
      // shouldConvertWeth,
    ]);
  }

  return {
    stakeUnstakeiBFR,
    buyBLP,
    sellBLP,
    deposit,
    withdraw,
    compound,
    claim,
    validations,
    deposit2,
    withdraw2,
  };
};

export const useGetApprovalAmount = (
  abi: any,
  token_address: string,
  spender_address: string
  // user_amount?: string
) => {
  const { writeCall } = useWriteCall(token_address, abi);

  async function approve(amount, cb: (newState) => void) {
    cb(true);
    writeCall(
      (res) => {
        cb(false);
      },
      'approve',
      [spender_address, amount]
    );
  }

  return { approve };
};
