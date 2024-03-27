import { getTradeTableError } from '@Views/AboveBelow/Helpers/getTradeTableError';
import {
  tardesAtom,
  tardesPageAtom,
  tardesTotalPageAtom,
  updateActivePageNumber,
} from '@Views/AboveBelow/Hooks/usePastTradeQuery';
import { TableErrorRow } from '@Views/TradePage/Views/AccordionTable/Common';
import { useAtomValue, useSetAtom } from 'jotai';
import { Active } from '../Active';

export const ActiveTable: React.FC<{
  userAddress: string | undefined;
  onlyView?: number[];
  overflow?: boolean;
  isMobile?: boolean;
}> = ({ userAddress, onlyView, overflow, isMobile }) => {
  const { active } = useAtomValue(tardesAtom);
  const { active: totalPages } = useAtomValue(tardesTotalPageAtom);
  const { active: activePage } = useAtomValue(tardesPageAtom);
  const setActivePage = useSetAtom(updateActivePageNumber);

  return (
    <Active
      onlyView={onlyView}
      overflow={overflow}
      isMobile={isMobile}
      activePage={activePage}
      active={active}
      setActivePage={setActivePage}
      totalPages={totalPages}
      isLoading={userAddress !== undefined && history === undefined}
      error={<TableErrorRow msg={getTradeTableError(userAddress)} />}
    />
  );
};
