import { getTradeTableError } from '@Views/AboveBelow/Helpers/getTradeTableError';
import {
  tardesAtom,
  tardesPageAtom,
  tardesTotalPageAtom,
  updateHistoryPageNumber,
} from '@Views/AboveBelow/Hooks/usePastTradeQuery';
import { TableErrorRow } from '@Views/ABTradePage/Views/AccordionTable/Common';
import { useAtomValue, useSetAtom } from 'jotai';
import { History } from '../History';

export const HistoryTable: React.FC<{
  userAddress: string | undefined;
  onlyView?: number[];
  overflow?: boolean;
  isMobile?: boolean;
}> = ({ userAddress, onlyView, overflow, isMobile }) => {
  const { history } = useAtomValue(tardesAtom);
  const { history: totalPages } = useAtomValue(tardesTotalPageAtom);
  const { history: activePage } = useAtomValue(tardesPageAtom);
  const setHistoryPage = useSetAtom(updateHistoryPageNumber);

  return (
    <History
      onlyView={onlyView}
      overflow={overflow}
      isMobile={isMobile}
      totalPages={totalPages}
      activePage={activePage}
      history={history}
      setHistoryPage={setHistoryPage}
      isLoading={userAddress !== undefined && history === undefined}
      error={<TableErrorRow msg={getTradeTableError(userAddress)} />}
    />
  );
};
