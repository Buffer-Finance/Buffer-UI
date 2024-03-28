import styled from '@emotion/styled';
import { poolsType } from '../types';

const Tab = styled.button<{ isActive: boolean }>`
  font-size: 22px;
  line-height: 24px;
  color: ${({ isActive }) => (isActive ? '#F7F7F7' : '#7F87A7')};
  font-weight: 500;
  background-color: ${({ isActive }) => (isActive ? '#2B2B37' : 'transparent')};
  padding: 6px 10px;
  border-radius: 4px;
`;

export const PoolTabs: React.FC<{
  activePool: poolsType;
  setActivePool: (newPool: poolsType) => void;
}> = ({ activePool, setActivePool }) => {
  return (
    <div>
      <Tab
        className="mr-2"
        isActive={activePool === 'uBLP'}
        onClick={() => {
          if (activePool !== 'uBLP') {
            setActivePool('uBLP');
          }
        }}
      >
        uBLP
      </Tab>
      <Tab
        isActive={activePool === 'aBLP'}
        onClick={() => {
          if (activePool !== 'aBLP') {
            setActivePool('aBLP');
          }
        }}
      >
        aBLP
      </Tab>
    </div>
  );
};
