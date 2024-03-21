import { useUserAccount } from '@Hooks/useUserAccount';
import { useCall2Data } from '@Utils/useReadCall';
import { getWeekId } from '@Views/V2-Leaderboard/Leagues/WinnersByPnl/getWeekId';
import RebatesABI from '../Abis/Rebates.json';
import { rebatesAddress, startWeekId } from '../config';

export const useRebatesAlloted = () => {
  const { address } = useUserAccount();
  const readcalls = [];
  const currentWeekId = getWeekId(0);

  for (let i = startWeekId; i < currentWeekId; i++) {
    readcalls.push({
      address: rebatesAddress,
      abi: RebatesABI,
      name: 'rebateAmount',
      params: [address, i],
      id: i,
    });
  }

  return useCall2Data(readcalls, 'rebates-alloted');
};
