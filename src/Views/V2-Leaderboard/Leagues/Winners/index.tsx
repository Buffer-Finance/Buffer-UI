import NumberTooltip from '@Views/Common/Tooltips';
import { usePoolNames } from '@Views/DashboardV2/hooks/usePoolNames';
import { UserImage } from '@Views/Profile/Components/UserDataComponent/UserImage';
import { RowBetween, RowGap } from '@Views/TradePage/Components/Row';
import { useNavigateToProfile } from '@Views/TradePage/Views/AccordionTable/HistoryTable';
import { ILeague } from '@Views/V2-Leaderboard/interfaces';
import styled from '@emotion/styled';
import { Launch } from '@mui/icons-material';
import { Skeleton } from '@mui/material';
import { useMemo } from 'react';
import { useMedia } from 'react-use';
import { NetPnl } from '../WinnersByPnl/NetPnl';
import { Confetti } from './Confetti';

export const Winners: React.FC<{ winners: ILeague[] | undefined }> = ({
  winners,
}) => {
  const isMobile = useMedia('(max-width:1200px)');

  if (winners === undefined)
    return (
      <div className="flex gap-6 b1200:flex-col b1200:gap-2">
        {[0, 1, 2].map((index) => {
          return (
            <Skeleton
              key={index}
              variant="rectangular"
              width={225}
              height={135}
              className="lc rounded-md b1200:mx-auto"
            />
          );
        })}
      </div>
    );
  if (isMobile)
    return (
      <div className="b1200:flex-col b1200:gap-2">
        {winners.map((item, index) => {
          return <Data participant={item} rank={index + 1} />;
        })}
      </div>
    );
  if (winners.length === 0) return <></>;
  if (winners.length === 1) return <Data participant={winners[0]} rank={1} />;
  if (winners.length === 2)
    return (
      <div className="flex gap-6">
        <Data participant={winners[0]} rank={1} />
        <Data participant={winners[1]} rank={2} />
      </div>
    );
  return (
    <div className="flex gap-6">
      <Data participant={winners[0]} rank={1} />
      <Data participant={winners[1]} rank={2} />
      <Data participant={winners[2]} rank={3} />
    </div>
  );
};

const Data: React.FC<{ participant: ILeague; rank: number }> = ({
  participant,
  rank,
}) => {
  const poolNames = usePoolNames();
  const navigatwToProfile = useNavigateToProfile();

  const tokens = useMemo(
    () => poolNames.filter((pool) => !pool.toLowerCase().includes('pol')),
    [poolNames]
  );
  const isUser = false;
  const isFirst = rank === 1;
  return (
    <DataWrapper
      className="flex flex-col items-center gap-3 group"
      isFirst={isFirst}
      onClick={() => {
        navigatwToProfile(participant.user);
      }}
    >
      {isFirst && <Confetti className="absolute z-9 -top-[6px]" />}
      <UserImage address={participant.user} isFirst={isFirst} />
      <RowBetween className="w-full">
        <RowGap gap="8px">
          <NumberTooltip content={participant.user || ''}>
            <div className={`text-[#c3c2d4] text-f15 b1200:text-f13`}>
              {isUser
                ? 'Your Account'
                : !participant.user
                ? 'Wallet not connected'
                : participant.user.slice(0, 3) +
                  '...' +
                  participant.user.slice(-3)}
            </div>
          </NumberTooltip>
          <Launch className="invisible group-hover:visible text-[#c3c2d4]" />
        </RowGap>
        <span
          className={`${
            isFirst ? 'text-buffer-blue' : 'text-1'
          } text-f17 b1200:text-f14`}
        >
          #{rank}
        </span>
      </RowBetween>
      <RowBetween className="w-full">
        <span className={`text-[#c3c2d4] text-f13 b1200:text-f12`}>
          {participant.totalTrades} Trades
        </span>
        <NetPnl
          currentStanding={participant}
          tokens={tokens}
          className="text-f17 b1200:text-f14"
        />
      </RowBetween>
    </DataWrapper>
  );
};

const DataWrapper = styled.button<{ isFirst: boolean }>`
  position: relative;
  border-radius: 15px;
  background-color: ${(props) => (props.isFirst ? '#171722' : '#161a27')};
  padding: 48px 32px 24px;
  width: 225px;
  height: 135px;
  margin: 24px 0;

  transition: all 0.2s ease-in-out;

  :hover {
    transform: scale(1.05);
  }

  @media (max-width: 1200px) {
    width: fit-content;
    margin: 16px auto;
    min-width: 250px;
  }
`;
