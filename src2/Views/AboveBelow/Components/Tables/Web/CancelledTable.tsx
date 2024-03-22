import { getTradeTableError } from '@Views/AboveBelow/Helpers/getTradeTableError';
import {
  tardesAtom,
  tardesPageAtom,
  tardesTotalPageAtom,
  updateCancelledPageNumber,
} from '@Views/AboveBelow/Hooks/usePastTradeQuery';
import { TableErrorRow } from '@Views/TradePage/Views/AccordionTable/Common';
import { useAtomValue, useSetAtom } from 'jotai';
import { Cancelled } from '../Cancelled';

export const CancelledTable: React.FC<{
  userAddress: string | undefined;
  onlyView?: number[];
  overflow?: boolean;
  isMobile?: boolean;
}> = ({ userAddress, onlyView, overflow, isMobile }) => {
  const { cancelled } = useAtomValue(tardesAtom);
  const { cancelled: totalPages } = useAtomValue(tardesTotalPageAtom);
  const { cancelled: activePage } = useAtomValue(tardesPageAtom);
  const setCancelledPage = useSetAtom(updateCancelledPageNumber);

  return (
    <Cancelled
      onlyView={onlyView}
      overflow={overflow}
      isMobile={isMobile}
      activePage={activePage}
      cancelled={cancelled}
      setCancelledPage={setCancelledPage}
      totalPages={totalPages}
      isLoading={userAddress !== undefined && history === undefined}
      error={<TableErrorRow msg={getTradeTableError(userAddress)} />}
    />
  );
};
