import styled from '@emotion/styled';
import { TimeSelector } from './TimeSelector';

const BuyTradeBackground = styled.div`
  max-width: 275px;
  background-color: #1c1c28;
  border-left: 1px solid #2a2a3a;
  border-right: 1px solid #2a2a3a;
  padding: 16px;
`;

export const BuyTrade: React.FC = () => {
  return (
    <BuyTradeBackground>
      <TimeSelector />
    </BuyTradeBackground>
  );
};
