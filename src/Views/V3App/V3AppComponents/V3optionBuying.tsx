import { Background } from '@Views/BinaryOptions/PGDrawer/style';

import { V3CustomOption } from './V3CustomOption';

const V3OptionBuying: React.FC<any> = ({}: {}) => {
  return (
    <Background>
      <V3CustomOption />
    </Background>
  );
};

export { V3OptionBuying };

// export const useActiveTournamentState = (
//   activeTournament: ITournament,
//   markets: { [a: string]: MarketInterface }
// ) => {
//   const { address } = useUserAccount();
//   const noLossTournaments = useNoLossTournaments();
//   const config = useNoLossStaticConfig();
//   const { highestTierNFT } = useHighestTierNFT({ userOnly: true });
//   const params = useParams();
//   const calls = useMemo(() => {
//     if (!markets) return [];
//     if (!Object.keys(markets).length || !activeTournament) return [];
//     const activeMarket = getActiveMarket(markets, params);
//     // if (!activeMarket) return [];
//     const allowance = {
//       address: config.tournament.manager,
//       abi: TournamentMangerABI,
//       id: getCallId(
//         config.tournament.manager,
//         noLossApprovalMethod,
//         activeTournament.id
//       ),
//       name: noLossApprovalMethod,
//       params: [address, config.router],
//     };

//     let configCalls: Call[] = [];

//     markets &&
//       Object.keys(markets).forEach((a) => {
//         let m = markets[a];
//         configCalls.push({
//           address: m.configContract,
//           abi: ConfigAbi,
//           name: 'minFee',
//           params: [],
//         });
//         configCalls.push({
//           address: m.configContract,
//           abi: ConfigAbi,
//           name: 'maxFee',
//           params: [],
//         });
//         configCalls.push({
//           address: m.configContract,
//           abi: ConfigAbi,
//           name: 'minPeriod',
//           params: [],
//         });
//         configCalls.push({
//           address: m.configContract,
//           abi: ConfigAbi,
//           name: 'maxPeriod',
//           params: [],
//         });
//       });
//     configCalls.push({
//       address: activeMarket.optionsContract,
//       abi: OptionsAbi,
//       name: baseFeeMethodName,
//       params: [],
//     });
//     configCalls.push({
//       address: config.optionsReader,
//       abi: NoLossOptionsReader,
//       name: 'getPayout',
//       params: [
//         activeMarket.optionsContract,
//         address || '0x0000000000000000000000000000000000000000',
//         highestTierNFT?.tokenId || 0,
//         true,
//       ],
//     });
//     const balances: Call[] = [];
//     for (const c in noLossTournaments) {
//       noLossTournaments[c].forEach((d) => {
//         balances.push({
//           address: config.tournament.manager,
//           abi: TournamentMangerABI,
//           id: getCallId(config.tournament.manager, 'balanceOf', d.id),
//           name: 'balanceOf',
//           params: [address, d.id],
//         });
//       });
//     }
//     if (!address) return configCalls;
//     return [...balances, allowance, ...configCalls];
//   }, [
//     activeTournament,
//     markets,
//     address,
//     highestTierNFT?.tokenId,
//     params,
//     noLossTournaments,
//   ]);
//   return useCall2Data(calls, 'no-loss-read-calls');
// };

// build a componen
