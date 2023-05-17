import { useMemo } from 'react';
import { Background } from '@Views/BinaryOptions/PGDrawer/style';
import { DynamicCustomOption } from '@Views/BinaryOptions/PGDrawer/DynamicCustomOption';
import {
  ITournament,
  baseFeeMethodName,
  useNoLossTournaments,
} from './useNoLossTournamets';
import NoLossOptionsReader from '@Views/NoLoss/ABI/NoLossOptionsReader.json';
import OptionsAbi from '@Views/NoLoss/ABI/OptionsABI.json';
import TournamentMangerABI from '@Views/NoLoss/ABI/TournamentsManager.json';
import { useAtom } from 'jotai';
import { useUserAccount } from '@Hooks/useUserAccount';
import { useNoLossStaticConfig } from './useNoLossConfig';
import { useCall2Data } from '@Utils/useReadCall';
import { Call, getCallId } from '@Utils/Contract/multiContract';
import ConfigAbi from '@Views/NoLoss/ABI/ConfigABI.json';
import { MarketInterface } from 'src/MultiChart';
import { useParams } from 'react-router-dom';
import { getActiveMarket } from '@Views/BinaryOptions/PGDrawer/ActiveAsset';
import { useHighestTierNFT } from '@Hooks/useNFTGraph';
import { divide, multiply, subtract } from '@Utils/NumString/stringArithmatics';
import { useIndependentWriteCall } from '@Hooks/writeCall';
import tmAbi from '@Views/NoLoss/ABI/TournamentsManager.json';
import routerAbi from '@Views/NoLoss/ABI/routerAbi.json';
import { toFixed } from '@Utils/NumString';
import { slippageAtom } from '@Views/BinaryOptions/Components/SlippageModal';
import { useGlobal } from '@Contexts/Global';
import { useToast } from '@Contexts/Toast';
// fetch balance
// fetch payout
const noLossApprovalMethod = 'isApprovedForAll';
export interface OptionBuyintMarketState {
  balance: string;
  allowance: boolean;
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
const playTokenDecimals = 18;
export function getPayoutFromSettlementFee(
  basePayoutExpanded: number | string
) {
  return subtract('100', multiply('2', divide(basePayoutExpanded + '', 2)));
}
const V3OptionBuying: React.FC<any> = ({
  activeTournament,
  markets,
}: {
  activeTournament: ITournament;
  markets: { [a: string]: MarketInterface };
}) => {
  const config = useNoLossStaticConfig();

  const { data } = useActiveTournamentState(activeTournament, markets);

  const params = useParams();
  const noLossState = useMemo(() => {
    if (!markets) return;

    const balance =
      data?.[
        getCallId(config.tournament.manager, 'balanceOf', activeTournament.id)
      ];
    const activeMarket = getActiveMarket(markets, params);

    const allowance =
      data?.[
        getCallId(
          config.tournament.manager,
          noLossApprovalMethod,
          activeTournament.id
        )
      ];
    let bundle: Partial<OptionBuyintMarketState> = {};
    ['maxFee', 'minFee', 'maxPeriod', 'minPeriod'].forEach((m) => {
      bundle[m] = data?.[getCallId(activeMarket.configContract, m)]?.[0];
    });
    const baseFee =
      data?.[getCallId(activeMarket.optionsContract, baseFeeMethodName)]?.[0];
    const totalPayoutExpanded =
      data?.[getCallId(config.optionsReader, 'getPayout')]?.[0];
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
  const { state } = useGlobal();
  const toastify = useToast();
  return (
    <Background>
      <DynamicCustomOption
        markets={markets}
        data={noLossState}
        tradeToken={{
          address: activeTournament.tournamentMeta.buyinToken,
          name: activeTournament.tournamentMeta.name,
          decimal: playTokenDecimals,
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
          if (state.txnLoading > 1) {
            toastify({
              id: '2321123',
              type: 'error',
              msg: 'Please confirm your previous pending transactions.',
            });
            return true;
          }
          // if (
          //   duration > +noLossState?.maxPeriod ||
          //   duration < +noLossState?.minPeriod
          // ) {
          //   return toastify({
          //     type: 'error',
          //     msg: `Option duration should be within ${minsToTime(
          //       noLossState?.minPeriod
          //     )} and ${minsToTime(noLossState?.maxPeriod)}`,
          //     id: 'binaryBuy',
          //   });
          // }

          const minFee = divide(noLossState?.minFee + '', playTokenDecimals);
          const maxFee = divide(noLossState?.maxFee + '', playTokenDecimals);
          if (+amount > +minFee || +amount < +maxFee) {
            return toastify({
              type: 'error',
              msg: `Trade Size must be within ${minFee} and ${maxFee}`,
            });
          }

          writeCall(config.router, routerAbi, () => {}, 'initiateTrade', [
            toFixed(multiply(amount, playTokenDecimals), 0),
            duration * 60 + '',
            isUp,
            noLossState?.activeMarket.optionsContract,
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

export { V3OptionBuying };

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
    if (!markets) return [];
    if (!Object.keys(markets).length || !activeTournament) return [];
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
      address: config.optionsReader,
      abi: NoLossOptionsReader,
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
