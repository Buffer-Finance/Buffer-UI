import { ethers } from 'ethers';
import { useNoLossConfig, useNoLossStaticConfig } from './useNoLossConfig';
import MarketFactoryABI from '@ABIs/MarketFactory.json';
import styled from 'styled-components';
import { NoLossNavigation } from './NoLossNavigation';
import { NoLossTournamentList } from './NoLossTournamentList';
import { atom, useAtomValue } from 'jotai';
import { MultiChart } from 'src/MultiChart';
import {
  ActiveAsset,
  DynamicActiveAsset,
} from '@Views/BinaryOptions/PGDrawer/ActiveAsset';
import { NoLossOptionBuying } from './NoLossOptionBuying';
import { useUserAccount } from '@Hooks/useUserAccount';
import {
  ITournament,
  useNoLossTournaments,
  useTournamentData,
} from './useNoLossTournamets';
import { useMemo } from 'react';

const MainBackground = styled.main`
  display: grid;
`;
const ifc = new ethers.utils.Interface(MarketFactoryABI);
const NoLoss: React.FC<any> = ({}) => {
  const { data: appConfig } = useNoLossConfig();
  const activeTournament = useActiveTournament();
  return (
    <main className="flex relative bg-grey w-[100vw]">
      <NoLossNavigation />
      <NoLossTournamentList />
      {appConfig ? (
        <>
          <div className="flex-1 relative  bg-green ">
            <MultiChart markets={appConfig} product="no-loss" />
          </div>
          <div className="w-[280px] h-full ">
            <DynamicActiveAsset markets={appConfig} payout="23%" />
            {activeTournament ? (
              <NoLossOptionBuying
                activeTournament={activeTournament}
                markets={appConfig}
              />
            ) : (
              'Tournament loading...'
            )}
          </div>
        </>
      ) : (
        'Loadig...'
      )}
    </main>
  );
};

export { NoLoss };

export const activetIdAtom = atom<string>('');

const useActiveTournament = (): null | ITournament => {
  const { address } = useUserAccount();
  const config = useNoLossStaticConfig();
  console.log(`config: `, config);
  const noLossTournaments = useNoLossTournaments();
  const { data: tournamentId2data } = useTournamentData();
  const activeTournamentId = useAtomValue(activetIdAtom);
  const tournamentInfo = useMemo(() => {
    if (!activeTournamentId) return null;
    if (!tournamentId2data || !(activeTournamentId in tournamentId2data))
      return null;
    return tournamentId2data[activeTournamentId];
  }, [tournamentId2data, noLossTournaments, address, activeTournamentId]);
  return tournamentInfo;
};
