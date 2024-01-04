import NumberTooltip from '@Views/Common/Tooltips';
import { usePoolNames } from '@Views/DashboardV2/hooks/usePoolNames';
import { RowBetween } from '@Views/TradePage/Components/Row';
import { ILeague } from '@Views/V2-Leaderboard/interfaces';
import styled from '@emotion/styled';
import { Skeleton } from '@mui/material';
import { useMemo } from 'react';
import { NetPnl } from '../WinnersByPnl/NetPnl';

export const Winners: React.FC<{ winners: ILeague[] | undefined }> = ({
  winners,
}) => {
  if (winners === undefined)
    return (
      <div className="flex gap-6">
        <Skeleton
          variant="rectangular"
          width={225}
          height={120}
          className="lc rounded-md"
        />
        <Skeleton
          variant="rectangular"
          width={250}
          height={135}
          className="lc rounded-md"
        />
        <Skeleton
          variant="rectangular"
          width={225}
          height={120}
          className="lc rounded-md"
        />
      </div>
    );
  return (
    <div className="flex gap-6">
      <Data participant={winners[1]} rank={2} />
      <Data participant={winners[0]} rank={1} />
      <Data participant={winners[2]} rank={3} />
    </div>
  );
};

const Data: React.FC<{ participant: ILeague; rank: number }> = ({
  participant,
  rank,
}) => {
  const poolNames = usePoolNames();

  const tokens = useMemo(
    () => poolNames.filter((pool) => !pool.toLowerCase().includes('pol')),
    [poolNames]
  );
  const isUser = false;
  const isFirst = rank === 1;
  return (
    <DataWrapper className="flex flex-col items-center gap-3" isFirst={isFirst}>
      {/* {isFirst && <Confetti />} */}
      <RowBetween className="w-full">
        <NumberTooltip content={participant.user || ''}>
          <div
            className={`text-[#c3c2d4] ${isFirst ? 'text-f15' : 'text-f17'}`}
          >
            {isUser
              ? 'Your Account'
              : !participant.user
              ? 'Wallet not connected'
              : participant.user.slice(0, 3) +
                '...' +
                participant.user.slice(-3)}
          </div>
        </NumberTooltip>
        <span className={`text-1 ${!isFirst ? 'text-f17' : 'text-f19'}`}>
          #{rank}
        </span>
      </RowBetween>
      <RowBetween className="w-full">
        <span
          className={`text-[#c3c2d4] ${!isFirst ? 'text-f13' : 'text-f14'}`}
        >
          {participant.totalTrades} Trades
        </span>
        <NetPnl
          currentStanding={participant}
          tokens={tokens}
          className={!isFirst ? 'text-f17' : 'text-f19'}
        />
      </RowBetween>
    </DataWrapper>
  );
};

const DataWrapper = styled.div<{ isFirst: boolean }>`
  position: relative;
  border-radius: 15px;
  background-color: ${(props) => (props.isFirst ? '#171722' : '#161a27')};
  padding: 48px 32px 24px;
  width: ${(props) => (props.isFirst ? '250px' : '225px')};
  height: ${(props) => (props.isFirst ? '135px' : '120px')};
`;
