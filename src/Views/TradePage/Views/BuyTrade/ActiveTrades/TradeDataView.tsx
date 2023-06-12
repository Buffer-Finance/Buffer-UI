import styled from '@emotion/styled';
import { DataCol } from './DataCol';

export const TradeDataView: React.FC<{
  isQueued: boolean;
  className?: string;
}> = ({ isQueued, className = '' }) => {
  const TradeData = [
    {
      head: <span>Probability</span>,
      desc: <span>50%</span>,
    },
    {
      head: <span>Current price</span>,
      desc: <span>1.2345</span>,
    },
    {
      head: <span>Trade Size</span>,
      desc: <span>1.2345</span>,
    },
    {
      head: <span>payout</span>,
      desc: <span>1.2345</span>,
    },
  ];
  return (
    <TradeDataViewBackground className={className}>
      {TradeData.map((data, index) => (
        <DataCol {...data} key={index} />
      ))}
    </TradeDataViewBackground>
  );
};

const TradeDataViewBackground = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: repeat(2, 1fr);
  row-gap: 8px;
`;
