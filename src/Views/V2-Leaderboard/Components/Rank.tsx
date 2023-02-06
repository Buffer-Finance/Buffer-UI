import { useMemo } from 'react';
import { CellContent } from '@Views/Common/BufferTable/CellInfo';
import { ILeague } from '../interfaces';
import Trophy from './Trophy';

export const Rank: React.FC<{
  userRank: number | string;
  row: number;
  skip: number;
  isUser: boolean;
  firstColPadding?: string;
}> = ({ userRank, row, skip, isUser, firstColPadding = '' }) => {
  const rank = userRank || skip + row + 1;

  return (
    <CellContent
      content={[
        <div className={firstColPadding + ' flex items-center gap-2'}>
          <Trophy isUser={isUser} row={row} currentRank={rank} />
          <div className="light-blue-text relative my-2 flex flex-row items-center">
            # {rank}
          </div>
        </div>,
      ]}
    />
  );
};
