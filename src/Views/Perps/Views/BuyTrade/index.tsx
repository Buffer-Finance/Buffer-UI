import styled from '@emotion/styled';
import { ReactNode } from 'react';
import { CollatralSelector } from './CollatralSelector';

export const BuyTradeBackground = styled.div`
  position: sticky;
  top: 45px;
  max-width: 275px;
  background-color: #1c1c28;
  padding: 8px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: stretch;
  height: calc(100vh - 80px);
`;

export const tabs = ['Long', 'Short'];

export const BuyTradeHeader: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  return (
    <div className="text-[#7F87A7] text-[12px] mt-[2px] mb-[6px]">
      {children}
    </div>
  );
};
