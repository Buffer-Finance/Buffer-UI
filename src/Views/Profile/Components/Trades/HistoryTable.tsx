import { useGlobal } from '@Contexts/Global';
import { usePriceRetriable } from '@Hooks/usePrice';
import { useUserAccount } from '@Hooks/useUserAccount';
import InfoIcon from '@SVG/Elements/InfoIcon';
import BufferTab from '@Views/Common/BufferTab';
import TabSwitch from '@Views/Common/TabSwitch';
import { MobileHistoryTable } from '@Views/TradePage/Components/MobileView/TradeLog_sm';
import { useBuyTradeData } from '@Views/TradePage/Hooks/useBuyTradeData';
import { useOngoingTrades } from '@Views/TradePage/Hooks/useOngoingTrades';
import { History } from '@Views/TradePage/Views/AccordionTable';
import LimitOrderTable from '@Views/TradePage/Views/AccordionTable/LimitOrderTable';
import { OngoingTradesTable } from '@Views/TradePage/Views/AccordionTable/OngoingTradesTable';
import { OpenInNew } from '@mui/icons-material';
import { binaryTabs, isTestnet } from 'config';
import { useEffect, useMemo } from 'react';
import { useMedia } from 'react-use';

export const useHistoryTableTabs = () => {
  const { state, dispatch } = useGlobal();
  const activeTab = state.tabs.activeIdx;

  useBuyTradeData();

  const activeTabIdx = useMemo(
    () => binaryTabs.findIndex((tab) => tab === activeTab) - 2,
    [state.tabs.activeIdx]
  );

  const changeActiveTab = (e: any, pageNumber: number) =>
    dispatch({
      type: 'SET_ACIVE_TAB',
      payload: binaryTabs[pageNumber + 2], //Runs only for web. Hence 0 & 1 tab neglected.
    });
  return { activeTabIdx, changeActiveTab };
};

export const HistoryTables = () => {
  const { activeTabIdx, changeActiveTab } = useHistoryTableTabs();
  const isNotMobile = useMedia('(min-width:1200px)');

  useEffect(() => {
    changeActiveTab(null, 2);
  }, []);

  const [activeTrades, limitOrders] = useOngoingTrades();
  const { address } = useUserAccount();
  usePriceRetriable();
  return (
    <div>
      <div className="flex items-center justify-between mb-5 sm:flex-col sm:items-start sm:gap-3 sm:mb-[0]">
        <BufferTab
          value={activeTabIdx}
          handleChange={(e, t) => {
            changeActiveTab(e, t);
          }}
          tablist={[
            {
              name: 'Active',
            },
            { name: 'Limit Orders' },
            { name: 'History' },
          ]}
        />
        <button
          className="flex text-f15 text-2 items-center gap-2 hover:text-1"
          onClick={() => {
            const domain = isTestnet
              ? 'testnet-buffer-finance.vercel.app'
              : 'app.buffer.finance';
            window.open(
              `https://classic.app.buffer.finance/#/profile?user_address=${address}`,
              '_blank'
            );
          }}
        >
          <InfoIcon tooltip="Click here to see the older version trades." />
          Old Version Trades <OpenInNew className="mt-2" />{' '}
        </button>
      </div>
      <TabSwitch
        value={activeTabIdx}
        childComponents={[
          <OngoingTradesTable
            trades={activeTrades}
            isLoading={false}
            className="sm:min-w-[800px]"
            overflow={false}
          />,
          <LimitOrderTable trades={limitOrders} overflow={false} />,
          isNotMobile ? (
            <History className="sm:min-w-[800px]" overflow={false} />
          ) : (
            <MobileHistoryTable />
          ),
        ]}
      />
    </div>
  );
};
