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

export const useEarnWriteCalls = () => {
  const { activeChain } = useActiveChain();
  const EarnRouterContract = getContract(activeChain?.id, 'RewardRouter');
  const routerContract = { contract: EarnRouterContract, abi: EarnRouterABI };
  const contract = routerContract;
  const { writeCall } = useWriteCall(contract.contract, contract.abi);
  const toastify = useToast();
  const [, setPageState] = useAtom(writeEarnAtom);

  function callBack(res: any) {
    if (res.payload)
      setPageState({
        isModalOpen: false,
        activeModal: null,
      });
  }
  function validations(amount: string) {
    if (!amount || amount === '0' || amount === '') {
      toastify({
        type: 'error',
        msg: 'Please enter a positive number.',
        id: 'invalidNumber',
      });
      return true;
    }
  }

  function buyBLP(amount: string) {
    if (validations(amount)) return;
    writeCall(callBack, 'mintAndStakeBlp', [
      toFixed(multiply(amount, 6) as string, 0),
      0,
    ]);
  }

  function sellBLP(amount: string) {
    if (validations(amount)) return;
    writeCall(callBack, 'unstakeAndRedeemBlp', [
      toFixed(multiply(amount, 6) as string, 0),
    ]);
  }

  function claim(callbackFn: () => void) {
    writeCall(callbackFn, 'handleRewards', []);
  }

  return {
    buyBLP,
    sellBLP,
    claim,
    validations,
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
