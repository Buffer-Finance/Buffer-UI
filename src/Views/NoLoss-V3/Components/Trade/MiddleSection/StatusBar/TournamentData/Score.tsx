import { LeaderboardData } from '@Views/NoLoss-V3/types';

export const Score: React.FC<{ data: LeaderboardData | undefined }> = ({
  data,
}) => {
  if (data === undefined) return <>-</>;
  return <>{parseInt(data.stats.score)}</>;
};
