import { useActiveChain } from '@Hooks/useActiveChain';
import { usePrice } from '@Hooks/usePrice';
import { useUserAccount } from '@Hooks/useUserAccount';
import BufferTab from '@Views/Common/BufferTab';
import TabSwitch from '@Views/Common/TabSwitch';
import { useAboveBelowMarketsSetter } from '@Views/Profile/Hooks/useAboveBelowMarkets';
import { useProcessedTrades } from '@Views/Profile/Hooks/usePastTradeQuery';
import { TableErrorRow } from '@Views/TradePage/Views/AccordionTable/Common';
import { getConfig } from '@Views/TradePage/utils/getConfig';
import axios from 'axios';
import { useMemo, useState } from 'react';
import useSWR from 'swr';
import { Active } from './AboveBelowActiveTable';
import { History } from './AboveBelowHistoryTable';

export const AboveBelowHistory = () => {
  const [activeTabIdx, changeActiveTab] = useState(0);
  useAboveBelowMarketsSetter();
  usePrice();

  return (
    <div>
      <div className="mb-5 sm:mb-[0]">
        <BufferTab
          value={activeTabIdx}
          handleChange={(e, t) => {
            changeActiveTab(t);
          }}
          tablist={[
            {
              name: 'Active',
            },
            { name: 'History' },
          ]}
        />
      </div>
      <TabSwitch
        value={activeTabIdx}
        childComponents={[
          <ActiveAboveBelowTable />,
          <HistoryAboveBelowTable />,
        ]}
      />
    </div>
  );
};

const ActiveAboveBelowTable = () => {
  const [activePage, setActivePage] = useState(1);
  const { activeChain } = useActiveChain();
  const { getProcessedTrades } = useProcessedTrades();
  const { address } = useUserAccount();

  const { data: totalActive } = useSWR(`total-active-ab`, {
    fetcher: async () => {
      if (activeChain === undefined) return;
      const config = getConfig(activeChain?.id);
      const response = await axios.post(
        `https://subgraph.satsuma-prod.com/${
          import.meta.env.VITE_SATSUMA_KEY
        }/bufferfinance/arbitrum-mainnet/version/v2.6.9-ab-ud-profile-page/api`,
        {
          query: `{
              activeLength: abuserOptionDatas(
                  orderBy: creationTime
                  orderDirection: desc
                  first: 10000
                  where: {
                    state_in: [1],
                    expirationTime_gt: ${Math.floor(Date.now() / 1000)},
                    user:"${address}"
                  }
                ){  
                    id
                }
              }`,
        }
      );
      return response.data?.data.activeLength;
    },
  });

  const { data } = useSWR(`all-active-ab-${activePage}`, {
    fetcher: async () => {
      if (activeChain === undefined) return;
      const config = getConfig(activeChain?.id);
      const response = await axios.post(
        `https://subgraph.satsuma-prod.com/${
          import.meta.env.VITE_SATSUMA_KEY
        }/bufferfinance/arbitrum-mainnet/version/v2.6.9-ab-ud-profile-page/api`,
        {
          query: `{
              activeTrades: abuserOptionDatas(
                  orderBy: creationTime
                  orderDirection: desc
                  first: ${10}
                  skip: ${(activePage - 1) * 10}
                  where: {
                    state_in: [1],
                    expirationTime_gt: ${Math.floor(Date.now() / 1000)},
                    user:"${address}"
                  }
                ){
                  amount
                  creationTime
                  expirationPrice
                  expirationTime
                  isAbove
                  payout
                  queueID
                  optionID
                  state
                  strike
                  totalFee
                  user
                  optionContract {
                    token0
                    token1
                    address
                  }
                }
                }`,
        }
      );
      return response.data?.data.activeTrades;
    },
    refreshInterval: 1000,
  });

  const activeTrades = useMemo(() => {
    return getProcessedTrades(data, 0, undefined, false);
  }, [data]);

  return (
    <Active
      overflow={false}
      activePage={activePage}
      setActivePage={setActivePage}
      totalPages={totalActive ? Math.ceil(totalActive.length / 10) : 1}
      isLoading={false}
      active={activeTrades ?? []}
      inGlobalContext
      error={<TableErrorRow msg={'No Trades Found.'} />}
    />
  );
};

const HistoryAboveBelowTable = () => {
  const [activePage, setActivePage] = useState(1);
  const { activeChain } = useActiveChain();
  const { getProcessedTrades } = useProcessedTrades();
  const { address } = useUserAccount();

  const { data: totalHistory } = useSWR(`total-history`, {
    fetcher: async () => {
      if (activeChain === undefined) return;
      const config = getConfig(activeChain?.id);
      const response = await axios.post(
        `https://subgraph.satsuma-prod.com/${
          import.meta.env.VITE_SATSUMA_KEY
        }/bufferfinance/arbitrum-mainnet/version/v2.6.9-ab-ud-profile-page/api`,
        {
          query: `{
            historyLength: abuserOptionDatas(
                orderBy: expirationTime
                orderDirection: desc
                first: 10000
                where: {
                  state_in: [1,2,3],
                  expirationTime_lt: ${Math.floor(Date.now() / 1000)},
                  user:"${address}"
                }
              ){ 
                  id
              }
        }`,
        }
      );
      return response.data?.data.historyLength;
    },
  });

  const { data } = useSWR(`all-history-${activePage}`, {
    fetcher: async () => {
      if (activeChain === undefined) return;
      const config = getConfig(activeChain?.id);
      const response = await axios.post(
        `https://subgraph.satsuma-prod.com/${
          import.meta.env.VITE_SATSUMA_KEY
        }/bufferfinance/arbitrum-mainnet/version/v2.6.9-ab-ud-profile-page/api`,
        {
          query: `{
                historyTrades: abuserOptionDatas(
                    orderBy: expirationTime
                    orderDirection: desc
                    first: ${10}
                    skip: ${(activePage - 1) * 10}
                    where: {
                      state_in: [1,2,3],
                      expirationTime_lt: ${Math.floor(Date.now() / 1000)},
                      user:"${address}"
                    }
                  ){
                    amount
                    creationTime
                    expirationPrice
                    expirationTime
                    isAbove
                    payout
                    queueID
                    optionID
                    state
                    strike
                    totalFee
                    user
                    optionContract {
                      token0
                      token1
                      address
                    }
                  }
            }`,
        }
      );
      return response.data?.data.historyTrades;
    },
    refreshInterval: 1000,
  });

  const historyTrades = useMemo(() => {
    return getProcessedTrades(data, 0, undefined, false);
  }, [data]);

  return (
    <History
      overflow={false}
      activePage={activePage}
      setHistoryPage={setActivePage}
      totalPages={totalHistory ? Math.ceil(totalHistory.length / 10) : 1}
      isLoading={false}
      history={historyTrades ?? []}
      inGlobalContext
      error={<TableErrorRow msg={'No Trades Found.'} />}
    />
  );
};
