import { useActiveChain } from '@Hooks/useActiveChain';
import { getCallId } from '@Utils/Contract/multiContract';
import { useCall2Data } from '@Utils/useReadCall';
import RewardRouterAbi from '@Views/Earn/Config/Abis/RewardRouterV2.json';
import RewardTrackerAbi from '@Views/Earn/Config/Abis/RewardTracker.json';
import VesterAbi from '@Views/Earn/Config/Abis/Vester.json';
import { appConfig } from '@Views/TradePage/config';

export const useBeginTransferData = ({
  account,
  parsedReceiver,
}: {
  account: string | undefined;
  parsedReceiver: string | undefined;
}) => {
  const { activeChain } = useActiveChain();
  const contracts =
    appConfig[activeChain.id as unknown as keyof typeof appConfig].EarnConfig;

  const calls = [
    {
      abi: VesterAbi,
      address: contracts.BfrVester,
      method: 'balanceOf',
      args: [account],
      id: getCallId(contracts.BfrVester, 'balanceOf'),
    },
    {
      abi: VesterAbi,
      address: contracts.BlpVester,
      method: 'balanceOf',
      args: [account],
      id: getCallId(contracts.BlpVester, 'balanceOf'),
    },
    {
      abi: VesterAbi,
      address: contracts.BlpVester2,
      method: 'balanceOf',
      args: [account],
      id: getCallId(contracts.BlpVester2, 'balanceOf'),
    },
    {
      abi: RewardTrackerAbi,
      address: contracts.StakedBfrTracker,
      method: 'cumulativeRewards',
      args: [parsedReceiver],
      id: getCallId(contracts.StakedBfrTracker, 'cumulativeRewards'),
    },
    {
      abi: RewardTrackerAbi,
      address: contracts.StakedBlpTracker,
      method: 'cumulativeRewards',
      args: [parsedReceiver],
      id: getCallId(contracts.StakedBlpTracker, 'cumulativeRewards'),
    },
    {
      abi: RewardTrackerAbi,
      address: contracts.StakedBlpTracker2,
      method: 'cumulativeRewards',
      args: [parsedReceiver],
      id: getCallId(contracts.StakedBlpTracker2, 'cumulativeRewards'),
    },
    {
      abi: VesterAbi,
      address: contracts.BfrVester,
      method: 'transferredCumulativeRewards',
      args: [parsedReceiver],
      id: getCallId(contracts.BfrVester, 'transferredCumulativeRewards'),
    },
    {
      abi: VesterAbi,
      address: contracts.BlpVester,
      method: 'transferredCumulativeRewards',
      args: [parsedReceiver],
      id: getCallId(contracts.BlpVester, 'transferredCumulativeRewards'),
    },
    {
      abi: VesterAbi,
      address: contracts.BlpVester2,
      method: 'transferredCumulativeRewards',
      args: [parsedReceiver],
      id: getCallId(contracts.BlpVester2, 'transferredCumulativeRewards'),
    },
    {
      abi: RewardRouterAbi,
      address: contracts.RewardRouter,
      method: 'pendingReceivers',
      args: [account],
      id: getCallId(contracts.RewardRouter, 'pendingReceivers'),
    },
    {
      abi: RewardRouterAbi,
      address: contracts.RewardRouter2,
      method: 'pendingReceivers',
      args: [account],
      id: getCallId(contracts.RewardRouter2, 'pendingReceivers'),
    },
    {
      abi: VesterAbi,
      address: contracts.iBFR,
      method: 'allowance',
      args: [account, contracts.StakedBfrTracker],
      id: getCallId(contracts.iBFR, 'allowance'),
    },
    {
      abi: RewardTrackerAbi,
      address: contracts.StakedBfrTracker,
      method: 'depositBalances',
      args: [account, contracts.iBFR],
      id: getCallId(contracts.StakedBfrTracker, 'depositBalances'),
    },
  ];
  console.log(calls);

  const { data } = useCall2Data(calls, 'beginTransferData');
  console.log(data);
  if (data) {
    const bfrVesterBalance = data[calls[0].id][0];
    const blpVesterBalance = data[calls[1].id][0];
    const blpVester2Balance = data[calls[2].id][0];
    const cumulativeBfrRewards = data[calls[3].id][0];
    const cumulativeBlpRewards = data[calls[4].id][0];
    const cumulativeBlpRewards2 = data[calls[5].id][0];
    const transferredCumulativeBfrRewards = data[calls[6].id][0];
    const transferredCumulativeBlpRewards = data[calls[7].id][0];
    const transferredCumulativeBlpRewards2 = data[calls[8].id][0];
    const pendingReceiver = data[calls[9].id][0];
    const pendingReceiver2 = data[calls[10].id][0];
    const bfrAllowance = data[calls[11].id][0];
    const bfrStaked = data[calls[12].id][0];
    return {
      bfrVesterBalance,
      blpVesterBalance,
      blpVester2Balance,
      cumulativeBfrRewards,
      cumulativeBlpRewards,
      cumulativeBlpRewards2,
      transferredCumulativeBfrRewards,
      transferredCumulativeBlpRewards,
      transferredCumulativeBlpRewards2,
      pendingReceiver,
      pendingReceiver2,
      bfrAllowance,
      bfrStaked,
    };
  }
  return undefined;
};
