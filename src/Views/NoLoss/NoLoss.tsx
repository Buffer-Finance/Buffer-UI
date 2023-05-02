import { ethers } from 'ethers';
import { useNoLossConfig } from './useNoLossConfig';
import MarketFactoryABI from '@ABIs/MarketFactory.json';
import styled from 'styled-components';
import { NoLossNavigation } from './NoLossNavigation';
import { NoLossTournamentList } from './NoLossTournamentList';
import { atom } from 'jotai';
import { MultiChart } from 'src/MultiChart';
import {
  ActiveAsset,
  DynamicActiveAsset,
} from '@Views/BinaryOptions/PGDrawer/ActiveAsset';

const MainBackground = styled.main`
  display: grid;
`;
const ifc = new ethers.utils.Interface(MarketFactoryABI);
const NoLoss: React.FC<any> = ({}) => {
  const { data: appConfig } = useNoLossConfig();
  console.log(`appConfig: `, appConfig);
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
