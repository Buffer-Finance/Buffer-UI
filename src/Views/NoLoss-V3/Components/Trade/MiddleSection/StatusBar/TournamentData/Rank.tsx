export const Rank: React.FC<{ rank: number | null }> = ({ rank }) => {
  if (rank === null) return <>-</>;
  return <>{rank}</>;
};
