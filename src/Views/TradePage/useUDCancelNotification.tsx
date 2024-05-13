import { useToast } from '@Contexts/Toast';
import { useCancelledTrades } from './Hooks/useCancelledTrades';
import { pendingQueueIds } from 'src/App';
import UpIcon from '@SVG/Elements/UpIcon';
import DownIcon from '@SVG/Elements/DownIcon';

const useUDCancelNotification = () => {
  const { page_data: canclledTrades, total_pages } = useCancelledTrades();
  const toastify = useToast();
  if (canclledTrades) {
    canclledTrades.forEach((trade) => {
      if (pendingQueueIds.has(trade.queue_id)) {
        let content = (
          <div className="flex flex-col gap-y-2 text-f12 ">
            <div className="nowrap font-[600]">
              Trade order cacelled
              {/* at Strike : {toFixed(divide(baseArgs[ArgIndex.Strike], 8), 3)} */}
            </div>
            <div className="flex items-center">
              {trade.market.token0 + '-' + trade.market.token1}
              &nbsp;&nbsp;
              <span className="!text-3">to go</span>&nbsp;
              {trade.is_above ? (
                <>
                  <UpIcon className="text-green scale-125" /> Higher
                </>
              ) : (
                <>
                  <DownIcon className="text-red scale-125" />
                  Lower
                </>
              )}
            </div>
            <div>
              <span>
                <span className="!text-3">Reason:</span>
                &nbsp;{trade.cancellation_reason}
              </span>
            </div>
          </div>
        );
        toastify({
          price: 121112,
          type: 'failure',
          timings: 20,
          body: null,
          msg: content,
        });

        pendingQueueIds.delete(trade.queue_id);
      }
    });
  }
  return null;
};

export { useUDCancelNotification };
