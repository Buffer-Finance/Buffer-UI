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
import { useMemo, useState } from 'react';
import { Skeleton } from '@mui/material';
import { useActiveAssetState } from '@Views/BinaryOptions/Hooks/useActiveAssetState';
import { useActiveTournamentState } from './NoLossOptionBuying';
import { getCallId } from '@Utils/Contract/multiContract';
import { divide } from '@Utils/NumString/stringArithmatics';
import { UserTrade } from '@Views/BinaryOptions/UserTrades';
import { UserTrades } from '@Views/BinaryOptions/UserTrades';

const MainBackground = styled.main`
  display: grid;
`;
const ifc = new ethers.utils.Interface(MarketFactoryABI);
const NoLoss: React.FC<any> = ({}) => {
  const { data: appConfig } = useNoLossConfig();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const activeTournament = useActiveTournament();
  return (
    <main className="flex  w-[100vw]">
      <NoLossNavigation setSidebarOpen={setSidebarOpen} />
      <NoLossTournamentList
        markets={appConfig}
        activeTournament={activeTournament}
        sidebarOpen={sidebarOpen}
        className={
          sidebarOpen ? 'open-sidebar-animation' : 'closed-sidebar-animation'
        }
      />
      {appConfig ? (
        <>
          <div className="flex flex-col flex-1">
            {activeTournament && (
              <ActiveTournamentSection markets={appConfig} />
            )}
            <div className="flex-1 relative  mr-2 mt-2 ">
              <MultiChart markets={appConfig} product="no-loss" />
            </div>
          </div>
          <div className="w-[281px] flex flex-col  border-left  pr-2 ">
            <DynamicActiveAsset markets={appConfig} payout="23%" />
            {activeTournament ? (
              <>
                <NoLossOptionBuying
                  activeTournament={activeTournament}
                  markets={appConfig}
                />
                <div className="flex-grow relative mt-[18px] text-2 mx-3">
                  <UserTrades />
                </div>
              </>
            ) : (
              <Skeleton
                className="lc sr w-full flex-1 !h-[300px] m-5  "
                variant="rectangular"
              />
            )}
          </div>
        </>
      ) : (
        <Skeleton
          className="lc sr w-full flex-1 !h-[50vh] m-5  "
          variant="rectangular"
        />
      )}
    </main>
  );
};

export { NoLoss };

export const activetIdAtom = atom<string>('');

const useActiveTournament = (): null | ITournament => {
  const { address } = useUserAccount();
  const config = useNoLossStaticConfig();
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

const ActiveTournamentInfo = ({
  header,
  data,
  border,
}: {
  header: any;
  data: any | null;
  border?: boolean;
}) => {
  return (
    <div
      className={`flex flex-col px-4 items-center justify-center ${
        border ? 'border-right' : ''
      }`}
    >
      <div>{header}</div>
      <div className="text-1 text-f16">
        {data || (
          <Skeleton
            className="lc sr !w-[40px] !h-[16px]"
            variant="reactangular"
          />
        )}
      </div>
    </div>
  );
};
const headers = ['Claim', 'Score', 'Rank', 'Play Tokens'];

const ActiveTournamentSection = ({ markets }) => {
  const { address } = useUserAccount();
  const config = useNoLossStaticConfig();
  const activeTournament = useActiveTournament();
  const { data } = useActiveTournamentState(activeTournament, markets);
  const balance =
    data?.[
      getCallId(config.tournament.manager, 'balanceOf', activeTournament.id)
    ];
  const stats = activeTournament && [
    '2',
    '21',
    '12',
    balance ? divide(balance, 18) : '',
  ];
  // console.log(`NoLoss-activeTournament: `, activeTournament);
  return address ? (
    <div className="text-f14 text-3 flex items-start  justify-between mt-3 pl-4">
      {activeTournament?.tournamentMeta.name}
      <div className="flex">
        {headers.map((s, idx) => (
          <ActiveTournamentInfo
            header={s}
            data={stats[idx]}
            border={idx == headers.length - 1 ? false : true}
          />
        ))}
      </div>
    </div>
  ) : (
    <></>
  );
};
