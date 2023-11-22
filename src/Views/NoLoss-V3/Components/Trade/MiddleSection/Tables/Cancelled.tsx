import {
  tardesAtom,
  tardesPageAtom,
  tardesTotalPageAtom,
  updateCancelledPageNumber,
} from '@Views/NoLoss-V3/Hooks/usePastTradeQuery';
import { Cancelled } from '@Views/NoLoss-V3/Tables/Cancelled';
import { getTradeTableError } from '@Views/NoLoss-V3/helpers/getTradeTableError';
import { TableErrorRow } from '@Views/TradePage/Views/AccordionTable/Common';
import { useAtomValue, useSetAtom } from 'jotai';

enum TableColumn {
  Asset = 0,
  Strike = 1,
  TradeSize = 2,
  QueueTimestamp = 3,
  CancelTimestamp = 4,
  Reason = 5,
}

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
