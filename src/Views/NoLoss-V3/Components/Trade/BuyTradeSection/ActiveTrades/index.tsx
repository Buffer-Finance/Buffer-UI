import { tardesAtom } from '@Views/NoLoss-V3/Hooks/usePastTradeQuery';
import styled from '@emotion/styled';
import { useAtomValue } from 'jotai';
import { Trade } from './Trade';

export const ActiveTrades = () => {
  const { active } = useAtomValue(tardesAtom);

  return (
    <TradesBackground className="b1200:mb-4">
      {active.map((t) => {
        if (!t) return <></>;
        return <Trade trade={t} key={t?.queueID} />;
      })}
    </TradesBackground>
  );
};

const TradesBackground = styled.div`
  flex-grow: 1;
  flex-basis: 0;
  overflow-y: auto;
  ::-webkit-scrollbar {
    width: 2px;
  }
  ::-webkit-scrollbar-track {
    border-radius: 24px;
  }
  ::-webkit-scrollbar-thumb {
    border-radius: 24px;
  }
`;
