import { userAtom, userLeaderboardDataAtom } from '@Views/NoLoss-V3/atoms';
import styled from '@emotion/styled';
import { Skeleton } from '@mui/material';
import { useAtomValue } from 'jotai';
import { Balance } from '../MiddleSection/StatusBar/TournamentData/Balance';
import { Rank } from '../MiddleSection/StatusBar/TournamentData/Rank';
import { Score } from '../MiddleSection/StatusBar/TournamentData/Score';

export const TournamentDataMobile = () => {
  const userTournamentData = useAtomValue(userLeaderboardDataAtom);
  const user = useAtomValue(userAtom);

  if (user === undefined || user.userAddress === undefined)
    return <div className=""></div>;

  if (userTournamentData === undefined)
    return <Skeleton className="w-full !h-7 lc !transform-none" />;

  const dataArray = [
    {
      head: 'score',
      data: <Score data={userTournamentData.data} />,
    },
    {
      head: 'rank',
      data: <Rank rank={userTournamentData.rank} />,
    },
    {
      head: 'play tokens',
      data: <Balance />,
    },
  ];
  return (
    <div className="flex items-center justify-evenly my-3">
      {dataArray.map((data, index) => {
        return (
          <CardWrapper key={data.head}>
            <span className="capitalize text-f14 text-[#808191]">
              {data.head}
            </span>
            <span className="text-f16">{data.data}</span>
          </CardWrapper>
        );
      })}
    </div>
  );
};

const CardWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 2px;
  margin: auto;
  width: 100%;

  :not(:last-child) {
    border-right: 1px solid #2d2d3d;
  }
`;
{
  /* {index !== dataArray.length - 1 && (
              <div className="w-[1px] h-7 bg-[#2D2D3D]" />
            )} */
}
