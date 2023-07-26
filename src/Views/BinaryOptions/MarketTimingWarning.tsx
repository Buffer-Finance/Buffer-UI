import useStopWatch from '@Hooks/Utilities/useStopWatch';
import { useAtom, useAtomValue } from 'jotai';
import { IconType, LeftBorderedDiv } from '@Views/Common/LeftBorderedDiv';
import { knowTillAtom } from '../TradePage/Hooks/useIsMerketOpen';
import { useState } from 'react';
import { ForexTimingsModalAtom } from './PGDrawer/CustomOption';
import { MarketTimingsModal } from './MarketTimingsModal';

interface IMarketTimingWarning {}

const MarketTimingWarning: React.FC<IMarketTimingWarning> = ({}) => {
  const knowTill = useAtomValue(knowTillAtom);

  const data = useStopWatch(knowTill.date / 1000);
  if (knowTill.date === null) return <></>;
  let type: IconType = 'retry';
  if (knowTill) {
    type = 'timer';
  }
  const [calOpen, setCalOpen] = useAtom(ForexTimingsModalAtom);
  return (
    <>
      <MarketTimingsModal />
      <LeftBorderedDiv
        type={type}
        className={`text-f12 ${
          type == 'retry'
            ? 'text-[#C2C1D3] '
            : 'text-[#E2CA18] bg-[rgba(226,202,24,0.05)]'
        }`}
      >
        <div className="text-[#C2C1D3] pr-[3px]">
          {!knowTill ? 'Market is Closed Currently.' : 'Market is open.'}
        </div>
        <div
          className="underline"
          role="button"
          onClick={() => {
            setCalOpen((o) => !o);
          }}
        >
          See Calendar
        </div>
      </LeftBorderedDiv>
    </>
  );
};

export { MarketTimingWarning };
