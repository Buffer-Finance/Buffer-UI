import { CellContent } from '@Views/Common/BufferTable/CellInfo';
import Trophy from '../Components/Trophy';

export const Rank: React.FC<{
  userRank: number | string;
  row: number;
  skip: number;
  isUser: boolean;
  firstColPadding?: string;
  nftWinners?: number;
}> = ({ userRank, row, skip, isUser, nftWinners, firstColPadding = '' }) => {
  const rank = userRank || skip + row + 1;

  return (
    <CellContent
      content={[
        <div className={firstColPadding + ' flex items-center gap-2'}>
          <Trophy
            isUser={isUser}
            row={row}
            currentRank={Number(rank)}
            nftWinners={nftWinners}
          />
          <div className="light-blue-text relative my-2 flex flex-row items-center">
            # {rank}
          </div>
        </div>,
      ]}
    />
  );
};
