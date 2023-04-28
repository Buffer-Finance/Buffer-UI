import { ethers } from 'ethers';
import { useNoLossConfig } from './useNoLossConfig';
import MarketFactoryABI from '@ABIs/MarketFactory.json';
import styled from 'styled-components';
import { NoLossNavigation } from './NoLossNavigation';
import { NoLossTournamentList } from './NoLossTournamentList';

const MainBackground = styled.main`
  display: grid;
`;
const ifc = new ethers.utils.Interface(MarketFactoryABI);
const NoLoss: React.FC<any> = ({}) => {
  const { data, error } = useNoLossConfig();
  return (
    <main className="flex relative bg-grey w-[100vw]">
      <NoLossNavigation />
      <NoLossTournamentList />
      <div className="flex-1  bg-green "></div>
      <div className="bg-blue w-[280px] h-full ">{/* Buying Modal */}</div>
    </main>
  );
};

export { NoLoss };
