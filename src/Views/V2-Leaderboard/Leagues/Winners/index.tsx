import NumberTooltip from '@Views/Common/Tooltips';
import { RowBetween } from '@Views/TradePage/Components/Row';
import { ILeague } from '@Views/V2-Leaderboard/interfaces';
import { Skeleton } from '@mui/material';

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
  return <div className="flex"></div>;
};

const data: React.FC<{ participant: ILeague; rank: number }> = ({
  participant,
  rank,
}) => {
  const isUser = false;
  const isFirst = rank === 1;
  return (
    <div className="flex flex-col items-center gap-3">
      <RowBetween>
        <NumberTooltip content={participant.user || ''}>
          <div
            className={`text-[#c3c2d4] ${isFirst ? 'text-f15' : 'text-f17'}`}
          >
            {isUser
              ? 'Your Account'
              : !participant.user
              ? 'Wallet not connected'
              : participant.user.slice(0, 7) +
                '...' +
                participant.user.slice(-7)}
          </div>
        </NumberTooltip>
        <span className={`text-1 ${isFirst ? 'text-f17' : 'text-f19'}`}>
          #{rank}
        </span>
      </RowBetween>
      <RowBetween>
        <span className={`text-[#c3c2d4] ${isFirst ? 'text-f17' : 'text-f19'}`}>
          {participant.totalTrades} Trades
        </span>
      </RowBetween>
    </div>
  );
};
