import { DynamicDurationPicker } from '@Views/BinaryOptions/PGDrawer/DurationPicker';
import { useMemo, useState } from 'react';
import { Background } from '@Views/BinaryOptions/PGDrawer/style';
import { DynamicCustomOption } from '@Views/BinaryOptions/PGDrawer/DynamicCustomOption';
import useSWR from 'swr';
import {
  ITournament,
  useNoLossTournaments,
  useTournamentData,
} from './useNoLossTournamets';
import playTokenAbi from '@Views/NoLoss/ABI/PlayTokenABI.json';
import { useAtom, useAtomValue } from 'jotai';
import { activetIdAtom } from './NoLoss';
import { useUserAccount } from '@Hooks/useUserAccount';
import { useNoLossConfig } from './useNoLossConfig';
import { useNoLossStaticConfig } from './useNoLossConfig';
import { useCall2Data } from '@Utils/useReadCall';
import { getReadId } from '@Utils/Contract/multiContract';
import { MarketInterface } from 'src/MultiChart';
// fetch balance
// fetch payout
const NoLossOptionBuying: React.FC<any> = ({
  activeTournament,
  markets,
}: {
  activeTournament: ITournament;
  markets: MarketInterface[];
}) => {
  const [currentTime, setCurrentTime] = useState(0);
  console.log(`activeTournament: `, activeTournament);
  const { data } = useActiveTournamentState(activeTournament, markets);
  console.log(`NoLossOptionBuying:data: `, data);

  return (
    <Background>
      <DynamicCustomOption markets={markets} />
    </Background>
  );
};

export { NoLossOptionBuying };

export const useActiveTournamentState = (
  activeTournament: ITournament,
  markets: MarketInterface[]
) => {
  const { address } = useUserAccount();
  const config = useNoLossStaticConfig();
  const calls = useMemo(() => {
    const balance = {
      address: activeTournament.tournamentMeta.buyinToken,
      abi: playTokenAbi,
      name: 'balanceOf',
      params: [address],
    };
    const allowance = {
      address: activeTournament.tournamentMeta.buyinToken,
      abi: playTokenAbi,
      name: 'allowance',
      params: [address, config.router],
    };
    return [balance, allowance];
  }, [activeTournament, markets]);
  return useCall2Data(calls, 'no-loss-read-calls');
};
