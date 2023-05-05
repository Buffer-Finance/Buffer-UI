import { DynamicDurationPicker } from '@Views/BinaryOptions/PGDrawer/DurationPicker';
import { useMemo, useState } from 'react';
import { Background } from '@Views/BinaryOptions/PGDrawer/style';
import { DynamicCustomOption } from '@Views/BinaryOptions/PGDrawer/DynamicCustomOption';
import useSWR from 'swr';
import {
  ITournament,
  baseFeeMethodName,
  useNoLossTournaments,
  useTournamentData,
} from './useNoLossTournamets';
import OptionsAbi from '@Views/NoLoss/ABI/OptionsABI.json';
import NoLossReaderAbi from '@Views/NoLoss/ABI/NoLossReaderAbi.json';
import TournamentMangerABI from '@Views/NoLoss/ABI/TournamentsManager.json';
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
import { useHighestTierNFT } from '@Hooks/useNFTGraph';
import { divide, multiply, subtract } from '@Utils/NumString/stringArithmatics';
import { useWriteCall } from '@Hooks/useWriteCall';
import { useIndependentWriteCall } from '@Hooks/writeCall';
import tmAbi from '@Views/NoLoss/ABI/TournamentsManager.json';
import routerAbi from '@Views/NoLoss/ABI/routerAbi.json';
import { toFixed } from '@Utils/NumString';
import { timeToMins } from '@Views/BinaryOptions/PGDrawer/TimeSelector';
import { slippageAtom } from '@Views/BinaryOptions/Components/SlippageModal';
// fetch balance
// fetch payout
const noLossApprovalMethod = 'isApprovedForAll';
export interface OptionBuyintMarketState {
  balance: string;
  allowance: string;
  maxFee: string;
  minFee: string;
  maxPeriod: string;
  minPeriod: string;
  activeMarket: MarketInterface;
  payout: {
    total: string;
    boosted: string;
  };
}
export function getPayoutFromSettlementFee(
  basePayoutExpanded: number | string
) {
  return subtract('100', multiply('2', divide(basePayoutExpanded + '', 2)));
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
    if (!markets) return;
    const buyinToken = activeTournament.tournamentMeta.buyinToken;

    const balance =
      data?.[
        getCallId(config.tournament.manager, 'balanceOf', activeTournament.id)
      ];
    const activeMarket = getActiveMarket(markets, params);

    const allowance = data?.[getCallId(buyinToken, 'allowance')];
    let bundle: Partial<OptionBuyintMarketState> = {};
    ['maxFee', 'minFee', 'maxPeriod', 'minPeriod'].forEach((m) => {
      bundle[m] = data?.[getCallId(activeMarket.configContract, 'maxFee')]?.[0];
    });
    const baseFee =
      data?.[getCallId(activeMarket.optionsContract, baseFeeMethodName)]?.[0];
    const totalPayoutExpanded =
      data?.[getCallId(config.reader, 'getPayout')]?.[0];
    const totalPayout = totalPayoutExpanded
      ? divide(totalPayoutExpanded + '', 2)
      : '0';
    data?.[getCallId(activeMarket.optionsContract, baseFeeMethodName)]?.[0];
    const basePayout = baseFee ? getPayoutFromSettlementFee(baseFee) : '';
    const boostedPayout =
      totalPayout && basePayout ? subtract(totalPayout, basePayout) : '0';
    return {
      balance: balance?.[0],
      allowance: allowance?.[0],
      isPaused: false,
      activeMarket,
      payout: {
        total: totalPayout,
        boosted: boostedPayout,
      },
      ...bundle,
    };
  }, [data, activeTournament, markets, params]);
  const { writeCall } = useIndependentWriteCall();
  const [settings] = useAtom(slippageAtom);
  const { highestTierNFT } = useHighestTierNFT({ userOnly: true });

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
        handleApprove={() => {
          writeCall(
            config.tournament.manager,
            tmAbi,
            () => console.log,
            'setApprovalForAll',
            [config.router, true]
          );
        }}
        buyHandler={(amount, isUp, duration, price) => {
          writeCall(config.router, routerAbi, () => {}, 'initiateTrade', [
            toFixed(multiply(amount, 18), 0),
            duration * 60 + '',
            isUp,
            state?.activeMarket.optionsContract,
            toFixed(multiply(('' + price).toString(), 8), 0),
            toFixed(multiply(settings.slippage.toString(), 2), 0),
            highestTierNFT?.tokenId || '0',
            activeTournament.id,
          ]);
        }}
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
  const noLossTournaments = useNoLossTournaments();
  const config = useNoLossStaticConfig();
  const { highestTierNFT } = useHighestTierNFT({ userOnly: true });
  const params = useParams();
  const calls = useMemo(() => {
    console.log(`NoLossOptionBuying-markets: `, markets);
    if (!markets) return [];
    if (!Object.keys(markets).length || !activeTournament) return [];
    console.log(`NoLossOptionBuying-params: `, params);
    const activeMarket = getActiveMarket(markets, params);
    // if (!activeMarket) return [];
    const allowance = {
      address: config.tournament.manager,
      abi: TournamentMangerABI,
      id: getCallId(
        config.tournament.manager,
        noLossApprovalMethod,
        activeTournament.id
      ),
      name: noLossApprovalMethod,
      params: [address, config.router],
    };

    let configCalls: Call[] = [];

    markets &&
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
    configCalls.push({
      address: activeMarket.optionsContract,
      abi: OptionsAbi,
      name: baseFeeMethodName,
      params: [],
    });
    configCalls.push({
      address: config.reader,
      abi: NoLossReaderAbi,
      name: 'getPayout',
      params: [
        activeMarket.optionsContract,
        address || '0x0000000000000000000000000000000000000000',
        highestTierNFT?.tokenId || 0,
        true,
      ],
    });
    const balances: Call[] = [];
    for (const c in noLossTournaments) {
      noLossTournaments[c].forEach((d) => {
        balances.push({
          address: config.tournament.manager,
          abi: TournamentMangerABI,
          id: getCallId(config.tournament.manager, 'balanceOf', d.id),
          name: 'balanceOf',
          params: [address, d.id],
        });
      });
    }
    if (!address) return configCalls;
    return [...balances, allowance, ...configCalls];
  }, [
    activeTournament,
    markets,
    address,
    highestTierNFT?.tokenId,
    params,
    noLossTournaments,
  ]);
  return useCall2Data(calls, 'no-loss-read-calls');
};

// build a componen
