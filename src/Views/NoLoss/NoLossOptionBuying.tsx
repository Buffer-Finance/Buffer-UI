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
import { Call, getCallId, getReadId } from '@Utils/Contract/multiContract';
import ConfigAbi from '@Views/NoLoss/ABI/ConfigABI.json';
import { MarketInterface } from 'src/MultiChart';
import { useParams } from 'react-router-dom';
import { getActiveMarket } from '@Views/BinaryOptions/PGDrawer/ActiveAsset';
// fetch balance
// fetch payout

export interface OptionBuyintMarketState {
  balance: string;
  allowance: string;
  maxFee: string;
  minFee: string;
  maxPeriod: string;
  minPeriod: string;
  activeMarket: MarketInterface;
}
const NoLossOptionBuying: React.FC<any> = ({
  activeTournament,
  markets,
}: {
  activeTournament: ITournament;
  markets: { [a: string]: MarketInterface };
}) => {
  const [currentTime, setCurrentTime] = useState(0);
  const config = useNoLossStaticConfig();

  console.log(`activeTournament: `, activeTournament);
  const { data } = useActiveTournamentState(activeTournament, markets);
  console.log(`NoLossOptionBuying:data: `, data);
  const params = useParams();
  const state = useMemo(() => {
    const buyinToken = activeTournament.tournamentMeta.buyinToken;
    const balance = data?.[getCallId(buyinToken, 'balanceOf')];
    const activeMarket = getActiveMarket(markets, params);
    console.log(`NoLossOptionBuying-activeMarket: `, activeMarket);

    const allowance = data?.[getCallId(buyinToken, 'allowance')];
    let bundle: Partial<OptionBuyintMarketState> = {};
    ['maxFee', 'minFee', 'maxPeriod', 'minPeriod'].forEach((m) => {
      bundle[m] = data?.[getCallId(activeMarket.configContract, 'maxFee')]?.[0];
    });
    return {
      balance: balance?.[0],
      allowance: allowance?.[0],
      isPaused: false,
      activeMarket,
      ...bundle,
    };
  }, [data, activeTournament, markets, params]);
  console.log(`NoLossOptionBuying-state: `, state);
  return (
    <Background>
      <DynamicCustomOption
        markets={markets}
        data={state}
        tradeToken={{
          address: activeTournament.tournamentMeta.buyinToken,
          name: activeTournament.tournamentMeta.name,
          decimal: 18,
        }}
        routerContract={config.router}
      />
    </Background>
  );
};

export { NoLossOptionBuying };

export const useActiveTournamentState = (
  activeTournament: ITournament,
  markets: { [a: string]: MarketInterface }
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
    let configCalls: Call[] = [];
    Object.keys(markets).forEach((a) => {
      let m = markets[a];
      configCalls.push({
        address: m.configContract,
        abi: ConfigAbi,
        name: 'minFee',
        params: [],
      });
      configCalls.push({
        address: m.configContract,
        abi: ConfigAbi,
        name: 'maxFee',
        params: [],
      });
      configCalls.push({
        address: m.configContract,
        abi: ConfigAbi,
        name: 'minPeriod',
        params: [],
      });
      configCalls.push({
        address: m.configContract,
        abi: ConfigAbi,
        name: 'maxPeriod',
        params: [],
      });
    });
    return [balance, allowance, ...configCalls];
  }, [activeTournament, markets]);
  return useCall2Data(calls, 'no-loss-read-calls');
};
