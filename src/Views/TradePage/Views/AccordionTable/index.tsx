import DDArrow from '@SVG/Elements/Arrow';
import { useOngoingTrades } from '@Views/TradePage/Hooks/useOngoingTrades';
import { useEffect, useState } from 'react';
import LimitOrderTable from './LimitOrderTable';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { isTableShownAtom, queuets2priceAtom } from '@Views/TradePage/atoms';
import { usePlatformTrades } from '@Views/TradePage/Hooks/useOngoingPlatformTrades';
import { usePriceChange } from '@Views/TradePage/Hooks/usePriceChange';
import { useHistoryTrades } from '@Views/TradePage/Hooks/useHistoryTrades';
import { OngoingTradesTable } from './OngoingTradesTable';
import { HistoryTable } from './HistoryTable';
import { useAccount, useProvider } from 'wagmi';
import { useActiveChain } from '@Hooks/useActiveChain';
import { getPriceWithRetry } from '@Hooks/usePrice';
import OptionsABI from '@Views/TradePage/ABIs/OptionContract.json';

import { Call, multicallLinked } from '@Utils/Contract/multiContract';
import { appConfig } from '@Views/TradePage/config';
import { getCachedPrice } from '@Views/TradePage/Hooks/useBuyTradeActions';
import { useCancelledTrades } from '@Views/TradePage/Hooks/useCancelledTrades';
import { CancelledTable } from './CancelTable';
const tables = {
  Trades: 'h',
  'Limit Orders': 'h',
  History: 'h',
  Cancelled: 'h',
  'Platform Trades': 'h',
  'Platform History': 'h',
};
const gap = ['Cancelled'];

const AccordionTable: React.FC<any> = ({}) => {
  const [expanded, setExpanded] = useAtom(isTableShownAtom);
  const [historyTrades] = useHistoryTrades();
  const [activeTrades, limitOrders] = useOngoingTrades();
  const setPriceCache = useSetAtom(queuets2priceAtom);
  const priceCache = useAtomValue(queuets2priceAtom);
  const [platformActiveTrades, platformHistoryTrades] = usePlatformTrades();
  const [canclledTrades] = useCancelledTrades();
  // const { activeChain } = useActiveChain();
  // const provider = useProvider({ chainId: activeChain.id });
  const [activeTable, setActiveTable] = useState('Trades');
  // const { address } = useAccount();
  const getAugmentedData = async (
    queries: { pair: string; timestamp: number; queueId: number }[],
    lockedAmmountQuery: Call[]
  ) => {
    console.log('getAugmentedData');
    const priceResponse = await Promise.all(
      queries.map((q) => getCachedPrice(q))
    );
    setPriceCache((p) => {
      let newP = { ...p };
      queries.forEach((q, i) => {
        newP[q.queueId] = priceResponse[i];
      });
      return newP;
    });
    // console.log(`index-priceResponse: `, priceResponse);
    // const lockedAmmountResponse = await multicallLinked(
    //   lockedAmmountQuery,
    //   provider,
    //   appConfig[activeChain.id],
    //   'hellother'
    // );
    // console.log(`index-response: `, priceResponse, lockedAmmountResponse);
  };
  useEffect(() => {
    const lockedAmountQueryName = 'evaluateParams';
    const priceQueries: { pair: string; timestamp: number; queueId: number }[] =
      [];
    const lockedAmmountQuery: Call[] = [];
    activeTrades.forEach((trade) => {
      if (trade.state == 'QUEUED') {
        if (trade.market) {
          if (!(trade.queue_id in priceCache))
            priceQueries.push({
              pair: trade.market.tv_id,
              timestamp: trade.queued_timestamp,
              queueId: trade.queue_id,
            });
          // lockedAmmountQuery.push({
          //   address: trade.target_contract,
          //   abi: OptionsABI,
          //   name: lockedAmountQueryName,
          //   params: [
          //     [
          //       trade.strike.toString(),
          //       '0',
          //       trade.period.toString(),
          //       trade.allow_partial_fill,
          //       trade.trade_size.toString(),
          //       address,
          //       trade.referral_code,
          //       trade.trader_nft_id.toString(),
          //       trade.settlement_fee.toString(),
          //     ],
          //     trade.slippage + '',
          //   ],
          // });
        }

        // queries.push({pair:trade.});
      }
    });
    getAugmentedData(priceQueries, lockedAmmountQuery);
    // console.log(`index-activeTrades: `, activeTrades);
  }, [activeTrades.length]);
  return (
    <div className="flex flex-col    ">
      <div className="w-full bg-[#282B39] rounded-[2px] flex items-center  justify-between p-3 ">
        <div className="flex gap-x-[15px]">
          {Object.keys(tables).map((s) => (
            <button
              onClick={() => {
                setExpanded(true);
                setActiveTable(s);
              }}
              className={`text-${s == activeTable ? '1' : '2'} text-f14 ${
                gap.filter((i) => i == s).length
                  ? ' pr-[13px] accordion-table-strip-right-border'
                  : ''
              }`}
            >
              <div className="flex items-center gap-x-2">
                {s}
                {s == 'Trades' && activeTrades.length ? (
                  <div className="text-[#C3C2D4] bg-[#171722] text-f10 h-[16px] p-2 pt-[0px] pb-[">
                    <span>{activeTrades.length}</span>
                  </div>
                ) : null}
              </div>
            </button>
          ))}
        </div>
        <button
          className="flex items-center gap-x-2 px-4 text-f14 transition group"
          onClick={() => setExpanded((p) => !p)}
        >
          {expanded ? 'Hide ' : 'Show '} Positions{' '}
          <DDArrow
            className={`transition scale group-hover:scale-150  ${
              expanded ? ' rotate-0' : 'rotate-180'
            }`}
          />
        </button>
      </div>
      <div
        className={` ${
          expanded ? 'h-[355px]' : 'h-[0px]'
        } flex flex-col transition-all  overflow-y-hidden `}
      >
        {activeTable == 'Trades' ? (
          <OngoingTradesTable trades={activeTrades} />
        ) : activeTable == 'Limit Orders' ? (
          <LimitOrderTable trades={limitOrders} />
        ) : activeTable == 'Platform Trades' ? (
          <OngoingTradesTable trades={platformActiveTrades} platform />
        ) : activeTable == 'Platform History' ? (
          <HistoryTable trades={platformHistoryTrades} platform />
        ) : activeTable == 'Cancelled' ? (
          <CancelledTable trades={canclledTrades} />
        ) : (
          <HistoryTable trades={historyTrades} />
        )}
      </div>
    </div>
  );
};

export { AccordionTable };
